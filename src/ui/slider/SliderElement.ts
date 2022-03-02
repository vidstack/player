import {
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult
} from 'lit';
import { property } from 'lit/decorators.js';

import { DisposalBin, eventListener, vdsEvent } from '../../base/events';
import { logElementLifecycle } from '../../base/logger';
import { focusVisiblePolyfill } from '../../base/observers';
import { get } from '../../base/stores';
import { MediaRemoteControl } from '../../media';
import {
  setAttribute,
  setAttributeIfEmpty,
  setCSSProperty
} from '../../utils/dom';
import {
  clampNumber,
  getNumberOfDecimalPlaces,
  round
} from '../../utils/number';
import { rafThrottle } from '../../utils/timing';
import { sliderStoreContext } from './store';
import { sliderElementStyles } from './styles';

/**
 * The direction to move the thumb, associated with key symbols.
 */
export enum SliderKeyDirection {
  Left = -1,
  ArrowLeft = -1,
  Up = -1,
  ArrowUp = -1,
  Right = 1,
  ArrowRight = 1,
  Down = 1,
  ArrowDown = 1
}

/**
 * A custom built `input[type="range"]` that is cross-browser friendly, ARIA friendly, mouse/touch
 * friendly and easily stylable. This component allows users to input numeric values between a
 * minimum and maximum value.
 *
 * 💡 The following attributes are also available on the host element:
 *
 * - `pointing`: Whether a device pointer is within the slider bounds.
 * - `dragging`: Whether the slider thumb is currently being dragged.
 * - `interactive`: When either `pointing` or `dragging` is true.
 *
 * @tagname vds-slider
 * @slot - Used to pass in additional content inside the slider.
 * @cssprop --vds-slider-fill-rate - The ratio of the slider that is filled (eg: `0.3`).
 * @cssprop --vds-slider-fill-value - The current amount of the slider that is filled (eg: `30`).
 * @cssprop --vds-slider-fill-percent - The fill rate expressed as a percentage such as (eg: `30%`).
 * @cssprop --vds-slider-pointer-rate - The ratio of the slider that is filled up to the device pointer.
 * @cssprop --vds-slider-pointer-value - The amount of the slider that is filled up to the device pointer.
 * @cssprop --vds-slider-pointer-percent - The pointer rate expressed as a percentage.
 * @events './events.ts'
 * @example
 * ```html
 * <vds-slider
 *   min="0"
 *   max="100"
 *   value="50"
 * >
 *  <div class="thumb"></div>
 * </vds-slider>
 * ```
 */
export class SliderElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [sliderElementStyles];
  }

  static get parts(): string[] {
    return [];
  }

  constructor() {
    super();
    if (__DEV__) logElementLifecycle(this);
    focusVisiblePolyfill(this);
  }

  // -------------------------------------------------------------------------------------------
  // Context
  // -------------------------------------------------------------------------------------------

  protected readonly _sliderStoreProvider = sliderStoreContext.provide(this);

  get store() {
    return this._sliderStoreProvider.value;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The lowest slider value in the range of permitted values.
   */
  @property({ reflect: true, type: Number })
  get min() {
    return get(this.store.min);
  }

  set min(newMin) {
    this.store.min.set(newMin);
  }

  /**
   * The greatest slider value in the range of permitted values.
   */
  @property({ reflect: true, type: Number })
  get max() {
    return get(this.store.max);
  }

  set max(newMax) {
    this.store.max.set(newMax);
  }

  /**
   * Whether the slider should be disabled (non-interactive).
   */
  @property({ reflect: true, type: Boolean })
  disabled = false;

  /**
   * The current slider value.
   */
  @property({ reflect: true, type: Number })
  value = 50;

  /**
   * A number that specifies the granularity that the slider value must adhere to.
   */
  @property({ type: Number, reflect: true })
  get step() {
    return this._step;
  }

  set step(newStep: number) {
    this._step = newStep;
  }

  protected _step = 1;

  /**
   * ♿ **ARIA:** A number that specifies the number of steps taken when interacting with
   * the slider via keyboard.
   */
  @property({ attribute: 'keyboard-step', type: Number })
  get keyboardStep() {
    return this._keyboardStep;
  }

  set keyboardStep(newStep: number) {
    this._keyboardStep = newStep;
  }

  protected _keyboardStep = 1;

  /**
   * ♿ **ARIA:** A number that will be used to multiply the `keyboardStep` when the `Shift` key
   * is held down and the slider value is changed by pressing `LeftArrow` or `RightArrow`. Think
   * of it as `keyboardStep * shiftKeyMultiplier`.
   */
  @property({ attribute: 'shift-key-multiplier', type: Number })
  shiftKeyMultiplier = 5;

  /**
   * ♿ **ARIA:** Whether custom `aria-valuemin`, `aria-valuenow`, `aria-valuemax`, and
   * `aria-valuetext` values will be provided.
   */
  @property({ type: Boolean, attribute: 'custom-value-text' })
  customValueText = false;

  /**
   * Whether the slider thumb is currently being dragged.
   *
   * @default false
   */
  get isDragging(): boolean {
    return get(this.store.dragging);
  }

  /**
   * The current value to range ratio.
   *
   * @default 0.5
   * @example
   * `min` = 0
   * `max` = 10
   * `value` = 5
   * `range` = 10 (max - min)
   * `fillRate` = 0.5 (result)
   */
  get fillRate(): number {
    const range = this.max - this.min;
    return range > 0 ? this.value / range : 0;
  }

  /**
   * The fill rate expressed as a percentage (`fillRate * 100`).
   *
   * @default 50
   */
  get fillPercent(): number {
    return this.fillRate * 100;
  }

  /**
   * The value at which the device pointer is pointing to inside the slider.
   *
   * @default 0
   */
  get pointerValue() {
    return get(this.store.pointerValue);
  }

  /**
   * The pointer value to range ratio.
   *
   * @default 0
   */
  get pointerRate() {
    const range = this.max - this.min;
    return range > 0 ? this.pointerValue / range : 0;
  }

  /**
   * The pointer rate expressed as a percentage (`pointerRate * 100`).
   *
   * @default 0
   */
  get pointerPercent() {
    return this.pointerRate * 100;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected _mediaRemote = new MediaRemoteControl(this);
  protected _disconnectDisposal = new DisposalBin();

  override connectedCallback(): void {
    super.connectedCallback();

    this._setupAriaAttrs();
    this._updateFillCSSProps();
    this._updatePointerCSSProps();

    this._disconnectDisposal.add(
      this.store.interactive.subscribe(($interactive) => {
        setAttribute(this, 'interactive', $interactive);
      })
    );
  }

  protected override willUpdate(changedProperties: PropertyValues) {
    if (
      changedProperties.has('value') ||
      changedProperties.has('min') ||
      changedProperties.has('max')
    ) {
      this.value = this._getClampedValue(this.value);
      this.store.value.set(this.value);
      this._updateFillCSSProps();
      this._dispatchValueChange();
    }

    if (changedProperties.has('disabled') && this.disabled) {
      this.store.dragging.set(false);
      this.store.pointing.set(false);
      this.removeAttribute('dragging');
      this.removeAttribute('pointing');
      this.removeAttribute('interactive');
      setAttribute(this, 'aria-disabled', this.disabled);
    }

    if (!this.customValueText) {
      this._updateAriaValueAttrs();
    }

    super.willUpdate(changedProperties);
  }

  override disconnectedCallback() {
    this._onDrag.cancel();
    this._disconnectDisposal.empty();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected readonly _handlePointerEnter = eventListener(
    this,
    'pointerenter',
    () => {
      if (this.disabled) return;
      this.setAttribute('pointing', '');
      this.store.pointing.set(true);
    }
  );

  protected readonly _handlePointerMove = eventListener(
    this,
    'pointermove',
    (event) => {
      if (this.disabled || this.isDragging) return;
      const value = this._getValueBasedOnThumbPosition(event);
      this.store.pointerValue.set(value);
      this._dispatchPointerValueChange(event);
    }
  );

  protected readonly _handlePointerLeave = eventListener(
    this,
    'pointerleave',
    () => {
      if (this.disabled) return;
      this.removeAttribute('pointing');
      this.store.pointing.set(false);
    }
  );

  protected readonly _handlePointerDown = eventListener(
    this,
    'pointerdown',
    (event) => {
      if (this.disabled) return;
      this._startDragging(event);
      this._onDrag(event);
    }
  );

  protected readonly _handleKeydown = eventListener(
    this,
    'keydown',
    (event: KeyboardEvent) => {
      if (this.disabled) return;

      const { key, shiftKey } = event;
      const isValidKey = Object.keys(SliderKeyDirection).includes(key);

      if (!isValidKey) return;

      const modifiedStep = !shiftKey
        ? this.keyboardStep
        : this.keyboardStep * this.shiftKeyMultiplier;
      const direction = Number(SliderKeyDirection[key]);
      const diff = modifiedStep * direction;
      const steps = (this.value + diff) / this.step;
      const value = this.step * steps;

      this.value = this._getClampedValue(value);
      this._dispatchValueChange(event);
    }
  );

  // -------------------------------------------------------------------------------------------
  // CSS Properties
  // -------------------------------------------------------------------------------------------

  protected readonly _handleFillValueChange = eventListener(
    this,
    'vds-slider-value-change',
    this._updateFillCSSProps.bind(this)
  );

  protected _updateFillCSSProps() {
    setCSSProperty(this, 'slider-fill-value', `${this.value}`);
    setCSSProperty(this, 'slider-fill-rate', `${this.fillRate}`);
    setCSSProperty(this, 'slider-fill-percent', `${this.fillPercent}%`);
  }

  protected readonly _handlePointerValueChange = eventListener(
    this,
    'vds-slider-pointer-value-change',
    this._updatePointerCSSProps.bind(this)
  );

  protected _updatePointerCSSProps() {
    setCSSProperty(this, 'slider-pointer-value', `${this.pointerValue}`);
    setCSSProperty(this, 'slider-pointer-rate', `${this.pointerRate}`);
    setCSSProperty(this, 'slider-pointer-percent', `${this.pointerPercent}%`);
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  protected override render(): TemplateResult {
    return this._renderSlider();
  }

  protected _renderSlider(): TemplateResult {
    return html`${this._renderDefaultSlot()}`;
  }

  protected _renderDefaultSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------

  protected _setupAriaAttrs() {
    setAttributeIfEmpty(this, 'role', 'slider');
    setAttributeIfEmpty(this, 'tabindex', '0');
    setAttributeIfEmpty(this, 'aria-orientation', 'horizontal');
    setAttributeIfEmpty(this, 'autocomplete', 'off');
  }

  protected _updateAriaValueAttrs() {
    this.setAttribute('aria-valuemin', this._getValueMin());
    this.setAttribute('aria-valuenow', this._getValueNow());
    this.setAttribute('aria-valuemax', this._getValueMax());
    this.setAttribute('aria-valuetext', this._getValueText());
  }

  protected _getValueMin(): string {
    return String(this.min);
  }

  protected _getValueNow(): string {
    return String(this.value);
  }

  protected _getValueMax(): string {
    return String(this.max);
  }

  protected _getValueText(): string {
    return `${round((this.value / this.max) * 100, 2)}%`;
  }

  // -------------------------------------------------------------------------------------------
  // Drag
  // -------------------------------------------------------------------------------------------

  protected _startDragging(event: PointerEvent) {
    if (this.isDragging) return;

    this.store.dragging.set(true);
    this.setAttribute('dragging', '');

    const value = this._getValueBasedOnThumbPosition(event);
    this.store.pointerValue.set(value);

    this._dispatchPointerValueChange(event);

    this.dispatchEvent(
      vdsEvent('vds-slider-drag-start', {
        triggerEvent: event,
        detail: this.value
      })
    );

    this._mediaRemote.pauseIdling(event);
  }

  protected readonly _onDrag = rafThrottle((event: PointerEvent) => {
    if (this.disabled || !this.isDragging) return;
    const value = this._getValueBasedOnThumbPosition(event);
    this.store.pointerValue.set(value);
    this._dispatchPointerValueChange(event);
  });

  protected _stopDragging(event: PointerEvent) {
    if (!this.isDragging) return;

    this.store.dragging.set(false);
    this._dispatchValueChange.cancel();
    this.removeAttribute('dragging');

    const value = this._getValueBasedOnThumbPosition(event);
    this.value = value;
    this.store.pointerValue.set(value);

    this._dispatchValueChange(event);
    this._dispatchPointerValueChange(event);

    this.dispatchEvent(
      vdsEvent('vds-slider-drag-end', {
        triggerEvent: event,
        detail: this.value
      })
    );

    this._mediaRemote.resumeIdling(event);
  }

  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------

  protected readonly _handleDocumentPointerUp = eventListener(
    this,
    'pointerup',
    (event) => {
      if (this.disabled || !this.isDragging) return;
      this._stopDragging(event);
    },
    { target: document }
  );

  protected readonly _handleDocumentTouchMove = eventListener(
    this,
    'touchmove',
    (event) => {
      if (this.disabled || !this.isDragging) return;
      event.preventDefault();
    },
    { target: document, passive: false }
  );

  protected readonly _handleDocumentPointerMove = eventListener(
    this,
    'pointermove',
    (event) => {
      if (this.disabled || !this.isDragging) return;
      this._onDrag(event);
    },
    { target: document }
  );

  protected _getClampedValue(value: number) {
    return clampNumber(
      this.min,
      round(value, getNumberOfDecimalPlaces(this.step)),
      this.max
    );
  }

  protected _getValueFromRate(rate: number) {
    const boundRate = clampNumber(0, rate, 1);
    const range = this.max - this.min;
    const fill = range * boundRate;
    const stepRatio = Math.round(fill / this.step);
    const steps = this.step * stepRatio;
    return this.min + steps;
  }

  protected _getValueBasedOnThumbPosition(event: PointerEvent) {
    const thumbClientX = event.clientX;
    const { left: trackLeft, width: trackWidth } = this.getBoundingClientRect();
    const thumbPositionRate = (thumbClientX - trackLeft) / trackWidth;
    return this._getValueFromRate(thumbPositionRate);
  }

  protected _lastDispatchedValue = this.value;
  protected readonly _dispatchValueChange = rafThrottle((event?: Event) => {
    if (this.value === this._lastDispatchedValue) return;

    this.dispatchEvent(
      vdsEvent('vds-slider-value-change', {
        detail: this.value,
        triggerEvent: event
      })
    );

    this._lastDispatchedValue = this.value;
  });

  protected _lastDispatchedPointerValue = this.pointerValue;
  protected readonly _dispatchPointerValueChange = rafThrottle(
    (event: Event) => {
      if (this.pointerValue === this._lastDispatchedPointerValue) return;

      const events = [
        'vds-slider-pointer-value-change',
        this.isDragging && 'vds-slider-drag-value-change'
      ] as const;

      events.forEach((eventType) => {
        if (eventType) {
          this.dispatchEvent(
            vdsEvent(eventType, {
              detail: this.pointerValue,
              triggerEvent: event
            })
          );
        }
      });

      this._lastDispatchedPointerValue = this.pointerValue;
    }
  );
}
