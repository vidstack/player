import { ifNonEmpty, on } from '@base/directives/index';
import { WithFocus } from '@base/elements/index';
import { eventListener, vdsEvent } from '@base/events/index';
import { clampNumber, getNumberOfDecimalPlaces, round } from '@utils/number';
import { rafThrottle } from '@utils/timing';
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

import { sliderElementStyles } from './styles';

export const SLIDER_ELEMENT_TAG_NAME = 'vds-slider';

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
export class SliderElement extends WithFocus(LitElement) {
  static override get styles(): CSSResultGroup {
    return [sliderElementStyles];
  }

  static get parts(): string[] {
    return ['root', 'thumb', 'track', 'track-fill'];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * ♿ **ARIA:** The `aria-label` property of the slider.
   */
  @property({ reflect: true })
  label: string | undefined;

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
   * Whether the slider should be hidden.
   */
  @property({ reflect: true, type: Boolean })
  override hidden = false;

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
   * ♿ **ARIA:** Alternative value for minimum value (defaults to `min`). This can
   * be used when expressing slider as a percentage (0-100), and wishing to detail more
   * information for better accessibility.
   */
  valueMin: string | undefined;

  /**
   * ♿ **ARIA:** Alternative value for current value (defaults to `value`). This can
   * be used when expressing slider as a percentage (0-100), and wishing to detail more
   * information for better accessibility.
   */
  @property({ attribute: 'value-now' })
  valueNow: string | undefined;

  /**
   * ♿ **ARIA:** Alternative value for maximum value (defaults to `max`). This can
   * be used when expressing slider as a percentage (0-100), and wishing to detail more
   * information for better accessibility.
   */
  @property({ attribute: 'value-max' })
  valueMax: string | undefined;

  /**
   * ♿ **ARIA:** Human-readable text alternative for the current value. Defaults to
   * `value:max` ratio as a percentage.
   */
  @property({ attribute: 'value-text' })
  valueText: string | undefined;

  /**
   * ♿ **ARIA:** Indicates the orientation of the slider.
   */
  @property({ reflect: true })
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * A number that specifies the granularity that the slider value must adhere to.
   */
  @property({ type: Number, reflect: true })
  step = 1;

  /**
   * ♿ **ARIA:** A number that specifies the number of steps taken when interacting with
   * the slider via keyboard.
   */
  @property({ attribute: 'keyboard-step', type: Number })
  keyboardStep = 1;

  /**
   * ♿ **ARIA:** A number that will be used to multiply the `keyboardStep` when the `Shift` key
   * is held down and the slider value is changed by pressing `LeftArrow` or `RightArrow`. Think
   * of it as `keyboardStep * shiftKeyMultiplier`.
   */
  @property({ attribute: 'shift-key-multiplier', type: Number })
  shiftKeyMultiplier = 5;

  @state()
  protected _isDragging = false;

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

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override update(changedProperties: PropertyValues) {
    if (changedProperties.has('value')) {
      this._updateValue(this.value);
    }

    if (changedProperties.has('disabled') && this.disabled) {
      this._isDragging = false;
      this.removeAttribute('dragging');
    }

    super.update(changedProperties);
  }

  override disconnectedCallback() {
    this._handlePointerMove.cancel();
    super.disconnectedCallback();
  }

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
          '--vds-slider-fill-percent': `${this.fillPercent}%`
        })}
        ${on('pointerdown', this._handleSliderPointerMove)}
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
        role="slider"
        tabindex="0"
        aria-label=${ifNonEmpty(this.label)}
        aria-valuemin=${this._getValueMin()}
        aria-valuenow=${this._getValueNow()}
        aria-valuemax=${this._getValueMax()}
        aria-valuetext=${this._getValueText()}
        aria-orientation=${this.orientation}
        aria-disabled=${this.disabled}
        aria-hidden=${this.hidden}
        autocomplete="off"
        part="thumb-container"
        ${on('keydown', this._handleThumbContainerKeydown)}
        ${on('pointerdown', this._handleThumbContainerPointerDown)}
        ${ref(this._thumbContainerRef)}
      >
        ${this._renderThumb()} ${this._renderThumbContainerSlot()}
      </div>
    `;
  }

  protected _getValueMin(): string {
    return this.valueMin ?? String(this.min);
  }

  protected _getValueNow(): string {
    return this.valueNow ?? String(this.value);
  }

  protected _getValueMax(): string {
    return this.valueMax ?? String(this.max);
  }

  protected _getValueText(): string {
    return this.valueText ?? this._getValueTextFallback();
  }

  protected _getValueTextFallback(): string {
    return `${round((this.value / this.max) * 100, 2)}%`;
  }

  protected _renderThumbContainerSlot(): TemplateResult {
    return html`<slot name="thumb-container"></slot> `;
  }

  protected _handleThumbContainerKeydown(event: KeyboardEvent) {
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

    this._updateValue(value);
    this._dispatchValueChange(event);
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
    this._updateValueBasedOnThumbPosition(event);
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
    this._updateValueBasedOnThumbPosition(event);
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

  @eventListener('pointerup', { target: document })
  protected _handleDocumentPointerUp(event: PointerEvent) {
    if (this.disabled || !this._isDragging) return;
    this._stopDragging(event);
  }

  @eventListener('pointermove', { target: document })
  protected _handleDocumentPointerMove(event: PointerEvent) {
    if (this.disabled || !this._isDragging) {
      this._handlePointerMove.cancel();
      return;
    }

    this._handlePointerMove(event);
  }

  protected readonly _handlePointerMove = rafThrottle((event: PointerEvent) => {
    if (this.disabled || !this._isDragging) return;
    this._updateValueBasedOnThumbPosition(event);
    this._dispatchValueChange(event);
  });

  protected _updateValue(value: number) {
    this.value = clampNumber(
      this.min,
      round(value, getNumberOfDecimalPlaces(this.step)),
      this.max
    );
  }

  protected _updateValueByRate(rate: number) {
    const boundRate = clampNumber(0, rate, 1);
    const range = this.max - this.min;
    const fill = range * boundRate;
    const stepRatio = Math.round(fill / this.step);
    const steps = this.step * stepRatio;
    const value = this.min + steps;
    this._updateValue(value);
  }

  protected _updateValueBasedOnThumbPosition(event: PointerEvent) {
    const thumbClientX = event.clientX;

    const { left: trackLeft, width: trackWidth } =
      this.trackElement!.getBoundingClientRect();

    const thumbPositionRate = (thumbClientX - trackLeft) / trackWidth;

    // Calling this will update `this.value`.
    this._updateValueByRate(thumbPositionRate);
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
}
