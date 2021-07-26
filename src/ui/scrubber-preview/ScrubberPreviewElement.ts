import { consumeContext, provideContextRecord } from '@base/context/index';
import { discover, DiscoveryEvent } from '@base/elements/index';
import {
  isPointerEvent,
  isVdsEvent,
  VdsEvent,
  vdsEvent
} from '@base/events/index';
import { mediaContext } from '@media/context';
import { getSlottedChildren, raf } from '@utils/dom';
import { clampNumber, round } from '@utils/number';
import { rafThrottle } from '@utils/timing';
import { isNil } from '@utils/unit';
import {
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult
} from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

import { scrubberContext } from '../scrubber/context';
import { scrubberPreviewContext } from './context';
import { scrubberPreviewElementStyles } from './styles';

export const SCRUBBER_PREVIEW_ELEMENT_TAG_NAME = 'vds-scrubber-preview';

/**
 * Fired when the scrubber preview element connects to the DOM.
 *
 * @event
 * @bubbles
 * @composed
 */
export type ScrubberPreviewConnectEvent =
  DiscoveryEvent<ScrubberPreviewElement>;

/**
 * Plugs in to the `<vds-scrubber>` component to enable media previews. A preview is essentially
 * a sneak peek of a certain time the user is interacting with on the time slider. You might
 * be familiar with this on YouTube when hovering over the scrubber, and seeing a square preview
 * above the timeline displaying an frame/image of the video at that hovered time.
 *
 * This element renders a track for the preview element to run along. There's a track fill
 * element that will fill the track up to the part of the track being interacted with. You can
 * turn this off by setting the `noTrackFill` property or `no-track-fill` attribute.
 *
 * ## Previews
 *
 * You can pass in a preview to be shown while the user is interacting (hover/drag) with the
 * scrubber by passing an element into the default `slot`.
 *
 * You need to do the following on your root preview element:
 *
 * - Expect that your root preview element will be positioned absolutely.
 * - Set the `bottom` CSS property on it to adjust it to the desired position above the slider.
 * - Create CSS styles for when it has a hidden attribute (`.preview[hidden] {}`).
 *
 * The Scrubber will automatically do the following to the root preview element passed in:
 *
 * - Set the `position` to `absolute`.
 * - Set a `hidden` attribute when it should be hidden (it's left to you to hide it with CSS).
 * - Update the `translateX()` CSS property to position the preview accordingly.
 *
 * ### How do I get the current preview time?
 *
 * You can either listen to `vds-scrubber-preview-time-update` event on this component, or you can
 * use the `scrubberPreviewContext`.
 *
 * For styling you have access to the `--vds-scrubber-preview-time` CSS property which contains
 * the current time in seconds the user is previewing. There's also the `--vds-media-duration`
 * property if needed.
 *
 * @tagname vds-scrubber-preview
 * @cssprop --vds-scrubber-preview-track-height - The height of the preview track (defaults to `--vds-slider-track-height`).
 * @cssprop --vds-scrubber-preview-track-fill-bg - The background color of the track fill (defaults to `#212121`).
 * @csspart track - The element that acts as a path that the preview travels along.
 * @csspart track-fill - The element that fills the track up to the point being previewed.
 * @slot Used to pass in the element that will be displayed on preview.
 * @slot track - Used to pass content into the track element.
 * @slot track-fill - Used to pass content into the track fill element.
 * @example
 * ```html
 * <vds-scrubber>
 *   <vds-scrubber-preview>
 *     <div class="preview"></div>
 *   </vds-scrubber-preview>
 * </vds-scrubber>
 * ```
 * @example
 * ```css
 * .preview {
 *   bottom: 24px;
 *   opacity: 1;
 *   transition: opacity 0.2s ease-in;
 * }
 *
 * .preview[hidden] {
 *   display: block;
 *   opacity: 0;
 * }
 * ```
 */
@discover('vds-scrubber-preview-connect')
export class ScrubberPreviewElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [scrubberPreviewElementStyles];
  }

  static get parts(): string[] {
    return ['track', 'track-fill'];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  protected readonly ctx = provideContextRecord(this, scrubberPreviewContext);

  /**
   * Whether the preview is hidden.
   */
  @property({ type: Boolean, reflect: true })
  override hidden = false;

  /**
   * Whether the preview is disabled.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Whether the preview track fill should be NOT be rendered.
   */
  @property({ attribute: 'no-track-fill', type: Boolean })
  noTrackFill = false;

  /**
   * Whether the preview passed in should NOT be clamped to the host element edges.
   */
  @property({ attribute: 'no-clamp', type: Boolean })
  noClamp = false;

  @state()
  @consumeContext(mediaContext.duration, { transform: (d) => (d >= 0 ? d : 0) })
  protected _mediaDuration = 0;

  @state()
  @consumeContext(scrubberContext.dragging)
  protected _isDragging = scrubberContext.dragging.initialValue;

  @state()
  @consumeContext(scrubberContext.interacting)
  protected _isInteracting = scrubberContext.interacting.initialValue;

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override update(changedProperties: PropertyValues) {
    if (changedProperties.has('_mediaDuration')) {
      this.style.setProperty(
        '--vds-media-duration',
        String(this._mediaDuration)
      );
    }

    if (changedProperties.has('hidden') && this.hidden) {
      this.hidePreview();
    }

    if (changedProperties.has('disabled') && this.disabled) {
      this.hidePreview();
    }

    super.update(changedProperties);
  }

  protected override render(): TemplateResult {
    return html`${this._renderTrack()}`;
  }

  // -------------------------------------------------------------------------------------------
  // Track Fill
  // -------------------------------------------------------------------------------------------

  protected readonly _trackRef = createRef<HTMLDivElement>();

  /**
   * Returns the underlying track element (`<div>`).
   */
  get trackElement() {
    return this._trackRef.value;
  }

  protected _renderTrack(): TemplateResult {
    return html`
      <div
        id="track"
        part="track"
        ?hidden=${this.hidden || this.disabled}
        ${ref(this._trackRef)}
      >
        ${this._renderPreviewSlot()}${this._renderTrackFill()}${this._renderTrackSlot()}
      </div>
    `;
  }

  protected _renderTrackSlot(): TemplateResult {
    return html`<slot name="track"></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Track Fill
  // -------------------------------------------------------------------------------------------

  protected readonly _trackFillRef = createRef<HTMLDivElement>();

  /**
   * Returns the underlying track fill element (`<div>`). This will be `undefined` if the
   * `noTrackFill` property or `no-track-fill` attribute is `true`.
   */
  get trackFillElement() {
    return this._trackFillRef.value;
  }

  protected _renderTrackFill(): TemplateResult {
    if (this.noTrackFill) return html``;

    return html`
      <div
        id="track-fill"
        part="track-fill"
        ?hidden=${!this._isInteracting}
        ${ref(this._trackFillRef)}
      >
        ${this._renderTrackFillSlot()}
      </div>
    `;
  }

  protected _renderTrackFillSlot(): TemplateResult {
    return html`<slot name="track-fill"></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Preview
  // -------------------------------------------------------------------------------------------

  protected _previewSlotElement: HTMLElement | undefined;

  /**
   * The element passed in to the `preview` slot.
   */
  get previewSlotElement() {
    return this._previewSlotElement;
  }

  /**
   * Whether the current slotted preview element is hidden.
   */
  get isPreviewHidden() {
    return this.previewSlotElement?.hasAttribute('hidden') ?? true;
  }

  protected _renderPreviewSlot(): TemplateResult {
    return html` <slot @slotchange="${this._handlePreviewSlotChange}"></slot> `;
  }

  protected _handlePreviewSlotChange() {
    this._previewSlotElement = getSlottedChildren(this)[0] as HTMLElement;

    if (!isNil(this.previewSlotElement)) {
      this.previewSlotElement.style.position = 'absolute';
      this.previewSlotElement.style.left = '0';
      this.previewSlotElement.style.willChange = 'transform';
      this.hidePreview();
    }
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  protected _showPreviewTimeout: number | undefined;

  /**
   * Show the slotted preview element.
   *
   * @param event Original event that triggered this action (if any).
   */
  showPreview(event?: Event) {
    window.clearTimeout(this._showPreviewTimeout);

    if (
      isNil(this.previewSlotElement) ||
      this.disabled ||
      !this._isInteracting ||
      (this._isInteracting && !this.isPreviewHidden)
    ) {
      return;
    }

    this._showPreviewTimeout = window.setTimeout(
      async () => {
        this.ctx.showing = true;
        this.previewSlotElement?.removeAttribute('hidden');

        await raf();

        if (isPointerEvent(event)) {
          await this.updatePreviewPosition(event);
        }

        await this.updateComplete;

        this.setAttribute('previewing', '');
        this.dispatchEvent(
          vdsEvent('vds-scrubber-preview-show', { originalEvent: event })
        );
      },
      this._isDragging ? 150 : 0
    );

    this.requestUpdate();
  }

  /**
   * Hide the slotted preview element.
   *
   * @param event - Original event that triggered this action (if any).
   */
  async hidePreview(event?: Event): Promise<void> {
    window.clearTimeout(this._showPreviewTimeout);

    if (this.isPreviewHidden) {
      return;
    }

    if (isPointerEvent(event)) {
      this.updatePreviewPosition(event);
      await this.updateComplete;
    }

    this._dispatchPreviewTimeUpdate.cancel();

    this.ctx.showing = false;
    this.removeAttribute('previewing');
    this.previewSlotElement?.setAttribute('hidden', '');
    this.dispatchEvent(
      vdsEvent('vds-scrubber-preview-hide', { originalEvent: event })
    );
    this.requestUpdate();
  }

  protected readonly _dispatchPreviewTimeUpdate = rafThrottle(
    (originalEvent: Event) => {
      if (!this._isInteracting) return;

      this.dispatchEvent(
        vdsEvent('vds-scrubber-preview-time-update', {
          detail: this.ctx.time,
          originalEvent
        })
      );
    }
  );

  protected _updatePreviewTime(time: number, event: Event) {
    this.ctx.time = clampNumber(0, round(time, 5), this._mediaDuration);
    this.style.setProperty(
      '--vds-scrubber-preview-time',
      String(this.ctx.time)
    );
    this._dispatchPreviewTimeUpdate(event);
  }

  /**
   * @param thumbPosition - `pointerEvent.clientX`
   */
  protected _calcPercentageOfTrackAtThumbPosition(
    thumbPosition: number
  ): number {
    if (isNil(this.trackElement)) return 0;
    const trackRect = this.trackElement.getBoundingClientRect();
    const percentage =
      (100 / trackRect.width) * (thumbPosition - trackRect.left);
    return clampNumber(0, percentage, 100);
  }

  /**
   * @param percentage - the percentage of the track to position the preview at.
   */
  protected _calcPreviewXPosition(percentage: number): number {
    if (isNil(this.previewSlotElement) || isNil(this.trackElement)) return 0;

    const { width: trackWidth } = this.trackElement.getBoundingClientRect();
    const { width: previewWidth } =
      this.previewSlotElement.getBoundingClientRect();

    const left = (percentage / 100) * trackWidth - previewWidth / 2;
    const rightLimit = trackWidth - previewWidth;

    return this.noClamp ? left : clampNumber(0, left, rightLimit);
  }

  protected _previewPositionRafId = 0;

  /**
   * Updates the slotted preview element position given a `PointerEvent`, or `VdsCustomEvent` with
   * an `originalEvent` property referencing a `PointerEvent`.
   *
   * @param event
   */
  async updatePreviewPosition(event: PointerEvent | VdsEvent): Promise<void> {
    window.cancelAnimationFrame(this._previewPositionRafId);

    this._previewPositionRafId = await raf(() => {
      const pointerEvent = isVdsEvent(event) ? event.originalEvent : event;

      if (!isPointerEvent(pointerEvent)) return;

      const percent = this._calcPercentageOfTrackAtThumbPosition(
        pointerEvent.clientX
      );

      const time = (percent / 100) * this._mediaDuration;

      this._updatePreviewTime(time, event);

      if (!isNil(this.previewSlotElement)) {
        const xPos = this._calcPreviewXPosition(percent);
        this.previewSlotElement.style.transform = `translateX(${xPos}px)`;
      }
    });
  }
}
