import { Component, effect, peek } from 'maverick.js';
import {
  DOMEvent,
  isMouseEvent,
  isPointerEvent,
  isTouchEvent,
  kebabToCamelCase,
  listenEvent,
} from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';
import { isTouchPinchEvent } from '../../utils/dom';

/**
 * This component enables actions to be performed on the media based on user gestures.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/media/gesture}
 */
export class Gesture extends Component<GestureProps, {}, GestureEvents> {
  static props: GestureProps = {
    disabled: false,
    event: undefined,
    action: undefined,
  };

  #media!: MediaContext;
  #provider: HTMLElement | null = null;

  protected override onSetup(): void {
    this.#media = useMediaContext();
    const { event, action } = this.$props;
    this.setAttributes({
      event,
      action,
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-gesture', '');
    el.style.setProperty('pointer-events', 'none');
  }

  protected override onConnect(el: HTMLElement) {
    this.#provider = this.#media.player!.el?.querySelector(
      '[data-media-provider]',
    ) as HTMLElement | null;
    effect(this.#attachListener.bind(this));
  }

  #attachListener() {
    let eventType = this.$props.event(),
      disabled = this.$props.disabled();

    if (!this.#provider || !eventType || disabled) return;

    if (/^dbl/.test(eventType)) {
      eventType = eventType.split(/^dbl/)[1] as keyof HTMLElementEventMap;
    }

    if (eventType === 'pointerup' || eventType === 'pointerdown') {
      const pointer = this.#media.$state.pointer();
      if (pointer === 'coarse') {
        eventType = eventType === 'pointerup' ? 'touchend' : 'touchstart';
      }
    }

    listenEvent(
      this.#provider,
      eventType as keyof HTMLElementEventMap,
      this.#acceptEvent.bind(this),
      { passive: false },
    );
  }

  #presses = 0;
  #pressTimerId = -1;

  #acceptEvent(event: Event) {
    if (
      this.$props.disabled() ||
      (isPointerEvent(event) && (event.button !== 0 || this.#media.activeMenu)) ||
      (isTouchEvent(event) && this.#media.activeMenu) ||
      isTouchPinchEvent(event) ||
      !this.#inBounds(event)
    ) {
      return;
    }

    // @ts-expect-error
    event.MEDIA_GESTURE = true;
    event.preventDefault();

    const eventType = peek(this.$props.event),
      isDblEvent = eventType?.startsWith('dbl');

    if (!isDblEvent) {
      if (this.#presses === 0) {
        setTimeout(() => {
          if (this.#presses === 1) this.#handleEvent(event);
        }, 250);
      }
    } else if (this.#presses === 1) {
      queueMicrotask(() => this.#handleEvent(event));
      clearTimeout(this.#pressTimerId);
      this.#presses = 0;
      return;
    }

    if (this.#presses === 0) {
      this.#pressTimerId = window.setTimeout(() => {
        this.#presses = 0;
      }, 275);
    }

    this.#presses++;
  }

  #handleEvent(event: Event) {
    this.el!.setAttribute('data-triggered', '');
    requestAnimationFrame(() => {
      if (this.#isTopLayer()) {
        this.#performAction(peek(this.$props.action), event);
      }
      requestAnimationFrame(() => {
        this.el!.removeAttribute('data-triggered');
      });
    });
  }

  /** Validate event occurred in gesture bounds. */
  #inBounds(event: Event) {
    if (!this.el) return false;

    if (isPointerEvent(event) || isMouseEvent(event) || isTouchEvent(event)) {
      const touch = isTouchEvent(event) ? (event.changedTouches[0] ?? event.touches[0]) : undefined;

      const clientX = touch?.clientX ?? (event as MouseEvent).clientX;
      const clientY = touch?.clientY ?? (event as MouseEvent).clientY;
      const rect = this.el.getBoundingClientRect();

      const inBounds =
        clientY >= rect.top &&
        clientY <= rect.bottom &&
        clientX >= rect.left &&
        clientX <= rect.right;

      return event.type.includes('leave') ? !inBounds : inBounds;
    }

    return true;
  }

  /** Validate gesture has the highest z-index in this triggered group. */
  #isTopLayer() {
    const gestures = this.#media.player!.el!.querySelectorAll(
      '[data-media-gesture][data-triggered]',
    ) as NodeListOf<HTMLElement>;

    return (
      Array.from(gestures).sort(
        (a, b) => +getComputedStyle(b).zIndex - +getComputedStyle(a).zIndex,
      )[0] === this.el
    );
  }

  #performAction(action: string | undefined, trigger: Event) {
    if (!action) return;

    const willTriggerEvent = new DOMEvent<string>('will-trigger', {
      detail: action,
      cancelable: true,
      trigger,
    });

    this.dispatchEvent(willTriggerEvent);
    if (willTriggerEvent.defaultPrevented) return;

    const [method, value] = action.replace(/:([a-z])/, '-$1').split(':');

    if (action.includes(':fullscreen')) {
      this.#media.remote.toggleFullscreen('prefer-media', trigger);
    } else if (action.includes('seek:')) {
      this.#media.remote.seek(peek(this.#media.$state.currentTime) + (+value || 0), trigger);
    } else {
      this.#media.remote[kebabToCamelCase(method)](trigger);
    }

    this.dispatch('trigger', {
      detail: action as GestureAction,
      trigger,
    });
  }
}

export interface GestureProps {
  /**
   * Whether this gesture should not be triggered.
   */
  disabled: boolean;
  /**
   * The DOM event type that will trigger this gesture. It can be any valid DOM event type. Any
   * event can be prefixed with `dbl` to ensure it occurs twice in succession (max 200ms gap).
   *
   * @example 'pointerup'
   * @example 'dblpointerup'
   * @example 'mouseleave'
   */
  event: GestureEventType | undefined;
  /**
   * An action describes the type of media request event that will be dispatched, which will
   * ultimately perform some operation on the player.
   *
   * @example 'play'
   * @example 'seek:30'
   * @example 'seek:-30'
   * @example 'toggle:paused'
   */
  action: GestureAction | undefined;
}

export type GestureEventType = keyof HTMLElementEventMap | `dbl${keyof HTMLElementEventMap}`;

export type GestureAction =
  | 'play'
  | 'pause'
  | `seek:${number}`
  | `toggle:${'paused' | 'muted' | 'fullscreen' | 'controls'}`;

export interface GestureEvents {
  'will-trigger': GestureWillTriggerEvent;
  trigger: GestureTriggerEvent;
}

export interface GestureEvent<Detail = unknown> extends DOMEvent<Detail> {
  target: Gesture;
}

/**
 * This event will fire before the gesture action is triggered. Calling `event.preventDefault()`
 * will stop the action from being triggered.
 *
 * @detail action
 * @cancelable
 */
export interface GestureWillTriggerEvent extends GestureEvent<GestureAction> {}

/**
 * This event will fire after the gesture action has been triggered.
 *
 * @detail action
 */
export interface GestureTriggerEvent extends GestureEvent<GestureAction> {}
