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

import {
  playerContext,
  VdsUserPauseEvent,
  VdsUserPlayEvent,
  VdsUserSeekedEvent,
  VdsUserSeekingEvent,
} from '../../../core';
import { FocusMixin } from '../../../shared/directives/FocusMixin';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { CancelableCallback } from '../../../shared/types';
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
import {
  VdsScrubberPreviewHideEvent,
  VdsScrubberPreviewShowEvent,
  VdsScrubberPreviewTimeUpdateEvent,
} from './scrubber.events';
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
 * - Set a safe `z-index` value so the preview is above all other components and is visible.
 * - Update the `translateX()` CSS property to position the preview accordingly.
 *
 * ### How do I get the current preview time?
 *
 * You can either listen to `vds-scrubber-preview-time-update` event on this component, or you can
 * use the `scrubberPreviewContext`.
 *
 * For styling you have access to the `--vds-scrubber-preview-time` CSS property which contains
 * the current time in seconds the user is previewing.
 *
 * ## Tag
 *
 * @tagname vds-scrubber
 *
 * ## Slots
 *
 * @slot Used to pass content into the root.
 * @slot progress - Used to pass content into the progress element (`<div>`).
 * @slot preview - Used to pass in a preview to be shown while the user is interacting (hover/drag) with the scrubber.
 * @slot slider - Used to pass content into the slider component (`<vds-slider>`).
 *
 * ## CSS Parts
 *
 * @csspart root - The component's root element (`<div>`).
 *
 * @csspart slider - The slider component (`<vds-slider>`).
 * @csspart slider-* - All slider parts re-exported with the `slider` prefix such as `slider-root` and `slider-thumb`.
 *
 * @csspart progress - The progress element (`<div>`).
 *
 * @csspart preview-track - The part of the slider track that displays
 * @csspart preview-track-hidden - Targets the `preview-track` part when it's hidden.
 *
 * ## CSS Properties
 *
 * @cssprop --vds-slider-* - All slider CSS properties can be used to style the underlying `<vds-slider>` component.
 *
 * @cssprop --vds-scrubber-current-time - Current time of playback.
 * @cssprop --vds-scrubber-seekable - The amount of media that is seekable.
 * @cssprop --vds-scrubber-duration - The length of media playback.
 *
 * @cssprop --vds-scrubber-progress-bg: The background color of the amount that is seekable.
 * @cssprop --vds-scrubber-progress-height - The height of the progress bar (defaults to `--vds-slider-track-height`).
 *
 * @cssprop --vds-scrubber-preview-time: The current time in seconds that is being previewed (hover/drag).
 * @cssprop --vds-scrubber-preview-track-height - The height of the preview track (defaults to `--vds-slider-track-height`).
 * @cssprop --vds-preview-track-bg - The background color of the preview track.
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
  @query('#preview-track') previewTrackEl?: HTMLDivElement;

  static get styles(): CSSResultArray {
    return [scrubberStyles];
  }

  static get parts(): string[] {
    const sliderExportParts = Slider.parts.map(part => `slider-${part}`);
    return ['root', 'slider', 'progress', ...sliderExportParts];
  }

  protected currentPreviewEl?: HTMLElement;

  /**
   * The root element passed in to the `preview` slot.
   */
  get currentPreviewElement(): HTMLElement | undefined {
    return this.currentPreviewEl;
  }

  @playerContext.paused.consume()
  protected paused = playerContext.paused.defaultValue;

  @internalProperty()
  @scrubberPreviewContext.time.provide()
  protected previewTime = 0;

  @internalProperty()
  @scrubberPreviewContext.showing.provide()
  protected isPreviewShowing = false;

  @internalProperty()
  @playerContext.currentTime.consume()
  protected currentTime = playerContext.currentTime.defaultValue;

  @internalProperty()
  @playerContext.duration.consume({ transform: d => (d >= 0 ? d : 0) })
  protected duration = 0;

  @internalProperty()
  @playerContext.seekableAmount.consume()
  protected seekableAmount = playerContext.seekableAmount.defaultValue;

  connectedCallback(): void {
    super.connectedCallback();
    this.initThrottles();
  }

  update(changedProperties: PropertyValues): void {
    this.isPreviewShowing = this.isSeeking;

    if (
      changedProperties.has('previewTimeThrottle') ||
      changedProperties.has('userSeekingThrottle')
    ) {
      this.initThrottles();
    }

    if (changedProperties.has('disabled') && this.disabled) {
      this.isPointerInsideScrubber = false;
      this.isDraggingThumb = false;
      this.hidePreview();
    }

    super.update(changedProperties);
  }

  disconnectedCallback(): void {
    this.destroyThrottles();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  @property({ attribute: 'slider-label' }) sliderLabel = 'Time scrubber';

  @property({ attribute: 'progress-label' }) progressLabel = 'Amount seekable';

  @property({ attribute: 'progress-text' }) progressText =
    '{currentTime} out of {duration}';

  @property({ type: Boolean, reflect: true }) hidden = false;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: Number, attribute: 'preview-throttle' })
  previewThrottle = 30;

  @property({ type: Boolean, attribute: 'pause-while-dragging' })
  pauseWhileDragging = false;

  @property({ type: Boolean, attribute: 'no-preview-track' })
  noPreviewTrack = false;

  @property({ type: Number, attribute: 'user-seeking-throttle' })
  userSeekingThrottle = 150;

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

  @internalProperty()
  protected isPointerInsideScrubber = false;

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
    return 'root';
  }

  protected getScrubberStyleMap(): StyleInfo {
    return {
      '--vds-scrubber-current-time': String(this.currentTime),
      '--vds-scrubber-seekable': String(this.seekableAmount),
      '--vds-scrubber-duration': String(this.duration),
      '--vds-scrubber-preview-time': String(this.previewTime),
    };
  }

  protected async handleScrubberPointerEnter(e: PointerEvent): Promise<void> {
    if (this.disabled) return;
    this.isPointerInsideScrubber = true;
    this.updatePreviewPosition(e);
    await this.updateComplete;
    this.showPreview();
  }

  protected async handleScrubberPointerLeave(e: PointerEvent): Promise<void> {
    this.isPointerInsideScrubber = false;
    this.updatePreviewPosition(e);
    await this.updateComplete;
    this.hidePreview();
  }

  protected handleScrubberPointerMove(e: PointerEvent): void {
    if (this.disabled) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.previewPositionThrottler!(e);
  }

  protected renderDefaultSlot(): TemplateResult {
    return html`<slot></slot>`;
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
    return html`<slot name="progress"></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Slider
  // -------------------------------------------------------------------------------------------

  @internalProperty()
  protected isDraggingThumb = false;

  /**
   * Returns the underlying `vds-slider` component.
   */
  get slider(): Slider {
    return this.sliderEl;
  }

  /**
   * Whether the user is seeking by either hovering over the scrubber or by dragging the thumb.
   */
  get isSeeking(): boolean {
    return this.isPointerInsideScrubber || this.isDraggingThumb;
  }

  protected renderSlider(): TemplateResult {
    return html`
      <vds-slider
        id="slider"
        label="${ifNonEmpty(this.sliderLabel)}"
        min="0"
        max="${this.duration}"
        value="${this.isDraggingThumb ? this.previewTime : this.currentTime}"
        step="${this.step}"
        step-multiplier="${this.stepMultiplier}"
        part="${this.getSliderPartAttr()}"
        orientation="${this.orientation}"
        throttle="${this.throttle}"
        value-text="${this.getSliderProgressText()}"
        @vds-slider-value-change="${this.handleSliderValueChange}"
        @vds-slider-drag-start="${this.handleSliderDragStart}"
        @vds-slider-drag-end="${this.handleSliderDragEnd}"
        exportparts="${this.getSliderExportPartsAttr()}"
        ?hidden="${this.hidden}"
        ?disabled="${this.disabled}"
      >
        ${this.renderSliderContent()}
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

  protected renderSliderContent(): TemplateResult {
    return html`
      <slot name="slider"></slot>
      ${this.renderProgress()} ${this.renderPreviewTrack()}
    `;
  }

  protected handleSliderValueChange(e: VdsSliderValueChangeEvent): void {
    if (this.isDraggingThumb) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.previewTimeThrottler!(e.detail);
    } else {
      this.currentTime = e.detail;
      this.previewTime = e.detail;
      this.dispatchEvent(new VdsUserSeekedEvent({ detail: this.previewTime }));
    }
  }

  protected async handleSliderDragStart(
    e: VdsSliderDragStartEvent,
  ): Promise<void> {
    this.isDraggingThumb = true;
    await this.updatePreviewPosition(e.originalEvent as PointerEvent);
    await this.updateComplete;
    this.showPreview();
    this.togglePlaybackWhileDragging(e);
  }

  protected async handleSliderDragEnd(e: VdsSliderDragEndEvent): Promise<void> {
    this.isDraggingThumb = false;
    await this.updatePreviewPosition(e.originalEvent as PointerEvent);
    await this.updateComplete;
    this.hidePreview();
    this.currentTime = e.detail;
    this.dispatchEvent(new VdsUserSeekedEvent({ detail: this.previewTime }));
    this.togglePlaybackWhileDragging(e);
  }

  protected wasPausedBeforeDragStart = false;
  protected togglePlaybackWhileDragging(originalEvent: Event): void {
    if (!this.pauseWhileDragging) return;

    if (this.isDraggingThumb && !this.paused) {
      this.wasPausedBeforeDragStart = this.paused;
      this.dispatchEvent(new VdsUserPauseEvent({ originalEvent }));
    } else if (
      !this.isDraggingThumb &&
      !this.wasPausedBeforeDragStart &&
      this.paused
    ) {
      this.dispatchEvent(new VdsUserPlayEvent({ originalEvent }));
    }
  }

  // -------------------------------------------------------------------------------------------
  // Preview Track Fill
  // -------------------------------------------------------------------------------------------

  /**
   * Returns the underlying preview track fill element (`<div>`). This will be `undefined` if
   * you set the `noPreviewTrack` property to true.
   */
  get previewTrackElement(): HTMLDivElement | undefined {
    return this.previewTrackEl ?? undefined;
  }

  protected renderPreviewTrack(): TemplateResult {
    if (this.noPreviewTrack) return html``;

    return html`
      <div
        id="preview-track"
        part="${this.getPreviewTrackPartAttr()}"
        ?hidden="${!this.isSeeking}"
        ?disabled="${this.disabled}"
      ></div>
    `;
  }

  protected getPreviewTrackPartAttr(): string {
    return clsx('preview-track', 'preview-track-hidden' && !this.isSeeking);
  }

  // -------------------------------------------------------------------------------------------
  // Preview
  // -------------------------------------------------------------------------------------------

  protected userSeekingThrottler?: CancelableCallback<number>;
  protected previewTimeThrottler?: CancelableCallback<number>;
  protected previewPositionThrottler?: CancelableCallback<PointerEvent>;

  protected initThrottles(): void {
    this.previewTimeThrottler?.cancel();
    this.previewTimeThrottler = throttle(
      this.updatePreviewTime.bind(this),
      this.previewThrottle,
    );

    this.userSeekingThrottler?.cancel();
    this.userSeekingThrottler = throttle(
      this.dispatchUserSeekingEvent.bind(this),
      this.userSeekingThrottle,
    );

    this.previewPositionThrottler?.cancel();
    this.previewPositionThrottler = throttle(
      this.updatePreviewPosition.bind(this),
      this.previewThrottle,
    );
  }

  protected destroyThrottles(): void {
    this.previewTimeThrottler?.cancel();
    this.previewTimeThrottler = undefined;
    this.userSeekingThrottler?.cancel();
    this.userSeekingThrottler = undefined;
    this.previewPositionThrottler?.cancel();
    this.previewPositionThrottler = undefined;
  }

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
      this.currentPreviewEl.style.willChange = 'transform';
      this.hidePreview();
    }
  }

  protected isCurrentPreviewHidden(): boolean {
    return this.currentPreviewEl?.hasAttribute('hidden') ?? true;
  }

  protected showPreview(): void {
    if (
      this.disabled ||
      isNil(this.currentPreviewEl) ||
      !this.isSeeking ||
      (this.isSeeking && !this.isCurrentPreviewHidden())
    ) {
      return;
    }

    this.currentPreviewEl?.removeAttribute('hidden');
    this.dispatchEvent(new VdsScrubberPreviewShowEvent());
    this.requestUpdate();
  }

  protected hidePreview(): void {
    if (this.isSeeking || (!this.isSeeking && this.isCurrentPreviewHidden())) {
      return;
    }

    this.currentPreviewEl?.setAttribute('hidden', '');
    this.dispatchEvent(new VdsScrubberPreviewHideEvent());
    this.requestUpdate();
  }

  protected dispatchUserSeekingEvent(time: number): void {
    if (!this.isSeeking) return;
    this.dispatchEvent(new VdsUserSeekingEvent({ detail: time }));
  }

  protected updatePreviewTime(time: number): void {
    if (!this.isSeeking) return;
    this.previewTime = time;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.userSeekingThrottler!(time);
    this.dispatchEvent(new VdsScrubberPreviewTimeUpdateEvent({ detail: time }));
    this.requestUpdate();
  }

  protected updatePreviewPosition(event: PointerEvent): void {
    const thumbPosition = event.clientX;
    const rootRect = this.rootEl.getBoundingClientRect();
    const trackRect = this.sliderEl.trackEl.getBoundingClientRect();
    const previewRectWidth =
      this.currentPreviewEl?.getBoundingClientRect().width ?? 0;

    // Margin on slider usually represents (thumb width / 2) so thumb is contained when on edge.
    const sliderLeftMargin = parseFloat(
      window.getComputedStyle(this.sliderEl.rootElement).marginLeft,
    );
    const sliderRightMargin = parseFloat(
      window.getComputedStyle(this.sliderEl.rootElement).marginRight,
    );

    const percent = Math.max(
      0,
      Math.min(100, (100 / trackRect.width) * (thumbPosition - trackRect.left)),
    );

    const left = (percent / 100) * rootRect.width - previewRectWidth / 2;
    const rightLimit = rootRect.width - previewRectWidth - sliderRightMargin;
    const xPos = Math.max(sliderLeftMargin, Math.min(left, rightLimit));

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.previewTimeThrottler!((percent / 100) * this.duration);

    if (!isNil(this.currentPreviewEl)) {
      this.currentPreviewEl.style.transform = `translateX(${xPos}px)`;
    }
  }
}
