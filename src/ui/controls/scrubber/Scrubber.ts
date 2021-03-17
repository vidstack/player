import clsx from 'clsx';
import {
  CSSResultArray,
  html,
  internalProperty,
  LitElement,
  property,
  query,
  TemplateResult,
} from 'lit-element';
import { StyleInfo, styleMap } from 'lit-html/directives/style-map';

import { playerContext, VdsUserSeeked, VdsUserSeeking } from '../../../core';
import { FocusMixin } from '../../../shared/directives/FocusMixin';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { getSlottedChildren } from '../../../utils/dom';
import { currentSafariVersion } from '../../../utils/support';
import { isNil } from '../../../utils/unit';
import { formatSpokenTime } from '../../time/time';
import {
  Slider,
  VdsSliderDragEndEvent,
  VdsSliderDragStartEvent,
  VdsSliderValueChangeEvent,
} from '../slider';
import { scrubberPreviewContext } from './scrubber.context';
import { scrubberStyles } from './scrubber.css';
import { ScrubberProps } from './scrubber.types';

/**
 * A control that displays the progression of playback and the amount seekable on a slider. This
 * control can be used to update the current playback time by interacting with the slider.
 *
 * ## Previews / Storyboards
 *
 * You can pass in a preview to be shown while the user is interacting (hover/drag) with the
 * scrubber by passing an element into the `preview` slot, such as `<div slot="preview"></div>`.
 *
 * **You need to do the following on your root preview element:**
 *
 * - Expect that your root preview element will be positioned absolutely.
 * - Set the `bottom` CSS property on it to adjust it to the desired position above the slider.
 * - Create CSS styles for when it has a hidden attribute (`.preview[hidden] {}`).
 *
 * **The Scrubber will automatically do the following to the root preview element passed in:**
 *
 * - Set a `hidden` attribute when it should be hidden (it's left to you to hide it with CSS).
 * - Set a `vds-preview-time` attribute with the time (seconds) that's currently being interacted
 * with. You can listen to changes on this attribute and react accordingly.
 * - Set a `--vds-preview-time` CSS property that matches the `vds-preview-time` attribute value.
 * - Set a safe `z-index` value so the preview is above all other components and is visible.
 * - Update the `left` CSS property to position the preview accordingly.
 *
 * ## Tag
 *
 * @tagname vds-scrubber
 *
 * ## Slots
 *
 * @slot Used to pass content into the root.
 * @slot slider - Used to pass content into the slider component (`<vds-slider>`).
 * @slot progress - Used to pass content into the progress element (`<div>`).
 * @slot preview - Used to pass in a preview to be shown while the user is interacting (hover/drag) with the scrubber.
 *
 * ## CSS Parts
 *
 * @csspart root - The component's root element (`<div>`).
 * @csspart root-disabled - The component's root element when the scrubber is disabled.
 * @csspart root-hidden - The component's root element when the scrubber is hidden.
 * @csspart slider - The slider component (`<vds-slider>`).
 * @csspart slider-* - All slider parts re-exported with the `slider` prefix such as `slider-root` and `slider-thumb`.
 * @csspart progress - The progress element (`<div>`).
 *
 * ## CSS Properties
 *
 * @cssprop --vds-slider-* - All slider CSS properties can be used to style the underlying `<vds-slider>` component.
 * @cssprop --vds-scrubber-current-time - Current time of playback.
 * @cssprop --vds-scrubber-seekable - The amount of media that is seekable.
 * @cssprop --vds-scrubber-duration - The length of media playback.
 * @cssprop --vds-scrubber-progress-bg: The background color of the amount that is seekable.
 *
 * ## Examples
 *
 * @example
 * ```html
 * <vds-scrubber
 *  slider-label="Time scrubber"
 *  progress-label="Amount seekable"
 * >
 *  <!-- `hidden` attribute will automatically be applied/removed -->
 *  <div class="preview" slot="preview" hidden>Preview</div>
 * </vds-scrubber
 * ```
 *
 * @example
 * ```css
 * vds-scrubber {
 *   --vds-scrubber-progress-bg: pink;
 * }
 *
 * .preview {
 *   position: absolute;
 *   left: 0;
 *   bottom: 12px;
 *   opacity: 1;
 *   transition: opacity 0.3s ease-in;
 * }
 *
 * .preview[hidden] {
 *   opacity: 0;
 * }
 * ```
 */
export class Scrubber extends FocusMixin(LitElement) implements ScrubberProps {
  @query('#root') rootEl!: HTMLDivElement;
  @query('#slider') sliderEl!: Slider;
  @query('#progress') progressEl!: HTMLProgressElement;

  static get styles(): CSSResultArray {
    return [scrubberStyles];
  }

  static get parts(): string[] {
    const sliderExportParts = Slider.parts.map(part => `slider-${part}`);
    return [
      'root',
      'root-hidden',
      'root-disabled',
      'slider',
      'progress',
      ...sliderExportParts,
    ];
  }

  protected currentPreviewEl?: HTMLElement;

  /**
   * The root element passed in to the `preview` slot.
   */
  get currentPreviewElement(): HTMLElement | undefined {
    return this.currentPreviewEl;
  }

  @internalProperty()
  @scrubberPreviewContext.time.provide()
  protected previewTime = 0;

  @internalProperty()
  @scrubberPreviewContext.hidden.provide()
  protected shouldHidePreview = true;

  @internalProperty()
  @playerContext.currentTime.consume()
  protected currentTime = playerContext.currentTime.defaultValue;

  @internalProperty()
  @playerContext.duration.consume({ transform: d => (d >= 0 ? d : 0) })
  protected duration = 0;

  @internalProperty()
  @playerContext.seekableAmount.consume()
  protected seekableAmount = playerContext.seekableAmount.defaultValue;

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  @property({ attribute: 'slider-label' }) sliderLabel = 'Time scrubber';

  @property({ attribute: 'progress-label' }) progressLabel = 'Amount seekable';

  @property({ attribute: 'progress-text' }) progressText =
    '{currentTime} out of {duration}';

  @property({ type: Boolean, reflect: true }) hidden = false;

  @property({ type: Boolean, reflect: true }) disabled = false;

  // Slider properties.
  @property({ type: Number }) step = 0.01;
  @property({ type: Number, attribute: 'step-ratio' }) stepMultiplier = 5;
  @property() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @property({ type: Number }) throttle = 10;

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
    return this.renderScrubber();
  }

  // -------------------------------------------------------------------------------------------
  // Scrubber
  // -------------------------------------------------------------------------------------------

  /**
   * The component's root element.
   */
  get rootElement(): HTMLDivElement {
    return this.rootEl;
  }

  protected renderScrubber(): TemplateResult {
    return html`
      <div
        id="root"
        part="${this.getScrubberPartAttr()}"
        style="${styleMap(this.getScrubberStyleMap())}"
        @pointerenter="${this.handleScrubberPointerEnter}"
        @pointerleave="${this.handleScrubberPointerLeave}"
        @pointermove="${this.handleScrubberPointerMove}"
        ?hidden="${this.hidden}"
      >
        ${this.renderSlider()} ${this.renderDefaultSlot()}
        ${this.renderPreviewSlot()}
      </div>
    `;
  }

  protected getScrubberPartAttr(): string {
    return clsx(
      'root',
      'root-hidden' && this.hidden,
      'root-disabled' && this.disabled,
    );
  }

  protected getScrubberStyleMap(): StyleInfo {
    return {
      '--vds-scrubber-current-time': String(this.currentTime),
      '--vds-scrubber-seekable': String(this.seekableAmount),
      '--vds-scrubber-duration': String(this.duration),
    };
  }

  protected handleScrubberPointerEnter(e: PointerEvent): void {
    if (this.disabled) return;
    this.updatePreviewPosition(e);
    this.showPreview();
  }

  protected handleScrubberPointerLeave(e: PointerEvent): void {
    this.updatePreviewPosition(e);
    this.hidePreview();
  }

  protected handleScrubberPointerMove(e: PointerEvent): void {
    if (this.disabled) return;
    this.updatePreviewPosition(e);
  }

  // -------------------------------------------------------------------------------------------
  // Slots
  // -------------------------------------------------------------------------------------------

  protected renderDefaultSlot(): TemplateResult {
    return html`<slot @slotchange="${this.handleDefaultSlotChange}"></slot>`;
  }

  /**
   * Override to listen to default slot changes.
   */
  protected handleDefaultSlotChange(): void {
    // no-op
  }

  // -------------------------------------------------------------------------------------------
  // Progress
  // -------------------------------------------------------------------------------------------

  /**
   * Returns the underlying `<progress>` element.
   */
  get progressElement(): HTMLProgressElement {
    return this.progressEl;
  }

  protected renderProgress(): TemplateResult {
    const valueText = `${(this.duration > 0
      ? (this.seekableAmount / this.duration) * 100
      : 0
    ).toFixed(0)}%`;

    return html`
      <div
        id="progress"
        role="progressbar"
        part="${this.getProgressPartAttr()}"
        ?hidden="${this.hidden}"
        aria-label="${this.progressLabel}"
        aria-valuemin="0"
        aria-valuemax="${this.duration}"
        aria-valuenow="${this.seekableAmount}"
        aria-valuetext="${valueText}"
      >
        ${this.renderProgressSlot()}
      </div>
    `;
  }

  protected getProgressPartAttr(): string {
    return 'progress';
  }

  protected renderProgressSlot(): TemplateResult {
    return html`
      <slot
        name="${this.getProgressSlotName()}"
        @slotchange="${this.handleProgressSlotChange}"
      ></slot>
    `;
  }

  protected getProgressSlotName(): string {
    return 'progress';
  }

  /**
   * Override to listen to progress slot changes.
   */
  protected handleProgressSlotChange(): void {
    // no-op
  }

  // -------------------------------------------------------------------------------------------
  // Slider
  // -------------------------------------------------------------------------------------------

  @internalProperty()
  protected _isDragging = false;

  /**
   * Returns the underlying `vds-slider` component.
   */
  get slider(): Slider {
    return this.sliderEl;
  }

  /**
   * Whether the scrubber thumb/handle is currently being actively dragged left/right.
   */
  get isDragging(): boolean {
    return this._isDragging;
  }

  protected renderSlider(): TemplateResult {
    return html`
      <vds-slider
        id="slider"
        label="${ifNonEmpty(this.sliderLabel)}"
        min="0"
        max="${this.duration}"
        value="${this._isDragging ? this.previewTime : this.currentTime}"
        step="${this.step}"
        step-multiplier="${this.stepMultiplier}"
        part="${this.getSliderPartAttr()}"
        orientation="${this.orientation}"
        throttle="${this.throttle}"
        value-text="${this.getSliderProgressText()}"
        @vds-slidervaluechange="${this.handleSliderValueChange}"
        @vds-sliderdragstart="${this.handleSliderDragStart}"
        @vds-sliderdragend="${this.handleSliderDragEnd}"
        exportparts="${this.getSliderExportPartsAttr()}"
        ?hidden="${this.hidden}"
        ?disabled="${this.disabled}"
      >
        ${this.renderSliderSlot()}
      </vds-slider>
    `;
  }

  protected getSliderPartAttr(): string {
    return 'slider';
  }

  protected getSliderExportPartsAttr(): string {
    // Take all slider parts and re-export with `slider` prefix (eg: `root` => `slider-root`).
    return Slider.parts.map(part => `${part}: slider-${part}`).join(', ');
  }

  protected getSliderProgressText(): string {
    return this.progressText
      .replace('{currentTime}', formatSpokenTime(this.currentTime))
      .replace('{duration}', formatSpokenTime(this.duration));
  }

  protected renderSliderSlot(): TemplateResult {
    return html`
      <slot
        name="${this.getSliderSlotName()}"
        @slotchange="${this.handleSliderSlotChange}"
      ></slot>
      ${this.renderProgress()}
    `;
  }

  protected getSliderSlotName(): string {
    return 'slider';
  }

  /**
   * Override to listen to slider slot changes.
   */
  protected handleSliderSlotChange(): void {
    // no-op
  }

  protected handleSliderValueChange(e: VdsSliderValueChangeEvent): void {
    this.previewTime = e.detail;
    this.dispatchEvent(new VdsUserSeeking({ detail: e.detail }));
    if (!this._isDragging) {
      this.dispatchEvent(new VdsUserSeeked({ detail: this.previewTime }));
    }
  }

  protected handleSliderDragStart(e: VdsSliderDragStartEvent): void {
    this.previewTime = this.slider.value;
    this._isDragging = true;
    this.updatePreviewPosition(e.originalEvent as PointerEvent);
    this.showPreview();
  }

  protected handleSliderDragEnd(e: VdsSliderDragEndEvent): void {
    this._isDragging = false;
    this.updatePreviewPosition(e.originalEvent as PointerEvent);
    this.hidePreview();
    this.dispatchEvent(new VdsUserSeeked({ detail: this.previewTime }));
  }

  // -------------------------------------------------------------------------------------------
  // Preview
  // -------------------------------------------------------------------------------------------

  protected renderPreviewSlot(): TemplateResult {
    return html`
      <slot
        name="${this.getPreviewSlotName()}"
        @slotchange="${this.handlePreviewSlotChange}"
      ></slot>
    `;
  }

  protected getPreviewSlotName(): string {
    return 'preview';
  }

  protected handlePreviewSlotChange(): void {
    this.currentPreviewEl = getSlottedChildren(
      this,
      this.getPreviewSlotName(),
    )[0] as HTMLElement;

    if (!isNil(this.currentPreviewEl)) {
      this.currentPreviewEl.style.position = 'absolute';
      this.currentPreviewEl.style.left = '0';
      this.currentPreviewEl.style.zIndex = '90';
      this.hidePreview();
    }
  }

  protected showPreview(): void {
    if (this.disabled) return;
    this.shouldHidePreview = false;
    this.currentPreviewEl?.removeAttribute('hidden');
  }

  protected hidePreview(): void {
    if (this._isDragging) return;
    this.shouldHidePreview = true;
    this.currentPreviewEl?.setAttribute('hidden', '');
  }

  protected updatePreviewPosition(event: PointerEvent): void {
    if (isNil(this.currentPreviewEl) || this.shouldHidePreview) return;

    const thumbPosition = event.clientX;
    const rootRect = this.rootEl.getBoundingClientRect();
    const previewRect = this.currentPreviewEl.getBoundingClientRect();

    const percent = Math.max(
      0,
      Math.min(100, (100 / rootRect.width) * (thumbPosition - rootRect.left)),
    );

    const left = (percent / 100) * rootRect.width - previewRect.width / 2;
    const rightLimit = rootRect.width - previewRect.width;
    const xPos = Math.max(0, Math.min(left, rightLimit));

    this.currentPreviewEl.style.left = `${xPos}px`;
    this.currentPreviewEl.setAttribute(
      'vds-preview-time',
      this.previewTime.toFixed(0),
    );
    this.currentPreviewEl.style.setProperty(
      '--vds-preview-time',
      this.previewTime.toFixed(0),
    );
  }
}
