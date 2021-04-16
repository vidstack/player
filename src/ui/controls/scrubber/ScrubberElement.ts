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

import { mediaContext } from '../../../core';
import {
  VdsUserPauseEvent,
  VdsUserPlayEvent,
  VdsUserSeekedEvent,
  VdsUserSeekingEvent,
} from '../../../core/user/user.events';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { FocusMixin } from '../../../shared/mixins/FocusMixin';
import { CancelableCallback } from '../../../shared/types';
import { getSlottedChildren, raf } from '../../../utils/dom';
import { isNil, isUndefined } from '../../../utils/unit';
import { formatSpokenTime } from '../../time/time';
import {
  SliderElement,
  VdsSliderDragEndEvent,
  VdsSliderDragStartEvent,
  VdsSliderValueChangeEvent,
} from '../slider';
import { scrubberPreviewContext } from './scrubber.context';
import { scrubberElementStyles } from './scrubber.css';
import {
  VdsScrubberPreviewHideEvent,
  VdsScrubberPreviewShowEvent,
  VdsScrubberPreviewTimeUpdateEvent,
} from './scrubber.events';
import { ScrubberElementProps } from './scrubber.types';

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
 * @tagname vds-scrubber
 *
 * @slot Used to pass content into the root.
 * @slot progress - Used to pass content into the progress element (`<div>`).
 * @slot preview - Used to pass in a preview to be shown while the user is interacting (hover/drag) with the scrubber.
 * @slot slider - Used to pass content into the slider component (`<vds-slider>`).
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
 * @cssprop --vds-slider-* - All slider CSS properties can be used to style the underlying `<vds-slider>` component.
 *
 * @cssprop --vds-scrubber-current-time - Current time of playback.
 * @cssprop --vds-scrubber-seekable - The amount of media that is seekable.
 * @cssprop --vds-scrubber-duration - The length of media playback.
 *
 * @cssprop --vds-scrubber-progress-bg - The background color of the amount that is seekable.
 * @cssprop --vds-scrubber-progress-height - The height of the progress bar (defaults to `--vds-slider-track-height`).
 *
 * @cssprop --vds-scrubber-preview-time - The current time in seconds that is being previewed (hover/drag).
 * @cssprop --vds-scrubber-preview-track-height - The height of the preview track (defaults to `--vds-slider-track-height`).
 * @cssprop --vds-preview-track-bg - The background color of the preview track.
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
export class ScrubberElement
  extends FocusMixin(LitElement)
  implements ScrubberElementProps {
  @query('#root') rootEl!: HTMLDivElement;
  @query('#slider') sliderEl!: SliderElement;
  @query('#progress') progressEl!: HTMLProgressElement;
  @query('#preview-track') previewTrackEl?: HTMLDivElement;

  static get styles(): CSSResultArray {
    return [scrubberElementStyles];
  }

  static get parts(): string[] {
    const sliderExportParts = SliderElement.parts.map(part => `slider-${part}`);
    return ['root', 'slider', 'progress', ...sliderExportParts];
  }

  protected currentPreviewEl?: HTMLElement;

  get currentPreviewElement(): HTMLElement | undefined {
    return this.currentPreviewEl;
  }

  @mediaContext.paused.consume()
  protected paused = mediaContext.paused.defaultValue;

  @internalProperty()
  @scrubberPreviewContext.time.provide()
  protected previewTime = 0;

  @internalProperty()
  @scrubberPreviewContext.showing.provide()
  protected isPreviewShowing = false;

  @internalProperty()
  @mediaContext.currentTime.consume()
  protected currentTime = mediaContext.currentTime.defaultValue;

  @internalProperty()
  @mediaContext.duration.consume({ transform: d => (d >= 0 ? d : 0) })
  protected duration = 0;

  @internalProperty()
  @mediaContext.seekableAmount.consume()
  protected seekableAmount = mediaContext.seekableAmount.defaultValue;

  connectedCallback(): void {
    super.connectedCallback();
    this.initThrottles();
  }

  update(changedProperties: PropertyValues): void {
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

  @property({ type: Number, attribute: 'preview-time-throttle' })
  previewTimeThrottle = 30;

  @property({ type: Boolean, attribute: 'pause-while-dragging' })
  pauseWhileDragging = false;

  @property({ type: Boolean, attribute: 'no-preview-track' })
  noPreviewTrack = false;

  @property({ type: Number, attribute: 'user-seeking-throttle' })
  userSeekingThrottle = 150;

  // Slider properties.
  @property({ type: Number }) step = 5;
  @property({ type: Number, attribute: 'step-ratio' }) stepMultiplier = 2;
  @property() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @property({ type: Number }) throttle = 0;

  // -------------------------------------------------------------------------------------------
  // User
  // -------------------------------------------------------------------------------------------

  protected dispatchUserSeekingEvent(eventInit: {
    detail: number;
    originalEvent?: Event;
  }): void {
    if (!this.isSeeking) return;
    this.dispatchEvent(new VdsUserSeekingEvent(eventInit));
  }

  protected dispatchUserSeeked(originalEvent: Event): void {
    this.currentTime = this.previewTime;
    this.dispatchEvent(
      new VdsUserSeekedEvent({
        detail: this.previewTime,
        originalEvent,
      }),
    );
  }

  // -------------------------------------------------------------------------------------------
  // Render (Root)
  // -------------------------------------------------------------------------------------------

  render(): TemplateResult {
    return this.renderScrubber();
  }

  // -------------------------------------------------------------------------------------------
  // Scrubber
  // -------------------------------------------------------------------------------------------

  @internalProperty()
  protected isPointerInsideScrubber = false;

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
    };
  }

  protected async handleScrubberPointerEnter(e: PointerEvent): Promise<void> {
    if (this.disabled) return;
    this.isPointerInsideScrubber = true;
    this.showPreview(e);
  }

  protected async handleScrubberPointerLeave(e: PointerEvent): Promise<void> {
    this.isPointerInsideScrubber = false;
    this.hidePreview(e);
  }

  protected handleScrubberPointerMove(e: PointerEvent): void {
    if (this.disabled) return;
    this.updatePreviewPosition(e);
  }

  protected renderDefaultSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Progress
  // -------------------------------------------------------------------------------------------

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

  get slider(): SliderElement {
    return this.sliderEl;
  }

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
    return SliderElement.parts
      .map(part => `${part}: slider-${part}`)
      .join(', ');
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

  protected async handleSliderValueChange(
    e: VdsSliderValueChangeEvent,
  ): Promise<void> {
    await this.updatePreviewPosition(e.originalEvent as PointerEvent);
    if (!this.isDraggingThumb) {
      this.dispatchUserSeeked(e);
    }
  }

  protected async handleSliderDragStart(
    e: VdsSliderDragStartEvent,
  ): Promise<void> {
    this.isDraggingThumb = true;
    this.showPreview(e.originalEvent as PointerEvent);
    this.togglePlaybackWhileDragging(e);
  }

  protected async handleSliderDragEnd(e: VdsSliderDragEndEvent): Promise<void> {
    this.isDraggingThumb = false;
    this.hidePreview(e.originalEvent as PointerEvent);
    this.dispatchUserSeeked(e);
    this.togglePlaybackWhileDragging(e);
  }

  // TODO: Clean up later.
  protected wasPausedBeforeDragStart = false;
  protected shouldTogglePlaybackWhileDragging = false;
  protected togglePlaybackWhileDragging(originalEvent: Event): void {
    if (!this.pauseWhileDragging) return;

    if (this.isDraggingThumb && !this.paused) {
      this.wasPausedBeforeDragStart = this.paused;
      this.shouldTogglePlaybackWhileDragging = true;
      this.dispatchEvent(new VdsUserPauseEvent({ originalEvent }));
    } else if (
      this.shouldTogglePlaybackWhileDragging &&
      !this.isDraggingThumb &&
      !this.wasPausedBeforeDragStart &&
      this.paused
    ) {
      this.shouldTogglePlaybackWhileDragging = false;
      this.dispatchEvent(new VdsUserPlayEvent({ originalEvent }));
    }
  }

  // -------------------------------------------------------------------------------------------
  // Preview Track Fill
  // -------------------------------------------------------------------------------------------

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

  protected updatePreviewTimeThrottler?: CancelableCallback<{
    detail: number;
    originalEvent?: Event;
  }>;

  protected dispatchUserSeekingEventThrottler?: CancelableCallback<{
    detail: number;
    originalEvent?: Event;
  }>;

  protected initThrottles(): void {
    this.updatePreviewTimeThrottler?.cancel();
    this.updatePreviewTimeThrottler = throttle(
      this.updatePreviewTime.bind(this),
      this.previewTimeThrottle,
    );

    this.dispatchUserSeekingEventThrottler?.cancel();
    this.dispatchUserSeekingEventThrottler = throttle(
      this.dispatchUserSeekingEvent.bind(this),
      this.userSeekingThrottle,
    );
  }

  protected destroyThrottles(): void {
    this.updatePreviewTimeThrottler?.cancel();
    this.updatePreviewTimeThrottler = undefined;
    this.dispatchUserSeekingEventThrottler?.cancel();
    this.dispatchUserSeekingEventThrottler = undefined;
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

  protected showPreviewTimeout?: number;

  protected showPreview(originalEvent: PointerEvent): void {
    window.clearTimeout(this.showPreviewTimeout);

    if (
      this.disabled ||
      isNil(this.currentPreviewEl) ||
      !this.isSeeking ||
      (this.isSeeking && !this.isCurrentPreviewHidden())
    ) {
      return;
    }

    this.showPreviewTimeout = window.setTimeout(
      async () => {
        this.isPreviewShowing = true;
        this.currentPreviewEl?.removeAttribute('hidden');
        await raf();
        await this.updatePreviewPosition(originalEvent);
        await this.updateComplete;
        this.dispatchEvent(new VdsScrubberPreviewShowEvent({ originalEvent }));
      },
      this.isDraggingThumb ? 150 : 0,
    );

    this.requestUpdate();
  }

  protected async hidePreview(originalEvent?: PointerEvent): Promise<void> {
    window.clearTimeout(this.showPreviewTimeout);

    if (this.isSeeking || (!this.isSeeking && this.isCurrentPreviewHidden())) {
      return;
    }

    if (!isUndefined(originalEvent)) {
      this.updatePreviewPosition(originalEvent);
      await this.updateComplete;
    }

    this.isPreviewShowing = false;
    this.currentPreviewEl?.setAttribute('hidden', '');
    this.dispatchEvent(new VdsScrubberPreviewHideEvent({ originalEvent }));
    this.requestUpdate();
  }

  protected updatePreviewTime(eventInit: {
    detail: number;
    originalEvent?: Event;
  }): void {
    if (!this.isSeeking) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.dispatchUserSeekingEventThrottler!(eventInit);
    this.dispatchEvent(new VdsScrubberPreviewTimeUpdateEvent(eventInit));
  }

  protected async updatePreviewPosition(event: PointerEvent): Promise<void> {
    await raf(async () => {
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
        Math.min(
          100,
          (100 / trackRect.width) * (thumbPosition - trackRect.left),
        ),
      );

      const left = (percent / 100) * rootRect.width - previewRectWidth / 2;
      const rightLimit = rootRect.width - previewRectWidth - sliderRightMargin;
      const xPos = Math.max(sliderLeftMargin, Math.min(left, rightLimit));

      this.previewTime = (percent / 100) * this.duration;

      this.rootEl.style.setProperty(
        '--vds-scrubber-preview-time',
        String(this.previewTime),
      );

      if (this.isDraggingThumb) {
        this.sliderEl.value = this.previewTime;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.updatePreviewTimeThrottler!({
        detail: this.previewTime,
        originalEvent: event,
      });

      if (!isNil(this.currentPreviewEl)) {
        this.currentPreviewEl.style.transform = `translateX(${xPos}px)`;
      }
    });
  }
}
