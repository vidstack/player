import throttle from 'just-throttle';
import {
  effect,
  hasProvidedContext,
  useContext,
  ViewController,
  type ReadSignal,
} from 'maverick.js';
import { EventsController, isNull, isNumber, listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../../../core/api/media-context';
import { isTouchPinchEvent } from '../../../../utils/dom';
import type {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderDragValueChangeEvent,
  SliderEvents,
  SliderValueChangeEvent,
} from './api/events';
import type { SliderState } from './api/state';
import {
  sliderObserverContext,
  type SliderObserverContext as SliderObserver,
} from './slider-context';
import type { SliderControllerProps } from './slider-controller';
import { getValueFromRate } from './utils';

/**
 * The direction to move the thumb, associated with key symbols.
 */
const SliderKeyDirection = {
  Left: -1,
  ArrowLeft: -1,
  Up: 1,
  ArrowUp: 1,
  Right: 1,
  ArrowRight: 1,
  Down: -1,
  ArrowDown: -1,
} as const;

export interface SliderEventDelegate {
  swipeGesture?: ReadSignal<boolean>;
  isDisabled(): boolean;
  getValue?(): number;
  getStep(): number;
  getKeyStep(): number;
  roundValue(value: number): number;
  onValueChange?(event: SliderValueChangeEvent): unknown;
  onDragStart?(event: SliderDragStartEvent): unknown;
  onDragEnd?(event: SliderDragEndEvent): unknown;
  onDragValueChange?(event: SliderDragValueChangeEvent): unknown;
}

export class SliderEventsController extends ViewController<
  SliderControllerProps,
  SliderState,
  SliderEvents
> {
  #delegate: SliderEventDelegate;
  #media: MediaContext;
  #observer?: SliderObserver;

  constructor(delegate: SliderEventDelegate, media: MediaContext) {
    super();
    this.#delegate = delegate;
    this.#media = media;
  }

  protected override onSetup(): void {
    if (hasProvidedContext(sliderObserverContext)) {
      this.#observer = useContext(sliderObserverContext);
    }
  }

  protected override onConnect(el: HTMLElement) {
    effect(this.#attachEventListeners.bind(this, el));
    effect(this.#attachPointerListeners.bind(this, el));
    if (this.#delegate.swipeGesture) effect(this.#watchSwipeGesture.bind(this));
  }

  #watchSwipeGesture() {
    const { pointer } = this.#media.$state;

    if (pointer() !== 'coarse' || !this.#delegate.swipeGesture!()) {
      this.#provider = null;
      return;
    }

    this.#provider = this.#media.player.el?.querySelector(
      'media-provider,[data-media-provider]',
    ) as HTMLElement | null;

    if (!this.#provider) return;

    new EventsController(this.#provider)
      .add('touchstart', this.#onTouchStart.bind(this), {
        passive: true,
      })
      .add('touchmove', this.#onTouchMove.bind(this), { passive: false });
  }

  #provider: HTMLElement | null = null;
  #touch: Touch | null = null;
  #touchStartValue: number | null = null;
  #onTouchStart(event: TouchEvent) {
    this.#touch = event.touches[0];
  }

  #onTouchMove(event: TouchEvent) {
    if (isNull(this.#touch) || isTouchPinchEvent(event)) return;

    const touch = event.touches[0],
      xDiff = touch.clientX - this.#touch.clientX,
      yDiff = touch.clientY - this.#touch.clientY,
      isDragging = this.$state.dragging();

    if (!isDragging && Math.abs(yDiff) > 5) {
      return;
    }

    if (isDragging) return;

    event.preventDefault();

    if (Math.abs(xDiff) > 20) {
      this.#touch = touch;
      this.#touchStartValue = this.$state.value();
      this.#onStartDragging(this.#touchStartValue, event);
    }
  }

  #attachEventListeners(el: HTMLElement) {
    const { hidden } = this.$props;

    new EventsController(el)
      .add('focus', this.#onFocus.bind(this))
      .add('keyup', this.#onKeyUp.bind(this))
      .add('keydown', this.#onKeyDown.bind(this));

    if (hidden() || this.#delegate.isDisabled()) return;

    new EventsController(el)
      .add('pointerenter', this.#onPointerEnter.bind(this))
      .add('pointermove', this.#onPointerMove.bind(this))
      .add('pointerleave', this.#onPointerLeave.bind(this))
      .add('pointerdown', this.#onPointerDown.bind(this));
  }

  #attachPointerListeners(el: HTMLElement) {
    if (this.#delegate.isDisabled() || !this.$state.dragging()) return;

    new EventsController(document)
      .add('pointerup', this.#onDocumentPointerUp.bind(this), { capture: true })
      .add('pointermove', this.#onDocumentPointerMove.bind(this))
      .add('touchmove', this.#onDocumentTouchMove.bind(this), {
        passive: false,
      });
  }

  #onFocus() {
    this.#updatePointerValue(this.$state.value());
  }

  #updateValue(newValue: number, trigger?: Event) {
    const { value, min, max, dragging } = this.$state;

    const clampedValue = Math.max(min(), Math.min(newValue, max()));
    value.set(clampedValue);

    const event = this.createEvent('value-change', { detail: clampedValue, trigger });
    this.dispatch(event);
    this.#delegate.onValueChange?.(event);

    if (dragging()) {
      const event = this.createEvent('drag-value-change', { detail: clampedValue, trigger });
      this.dispatch(event);
      this.#delegate.onDragValueChange?.(event);
    }
  }

  #updatePointerValue(value: number, trigger?: Event) {
    const { pointerValue, dragging } = this.$state;
    pointerValue.set(value);
    this.dispatch('pointer-value-change', { detail: value, trigger });
    if (dragging()) {
      this.#updateValue(value, trigger);
    }
  }

  #getPointerValue(event: PointerEvent) {
    let thumbPositionRate: number,
      rect = this.el!.getBoundingClientRect(),
      { min, max } = this.$state;

    if (this.$props.orientation() === 'vertical') {
      const { bottom: trackBottom, height: trackHeight } = rect;
      thumbPositionRate = (trackBottom - event.clientY) / trackHeight;
    } else {
      if (this.#touch && isNumber(this.#touchStartValue)) {
        const { width } = this.#provider!.getBoundingClientRect(),
          rate = (event.clientX - this.#touch.clientX) / width,
          range = max() - min(),
          diff = range * Math.abs(rate);
        thumbPositionRate =
          (rate < 0 ? this.#touchStartValue - diff : this.#touchStartValue + diff) / range;
      } else {
        const { left: trackLeft, width: trackWidth } = rect;
        thumbPositionRate = (event.clientX - trackLeft) / trackWidth;
      }
    }

    return Math.max(
      min(),
      Math.min(
        max(),
        this.#delegate.roundValue(
          getValueFromRate(min(), max(), thumbPositionRate, this.#delegate.getStep()),
        ),
      ),
    );
  }

  #onPointerEnter(event: PointerEvent) {
    this.$state.pointing.set(true);
  }

  #onPointerMove(event: PointerEvent) {
    const { dragging } = this.$state;
    // Avoid double updates - use document pointer move.
    if (dragging()) return;
    this.#updatePointerValue(this.#getPointerValue(event), event);
  }

  #onPointerLeave(event: PointerEvent) {
    this.$state.pointing.set(false);
  }

  #onPointerDown(event: PointerEvent) {
    if (event.button !== 0) return;
    const value = this.#getPointerValue(event);
    this.#onStartDragging(value, event);
    this.#updatePointerValue(value, event);
  }

  #onStartDragging(value: number, trigger: Event) {
    const { dragging } = this.$state;

    if (dragging()) return;
    dragging.set(true);

    this.#media.remote.pauseControls(trigger);

    const event = this.createEvent('drag-start', { detail: value, trigger });
    this.dispatch(event);
    this.#delegate.onDragStart?.(event);
    this.#observer?.onDragStart?.();
  }

  #onStopDragging(value: number, trigger: Event) {
    const { dragging } = this.$state;

    if (!dragging()) return;
    dragging.set(false);

    this.#media.remote.resumeControls(trigger);

    const event = this.createEvent('drag-end', { detail: value, trigger });
    this.dispatch(event);
    this.#delegate.onDragEnd?.(event);
    this.#touch = null;
    this.#touchStartValue = null;
    this.#observer?.onDragEnd?.();
  }

  // -------------------------------------------------------------------------------------------
  // Keyboard Events
  // -------------------------------------------------------------------------------------------

  #lastDownKey!: string;
  #repeatedKeys = false;

  #onKeyDown(event: KeyboardEvent) {
    const isValidKey = Object.keys(SliderKeyDirection).includes(event.key);

    if (!isValidKey) return;

    const { key } = event,
      jumpValue = this.#calcJumpValue(event);

    if (!isNull(jumpValue)) {
      this.#updatePointerValue(jumpValue, event);
      this.#updateValue(jumpValue, event);
      return;
    }

    const newValue = this.#calcNewKeyValue(event);

    if (!this.#repeatedKeys) {
      this.#repeatedKeys = key === this.#lastDownKey;
      if (!this.$state.dragging() && this.#repeatedKeys) {
        this.#onStartDragging(newValue, event);
      }
    }

    this.#updatePointerValue(newValue, event);

    this.#lastDownKey = key;
  }

  #onKeyUp(event: KeyboardEvent) {
    const isValidKey = Object.keys(SliderKeyDirection).includes(event.key);
    if (!isValidKey || !isNull(this.#calcJumpValue(event))) return;

    const newValue = this.#repeatedKeys ? this.$state.pointerValue() : this.#calcNewKeyValue(event);
    this.#updateValue(newValue, event);
    this.#onStopDragging(newValue, event);

    this.#lastDownKey = '';
    this.#repeatedKeys = false;
  }

  #calcJumpValue(event: KeyboardEvent) {
    let key = event.key,
      { min, max } = this.$state;

    if (key === 'Home' || key === 'PageUp') {
      return min();
    } else if (key === 'End' || key === 'PageDown') {
      return max();
    } else if (!event.metaKey && /^[0-9]$/.test(key)) {
      return ((max() - min()) / 10) * Number(key);
    }

    return null;
  }

  #calcNewKeyValue(event: KeyboardEvent) {
    const { key, shiftKey } = event;

    event.preventDefault();
    event.stopPropagation();

    const { shiftKeyMultiplier } = this.$props;
    const { min, max, value, pointerValue } = this.$state,
      step = this.#delegate.getStep(),
      keyStep = this.#delegate.getKeyStep();

    const modifiedStep = !shiftKey ? keyStep : keyStep * shiftKeyMultiplier(),
      direction = Number(SliderKeyDirection[key]),
      diff = modifiedStep * direction,
      currentValue = this.#repeatedKeys ? pointerValue() : (this.#delegate.getValue?.() ?? value()),
      steps = (currentValue + diff) / step;

    return Math.max(min(), Math.min(max(), Number((step * steps).toFixed(3))));
  }

  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------

  #onDocumentPointerUp(event: PointerEvent) {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const value = this.#getPointerValue(event);
    this.#updatePointerValue(value, event);
    this.#onStopDragging(value, event);
  }

  #onDocumentTouchMove(event: TouchEvent) {
    event.preventDefault();
  }

  #onDocumentPointerMove = throttle(
    (event: PointerEvent) => {
      this.#updatePointerValue(this.#getPointerValue(event), event);
    },
    20,
    { leading: true },
  );
}
