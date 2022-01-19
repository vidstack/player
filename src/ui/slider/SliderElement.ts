import {
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult
} from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

import { hostedEventListener, vdsEvent } from '../../base/events';
import { logElementLifecycle } from '../../base/logger';
import { setAttribute, setAttributeIfEmpty } from '../../utils/dom';
import {
  clampNumber,
  getNumberOfDecimalPlaces,
  round
} from '../../utils/number';
import { rafThrottle } from '../../utils/timing';
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
 * friendly and easily styleable. This component allows users to input numeric values between a
 * minimum and maxmimum value. Generally used in the player for volume or scrubber controls.
 *
 * @see https://github.com/carbon-design-system/carbon-web-components
 * @tagname vds-slider
 * @slot Used to pass in additional content inside the slider.
 * @slot thumb-container - Used to pass content into the thumb container.
 * @slot thumb - Used to pass content inside the thumb.
 * @slot track - Used to pass content inside the track.
 * @slot track-fill - Used to pass content inside the track fill.
 * @csspart root - The component's root element, in this case the slider container (`<div>`).
 * @csspart thumb-container - The container for the slider's handle.
 * @csspart thumb - The slider's handle the user drags left/right (`<div>`).
 * @csspart track - The path in which the thumb slides along (`<div>`).
 * @csspart track-fill - The part of the track that is currently filled which fills left-to-right (`<div>`).
 * @cssprop --vds-slider-fill-rate - The ratio of the slider that is filled such as `0.3`.
 * @cssprop --vds-slider-fill-value - The current amount the slider is filled such as `30`.
 * @cssprop --vds-slider-fill-percentage - The fill rate expressed as a precetange such as `30%`.
 * @cssprop --vds-slider-thumb-width - The slider handle width.
 * @cssprop --vds-slider-thumb-height - The slider handle height.
 * @cssprop --vds-slider-thumb-bg - The background color of the slider handle.
 * @cssprop --vds-slider-thumb-border-radius - The border radius of the slider handle.
 * @cssprop --vds-slider-thumb-scale - The base scale of thumb when it is inactive, it'll scale to 1 when active.
 * @cssprop --vds-slider-thumb-transition - The CSS transitions to use for the thumb, defaults to `transform 100ms ease-out 0s`.
 * @cssprop --vds-slider-track-height - The height of the slider track.
 * @cssprop --vds-slider-track-bg - The background color of the slider track.
 * @cssprop --vds-slider-track-fill-bg - The background color of the slider track fill.
 * @cssprop --vds-slider-active-color - The slider thumb and track fill background color when focused, active or being dragged.
 * @cssprop --vds-slider-disabled-color - The slider thumb, track, and track fill background color when disabled.
 * @example
 * ```html
 * <vds-slider
 *   min="0"
 *   max="100"
 *   value="50"
 * ></vds-slider>
 * ```
 * @example
 * ```css
 * vds-slider {
 *   --vds-slider-active-color: #ff2a5d;
 * }
 *
 * vds-slider::part(thumb) {
 *   box-shadow: transparent 0px 0px 0px 1px inset;
 * }
 *
 * vds-slider::part(track),
 * vds-slider::part(track-fill) {
 *   border-radius: 3px;
 * }
 * ```
 */
export class SliderElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [sliderElementStyles];
  }

  static get parts(): string[] {
    return ['root', 'thumb', 'track', 'track-fill'];
  }

  constructor() {
    super();
    if (__DEV__) logElementLifecycle(this);
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The lowest slider value in the range of permitted values.
   */
  @property({ reflect: true, type: Number })
  min = 0;

  /**
   * The greatest slider value in the range of permitted values.
   */
  @property({ reflect: true, type: Number })
  max = 100;

  /**
   * Whether the slider should be disabled (not-interactable).
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

  @state() protected _isDragging = false;

  /**
   * Whether the slider thumb is currently being dragged.
   *
   * @default false
   */
  get isDragging(): boolean {
    return this._isDragging;
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
    return this.value / range;
  }

  /**
   * The fill rate expressed as a percentage (`fillRate * 100`).
   *
   * @default 50
   */
  get fillPercent(): number {
    return this.fillRate * 100;
  }

  @state() protected _dragValue = 0;

  get dragValue() {
    return this._dragValue;
  }

  get dragRate() {
    const range = this.max - this.min;
    return this._dragValue / range;
  }

  get dragPercent() {
    return this.dragRate * 100;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  override connectedCallback(): void {
    super.connectedCallback();
    this._setupHostAttrs();
  }

  protected override updated(changedProperties: PropertyValues) {
    if (changedProperties.has('value')) {
      this.value = this._getClampedValue(this.value);
    }

    if (changedProperties.has('disabled') && this.disabled) {
      this._isDragging = false;
      this.removeAttribute('dragging');
      setAttribute(this, 'aria-disabled', this.disabled);
    }

    if (!this.customValueText) {
      this.setAttribute('aria-valuemin', this._getValueMin());
      this.setAttribute('aria-valuenow', this._getValueNow());
      this.setAttribute('aria-valuemax', this._getValueMax());
      this.setAttribute('aria-valuetext', this._getValueText());
    }

    super.update(changedProperties);
  }

  override disconnectedCallback() {
    this._handlePointerMove.cancel();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Host
  // -------------------------------------------------------------------------------------------

  protected _setupHostAttrs() {
    setAttributeIfEmpty(this, 'role', 'slider');
    setAttributeIfEmpty(this, 'tabindex', '0');
    setAttributeIfEmpty(this, 'aria-orientation', 'horizontal');
    setAttributeIfEmpty(this, 'autocomplete', 'off');
  }

  protected _handleHostKeydown = hostedEventListener(
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
  // Render (Root/Slider)
  // -------------------------------------------------------------------------------------------

  protected readonly _rootRef = createRef<HTMLDivElement>();

  /**
   * The component's root element.
   */
  get rootElement() {
    return this._rootRef.value;
  }

  protected override render(): TemplateResult {
    return this._renderSlider();
  }

  protected _renderSlider(): TemplateResult {
    return html`
      <div
        id="root"
        role="presentation"
        part="root"
        style=${styleMap({
          '--vds-slider-fill-value': String(this.value),
          '--vds-slider-fill-rate': String(this.fillRate),
          '--vds-slider-fill-percent': `${this.fillPercent}%`,
          '--vds-slider-drag-rate': String(this.dragRate),
          '--vds-slider-drag-percent': `${this.dragPercent}%`
        })}
        @pointerdown=${this._handleSliderPointerMove}
        ${ref(this._rootRef)}
      >
        ${this._renderSliderChildren()}
      </div>
    `;
  }

  protected _renderSliderChildren(): TemplateResult {
    return html`${this._renderThumbContainer()}${this._renderTrack()}${this._renderTrackFill()}${this._renderInput()}${this._renderDefaultSlot()}`;
  }

  protected _renderDefaultSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected _handleSliderPointerMove(event: PointerEvent) {
    if (this.disabled) return;
    this._startDragging(event);
    this._handlePointerMove(event);
  }

  // -------------------------------------------------------------------------------------------
  // Render (Thumb Container)
  // -------------------------------------------------------------------------------------------

  protected readonly _thumbContainerRef = createRef<HTMLDivElement>();

  /**
   * The thumb container element.
   */
  get thumbContainerElement() {
    return this._thumbContainerRef.value;
  }

  protected _renderThumbContainer(): TemplateResult {
    return html`
      <div
        id="thumb-container"
        part="thumb-container"
        class=${this.isDragging ? 'dragging' : ''}
        @pointerdown=${this._handleThumbContainerPointerDown}
        ${ref(this._thumbContainerRef)}
      >
        ${this._renderThumb()} ${this._renderThumbContainerSlot()}
      </div>
    `;
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

  protected _renderThumbContainerSlot(): TemplateResult {
    return html`<slot name="thumb-container"></slot> `;
  }

  protected _handleThumbContainerPointerDown(event: PointerEvent) {
    if (this.disabled) return;
    this._startDragging(event);
  }

  // -------------------------------------------------------------------------------------------
  // Render (Thumb)
  // -------------------------------------------------------------------------------------------

  protected readonly _thumbRef = createRef<HTMLDivElement>();

  /**
   * The thumb element.
   */
  get thumbElement() {
    return this._thumbRef.value;
  }

  protected _renderThumb(): TemplateResult {
    return html`
      <div id="thumb" part="thumb" ${ref(this._thumbRef)}>
        ${this._renderThumbSlot()}
      </div>
    `;
  }

  protected _renderThumbSlot(): TemplateResult {
    return html`<slot name="thumb"></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Render (Track)
  // -------------------------------------------------------------------------------------------

  protected readonly _trackRef = createRef<HTMLDivElement>();

  /**
   * The track element.
   */
  get trackElement() {
    return this._trackRef.value;
  }

  protected _renderTrack(): TemplateResult {
    return html`
      <div id="track" part="track" ${ref(this._trackRef)}>
        ${this._renderTrackSlot()}
      </div>
    `;
  }

  protected _renderTrackSlot(): TemplateResult {
    return html`<slot name="track"></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Render (Track Fill)
  // -------------------------------------------------------------------------------------------

  protected readonly _trackFillRef = createRef<HTMLDivElement>();

  /**
   * The track fill element.
   */
  get trackFillElement() {
    return this._trackFillRef.value;
  }

  protected _renderTrackFill(): TemplateResult {
    return html`
      <div id="track-fill" part="track-fill" ${ref(this._trackFillRef)}>
        ${this._renderTrackFillSlot()}
      </div>
    `;
  }

  protected _renderTrackFillSlot(): TemplateResult {
    return html`<slot name="track-fill"></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Render (Input)
  // -------------------------------------------------------------------------------------------

  /**
   * Why? Used to emit native `input` events.
   */
  protected _renderInput(): TemplateResult {
    return html`
      <input
        type="hidden"
        min="${this.min}"
        max="${this.max}"
        value="${this.value}"
      />
    `;
  }

  // -------------------------------------------------------------------------------------------
  // Drag
  // -------------------------------------------------------------------------------------------

  protected _startDragging(event: PointerEvent) {
    if (this._isDragging) return;

    this._isDragging = true;
    this.setAttribute('dragging', '');

    this._dragValue = this._getValueBasedOnThumbPosition(event);
    this._dispatchDragValueChange(event);

    this.dispatchEvent(
      vdsEvent('vds-slider-drag-start', {
        originalEvent: event,
        detail: this.value
      })
    );
  }

  protected _stopDragging(event: PointerEvent) {
    if (!this._isDragging) return;

    this._isDragging = false;
    this._dispatchValueChange.cancel();
    this.removeAttribute('dragging');

    const newValue = this._getValueBasedOnThumbPosition(event);
    this.value = newValue;
    this._dragValue = newValue;
    this._dispatchValueChange(event);
    this._dispatchDragValueChange(event);

    this.dispatchEvent(
      vdsEvent('vds-slider-drag-end', {
        originalEvent: event,
        detail: this.value
      })
    );
  }

  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------

  protected readonly _handleDocumentPointerUp = hostedEventListener(
    this,
    'pointerup',
    (event) => {
      if (this.disabled || !this._isDragging) return;
      this._stopDragging(event);
    },
    { target: document }
  );

  protected readonly _handleDocumentPointerMove = hostedEventListener(
    this,
    'pointermove',
    (event) => {
      if (this.disabled || !this._isDragging) {
        this._handlePointerMove.cancel();
        return;
      }

      this._handlePointerMove(event);
    },
    { target: document }
  );

  protected readonly _handlePointerMove = rafThrottle((event: PointerEvent) => {
    if (this.disabled || !this._isDragging) return;
    this._dragValue = this._getValueBasedOnThumbPosition(event);
    this._dispatchDragValueChange(event);
  });

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

    const { left: trackLeft, width: trackWidth } =
      this.trackElement!.getBoundingClientRect();

    const thumbPositionRate = (thumbClientX - trackLeft) / trackWidth;

    return this._getValueFromRate(thumbPositionRate);
  }

  protected _lastDispatchedValue = this.value;
  protected readonly _dispatchValueChange = rafThrottle((event: Event) => {
    if (this.value === this._lastDispatchedValue) return;

    this.dispatchEvent(
      vdsEvent('vds-slider-value-change', {
        detail: this.value,
        originalEvent: event
      })
    );

    this._lastDispatchedValue = this.value;
  });

  protected _lastDragDispatchedValue = this.dragValue;
  protected readonly _dispatchDragValueChange = rafThrottle((event: Event) => {
    if (this.dragValue === this._lastDragDispatchedValue) return;

    this.dispatchEvent(
      vdsEvent('vds-slider-drag-value-change', {
        detail: this.dragValue,
        originalEvent: event
      })
    );

    this._lastDispatchedValue = this.value;
  });
}
