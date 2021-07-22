import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { ifNonEmpty, ifNumber } from '../../foundation/directives/index.js';
import { vdsEvent } from '../../foundation/events/index.js';
import { ViewType } from '../../media/index.js';
import { Html5MediaElement } from '../html5/index.js';
import { VideoFullscreenController } from './fullscreen/index.js';
import { VideoPresentationController } from './presentation/index.js';
import { videoElementStyles } from './styles.js';

export const VIDEO_ELEMENT_TAG_NAME = 'vds-video';

/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element.
 *
 * @tagname vds-video
 * @slot Used to pass in `<source>`/`<track>` elements to the underlying HTML5 media player.
 * @csspart media - The video element (`<video>`).
 * @csspart video - Alias for `media` part.
 * @example
 * ```html
 * <vds-video src="/media/video.mp4" poster="/media/poster.png">
 *   <!-- ... -->
 * </vds-video>
 * ```
 * @example
 * ```html
 * <vds-video poster="/media/poster.png">
 *   <source src="/media/video.mp4" type="video/mp4" />
 *   <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" label="English" />
 * </vds-video>
 * ```
 */
export class VideoElement extends Html5MediaElement {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [videoElementStyles];
  }

  /** @type {string[]} */
  static get parts() {
    return ['root', 'video'];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Whether the browser should automatically toggle picture-in-picture mode as
   * the user switches back and forth between this document and another document or application.
   *
   * @type {boolean | undefined}
   */
  @property({ type: Boolean, attribute: 'autopictureinpicture' })
  autoPiP;

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Prevents the browser from suggesting a picture-in-picture context menu or
   * to request picture-in-picture automatically in some cases.
   *
   * @type {boolean | undefined}
   * @link https://w3c.github.io/picture-in-picture/#disable-pip
   */
  @property({ type: Boolean, attribute: 'disablepictureinpicture' })
  disablePiP;

  /**
   * A URL for an image to be shown while the video is downloading. If this attribute isn't
   * specified, nothing is displayed until the first frame is available, then the first frame is
   * shown as the poster frame.
   *
   * @type {string}
   */
  @property()
  get poster() {
    return this.ctx.currentPoster;
  }

  set poster(newPoster) {
    this._connectedQueue.queue('currentPoster', () => {
      this.ctx.currentPoster = newPoster;
      this.requestUpdate();
    });
  }

  /** @type {HTMLVideoElement} */
  get mediaElement() {
    return /** @type {HTMLVideoElement} */ (this._mediaRef.value);
  }

  get videoElement() {
    return /** @type {HTMLVideoElement} */ (this._mediaRef.value);
  }

  get engine() {
    return this.mediaElement;
  }

  get videoEngine() {
    return this.videoElement;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  connectedCallback() {
    super.connectedCallback();

    this.ctx.viewType = ViewType.Video;
    this.dispatchEvent(
      vdsEvent('vds-view-type-change', {
        detail: ViewType.Video
      })
    );
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  /** @returns {import('lit').TemplateResult} */
  render() {
    return this._renderVideo();
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderVideo() {
    return html`
      <video
        part="${this._getVideoPartAttr()}"
        src="${ifNonEmpty(this._shouldSetVideoSrcAttr() ? this.src : '')}"
        width="${ifNumber(this.width)}"
        height="${ifNumber(this.height)}"
        poster="${ifNonEmpty(this.poster)}"
        preload="${ifNonEmpty(this.preload)}"
        crossorigin="${ifNonEmpty(this.crossOrigin)}"
        controlslist="${ifNonEmpty(this.controlsList)}"
        ?autoplay="${this.autoplay}"
        ?loop="${this.loop}"
        ?playsinline="${this.playsinline}"
        ?controls="${this.controls}"
        ?autopictureinpicture="${this.autoPiP}"
        ?disablepictureinpicture="${this.disablePiP}"
        ?disableremoteplayback="${this.disableRemotePlayback}"
        .defaultMuted="${this.defaultMuted ?? this.muted}"
        .defaultPlaybackRate="${this.defaultPlaybackRate ?? 1}"
        ${ref(this._mediaRef)}
      >
        ${this._renderMediaChildren()}
      </video>
    `;
  }

  /**
   * Override this to modify video CSS Parts.
   *
   * @protected
   * @returns {string}
   */
  _getVideoPartAttr() {
    return 'media video';
  }

  /**
   * Can be used by attaching engine such as `hls.js` to prevent src attr being set on
   * `<video>` element.
   *
   * @protected
   * @returns {boolean}
   */
  _shouldSetVideoSrcAttr() {
    return true;
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  /**
   * Issues an asynchronous request to display the video in picture-in-picture mode.
   *
   * It's not guaranteed that the video will be put into picture-in-picture. If permission to enter
   * that mode is granted, the returned `Promise` will resolve and the video will receive a
   * `enterpictureinpicture` event to let it know that it's now in picture-in-picture.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture
   * @returns {Promise<PictureInPictureWindow>}
   */
  async requestPictureInPicture() {
    return this.videoElement.requestPictureInPicture();
  }

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  presentationController = new VideoPresentationController(this);

  fullscreenController = new VideoFullscreenController(
    this,
    this.screenOrientationController,
    this.presentationController
  );
}
