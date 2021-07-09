import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

import { ifNonEmpty, on } from '../../../foundation/directives/index.js';
import { VdsElement, WithFocus } from '../../../foundation/elements/index.js';
import { EventListenerController } from '../../../foundation/events/index.js';
import {
  storybookAction,
  StorybookControlType
} from '../../../foundation/storybook/index.js';
import {
  clampNumber,
  getNumberOfDecimalPlaces,
  round
} from '../../../utils/number.js';
import { throttle } from '../../../utils/timing.js';
import {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderValueChangeEvent
} from './events.js';
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
 * @csspart track - The background of the slider in which the thumb slides along (`<div>`).
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
 *   throttle="10"
 * ></vds-slider>
 * ```
 * @example
 * ```css
 * vds-slider {
 *   --vds-slider-active-color: pink;
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
export class SliderElement extends WithFocus(VdsElement) {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [sliderElementStyles];
  }

  /** @type {string[]} */
  static get parts() {
    return ['root', 'thumb', 'track', 'track-fill'];
  }

  /** @type {string[]} */
  static get events() {
    return [
      SliderDragEndEvent.TYPE,
      SliderDragStartEvent.TYPE,
      SliderValueChangeEvent.TYPE
    ];
  }

  constructor() {
    super();

    // Properties
    /**
     * ♿ **ARIA:** The `aria-label` property of the slider.
     *
     * @type {string | undefined}
     */
    this.label = undefined;

    /**
     * The lowest slider value in the range of permitted values.
     *
     * @type {number}
     */
    this.min = 0;

    /**
     * The greatest slider value in the range of permitted values.
     *
     * @type {number}
     */
    this.max = 100;

    /**
     * Whether the slider should be hidden.
     *
     * @type {boolean}
     */
    this.hidden = false;

    /**
     * Whether the slider should be disabled (not-interactable).
     *
     * @type {boolean}
     */
    this.disabled = false;

    /**
     * The current slider value.
     *
     * @type {number}
     */
    this.value = 50;

    /**
     * ♿ **ARIA:** Human-readable text alternative for the current value. Defaults to
     * `value:max` ratio as a percentage.
     *
     * @type {string | undefined}
     */
    this.valueText = undefined;

    /**
     * ♿ **ARIA:** Indicates the orientation of the slider.
     *
     * @type {'horizontal' | 'vertical'}
     */
    this.orientation = 'horizontal';

    /**
     * A number that specifies the granularity that the slider value must adhere to.
     *
     * @type {number}
     */
    this.step = 1;

    /**
     * ♿ **ARIA:** A number that specifies the number of steps taken when interacting with
     * the slider via keyboard.
     *
     * @type {number}
     */
    this.keyboardStep = 1;

    /**
     * ♿ **ARIA:** A number that will be used to multiply the `keyboardStep` when the `Shift` key
     * is held down and the slider value is changed by pressing `LeftArrow` or `RightArrow`.
     *
     * @type {number}
     */
    this.shiftKeyMultiplier = 5;

    /**
     * The amount of milliseconds to throttle the slider thumb during `mousemove` / `touchmove`
     * events.
     *
     * @type {number}
     */
    this.throttle = 10;

    // State
    /**
     * @protected
     * @type {boolean}
     */
    this._isDragging = false;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /** @type {import('lit').PropertyDeclarations} */
  static get properties() {
    return {
      label: { reflect: true },
      step: { type: Number, reflect: true },
      keyboardStep: { type: Number, attribute: 'keyboard-step' },
      shiftKeyMultiplier: {
        type: Number,
        attribute: 'shift-key-multiplier'
      },
      min: { type: Number, reflect: true },
      max: { type: Number, reflect: true },
      hidden: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      value: { type: Number, reflect: true },
      valueText: { attribute: 'value-text' },
      orientation: {},
      thottle: { type: Number },
      _isDragging: { state: true }
    };
  }

  /**
   * Whether the current orientation is horizontal.
   *
   * @type {boolean}
   * @default true
   */
  get isOrientationHorizontal() {
    return this.orientation === 'horizontal';
  }

  /**
   * Whether the current orientation is vertical.
   *
   * @type {boolean}
   * @default false
   */
  get isOrientationVertical() {
    return this.orientation === 'vertical';
  }

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

  connectedCallback() {
    super.connectedCallback();
    this.initPointerMoveThrottle();
  }

  update(changedProperties) {
    if (changedProperties.has('value')) {
      this.updateValue(this.value);
    }

    if (changedProperties.has('disabled') && this.disabled) {
      this._isDragging = false;
      this.removeAttribute('dragging');
    }

    if (changedProperties.has('throttle')) {
      this.initPointerMoveThrottle();
    }

    super.update(changedProperties);
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.destroyPointerMoveThrottle();
  }

  // -------------------------------------------------------------------------------------------
  // Render (Root/Slider)
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  rootRef = createRef();

  /**
   * The component's root element.
   *
   * @type {HTMLDivElement}
   */
  get rootElement() {
    return /** @type {HTMLDivElement} */ (this.rootRef.value);
  }

  render() {
    return this.renderSlider();
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderSlider() {
    return html`
      <div
        id="root"
        role="presentation"
        class=${this.getSliderClassAttr()}
        part=${this.getSliderPartAttr()}
        style=${styleMap(this.getSliderStyleMap())}
        ${on('pointerdown', this.handleSliderPointerMove)}
        ${ref(this.rootRef)}
      >
        ${this.renderThumbContainer()}${this.renderTrack()}${this.renderTrackFill()}${this.renderInput()}
        <slot></slot>
      </div>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getSliderClassAttr() {
    return '';
  }

  /**
   * @protected
   * @returns {string}
   */
  getSliderPartAttr() {
    return 'root';
  }

  /**
   * @protected
   * @returns {import('lit/directives/style-map').StyleInfo}
   */
  getSliderStyleMap() {
    return {
      '--vds-slider-fill-value': String(this.value),
      '--vds-slider-fill-rate': String(this.fillRate),
      '--vds-slider-fill-percent': `${this.fillPercent}%`
    };
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  handleSliderPointerMove(event) {
    if (this.disabled) return;
    this.startDragging(event);
    this.handlePointerMove(event);
  }

  // -------------------------------------------------------------------------------------------
  // Render (Thumb Container)
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  thumbContainerRef = createRef();

  /**
   * The thumb container element.
   *
   * @type {HTMLDivElement}
   */
  get thumbContainerElement() {
    return /** @type {HTMLDivElement} */ (this.thumbContainerRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderThumbContainer() {
    return html`
      <div
        id="thumb-container"
        role="slider"
        tabindex="0"
        aria-label=${ifNonEmpty(this.label)}
        aria-valuemax=${this.max}
        aria-valuemin=${this.min}
        aria-valuenow=${this.value}
        aria-valuetext=${this.valueText ?? this.getValueAsTextFallback()}
        aria-orientation=${this.orientation}
        aria-disabled=${this.disabled}
        aria-hidden=${this.hidden}
        autocomplete="off"
        part=${this.getThumbContainerPartAttr()}
        ${on('keydown', this.handleThumbContainerKeydown)}
        ${on('pointerdown', this.handleThumbContainerPointerDown)}
        ${ref(this.thumbContainerRef)}
      >
        ${this.renderThumb()} ${this.renderThumbContainerSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getValueAsTextFallback() {
    return `${round((this.value / this.max) * 100, 2)}%`;
  }

  /**
   * @protected
   * @returns {string}
   */
  getThumbContainerPartAttr() {
    return 'thumb-container';
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderThumbContainerSlot() {
    return html`<slot name="thumb-container"></slot> `;
  }

  /**
   * @protected
   * @param {KeyboardEvent} event
   */
  handleThumbContainerKeydown(event) {
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

    this.updateValue(value);
    this.dispatchValueChange(event);
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  handleThumbContainerPointerDown(event) {
    if (this.disabled) return;
    this.startDragging(event);
  }

  // -------------------------------------------------------------------------------------------
  // Render (Thumb)
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  thumbRef = createRef();

  /**
   * The thumb element.
   *
   * @type {HTMLDivElement}
   */
  get thumbElement() {
    return /** @type {HTMLDivElement} */ (this.thumbRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderThumb() {
    return html`
      <div id="thumb" part=${this.getThumbPartAttr()} ${ref(this.thumbRef)}>
        ${this.renderThumbSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getThumbPartAttr() {
    return 'thumb';
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderThumbSlot() {
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
  trackRef = createRef();

  /**
   * The track element.
   *
   * @type {HTMLDivElement}
   */
  get trackElement() {
    return /** @type {HTMLDivElement} */ (this.trackRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderTrack() {
    return html`
      <div id="track" part=${this.getTrackPartAttr()} ${ref(this.trackRef)}>
        ${this.renderTrackSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderTrackSlot() {
    return html`<slot name="track"></slot>`;
  }

  /**
   * @protected
   * @returns {string}
   */
  getTrackPartAttr() {
    return 'track';
  }

  // -------------------------------------------------------------------------------------------
  // Render (Track Fill)
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  trackFillRef = createRef();

  /**
   * The track fill element.
   *
   * @type {HTMLDivElement}
   */
  get trackFillElement() {
    return /** @type {HTMLDivElement} */ (this.trackFillRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderTrackFill() {
    return html`
      <div
        id="track-fill"
        part=${this.getTrackFillPartAttr()}
        ${ref(this.trackFillRef)}
      >
        ${this.renderTrackFillSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderTrackFillSlot() {
    return html`<slot name="track-fill"></slot>`;
  }

  /**
   * @protected
   * @returns {string}
   */
  getTrackFillPartAttr() {
    return 'track-fill';
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
  renderInput() {
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
  startDragging(event) {
    if (this._isDragging) return;
    this._isDragging = true;
    this.setAttribute('dragging', '');
    this.updateValueBasedOnThumbPosition(event);
    this.dispatchEvent(
      new SliderDragStartEvent({
        originalEvent: event,
        detail: this.value
      })
    );
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  stopDragging(event) {
    if (!this._isDragging) return;
    this._isDragging = false;
    this.removeAttribute('dragging');
    this.updateValueBasedOnThumbPosition(event);
    this.dispatchEvent(
      new SliderDragEndEvent({
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
   * @type {import('../../../utils/timing').ThrottledFunction<Parameters<SliderElement['handlePointerMove']>> | undefined}
   */
  pointerMoveThrottle;

  /**
   * @protected
   * @readonly
   */
  documentEventListeners = new EventListenerController(
    this,
    {
      pointerup: this.handleDocumentPointerUp,
      pointermove: this.handleDocumentPointerMove
    },
    {
      target: document,
      receiver: this
    }
  );

  /**
   * @protected
   */
  initPointerMoveThrottle() {
    this.pointerMoveThrottle?.cancel();
    this.pointerMoveThrottle = throttle(this.handlePointerMove, this.throttle);
  }

  /**
   * @protected
   */
  destroyPointerMoveThrottle() {
    this.pointerMoveThrottle?.cancel();
    this.pointerMoveThrottle = undefined;
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  handleDocumentPointerUp(event) {
    if (this.disabled || !this._isDragging) return;
    this.stopDragging(event);
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  handleDocumentPointerMove(event) {
    if (this.disabled || !this._isDragging) {
      this.pointerMoveThrottle?.cancel();
      return;
    }

    this.pointerMoveThrottle?.(event);
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  handlePointerMove(event) {
    if (this.disabled || !this._isDragging) return;
    this.updateValueBasedOnThumbPosition(event);
    this.dispatchValueChange(event);
  }

  /**
   * @protected
   * @param {number} value
   */
  updateValue(value) {
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
  updateValueByRate(rate) {
    const boundRate = clampNumber(0, rate, 1);
    const range = this.max - this.min;
    const fill = range * boundRate;
    const stepRatio = Math.round(fill / this.step);
    const steps = this.step * stepRatio;
    const value = this.min + steps;
    this.updateValue(value);
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  updateValueBasedOnThumbPosition(event) {
    const thumbPosition = event.clientX;

    const { left: trackLeft, width: trackWidth } =
      this.trackElement.getBoundingClientRect();

    const thumbPositionRate = (thumbPosition - trackLeft) / trackWidth;

    // Calling this will update `this.value`.
    this.updateValueByRate(thumbPositionRate);
  }

  /**
   * @protected
   * @type {number}
   */
  lastDispatchedValue = this.value;

  /**
   * @protected
   * @param {Event | undefined} [event]
   */
  dispatchValueChange(event) {
    if (this.value === this.lastDispatchedValue) return;

    this.dispatchEvent(
      new SliderValueChangeEvent({
        detail: this.value,
        originalEvent: event
      })
    );

    this.lastDispatchedValue = this.value;
  }
}

export const SLIDER_ELEMENT_STORYBOOK_ARG_TYPES = {
  disabled: { control: StorybookControlType.Boolean, defaultValue: false },
  hidden: { control: StorybookControlType.Boolean, defaultValue: false },
  label: { control: StorybookControlType.Text },
  max: { control: StorybookControlType.Number, defaultValue: 100 },
  min: { control: StorybookControlType.Number, defaultValue: 0 },
  orientation: {
    control: StorybookControlType.Select,
    options: ['horizontal', 'vertical'],
    defaultValue: 'horizontal'
  },
  step: {
    control: StorybookControlType.Number,
    defaultValue: 1
  },
  keyboardStep: {
    control: StorybookControlType.Number,
    defaultValue: 1
  },
  shiftKeyMultiplier: {
    control: StorybookControlType.Number,
    defaultValue: 5
  },
  throttle: { control: StorybookControlType.Number, defaultValue: 10 },
  value: { control: StorybookControlType.Number, defaultValue: 50 },
  valueText: { control: StorybookControlType.Text },
  onSliderDragStart: storybookAction(SliderDragStartEvent.TYPE),
  onSliderDragEnd: storybookAction(SliderDragEndEvent.TYPE),
  onSliderValueChange: storybookAction(SliderValueChangeEvent.TYPE)
};
