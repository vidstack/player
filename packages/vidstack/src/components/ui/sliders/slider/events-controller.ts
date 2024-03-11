import throttle from 'just-throttle';
import {
  effect,
  hasProvidedContext,
  useContext,
  ViewController,
  type ReadSignal,
} from 'maverick.js';
import { isNull, isNumber, isUndefined, listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../../../core';
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
  _swipeGesture?: ReadSignal<boolean>;
  _isDisabled(): boolean;
  _getStep(): number;
  _getKeyStep(): number;
  _roundValue(value: number): number;
  _onValueChange?(event: SliderValueChangeEvent): unknown;
  _onDragStart?(event: SliderDragStartEvent): unknown;
  _onDragEnd?(event: SliderDragEndEvent): unknown;
  _onDragValueChange?(event: SliderDragValueChangeEvent): unknown;
}

export class SliderEventsController extends ViewController<
  SliderControllerProps,
  SliderState,
  SliderEvents
> {
  private _observer?: SliderObserver;

  constructor(
    private _delegate: SliderEventDelegate,
    private _media: MediaContext,
  ) {
    super();
  }

  protected override onSetup(): void {
    if (hasProvidedContext(sliderObserverContext)) {
      this._observer = useContext(sliderObserverContext);
    }
  }

  protected override onConnect() {
    effect(this._attachEventListeners.bind(this));
    effect(this._attachPointerListeners.bind(this));
    if (this._delegate._swipeGesture) effect(this._watchSwipeGesture.bind(this));
  }

  private _watchSwipeGesture() {
    const { pointer } = this._media.$state;

    if (pointer() !== 'coarse' || !this._delegate._swipeGesture!()) {
      this._provider = null;
      return;
    }

    this._provider = this._media.player.el?.querySelector(
      'media-provider,[data-media-provider]',
    ) as HTMLElement | null;

    if (!this._provider) return;

    listenEvent(this._provider, 'touchstart', this._onTouchStart.bind(this), {
      passive: true,
    });

    listenEvent(this._provider, 'touchmove', this._onTouchMove.bind(this), {
      passive: false,
    });
  }

  private _provider: HTMLElement | null = null;
  private _touch: Touch | null = null;
  private _touchStartValue: number | null = null;
  private _onTouchStart(event: TouchEvent) {
    this._touch = event.touches[0];
  }

  private _onTouchMove(event: TouchEvent) {
    if (isNull(this._touch) || isTouchPinchEvent(event)) return;

    const touch = event.touches[0],
      xDiff = touch.clientX - this._touch.clientX,
      yDiff = touch.clientY - this._touch.clientY,
      isDragging = this.$state.dragging();

    if (!isDragging && Math.abs(yDiff) > 5) {
      return;
    }

    if (isDragging) return;

    event.preventDefault();

    if (Math.abs(xDiff) > 20) {
      this._touch = touch;
      this._touchStartValue = this.$state.value();
      this._onStartDragging(this._touchStartValue, event);
    }
  }

  private _attachEventListeners() {
    const { hidden } = this.$props;

    this.listen('focus', this._onFocus.bind(this));
    this.listen('keydown', this._onKeyDown.bind(this));
    this.listen('keyup', this._onKeyUp.bind(this));

    if (hidden() || this._delegate._isDisabled()) return;

    this.listen('pointerenter', this._onPointerEnter.bind(this));
    this.listen('pointermove', this._onPointerMove.bind(this));
    this.listen('pointerleave', this._onPointerLeave.bind(this));
    this.listen('pointerdown', this._onPointerDown.bind(this));
  }

  private _attachPointerListeners() {
    if (this._delegate._isDisabled() || !this.$state.dragging()) return;

    listenEvent(document, 'pointerup', this._onDocumentPointerUp.bind(this));
    listenEvent(document, 'pointermove', this._onDocumentPointerMove.bind(this));
    listenEvent(document, 'touchmove', this._onDocumentTouchMove.bind(this), {
      passive: false,
    });
  }

  private _onFocus() {
    this._updatePointerValue(this.$state.value());
  }

  private _updateValue(newValue: number, trigger?: Event) {
    const { value, min, max, dragging } = this.$state;

    const clampedValue = Math.max(min(), Math.min(newValue, max()));
    value.set(clampedValue);

    const event = this.createEvent('value-change', { detail: clampedValue, trigger });
    this.dispatch(event);
    this._delegate._onValueChange?.(event);

    if (dragging()) {
      const event = this.createEvent('drag-value-change', { detail: clampedValue, trigger });
      this.dispatch(event);
      this._delegate._onDragValueChange?.(event);
    }
  }

  private _updatePointerValue(value: number, trigger?: Event) {
    const { pointerValue, dragging } = this.$state;
    pointerValue.set(value);
    this.dispatch('pointer-value-change', { detail: value, trigger });
    if (dragging()) {
      this._updateValue(value, trigger);
    }
  }

  private _getPointerValue(event: PointerEvent) {
    let thumbPositionRate: number,
      rect = this.el!.getBoundingClientRect(),
      { min, max } = this.$state;

    if (this.$props.orientation() === 'vertical') {
      const { bottom: trackBottom, height: trackHeight } = rect;
      thumbPositionRate = (trackBottom - event.clientY) / trackHeight;
    } else {
      if (this._touch && isNumber(this._touchStartValue)) {
        const { width } = this._provider!.getBoundingClientRect(),
          rate = (event.clientX - this._touch.clientX) / width,
          range = max() - min(),
          diff = range * Math.abs(rate);
        thumbPositionRate =
          (rate < 0 ? this._touchStartValue - diff : this._touchStartValue + diff) / range;
      } else {
        const { left: trackLeft, width: trackWidth } = rect;
        thumbPositionRate = (event.clientX - trackLeft) / trackWidth;
      }
    }

    return Math.max(
      min(),
      Math.min(
        max(),
        this._delegate._roundValue(
          getValueFromRate(min(), max(), thumbPositionRate, this._delegate._getStep()),
        ),
      ),
    );
  }

  private _onPointerEnter(event: PointerEvent) {
    this.$state.pointing.set(true);
  }

  private _onPointerMove(event: PointerEvent) {
    const { dragging } = this.$state;
    // Avoid double updates - use document pointer move.
    if (dragging()) return;
    this._updatePointerValue(this._getPointerValue(event), event);
  }

  private _onPointerLeave(event: PointerEvent) {
    this.$state.pointing.set(false);
  }

  private _onPointerDown(event: PointerEvent) {
    if (event.button !== 0) return;
    const value = this._getPointerValue(event);
    this._onStartDragging(value, event);
    this._updatePointerValue(value, event);
  }

  private _onStartDragging(value: number, trigger: Event) {
    const { dragging } = this.$state;

    if (dragging()) return;
    dragging.set(true);

    this._media.remote.pauseControls(trigger);

    const event = this.createEvent('drag-start', { detail: value, trigger });
    this.dispatch(event);
    this._delegate._onDragStart?.(event);
    this._observer?.onDragStart?.();
  }

  private _onStopDragging(value: number, trigger: Event) {
    const { dragging } = this.$state;

    if (!dragging()) return;
    dragging.set(false);

    this._media.remote.resumeControls(trigger);

    const event = this.createEvent('drag-end', { detail: value, trigger });
    this.dispatch(event);
    this._delegate._onDragEnd?.(event);
    this._touch = null;
    this._touchStartValue = null;
    this._observer?.onDragEnd?.();
  }

  // -------------------------------------------------------------------------------------------
  // Keyboard Events
  // -------------------------------------------------------------------------------------------

  private _lastDownKey!: string;
  private _onKeyDown(event: KeyboardEvent) {
    const { key } = event,
      { min, max } = this.$state;

    let newValue: number | undefined;
    if (key === 'Home' || key === 'PageUp') {
      newValue = min();
    } else if (key === 'End' || key === 'PageDown') {
      newValue = max();
    } else if (!event.metaKey && /^[0-9]$/.test(key)) {
      newValue = ((max() - min()) / 10) * Number(key);
    }

    if (!isUndefined(newValue)) {
      this._updatePointerValue(newValue, event);
      this._updateValue(newValue, event);
      return;
    }

    const value = this._getKeyValue(event);
    if (isUndefined(value)) return;

    const repeat = key === this._lastDownKey;
    if (!this.$state.dragging() && repeat) this._onStartDragging(value, event);

    this._updatePointerValue(value, event);
    if (!repeat) this._updateValue(value, event);

    this._lastDownKey = key;
  }

  private _onKeyUp(event: KeyboardEvent) {
    this._lastDownKey = '';

    const { dragging, value } = this.$state;
    if (!dragging()) return;

    const newValue = this._getKeyValue(event) ?? value();
    this._updatePointerValue(newValue);
    this._onStopDragging(newValue, event);
  }

  private _getKeyValue(event: KeyboardEvent) {
    const { key, shiftKey } = event,
      isValidKey = Object.keys(SliderKeyDirection).includes(key);

    if (!isValidKey) return;

    event.preventDefault();
    event.stopPropagation();

    const { shiftKeyMultiplier } = this.$props;
    const { value, min, max } = this.$state,
      step = this._delegate._getStep(),
      keyStep = this._delegate._getKeyStep();

    const modifiedStep = !shiftKey ? keyStep : keyStep * shiftKeyMultiplier(),
      direction = Number(SliderKeyDirection[key]),
      diff = modifiedStep * direction,
      steps = (value() + diff) / step;

    return Math.max(min(), Math.min(max(), Number((step * steps).toFixed(3))));
  }

  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------

  private _onDocumentPointerUp(event: PointerEvent) {
    if (event.button !== 0) return;
    const value = this._getPointerValue(event);
    this._updatePointerValue(value, event);
    this._onStopDragging(value, event);
  }

  private _onDocumentTouchMove(event: TouchEvent) {
    event.preventDefault();
  }

  private _onDocumentPointerMove = throttle(
    (event: PointerEvent) => {
      this._updatePointerValue(this._getPointerValue(event), event);
    },
    20,
    { leading: true },
  );
}
