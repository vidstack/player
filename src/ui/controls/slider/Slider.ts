import { listen } from '@wcom/events';
import clsx from 'clsx';
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
import { throttle } from 'lodash-es';

import { FocusMixin } from '../../../shared/directives/FocusMixin';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { CancelableCallback } from '../../../shared/types';
import { currentSafariVersion } from '../../../utils/support';
import { SliderProps } from './slider.args';
import { sliderStyles } from './slider.css';
import {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderValueChangeEvent,
} from './slider.events';
import { SliderKeyDirection } from './slider.types';

/**
 * A custom built `input[type="range"]` that is cross-browser friendly, ARIA friendly, mouse/touch
 * friendly and easily styleable. This component allows users to input numeric values between a
 * minimum and maxmimum value. Generally used in the player for volume or scrubber controls.
 *
 * @inspriation https://github.com/carbon-design-system/carbon-web-components
 *
 * ## Tag
 *
 * @tagname vds-slider
 *
 * ## Slots
 *
 * @slot Used to pass in additional content inside the slider.
 *
 * ## CSS Parts
 *
 * @csspart root - The component's root element, in this case the slider container (`<div>`).
 * @csspart root-dragging - The component's root element when the user is dragging the thumb.
 * @csspart root-orientation-vertical - The component's root element when the slider orientation is `vertical`.
 * @csspart thumb - The slider's handle the user drags left/right (`<div>`).
 * @csspart thumb-dragging - The slider's handle when the user is dragging.
 * @csspart track - The background of the slider in which the thumb slides along (`<div>`).
 * @csspart track-dragging - The slider's track when the user is dragging.
 * @csspart track-fill - The part of the track that is currently filled which fills left-to-right (`<div>`).
 * @csspart track-fill-dragging - The slider's track fill when the user is dragging.
 *
 * ## CSS Properties
 *
 * @cssprop --vds-slider-fill-rate - The ratio of the slider that is filled such as `0.3`.
 * @cssprop --vds-slider-fill-value - The current amount the slider is filled such as `30`.
 * @cssprop --vds-slider-fill-percentage - The fill rate expressed as a precetange such as `30%`.
 *
 * @cssprop --vds-slider-thumb-width - The slider handle width.
 * @cssprop --vds-slider-thumb-height - The slider handle height.
 * @cssprop --vds-slider-thumb-bg - The background color of the slider handle.
 * @cssprop --vds-slider-thumb-border-radius - The border radius of the slider handle.
 *
 * @cssprop --vds-slider-track-height - The height of the slider track.
 * @cssprop --vds-slider-track-bg - The background color of the slider track.
 *
 * @cssprop --vds-slider-track-fill-bg - The background color of the slider track fill.
 *
 * @cssprop --vds-slider-active-color - The slider thumb and track fill background color when focused, active or being dragged.
 * @cssprop --vds-slider-disabled-color - The slider thumb, track, and track fill background color when disabled.
 *
 * ## Examples
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
export class Slider extends FocusMixin(LitElement) implements SliderProps {
  @query('#root') rootEl!: HTMLDivElement;
  @query('#thumb') thumbEl!: HTMLDivElement;
  @query('#track') trackEl!: HTMLDivElement;
  @query('#track-fill') trackFillEl!: HTMLDivElement;

  static get styles(): CSSResultArray {
    return [sliderStyles];
  }

  static get parts(): string[] {
    return [
      'root',
      'root-dragging',
      'root-orientation-vertical',
      'thumb',
      'thumb-dragging',
      'track',
      'track-dragging',
      'track-fill',
      'track-fill-dragging',
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.initPointerMoveThrottle();
  }

  update(changedProperties: PropertyValues): void {
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

  @property({ type: Number }) value = 50;

  @property({ attribute: 'value-text' }) valueText?: string;

  @property() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @property({ type: Number }) throttle = 10;

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  @internalProperty()
  protected _isDragging = false;

  /**
   * Whether the current orientation is horizontal.
   */
  get isOrientationHorizontal(): boolean {
    return this.orientation === 'horizontal';
  }

  /**
   * Whether the current orientation is vertical.
   */
  get isOrientationVertical(): boolean {
    return this.orientation === 'vertical';
  }

  /**
   * Whether the slider thumb is currently being dragged.
   */
  get isDragging(): boolean {
    return this._isDragging;
  }

  protected get _fillRate(): number {
    const boundValue = Math.min(this.max, Math.max(this.min, this.value));
    const range = this.max - this.min;
    return boundValue / range;
  }

  protected set _fillRate(rate: number) {
    const boundRate = Math.min(1, Math.max(0, rate));
    const range = this.max - this.min;
    const fill = range * boundRate;
    const fillToStepRatio = Math.round(fill / this.step);
    const fillAmount = fillToStepRatio * this.step;
    this.value = this.min + fillAmount;
  }

  /**
   * The current value to range ratio.
   *
   * @example
   * `min` = 0
   * `max` = 10
   * `value` = 5
   * `range` = 10 (max - min)
   * `fillRate` = 0.5 (result)
   */
  get fillRate(): number {
    return this._fillRate;
  }

  /**
   * The fill rate expressed as a percentage (`fillRate * 100`).
   */
  get fillPercent(): number {
    return this._fillRate * 100;
  }

  /**
   * The component's root element.
   */
  get rootElement(): HTMLDivElement {
    return this.rootEl;
  }

  /**
   * The thumb element.
   */
  get thumbElement(): HTMLDivElement {
    return this.thumbEl;
  }

  /**
   * The track element.
   */
  get trackElement(): HTMLDivElement {
    return this.trackEl;
  }

  /**
   * The track fill element.
   */
  get trackFillElement(): HTMLDivElement {
    return this.trackFillEl;
  }

  // -------------------------------------------------------------------------------------------
  // Render (Root)
  // -------------------------------------------------------------------------------------------

  createRenderRoot(): ShadowRoot {
    return this.attachShadow({
      mode: 'open',
      // See Control for more information.
      delegatesFocus: currentSafariVersion() <= 537,
    });
  }

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
      >
        ${this.renderThumb()}${this.renderTrack()}${this.renderTrackFill()}${this.renderInput()}
        <slot></slot>
      </div>
    `;
  }

  protected getSliderClassAttr(): string {
    return clsx(
      this.isDragging && 'dragging',
      this.isOrientationVertical && 'orientation-vertical',
    );
  }

  protected getSliderPartAttr(): string {
    return clsx(
      'root',
      this.isDragging && 'root-dragging',
      this.isOrientationVertical && 'root-orientation-vertical',
    );
  }

  protected getSliderStyleMap(): StyleInfo {
    return {
      '--vds-slider-fill-value': String(this.value),
      '--vds-slider-fill-rate': String(this.fillRate),
      '--vds-slider-fill-percent': `${this.fillPercent}%`,
    };
  }

  // -------------------------------------------------------------------------------------------
  // Render (Thumb)
  // -------------------------------------------------------------------------------------------

  protected renderThumb(): TemplateResult {
    return html`
      <div
        id="thumb"
        role="slider"
        tabindex="0"
        part="${this.getThumbPartAttr()}"
        aria-label="${ifNonEmpty(this.label)}"
        aria-valuemax="${this.max}"
        aria-valuemin="${this.min}"
        aria-valuenow="${this.value}"
        aria-valuetext="${this.valueText ?? this.getValueAsTextFallback()}"
        aria-orientation="${this.orientation}"
        aria-disabled="${this.disabled}"
        aria-hidden="${this.hidden}"
        autocomplete="off"
        style="left: ${this.fillPercent}%"
        @keydown="${this.handleThumbKeydown}"
        @pointerdown="${this.handleThumbPointerDown}"
      ></div>
    `;
  }

  protected getThumbPartAttr(): string {
    return clsx('thumb', this.isDragging && 'thumb-dragging');
  }

  protected getValueAsTextFallback(): string {
    return `${(this.value / this.max) * 100}%`;
  }

  protected handleThumbKeydown(event: KeyboardEvent): void {
    const { key, shiftKey } = event;
    const isValidKey = Object.keys(SliderKeyDirection).includes(key);

    if (this.disabled || !isValidKey) return;

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
      new SliderValueChangeEvent({
        detail: this.value,
        originalEvent: event,
      }),
    );
  }

  protected handleThumbPointerDown(event: PointerEvent): void {
    if (this.disabled) return;
    this.startDragging(event);
  }

  // -------------------------------------------------------------------------------------------
  // Render (Track)
  // -------------------------------------------------------------------------------------------

  protected renderTrack(): TemplateResult {
    return html`
      <div
        id="track"
        part="${this.getTrackPartAttr()}"
        @pointerdown="${this.handlePointerMove}"
      ></div>
    `;
  }

  protected getTrackPartAttr(): string {
    return clsx('track', this.isDragging && 'track-dragging');
  }

  // -------------------------------------------------------------------------------------------
  // Render (Track Fill)
  // -------------------------------------------------------------------------------------------

  protected renderTrackFill(): TemplateResult {
    return html`
      <div id="track-fill" part="${this.getTrackFillPartAttr()}"></div>
    `;
  }

  protected getTrackFillPartAttr(): string {
    return clsx('track-fill', this.isDragging && 'track-fill-dragging');
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
    this._isDragging = true;

    this.dispatchEvent(
      new SliderDragStartEvent({
        originalEvent,
      }),
    );
  }

  protected stopDragging(originalEvent: PointerEvent): void {
    this._isDragging = false;

    this.dispatchEvent(
      new SliderDragEndEvent({
        originalEvent,
      }),
    );
  }

  // -------------------------------------------------------------------------------------------
  // Document
  // -------------------------------------------------------------------------------------------

  protected pointerMoveThrottle?: CancelableCallback<PointerEvent>;

  protected initPointerMoveThrottle(): void {
    this.pointerMoveThrottle?.cancel();
    this.pointerMoveThrottle = throttle(
      this.handleThrottledPointerMove,
      this.throttle,
    );
  }

  protected destroyPointerMoveThrottle(): void {
    this.pointerMoveThrottle?.cancel();
    this.pointerMoveThrottle = undefined;
  }

  @listen('pointerup', { target: 'document' })
  protected handleDocumentPointerUp(event: PointerEvent): void {
    if (this.disabled || !this._isDragging) return;
    this.stopDragging(event);
  }

  @listen('pointermove', { target: 'document' })
  protected handleDocumentPointerMove(event: PointerEvent): void {
    if (this.disabled || !this._isDragging) return;
    this.pointerMoveThrottle?.(event);
  }

  protected handleThrottledPointerMove(event: PointerEvent): void {
    if (this.disabled || !this._isDragging) return;
    this.handlePointerMove(event);
  }

  protected handlePointerMove(event: PointerEvent): void {
    if (this.disabled) return;
    const thumbPosition = event.clientX;
    this.updateValueBasedOnThumbPosition(thumbPosition, event);
  }

  protected updateValueBasedOnThumbPosition(
    thumbPosition: number,
    originalEvent?: PointerEvent,
  ): void {
    const {
      left: trackLeft,
      width: trackWidth,
    } = this.trackEl.getBoundingClientRect();

    // Calling this will update `this.value`.
    this._fillRate = (thumbPosition - trackLeft) / trackWidth;

    this.dispatchEvent(
      new SliderValueChangeEvent({
        detail: this.value,
        originalEvent,
      }),
    );
  }
}
