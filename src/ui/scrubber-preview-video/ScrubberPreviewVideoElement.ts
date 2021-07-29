import {
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult
} from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

import { watchContext } from '../../base/context';
import { ifNonEmpty } from '../../base/directives';
import { redispatchEvent } from '../../base/events';
import { scrubberPreviewContext } from '../scrubber-preview';
import { scrubberPreviewVideoElementStyles } from './styles';

export const SCRUBBER_PREVIEW_VIDEO_ELEMENT_TAG_NAME =
  'vds-scrubber-preview-video';

/**
 * Used to load a low-resolution video to be displayed when the user is hovering or dragging
 * the scrubber thumb. The point at which they're hovering or dragging is the preview time position.
 * The video will automatically be updated to match, so ensure it's of the same length as the
 * original.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `video-can-play`: Applied when the video is ready for playback.
 * - `video-error`: Applied when a media error has been encountered.
 *
 * 💡 The `canplay` and `error` events are re-dispatched by this element for you to listen to if
 * needed.
 *
 * @tagname vds-scrubber-preview-video
 * @csspart video
 * @example
 * ```html
 * <vds-scrubber>
 *   <vds-scrubber-preview>
 *     <vds-scrubber-preview-video
 *       src="/my-low-res-video.mp4"
 *     ></vds-scrubber-preview-video>
 *   </vds-scrubber-preview>
 * </vds-scrubber>
 * ```
 * @example
 * ```css
 * vds-scrubber-preview-video {
 *   bottom: 56px;
 * }
 *
 * vds-scrubber-preview-video::part(video) {
 *   max-width: 168px;
 * }
 * ```
 */
export class ScrubberPreviewVideoElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [scrubberPreviewVideoElementStyles];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The URL of a media resource to use.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src
   */
  @property()
  src: string | undefined;

  protected readonly _videoRef = createRef<HTMLVideoElement>();

  /**
   * The underlying `<video>` element.
   */
  get videoElement() {
    return this._videoRef.value;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  override connectedCallback() {
    super.connectedCallback();
  }

  override willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('src')) {
      this._canPlay = false;
      this._hasError = false;
      this.removeAttribute('video-can-play');
      this.removeAttribute('video-error');
    }

    super.willUpdate(changedProperties);
  }

  protected override render(): TemplateResult {
    return this._renderVideo();
  }

  protected _renderVideo(): TemplateResult {
    return html`
      <video
        part="video"
        muted
        preload="metadata"
        src=${ifNonEmpty(this.src)}
        @canplay=${this._handleCanPlay}
        @error=${this._handleError}
        ${ref(this._videoRef)}
      ></video>
    `;
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  @state()
  protected _canPlay = false;

  protected _handleCanPlay(event: Event) {
    this._canPlay = true;
    this.setAttribute('video-can-play', '');
    redispatchEvent(this, event);
  }

  @state()
  protected _hasError = false;

  protected _handleError(event: Event) {
    this._hasError = true;
    this.setAttribute('video-error', '');
    redispatchEvent(this, event);
  }

  @watchContext(scrubberPreviewContext.time)
  protected _handlePreviewTimeContextUpdate(previewTime: number) {
    if (
      !this._hasError &&
      this._canPlay &&
      this.videoElement!.currentTime !== previewTime
    ) {
      this.videoElement!.currentTime = previewTime;
    }
  }
}
