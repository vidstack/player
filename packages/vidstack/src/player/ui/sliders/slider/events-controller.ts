import { effect } from 'maverick.js';
import { ComponentController, ComponentInstance } from 'maverick.js/element';
import { DOMEvent, isDOMEvent, isKeyboardEvent, isUndefined, listenEvent } from 'maverick.js/std';

import { IS_SAFARI } from '../../../../utils/support';
import type { MediaContext } from '../../../core/api/context';
import type {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderDragValueChangeEvent,
  SliderValueChangeEvent,
} from './api/events';
import type { SliderAPI } from './slider';
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
  readonly _orientation: string;
  _isDisabled(): boolean;
  _getStep(): number;
  _getKeyStep(): number;
  _onValueChange(event: SliderValueChangeEvent): unknown;
  _onDragStart(event: SliderDragStartEvent): unknown;
  _onDragEnd(event: SliderDragEndEvent): unknown;
  _onDragValueChange(event: SliderDragValueChangeEvent): unknown;
}

export class SliderEventsController extends ComponentController<SliderAPI> {
  constructor(
    instance: ComponentInstance<SliderAPI>,
    protected _delegate: SliderEventDelegate,
    protected _media: MediaContext,
  ) {
    super(instance);
  }

  protected override onConnect() {
    effect(this._attachEventListeners.bind(this));
    effect(this._attachPointerListeners.bind(this));
  }

  protected _attachEventListeners() {
    if (this._delegate._isDisabled()) return;
    this.listen('focus', this._onFocus.bind(this));
    this.listen('pointerenter', this._onPointerEnter.bind(this));
    this.listen('pointermove', this._onPointerMove.bind(this));
    this.listen('pointerleave', this._onPointerLeave.bind(this));
    this.listen('pointerdown', this._onPointerDown.bind(this));
    this.listen('keydown', this._onKeyDown.bind(this));
    this.listen('keyup', this._onKeyUp.bind(this));
  }

  protected _attachPointerListeners() {
    if (this._delegate._isDisabled() || !this.$store.dragging()) return;
    listenEvent(document, 'pointerup', this._onDocumentPointerUp.bind(this));
    listenEvent(document, 'pointermove', this._onDocumentPointerMove.bind(this));
    if (IS_SAFARI) {
      listenEvent(document, 'touchmove', this._onDocumentTouchMove.bind(this), {
        passive: false,
      });
    }
  }

  protected _onFocus() {
    this._updatePointerValue(this.$store.value());
  }

  protected _updateValue(newValue: number, trigger?: Event) {
    const { value, min, max, dragging } = this.$store;

    const clampedValue = Math.max(min(), Math.min(newValue, max()));
    value.set(clampedValue);

    const event = this.createEvent('value-change', { detail: clampedValue, trigger });
    this.el!.dispatchEvent(event);
    this._delegate._onValueChange(event);

    if (dragging()) {
      const event = this.createEvent('drag-value-change', { detail: clampedValue, trigger });
      this.el!.dispatchEvent(event);
      this._delegate._onDragValueChange(event);
    }
  }

  protected _updatePointerValue(newValue: number, trigger?: Event) {
    const { pointerValue, min, max, dragging } = this.$store;
    const clampedValue = Math.max(min(), Math.min(newValue, max()));
    pointerValue.set(clampedValue);
    this._onPointerValueChange(clampedValue, trigger);
    if (dragging()) this._updateValue(clampedValue, trigger);
  }

  protected _onPointerValueChange(value: number, trigger?: Event) {
    this.dispatch('pointer-value-change', { detail: value, trigger });
  }

  protected _getPointerValue(event: PointerEvent) {
    let thumbPositionRate: number,
      rect = this.el!.getBoundingClientRect();

    if (this._delegate._orientation === 'vertical') {
      const thumbClientY = event.clientY;
      const { bottom: trackBottom, height: trackHeight } = rect;
      thumbPositionRate = (trackBottom - thumbClientY) / trackHeight;
    } else {
      const thumbClientX = event.clientX;
      const { left: trackLeft, width: trackWidth } = rect;
      thumbPositionRate = (thumbClientX - trackLeft) / trackWidth;
    }

    const { min, max } = this.$store;
    return getValueFromRate(min(), max(), thumbPositionRate, this._delegate._getStep());
  }

  protected _onPointerEnter() {
    this.$store.pointing.set(true);
  }

  protected _onPointerMove(event: PointerEvent) {
    const { dragging } = this.$store;
    // Avoid double updates - use document pointer move.
    if (dragging()) return;
    this._updatePointerValue(this._getPointerValue(event), event);
  }

  protected _onPointerLeave(event: PointerEvent) {
    this.$store.pointing.set(false);
  }

  protected _onPointerDown(event: PointerEvent) {
    const value = this._getPointerValue(event);
    this._onStartDragging(value, event);
    this._updatePointerValue(value, event);
  }

  protected _onStartDragging(value: number, trigger: Event) {
    const { dragging } = this.$store;

    if (dragging()) return;
    dragging.set(true);

    this._media.remote.pauseUserIdle(trigger);

    const event = this.createEvent('drag-start', { detail: value, trigger });
    this.el!.dispatchEvent(event);
    this._delegate._onDragStart(event);
  }

  protected _onStopDragging(value: number, trigger: Event) {
    const { dragging } = this.$store;

    if (!dragging()) return;
    dragging.set(false);

    this._media.remote.resumeUserIdle(trigger);

    const event = this.createEvent('drag-end', { detail: value, trigger });
    this.el!.dispatchEvent(event);
    this._delegate._onDragEnd(event);
  }

  // -------------------------------------------------------------------------------------------
  // Keyboard Events
  // -------------------------------------------------------------------------------------------

  protected _lastDownKey!: string;
  protected _onKeyDown(event: DOMEvent<void> | KeyboardEvent) {
    if (isDOMEvent(event)) {
      const trigger = event.trigger;
      if (isKeyboardEvent(trigger)) event = trigger;
      else return;
    }

    const { key } = event;
    const { min, max } = this.$store;

    let newValue: number | undefined;
    if (key === 'Home' || key === 'PageUp') {
      newValue = min();
    } else if (key === 'End' || key === 'PageDown') {
      newValue = max();
    } else if (/[0-9]/.test(key)) {
      newValue = ((max() - min()) / 10) * Number(key);
    }

    if (!isUndefined(newValue)) {
      this._updatePointerValue(newValue, event);
      this._updateValue(newValue, event);
      return;
    }

    const value = this._getKeyValue(event);
    if (!value) return;

    const repeat = key === this._lastDownKey;
    if (!this.$store.dragging() && repeat) this._onStartDragging(value, event);

    this._updatePointerValue(value, event);
    if (!repeat) this._updateValue(value, event);

    this._lastDownKey = key;
  }

  protected _onKeyUp(event: DOMEvent<void> | KeyboardEvent) {
    if (isDOMEvent(event)) {
      const trigger = event.trigger;
      if (isKeyboardEvent(trigger)) event = trigger;
      else return;
    }

    this._lastDownKey = '';

    const { dragging, value } = this.$store;
    if (!dragging()) return;
    const newValue = this._getKeyValue(event) ?? value();
    this._updatePointerValue(newValue);
    this._onStopDragging(newValue, event);
  }

  protected _getKeyValue(event: KeyboardEvent) {
    const { key, shiftKey } = event,
      isValidKey = Object.keys(SliderKeyDirection).includes(key);

    if (!isValidKey) return;

    const { shiftKeyMultiplier } = this.$props;
    const { value } = this.$store,
      step = this._delegate._getStep(),
      keyStep = this._delegate._getKeyStep();

    const modifiedStep = !shiftKey ? keyStep : keyStep * shiftKeyMultiplier(),
      direction = Number(SliderKeyDirection[key]),
      diff = modifiedStep * direction,
      steps = (value() + diff) / step;

    return Number((step * steps).toFixed(3));
  }

  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------

  protected _onDocumentPointerUp(event: PointerEvent) {
    const value = this._getPointerValue(event);
    this._updatePointerValue(value, event);
    this._onStopDragging(value, event);
  }

  protected _onDocumentTouchMove(event: TouchEvent) {
    event.preventDefault();
  }

  protected _onDocumentPointerMove(event: PointerEvent) {
    this._updatePointerValue(this._getPointerValue(event), event);
  }
}
