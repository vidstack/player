import { Component, effect, peek } from 'maverick.js';
import {
  isMouseEvent,
  isPointerEvent,
  isTouchEvent,
  kebabToCamelCase,
  listenEvent,
} from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';

/**
 * This component enables actions to be performed on the media based on user gestures.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/media/gesture}
 */
export class Gesture extends Component<GestureProps> {
  static props: GestureProps = {
    event: undefined,
    action: undefined,
  };

  private _media!: MediaContext;
  private _provider: HTMLElement | null = null;

  protected override onSetup(): void {
    this._media = useMediaContext();
    const { event, action } = this.$props;
    this.setAttributes({
      event,
      action,
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.style.pointerEvents = 'none';
  }

  protected override onConnect(el: HTMLElement) {
    this._provider = this._media.player!.el?.querySelector(
      '[data-media-provider]',
    ) as HTMLElement | null;
    effect(this._attachListener.bind(this));
  }

  private _attachListener() {
    let eventType = this.$props.event();

    if (!this._provider || !eventType) return;

    if (/^dbl/.test(eventType)) {
      eventType = eventType.split(/^dbl/)[1] as keyof HTMLElementEventMap;
    }

    listenEvent(
      this._provider,
      eventType as keyof HTMLElementEventMap,
      this._acceptEvent.bind(this),
    );
  }

  private _presses = 0;
  private _pressTimerId = -1;

  private _acceptEvent(event: Event) {
    if (
      !this._inBounds(event) ||
      (isPointerEvent(event) && (event.button !== 0 || this._media.activeMenu))
    ) {
      return;
    }

    // @ts-expect-error
    event.MEDIA_GESTURE = true;
    event.preventDefault();

    const isDblEvent = peek(this.$props.event)?.startsWith('dbl');
    if (!isDblEvent) {
      if (this._presses === 0) {
        setTimeout(() => {
          if (this._presses === 1) this._handleEvent(event);
        }, 250);
      }
    } else if (this._presses === 1) {
      queueMicrotask(() => this._handleEvent(event));
      clearTimeout(this._pressTimerId);
      this._presses = 0;
      return;
    }

    if (this._presses === 0) {
      this._pressTimerId = window.setTimeout(() => {
        this._presses = 0;
      }, 275);
    }

    this._presses++;
  }

  private _handleEvent(event: Event) {
    this.el!.setAttribute('data-triggered', '');
    requestAnimationFrame(() => {
      if (this._isTopLayer()) {
        this._performAction(peek(this.$props.action), event);
      }
      requestAnimationFrame(() => {
        this.el!.removeAttribute('data-triggered');
      });
    });
  }

  /** Validate event occurred in gesture bounds. */
  private _inBounds(event: Event) {
    if (!this.el) return false;

    if (isPointerEvent(event) || isMouseEvent(event) || isTouchEvent(event)) {
      const touch = isTouchEvent(event) ? event.touches[0] : undefined;

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
  private _isTopLayer() {
    const gestures = this._media.player!.el!.querySelectorAll(
      '.vds-gesture[data-triggered]',
    ) as NodeListOf<HTMLElement>;

    return (
      Array.from(gestures).sort(
        (a, b) => +getComputedStyle(b).zIndex - +getComputedStyle(a).zIndex,
      )[0] === this.el
    );
  }

  private _performAction(action: string | undefined, trigger: Event) {
    if (!action) return;

    const [method, value] = action.replace(/:([a-z])/, '-$1').split(':');

    if (action.includes(':fullscreen')) {
      this._media.remote.toggleFullscreen('prefer-media', trigger);
    } else if (action.includes('seek:')) {
      this._media.remote.seek(peek(this._media.$state.currentTime) + (+value || 0), trigger);
    } else {
      this._media.remote[kebabToCamelCase(method)](trigger);
    }
  }
}

export interface GestureProps {
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
