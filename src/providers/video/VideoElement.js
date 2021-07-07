import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref } from 'lit/directives/ref.js';

import { ifNonEmpty, ifNumber } from '../../foundation/directives/index.js';
import { StorybookControlType } from '../../foundation/storybook/index.js';
import {
  MEDIA_PROVIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  MediaType,
  MediaTypeChangeEvent,
  ViewType,
  ViewTypeChangeEvent
} from '../../media/index.js';
import { Html5MediaElement } from '../html5/index.js';
import { VideoFullscreenController } from './fullscreen/index.js';
import { VideoPresentationController } from './presentation/index.js';
import { videoElementStyles } from './styles.js';

export const VIDEO_ELEMENT_TAG_NAME = 'vds-video';

export const AUDIO_EXTENSIONS =
  /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i;

/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element.
 *
 * @tagname vds-video
 * @slot Used to pass in `<source>`/`<track>` elements to the underlying HTML5 media player.
 * @csspart root - The component's root element that wraps the video (`<div>`).
 * @csspart video - The video element (`<video>`).
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

  constructor() {
    super();

    /**
     * 🧑‍🔬 **EXPERIMENTAL:** Whether the browser should automatically toggle picture-in-picture mode as
     * the user switches back and forth between this document and another document or application.
     *
     * @type {boolean | undefined}
     */
    this.autoPiP;

    /**
     * 🧑‍🔬 **EXPERIMENTAL:** Prevents the browser from suggesting a picture-in-picture context menu or
     * to request picture-in-picture automatically in some cases.
     *
     * @type {boolean | undefined}
     * @link https://w3c.github.io/picture-in-picture/#disable-pip
     */
    this.disablePiP;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /** @type {import('lit').PropertyDeclarations} */
  static get properties() {
    return {
      poster: {},
      autoPiP: { type: Boolean, attribute: 'autopictureinpicture' },
      disablePiP: { type: Boolean, attribute: 'disablepictureinpicture' }
    };
  }

  /**
   * A URL for an image to be shown while the video is downloading. If this attribute isn't
   * specified, nothing is displayed until the first frame is available, then the first frame is
   * shown as the poster frame.
   *
   * @type {string}
   */
  get poster() {
    return this.context.currentPoster;
  }

  set poster(newPoster) {
    this.connectedQueue.queue('currentPoster', () => {
      this.context.currentPoster = newPoster;
      this.requestUpdate();
    });
  }

  /** @type {HTMLVideoElement} */
  get mediaElement() {
    return /** @type {HTMLVideoElement} */ (this.mediaRef.value);
  }

  get videoElement() {
    return /** @type {HTMLVideoElement} */ (this.mediaRef.value);
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

    this.context.viewType = ViewType.Video;
    this.dispatchEvent(
      new ViewTypeChangeEvent({
        detail: ViewType.Video
      })
    );
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  /** @returns {import('lit').TemplateResult} */
  render() {
    return html`
      <div
        id="root"
        class="${this.getRootClassAttr()}"
        part="${this.getRootPartAttr()}"
      >
        ${this.renderVideo()}
      </div>
    `;
  }

  /**
   * Override this to modify root provider CSS Classes.
   *
   * @protected
   * @returns {string}
   */
  getRootClassAttr() {
    return '';
  }

  /**
   * Override this to modify root provider CSS Parts.
   *
   * @protected
   * @returns {string}
   */
  getRootPartAttr() {
    return 'root';
  }

  /**
   * Override this to modify video CSS Parts.
   *
   * @protected
   * @returns {string}
   */
  getVideoPartAttr() {
    return 'video';
  }

  /**
   * Can be used by attaching engine such as `hls.js` to prevent src attr being set on
   * `<video>` element.
   *
   * @protected
   * @returns {boolean}
   */
  shouldSetVideoSrcAttr() {
    return true;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderVideo() {
    return html`
      <video
        part="${this.getVideoPartAttr()}"
        src="${ifNonEmpty(this.shouldSetVideoSrcAttr() ? this.src : '')}"
        width="${ifNumber(this.width)}"
        height="${ifNumber(this.height)}"
        poster="${ifDefined(this.poster)}"
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
        ${ref(this.mediaRef)}
      >
        ${this.renderMediaChildren()}
      </video>
    `;
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @param {Event} event
   */
  handleLoadedMetadata(event) {
    this.context.mediaType = this.getMediaType();
    this.dispatchEvent(
      new MediaTypeChangeEvent({
        detail: this.context.mediaType,
        originalEvent: event
      })
    );

    super.handleLoadedMetadata(event);
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @returns {MediaType}
   */
  getMediaType() {
    if (AUDIO_EXTENSIONS.test(this.currentSrc)) {
      return MediaType.Audio;
    }

    if (VIDEO_EXTENSIONS.test(this.currentSrc)) {
      return MediaType.Video;
    }

    return MediaType.Unknown;
  }

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

export const VIDEO_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...MEDIA_PROVIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  autoPiP: { control: StorybookControlType.Boolean },
  controlsList: { control: StorybookControlType.Text },
  crossOrigin: { control: StorybookControlType.Text },
  defaultMuted: { control: StorybookControlType.Boolean },
  defaultPlaybackRate: { control: StorybookControlType.Number },
  disablePiP: { control: StorybookControlType.Boolean },
  disableRemotePlayback: { control: StorybookControlType.Boolean },
  height: { control: StorybookControlType.Number },
  poster: {
    control: StorybookControlType.Text,
    defaultValue: 'https://media-files.vidstack.io/poster.png'
  },
  preload: { control: StorybookControlType.Text },
  src: {
    control: StorybookControlType.Text,
    defaultValue:
      'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8/medium.mp4'
  },
  srcObject: { control: StorybookControlType.Text },
  width: { control: StorybookControlType.Number }
};
