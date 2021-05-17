import {
  CSSResultArray,
  html,
  internalProperty,
  LitElement,
  property,
  PropertyValues,
  query,
  TemplateResult,
} from 'lit-element';
import { StyleInfo, styleMap } from 'lit-html/directives/style-map';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { eventListener } from '../../../shared/events';
import { WithFocus } from '../../../shared/mixins/WithFocus';
import { setAttribute } from '../../../utils/dom';
import { throttle, ThrottledFunction } from '../../../utils/timing';
import { sliderElementStyles } from './slider.css';
import {
  VdsSliderDragEndEvent,
  VdsSliderDragStartEvent,
  VdsSliderValueChangeEvent,
} from './slider.events';
import { SliderElementProps, SliderKeyDirection } from './slider.types';

/**
 * A custom built `input[type="range"]` that is cross-browser friendly, ARIA friendly, mouse/touch
 * friendly and easily styleable. This component allows users to input numeric values between a
 * minimum and maxmimum value. Generally used in the player for volume or scrubber controls.
 *
 * @inspriation https://github.com/carbon-design-system/carbon-web-components
 *
 * @tagname vds-slider
 *
 * @slot Used to pass in additional content inside the slider.
 * @slot thumb-container - Used to pass content into the thumb container.
 * @slot thumb - Used to pass content inside the thumb.
 * @slot track - Used to pass content inside the track.
 * @slot track-fill - Used to pass content inside the track fill.
 *
 * @csspart root - The component's root element, in this case the slider container (`<div>`).
 * @csspart thumb-container - The container for the slider's handle.
 * @csspart thumb - The slider's handle the user drags left/right (`<div>`).
 * @csspart track - The background of the slider in which the thumb slides along (`<div>`).
 * @csspart track-fill - The part of the track that is currently filled which fills left-to-right (`<div>`).
 *
 * @cssprop --vds-slider-fill-rate - The ratio of the slider that is filled such as `0.3`.
 * @cssprop --vds-slider-fill-value - The current amount the slider is filled such as `30`.
 * @cssprop --vds-slider-fill-percentage - The fill rate expressed as a precetange such as `30%`.
 *
 * @cssprop --vds-slider-thumb-width - The slider handle width.
 * @cssprop --vds-slider-thumb-height - The slider handle height.
 * @cssprop --vds-slider-thumb-bg - The background color of the slider handle.
 * @cssprop --vds-slider-thumb-border-radius - The border radius of the slider handle.
 * @cssprop --vds-slider-thumb-scale - The base scale of thumb when it is inactive, it'll scale to 1 when active.
 * @cssprop --vds-slider-thumb-transition - The CSS transitions to use for the thumb, defaults to `transform 100ms ease-out 0s`.
 *
 * @cssprop --vds-slider-track-height - The height of the slider track.
 * @cssprop --vds-slider-track-bg - The background color of the slider track.
 *
 * @cssprop --vds-slider-track-fill-bg - The background color of the slider track fill.
 *
 * @cssprop --vds-slider-active-color - The slider thumb and track fill background color when focused, active or being dragged.
 * @cssprop --vds-slider-disabled-color - The slider thumb, track, and track fill background color when disabled.
 *
 * @example
 * ```html
 * <vds-slider
 *   min="0"
 *   max="100"
 *   value="50"
 *   throttle="10"
 * ></vds-slider>
 * ```
 *
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
export class SliderElement
  extends WithFocus(LitElement)
  implements SliderElementProps {
  @query('#root') rootEl!: HTMLDivElement;
  @query('#thumb') thumbEl!: HTMLDivElement;
  @query('#thumb-container') thumbContainerEl!: HTMLDivElement;
  @query('#track') trackEl!: HTMLDivElement;
  @query('#track-fill') trackFillEl!: HTMLDivElement;

  static get styles(): CSSResultArray {
    return [sliderElementStyles];
  }

  static get parts(): string[] {
    return ['root', 'thumb', 'track', 'track-fill'];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.initPointerMoveThrottle();
  }

  update(changedProperties: PropertyValues): void {
    setAttribute(this, 'dragging', this.isDragging ? '' : undefined);

    if (changedProperties.has('value')) {
      // Bound value between min/max.
      this.value = Math.min(this.max, Math.max(this.min, this.value));
    }

    if (changedProperties.has('disabled') && this.disabled) {
      this._isDragging = false;
    }

    if (changedProperties.has('throttle')) {
      this.initPointerMoveThrottle();
    }

    super.update(changedProperties);
  }

  async firstUpdated(changedProperties: PropertyValues): Promise<void> {
    super.firstUpdated(changedProperties);
    await this.requestUpdate();
  }

  disconnectedCallback(): void {
    this.destroyPointerMoveThrottle();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  @property() label?: string;

  @property({ type: Number, reflect: true }) step = 1;

  @property({ type: Number, reflect: true, attribute: 'step-multiplier' })
  stepMultiplier = 10;

  @property({ type: Number, reflect: true }) min = 0;

  @property({ type: Number, reflect: true }) max = 100;

  @property({ type: Boolean, reflect: true }) hidden = false;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: Number, reflect: true }) value = 50;

  @property({ attribute: 'value-text' }) valueText?: string;

  @property() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @property({ type: Number }) throttle = 10;

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  @internalProperty()
  protected _isDragging = false;

  get isOrientationHorizontal(): boolean {
    return this.orientation === 'horizontal';
  }

  get isOrientationVertical(): boolean {
    return this.orientation === 'vertical';
  }

  get isDragging(): boolean {
    return this._isDragging;
  }

  get fillRate(): number {
    const boundValue = Math.min(this.max, Math.max(this.min, this.value));
    const range = this.max - this.min;
    return boundValue / range;
  }

  get fillPercent(): number {
    return this.fillRate * 100;
  }

  get rootElement(): HTMLDivElement {
    return this.rootEl;
  }

  get thumbContainerElement(): HTMLDivElement {
    return this.thumbContainerEl;
  }

  get thumbElement(): HTMLDivElement {
    return this.thumbEl;
  }

  get trackElement(): HTMLDivElement {
    return this.trackEl;
  }

  get trackFillElement(): HTMLDivElement {
    return this.trackFillEl;
  }

  // -------------------------------------------------------------------------------------------
  // Render (Root)
  // -------------------------------------------------------------------------------------------

  render(): TemplateResult {
    return this.renderSlider();
  }

  // -------------------------------------------------------------------------------------------
  // Render (Slider)
  // -------------------------------------------------------------------------------------------

  protected renderSlider(): TemplateResult {
    return html`
      <div
        id="root"
        role="presentation"
        class="${this.getSliderClassAttr()}"
        part="${this.getSliderPartAttr()}"
        style="${styleMap(this.getSliderStyleMap())}"
        @pointerdown="${this.handleSliderPointerMove}"
      >
        ${this.renderThumbContainer()}${this.renderTrack()}${this.renderTrackFill()}${this.renderInput()}
        <slot></slot>
      </div>
    `;
  }

  protected getSliderClassAttr(): string {
    return '';
  }

  protected getSliderPartAttr(): string {
    return 'root';
  }

  protected getSliderStyleMap(): StyleInfo {
    return {
      '--vds-slider-fill-value': String(this.value),
      '--vds-slider-fill-rate': String(this.fillRate),
      '--vds-slider-fill-percent': `${this.fillPercent}%`,
    };
  }

  protected handleSliderPointerMove(event: PointerEvent): void {
    if (this.disabled) return;
    this.startDragging(event);
    this.handlePointerMove(event);
  }

  // -------------------------------------------------------------------------------------------
  // Render (Thumb Container)
  // -------------------------------------------------------------------------------------------

  protected renderThumbContainer(): TemplateResult {
    return html`
      <div
        id="thumb-container"
        role="slider"
        tabindex="0"
        aria-label="${ifNonEmpty(this.label)}"
        aria-valuemax="${this.max}"
        aria-valuemin="${this.min}"
        aria-valuenow="${this.value}"
        aria-valuetext="${this.valueText ?? this.getValueAsTextFallback()}"
        aria-orientation="${this.orientation}"
        aria-disabled="${this.disabled}"
        aria-hidden="${this.hidden}"
        autocomplete="off"
        part="${this.getThumbContainerPartAttr()}"
        @keydown="${this.handleThumbContainerKeydown}"
        @pointerdown="${this.handleThumbContainerPointerDown}"
      >
        ${this.renderThumb()} ${this.renderThumbContainerSlot()}
      </div>
    `;
  }

  protected getValueAsTextFallback(): string {
    return `${(this.value / this.max) * 100}%`;
  }

  protected getThumbContainerPartAttr(): string {
    return 'thumb-container';
  }

  protected renderThumbContainerSlot(): TemplateResult {
    return html`<slot name="thumb-container"></slot> `;
  }

  protected handleThumbContainerKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;

    const { key, shiftKey } = event;
    const isValidKey = Object.keys(SliderKeyDirection).includes(key);

    if (!isValidKey) return;

    const modified = !shiftKey ? this.step : this.step * this.stepMultiplier;
    const direction =
      SliderKeyDirection[key as keyof typeof SliderKeyDirection];
    const diff = modified * direction;
    const stepCount = (this.value + diff) / this.step;

    // Snaps to next step.
    this.value = Math.min(
      this.max,
      Math.max(
        this.min,
        (diff >= 0 ? Math.floor(stepCount) : Math.ceil(stepCount)) * this.step,
      ),
    );

    this.dispatchEvent(
      new VdsSliderValueChangeEvent({
        detail: this.value,
        originalEvent: event,
      }),
    );
  }

  protected handleThumbContainerPointerDown(event: PointerEvent): void {
    if (this.disabled) return;
    this.startDragging(event);
  }

  // -------------------------------------------------------------------------------------------
  // Render (Thumb)
  // -------------------------------------------------------------------------------------------

  protected renderThumb(): TemplateResult {
    return html`
      <div id="thumb" part="${this.getThumbPartAttr()}">
        ${this.renderThumbSlot()}
      </div>
    `;
  }

  protected getThumbPartAttr(): string {
    return 'thumb';
  }

  protected renderThumbSlot(): TemplateResult {
    return html`<slot name="thumb"></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Render (Track)
  // -------------------------------------------------------------------------------------------

  protected renderTrack(): TemplateResult {
    return html`
      <div id="track" part="${this.getTrackPartAttr()}">
        ${this.renderTrackSlot()}
      </div>
    `;
  }

  protected renderTrackSlot(): TemplateResult {
    return html`<slot name="track"></slot>`;
  }

  protected getTrackPartAttr(): string {
    return 'track';
  }

  // -------------------------------------------------------------------------------------------
  // Render (Track Fill)
  // -------------------------------------------------------------------------------------------

  protected renderTrackFill(): TemplateResult {
    return html`
      <div id="track-fill" part="${this.getTrackFillPartAttr()}">
        ${this.renderTrackFillSlot()}
      </div>
    `;
  }

  protected renderTrackFillSlot(): TemplateResult {
    return html`<slot name="track-fill"></slot>`;
  }
  protected getTrackFillPartAttr(): string {
    return 'track-fill';
  }

  // -------------------------------------------------------------------------------------------
  // Render (Input)
  // -------------------------------------------------------------------------------------------

  /**
   * Why? Used to emit native `input` events.
   */
  protected renderInput(): TemplateResult {
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

  protected startDragging(originalEvent: PointerEvent): void {
    if (this._isDragging) return;
    this._isDragging = true;
    this.updateValueBasedOnThumbPosition(originalEvent, false);
    this.dispatchEvent(
      new VdsSliderDragStartEvent({
        originalEvent,
        detail: this.value,
      }),
    );
  }

  protected stopDragging(originalEvent: PointerEvent): void {
    if (!this._isDragging) return;
    this._isDragging = false;
    this.updateValueBasedOnThumbPosition(originalEvent, false);
    this.dispatchEvent(
      new VdsSliderDragEndEvent({
        originalEvent,
        detail: this.value,
      }),
    );
  }

  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------

  protected pointerMoveThrottle?: ThrottledFunction<
    Parameters<SliderElement['handlePointerMove']>
  >;

  protected initPointerMoveThrottle(): void {
    this.pointerMoveThrottle?.cancel();
    this.pointerMoveThrottle = throttle(this.handlePointerMove, this.throttle);
  }

  protected destroyPointerMoveThrottle(): void {
    this.pointerMoveThrottle?.cancel();
    this.pointerMoveThrottle = undefined;
  }

  @eventListener('pointerup', { target: 'document' })
  protected handleDocumentPointerUp(event: PointerEvent): void {
    if (this.disabled || !this._isDragging) return;
    this.stopDragging(event);
  }

  @eventListener('pointermove', { target: 'document' })
  protected handleDocumentPointerMove(event: PointerEvent): void {
    if (this.disabled || !this._isDragging) {
      this.pointerMoveThrottle?.cancel();
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.pointerMoveThrottle!(event);
  }

  protected handlePointerMove(event: PointerEvent): void {
    if (this.disabled || !this._isDragging) return;
    this.updateValueBasedOnThumbPosition(event);
  }

  protected updateValueByRate(rate: number): void {
    const boundRate = Math.min(1, Math.max(0, rate));
    const range = this.max - this.min;
    const fill = range * boundRate;
    const fillToStepRatio = Math.round(fill / this.step);
    this.value = this.min + fillToStepRatio * this.step;
  }

  protected updateValueBasedOnThumbPosition(
    originalEvent: PointerEvent,
    shouldFireValueChange = true,
  ): void {
    const thumbPosition = originalEvent.clientX;

    const {
      left: trackLeft,
      width: trackWidth,
    } = this.trackEl.getBoundingClientRect();

    // Calling this will update `this.value`.
    this.updateValueByRate((thumbPosition - trackLeft) / trackWidth);

    if (shouldFireValueChange) {
      this.dispatchEvent(
        new VdsSliderValueChangeEvent({
          detail: this.value,
          originalEvent,
        }),
      );
    }
  }
}
