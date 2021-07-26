import { ifNonEmpty, on } from '@base/directives/index.js';
import { WithFocus } from '@base/elements/index.js';
import { eventListener, vdsEvent } from '@base/events/index.js';
import { clampNumber, getNumberOfDecimalPlaces, round } from '@utils/number.js';
import { rafThrottle } from '@utils/timing.js';
import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

import { sliderElementStyles } from './styles.js';

export const SLIDER_ELEMENT_TAG_NAME = 'vds-slider';

/**
 * The direction to move the thumb, associated with key symbols.
 *
 * @readonly
 * @enum {number}
 */
export const SliderKeyDirection = {
  Left: -1,
  ArrowLeft: -1,
  Up: -1,
  ArrowUp: -1,
  Right: 1,
  ArrowRight: 1,
  Down: 1,
  ArrowDown: 1
};

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
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [sliderElementStyles];
  }

  /** @type {string[]} */
  static get parts() {
    return ['root', 'thumb', 'track', 'track-fill'];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * ♿ **ARIA:** The `aria-label` property of the slider.
   *
   * @type {string | undefined}
   */
  @property({ reflect: true })
  label;

  /**
   * The lowest slider value in the range of permitted values.
   *
   * @type {number}
   */
  @property({ reflect: true, type: Number })
  min = 0;

  /**
   * The greatest slider value in the range of permitted values.
   *
   * @type {number}
   */
  @property({ reflect: true, type: Number })
  max = 100;

  /**
   * Whether the slider should be hidden.
   *
   * @type {boolean}
   */
  @property({ reflect: true, type: Boolean })
  hidden = false;

  /**
   * Whether the slider should be disabled (not-interactable).
   *
   * @type {boolean}
   */
  @property({ reflect: true, type: Boolean })
  disabled = false;

  /**
   * The current slider value.
   *
   * @type {number}
   */
  @property({ reflect: true, type: Number })
  value = 50;

  /**
   * ♿ **ARIA:** Alternative value for minimum value (defaults to `min`). This can
   * be used when expressing slider as a percentage (0-100), and wishing to detail more
   * information for better accessibility.
   *
   * @type {string | undefined}
   */
  valueMin;

  /**
   * ♿ **ARIA:** Alternative value for current value (defaults to `value`). This can
   * be used when expressing slider as a percentage (0-100), and wishing to detail more
   * information for better accessibility.
   *
   * @type {string | undefined}
   */
  @property({ attribute: 'value-now' })
  valueNow;

  /**
   * ♿ **ARIA:** Alternative value for maximum value (defaults to `max`). This can
   * be used when expressing slider as a percentage (0-100), and wishing to detail more
   * information for better accessibility.
   *
   * @type {string | undefined}
   */
  @property({ attribute: 'value-max' })
  valueMax = undefined;

  /**
   * ♿ **ARIA:** Human-readable text alternative for the current value. Defaults to
   * `value:max` ratio as a percentage.
   *
   * @type {string | undefined}
   */
  @property({ attribute: 'value-text' })
  valueText = undefined;

  /**
   * ♿ **ARIA:** Indicates the orientation of the slider.
   *
   * @type {'horizontal' | 'vertical'}
   */
  @property({ reflect: true })
  orientation = 'horizontal';

  /**
   * A number that specifies the granularity that the slider value must adhere to.
   *
   * @type {number}
   */
  @property({ type: Number, reflect: true })
  step = 1;

  /**
   * ♿ **ARIA:** A number that specifies the number of steps taken when interacting with
   * the slider via keyboard.
   *
   * @type {number}
   */
  @property({ attribute: 'keyboard-step', type: Number })
  keyboardStep = 1;

  /**
   * ♿ **ARIA:** A number that will be used to multiply the `keyboardStep` when the `Shift` key
   * is held down and the slider value is changed by pressing `LeftArrow` or `RightArrow`. Think
   * of it as `keyboardStep * shiftKeyMultiplier`.
   *
   * @type {number}
   */
  @property({ attribute: 'shift-key-multiplier', type: Number })
  shiftKeyMultiplier = 5;

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  _isDragging = false;

  /**
   * Whether the slider thumb is currently being dragged.
   *
   * @type {boolean}
   * @default false
   */
  get isDragging() {
    return this._isDragging;
  }

  /**
   * The current value to range ratio.
   *
   * @type {number}
   * @default 0.5
   * @example
   * `min` = 0
   * `max` = 10
   * `value` = 5
   * `range` = 10 (max - min)
   * `fillRate` = 0.5 (result)
   */
  get fillRate() {
    const range = this.max - this.min;
    return this.value / range;
  }

  /**
   * The fill rate expressed as a percentage (`fillRate * 100`).
   *
   * @type {number}
   * @default 50
   */
  get fillPercent() {
    return this.fillRate * 100;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  update(changedProperties) {
    if (changedProperties.has('value')) {
      this._updateValue(this.value);
    }

    if (changedProperties.has('disabled') && this.disabled) {
      this._isDragging = false;
      this.removeAttribute('dragging');
    }

    super.update(changedProperties);
  }

  disconnectedCallback() {
    this._handlePointerMove.cancel();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Render (Root/Slider)
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  _rootRef = createRef();

  /**
   * The component's root element.
   *
   * @type {HTMLDivElement}
   */
  get rootElement() {
    return /** @type {HTMLDivElement} */ (this._rootRef.value);
  }

  render() {
    return this._renderSlider();
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderSlider() {
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

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderSliderChildren() {
    return html`${this._renderThumbContainer()}${this._renderTrack()}${this._renderTrackFill()}${this._renderInput()}${this._renderDefaultSlot()}`;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderDefaultSlot() {
    return html`<slot></slot>`;
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  _handleSliderPointerMove(event) {
    if (this.disabled) return;
    this._startDragging(event);
    this._handlePointerMove(event);
  }

  // -------------------------------------------------------------------------------------------
  // Render (Thumb Container)
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  _thumbContainerRef = createRef();

  /**
   * The thumb container element.
   *
   * @type {HTMLDivElement}
   */
  get thumbContainerElement() {
    return /** @type {HTMLDivElement} */ (this._thumbContainerRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderThumbContainer() {
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

  /**
   * @protected
   * @returns {string}
   */
  _getValueMin() {
    return this.valueMin ?? String(this.min);
  }

  /**
   * @protected
   * @returns {string}
   */
  _getValueNow() {
    return this.valueNow ?? String(this.value);
  }

  /**
   * @protected
   * @returns {string}
   */
  _getValueMax() {
    return this.valueMax ?? String(this.max);
  }

  /**
   * @protected
   * @returns {string}
   */
  _getValueText() {
    return this.valueText ?? this._getValueTextFallback();
  }

  /**
   * @protected
   * @returns {string}
   */
  _getValueTextFallback() {
    return `${round((this.value / this.max) * 100, 2)}%`;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderThumbContainerSlot() {
    return html`<slot name="thumb-container"></slot> `;
  }

  /**
   * @protected
   * @param {KeyboardEvent} event
   */
  _handleThumbContainerKeydown(event) {
    if (this.disabled) return;

    const { key, shiftKey } = event;
    const isValidKey = Object.keys(SliderKeyDirection).includes(key);

    if (!isValidKey) return;

    const modifiedStep = !shiftKey
      ? this.keyboardStep
      : this.keyboardStep * this.shiftKeyMultiplier;
    const direction = SliderKeyDirection[key];
    const diff = modifiedStep * direction;
    const steps = (this.value + diff) / this.step;
    const value = this.step * steps;

    this._updateValue(value);
    this._dispatchValueChange(event);
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  _handleThumbContainerPointerDown(event) {
    if (this.disabled) return;
    this._startDragging(event);
  }

  // -------------------------------------------------------------------------------------------
  // Render (Thumb)
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  _thumbRef = createRef();

  /**
   * The thumb element.
   *
   * @type {HTMLDivElement}
   */
  get thumbElement() {
    return /** @type {HTMLDivElement} */ (this._thumbRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderThumb() {
    return html`
      <div id="thumb" part="thumb" ${ref(this._thumbRef)}>
        ${this._renderThumbSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderThumbSlot() {
    return html`<slot name="thumb"></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Render (Track)
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  _trackRef = createRef();

  /**
   * The track element.
   *
   * @type {HTMLDivElement}
   */
  get trackElement() {
    return /** @type {HTMLDivElement} */ (this._trackRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderTrack() {
    return html`
      <div id="track" part="track" ${ref(this._trackRef)}>
        ${this._renderTrackSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderTrackSlot() {
    return html`<slot name="track"></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Render (Track Fill)
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  _trackFillRef = createRef();

  /**
   * The track fill element.
   *
   * @type {HTMLDivElement}
   */
  get trackFillElement() {
    return /** @type {HTMLDivElement} */ (this._trackFillRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderTrackFill() {
    return html`
      <div id="track-fill" part="track-fill" ${ref(this._trackFillRef)}>
        ${this._renderTrackFillSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderTrackFillSlot() {
    return html`<slot name="track-fill"></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Render (Input)
  // -------------------------------------------------------------------------------------------

  /**
   * Why? Used to emit native `input` events.
   *
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderInput() {
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

  /**
   * @protected
   * @param {PointerEvent} event
   */
  _startDragging(event) {
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

  /**
   * @protected
   * @param {PointerEvent} event
   */
  _stopDragging(event) {
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

  /**
   * @protected
   * @param {PointerEvent} event
   */
  @eventListener('pointerup', { target: document })
  _handleDocumentPointerUp(event) {
    if (this.disabled || !this._isDragging) return;
    this._stopDragging(event);
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  @eventListener('pointermove', { target: document })
  _handleDocumentPointerMove(event) {
    if (this.disabled || !this._isDragging) {
      this._handlePointerMove.cancel();
      return;
    }

    this._handlePointerMove(event);
  }

  /**
   * @protected
   * @readonly
   * @type {import('@utils/timing').RafThrottledFunction<(event: PointerEvent) => void>}
   */
  _handlePointerMove = rafThrottle((event) => {
    if (this.disabled || !this._isDragging) return;
    this._updateValueBasedOnThumbPosition(event);
    this._dispatchValueChange(event);
  });

  /**
   * @protected
   * @param {number} value
   */
  _updateValue(value) {
    this.value = clampNumber(
      this.min,
      round(value, getNumberOfDecimalPlaces(this.step)),
      this.max
    );
  }

  /**
   * @protected
   * @param {number} rate
   */
  _updateValueByRate(rate) {
    const boundRate = clampNumber(0, rate, 1);
    const range = this.max - this.min;
    const fill = range * boundRate;
    const stepRatio = Math.round(fill / this.step);
    const steps = this.step * stepRatio;
    const value = this.min + steps;
    this._updateValue(value);
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  _updateValueBasedOnThumbPosition(event) {
    const thumbClientX = event.clientX;

    const { left: trackLeft, width: trackWidth } =
      this.trackElement.getBoundingClientRect();

    const thumbPositionRate = (thumbClientX - trackLeft) / trackWidth;

    // Calling this will update `this.value`.
    this._updateValueByRate(thumbPositionRate);
  }

  /**
   * @protected
   * @type {number}
   */
  _lastDispatchedValue = this.value;

  /**
   * @protected
   * @readonly
   * @type {import('@utils/timing').RafThrottledFunction<(event: Event | undefined) => void>}
   */
  _dispatchValueChange = rafThrottle((event) => {
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
