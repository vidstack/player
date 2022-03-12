import { ifNonEmpty, redispatchEvent, storeRecordSubscription } from '@vidstack/foundation';
import {
  css,
  type CSSResultGroup,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { sliderStoreContext } from './store.js';

/**
 * Used to load a low-resolution video to be displayed when the user is hovering or dragging
 * the slider. The point at which they're hovering or dragging (`pointerValue`) is the preview
 * time position. The video will automatically be updated to match, so ensure it's of the same
 * length as the original.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `video-can-play`: Applied when the video is ready for playback.
 * - `video-error`: Applied when a media error has been encountered.
 *
 * 💡 The `canplay` and `error` events are re-dispatched by this element for you to listen to if
 * needed.
 *
 * @tagname vds-slider-video
 * @csspart video - The video element.
 * @example
 * ```html
 * <vds-time-slider>
 *  <vds-slider-video
 *    src="/low-res-video.mp4"
 *  ></vds-slider-video>
 * </vds-time-slider>
 * ```
 */
export class SliderVideoElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [
      css`
        :host {
          display: inline-block;
          contain: content;
        }

        :host([hidden]) {
          display: none;
        }

        video {
          display: block;
          width: 100%;
          height: auto;
        }
      `,
    ];
  }

  constructor() {
    super();

    storeRecordSubscription(this, sliderStoreContext, 'pointerValue', ($previewTime) => {
      this._updateCurrentTime($previewTime);
    });
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The URL of a media resource to use.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src
   */
  @property() src: string | undefined;

  protected readonly _videoRef: Ref<HTMLVideoElement> = createRef();

  /**
   * The underlying `<video>` element.
   */
  get videoElement() {
    return this._videoRef.value;
  }

  protected _updateCurrentTime(seconds: number) {
    if (!this.__hasError && this.__canPlay && this.videoElement!.currentTime !== seconds) {
      this.videoElement!.currentTime = seconds;
    }
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  override willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('src')) {
      this.__canPlay = false;
      this.__hasError = false;
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
        playsinline
        preload="auto"
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

  @state() protected __canPlay = false;

  protected async _handleCanPlay(event: Event) {
    this.__canPlay = true;
    this.setAttribute('video-can-play', '');
    redispatchEvent(this, event);
  }

  @state() protected __hasError = false;

  protected _handleError(event: Event) {
    this.__hasError = true;
    this.setAttribute('video-error', '');
    redispatchEvent(this, event);
  }
}
