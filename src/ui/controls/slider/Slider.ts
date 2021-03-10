import { event, listen } from '@wcom/events';
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
import throttle from 'lodash.throttle';

import { FocusMixin } from '../../../shared/directives/FocusMixin';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { CancelableCallback } from '../../../shared/types';
import { currentSafariVersion } from '../../../utils/support';
import { sliderStyles } from './slider.css';
import {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderValueChangeEvent,
} from './slider.events';
import { SliderKeyDirection } from './slider.types';

/**
 * TODO: DOCUMENTATION
 *
 * root, root-dragging, root-vertical-orientation, thumb, track, track-fill
 *
 * --slider-fill-rate, --slider-fill-value, --slider-fill-percentage
 *
 * default slot
 *
 * @inspriation https://github.com/carbon-design-system/carbon-web-components/blob/master/src/components/slider/slider.ts
 */
export class Slider extends FocusMixin(LitElement) {
  static get styles(): CSSResultArray {
    return [sliderStyles];
  }

  @query('#thumb') thumbEl!: HTMLDivElement;
  @query('#track') trackEl!: HTMLDivElement;

  connectedCallback(): void {
    super.connectedCallback();
    this.initMouseMoveThrottle();
  }

  update(changedProperties: PropertyValues): void {
    if (changedProperties.has('disabled') && this.disabled) {
      this._isDragging = false;
    }

    if (changedProperties.has('throttle')) {
      this.initMouseMoveThrottle();
    }

    super.update(changedProperties);
  }

  disconnectedCallback(): void {
    // Avoid memory leak.
    this.mouseMoveThrottle?.cancel();
    this.mouseMoveThrottle = undefined;

    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * ♿ **ARIA:** The `aria-label` property of the slider.
   */
  @property() label?: string;

  /**
   * A number that specifies the granularity that the value must adhere to.
   */
  @property({ type: Number, reflect: true }) step = 1;

  /**
   * A number determining how much the value should increase/decrease by Shift+Arrow keys,
   * which will be `(max - min) / stepRatio`.
   */
  @property({ type: Number, reflect: true, attribute: 'step-ratio' })
  stepRatio = 4;

  /**
   * The lowest value in the range of permitted values.
   */
  @property({ type: Number, reflect: true }) min = 0;

  /**
   * The greatest value in the range of permitted values.
   */
  @property({ type: Number, reflect: true }) max = 100;

  /**
   * Whether the slider should be hidden.
   */
  @property({ type: Boolean, reflect: true }) hidden = false;

  /**
   * Whether the slider should be disabled (not-interactable).
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The current value.
   */
  @property({ type: Number }) value = 50;

  /**
   * ♿ **ARIA:** Human-readable text alternative for the current value. Defaults to
   * `value:max` ratio as a percentage.
   */
  @property({ attribute: 'value-text' }) valueText?: string;

  /**
   * ♿ **ARIA:** Indicates the orientation of the slider.
   */
  @property() orientation: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * The amount of milliseconds to throttle slider thumb move events.
   */
  @property({ type: Number }) throttle = 10;

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  @internalProperty()
  protected _isDragging = false;

  /**
   * Whether the current orientation is horizontal.
   */
  get isHorizontalOrientation(): boolean {
    return this.orientation === 'horizontal';
  }

  /**
   * Whether the current orientation is vertical.
   */
  get isVerticalOrientation(): boolean {
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
   * The percetange of the slider that should be filled based on the current value.
   */
  get fillPercent(): number {
    return this._fillRate * 100;
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
    return clsx(this.isVerticalOrientation && 'vertical-orientation');
  }

  protected getSliderPartAttr(): string {
    return clsx(
      'root',
      this.isDragging && 'root-dragging',
      this.isVerticalOrientation && 'root-vertical-orientation',
    );
  }

  protected getSliderStyleMap(): StyleInfo {
    return {
      '--vds-slider-value': String(this.value),
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
        @mousedown="${this.handleThumbMouseDown}"
      ></div>
    `;
  }

  protected getThumbPartAttr(): string {
    return 'thumb';
  }

  protected getValueAsTextFallback(): string {
    return `${(this.value / this.max) * 100}%`;
  }

  protected handleThumbKeydown(event: KeyboardEvent): void {
    const { key, shiftKey } = event;
    const isValidKey = Object.keys(SliderKeyDirection).includes(key);

    if (this.disabled || !isValidKey) return;

    const range = this.max - this.min;
    const modified = !shiftKey ? this.step : range / this.stepRatio;
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

  protected handleThumbMouseDown(originalEvent: MouseEvent): void {
    this._isDragging = true;
    this.dispatchEvent(
      new SliderDragStartEvent({
        originalEvent,
      }),
    );
  }

  // -------------------------------------------------------------------------------------------
  // Render (Track)
  // -------------------------------------------------------------------------------------------

  protected renderTrack(): TemplateResult {
    return html`
      <div
        id="track"
        part="${this.getTrackPartAttr()}"
        @mousedown="${this.handleTrackMouseDown}"
      ></div>
    `;
  }

  protected getTrackPartAttr(): string {
    return 'track';
  }

  protected handleTrackMouseDown(event: MouseEvent): void {
    if (this.disabled) return;
    const thumbPosition = event.clientX;
    this.updateValueBasedOnThumbPosition(thumbPosition, event);
  }

  protected updateValueBasedOnThumbPosition(
    thumbPosition: number,
    originalEvent?: Event,
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

  // -------------------------------------------------------------------------------------------
  // Render (Track Fill)
  // -------------------------------------------------------------------------------------------

  protected renderTrackFill(): TemplateResult {
    return html`
      <div id="track-fill" part="${this.getTrackFillPartAttr()}"></div>
    `;
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
  // Document
  // -------------------------------------------------------------------------------------------

  protected mouseMoveThrottle?: CancelableCallback<MouseEvent>;

  protected initMouseMoveThrottle(): void {
    this.mouseMoveThrottle?.cancel();
    this.mouseMoveThrottle = throttle(
      this.handleThrottledDocumentMouseMove,
      this.throttle,
    );
  }

  @listen('mouseup', { target: 'document' })
  protected handleDocumentMouseUp(originalEvent: MouseEvent): void {
    if (!this._isDragging) return;
    this._isDragging = false;
    this.dispatchEvent(
      new SliderDragEndEvent({
        originalEvent,
      }),
    );
  }

  @listen('mousemove', { target: 'document' })
  protected handleDocumentMouseMove(event: MouseEvent): void {
    if (this.disabled || !this._isDragging) return;
    this.mouseMoveThrottle?.(event);
  }

  protected handleThrottledDocumentMouseMove(event: MouseEvent): void {
    if (this.disabled || !this._isDragging) return;
    const thumbPosition = event.clientX;
    this.updateValueBasedOnThumbPosition(thumbPosition, event);
  }

  // -------------------------------------------------------------------------------------------
  // Event Documentation
  //
  // Purely documentation purposes only, it'll be picked up by `@wcom/cli`.
  // -------------------------------------------------------------------------------------------

  /**
   * Emitted when the slider value changes.
   */
  @event({ name: 'vds-slider-value-change' })
  protected sliderValueChangeEvent!: number;

  /**
   * Emitted when the user begins interacting with the slider and dragging the thumb.
   */
  @event({ name: 'vds-slider-drag-start' })
  protected sliderDragStartEvent!: boolean;

  /**
   * Emitted when the user stops dragging the slider thumb.
   */
  @event({ name: 'vds-slider-drag-end' })
  protected sliderDragEndEvent!: boolean;
}
