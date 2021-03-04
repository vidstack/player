import {
  CSSResultArray,
  html,
  property,
  PropertyValues,
  TemplateResult,
} from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import { StyleInfo, styleMap } from 'lit-html/directives/style-map';

import {
  MediaType,
  MediaTypeChangeEvent,
  ViewType,
  ViewTypeChangeEvent,
} from '../../core';
import { ifNonEmpty } from '../../shared/directives/if-non-empty';
import { ifNumber } from '../../shared/directives/if-number';
import { MediaFileProvider, MediaFileProviderEngine } from '../file';
import { videoStyles } from './video.css';
import { VideoControlsList } from './video.types';
import { AUDIO_EXTENSIONS, VIDEO_EXTENSIONS } from './video.utils';

/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element.
 *
 * ## Tag
 *
 * @tagname vds-video
 *
 * ## Slots
 *
 * @slot Used to pass in `<source>`/`<track>` elements to the underlying HTML5 media player.
 * @slot ui - Used to pass in `<vds-ui>` to customize the player user interface.
 *
 * ## CSS Parts
 *
 * @csspart root - The root component element that wraps the video (`<div>`).
 * @csspart video - The video element (`<video>`).
 *
 * ## Examples
 *
 * @example
 * ```html
 * <vds-video src="/media/video.mp4" poster="/media/poster.png">
 *   <!-- ... -->
 * </vds-video>
 * ```
 *
 * @example
 * ```html
 *  <vds-video poster="/media/poster.png">
 *    <source src="/media/video.mp4" type="video/mp4" />
 *    <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" label="English" />
 *    <vds-ui slot="ui">
 *      <!-- ... -->
 *    </vds-ui>
 *  </vds-video>
 * ```
 */
export class VideoProvider<
  EngineType = MediaFileProviderEngine
> extends MediaFileProvider<EngineType> {
  static get styles(): CSSResultArray {
    return [videoStyles];
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.dispatchEvent(
      new ViewTypeChangeEvent({
        detail: ViewType.Video,
      }),
    );
  }

  firstUpdated(changedProps: PropertyValues): void {
    this.mediaEl = this.shadowRoot?.querySelector('video') as HTMLMediaElement;
    super.firstUpdated(changedProps);
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  render(): TemplateResult {
    return html`
      <div
        class="${this.buildRootClassAttr()}"
        part="${this.buildRootPartAttr()}"
        aria-busy="${this.getAriaBusy()}"
        style="${styleMap(this.buildRootStyleMap())}"
      >
        ${this.renderVideo()}
        <slot name="ui" @slotchange="${this.handleUiSlotChange}"></slot>
      </div>
    `;
  }

  /**
   * Override this to modify root provider CSS Classes.
   */
  protected buildRootClassAttr(): string {
    return 'root';
  }

  /**
   * Override this to modify root provider CSS Parts.
   */
  protected buildRootPartAttr(): string {
    return 'root';
  }

  /**
   * Override this to modify root provider styles.
   */
  protected buildRootStyleMap(): StyleInfo {
    return {
      'padding-bottom': this.getAspectRatioPadding(),
    };
  }

  /**
   * Override this to modify video CSS Parts.
   */
  protected buildVideoPartAttr(): string {
    return 'video';
  }

  /**
   * Can be used by attaching engine such as `hls.js` to prevent src attr being set on
   * `<video>` element.
   */
  protected shouldSetVideoSrcAttr(): boolean {
    return true;
  }

  protected renderVideo(): TemplateResult {
    return html`
      <video
        part="${this.buildVideoPartAttr()}"
        src="${ifNonEmpty(this.shouldSetVideoSrcAttr() ? this.src : '')}"
        width="${ifNumber(this.width)}"
        height="${ifNumber(this.height)}"
        poster="${ifDefined(this.poster)}"
        preload="${ifNonEmpty(this.preload)}"
        crossorigin="${ifNonEmpty(this.crossOrigin)}"
        controlslist="${ifNonEmpty(this.controlsList)}"
        ?controls="${this.controls}"
        ?autopictureinpicture="${this.autoPiP}"
        ?disablepictureinpicture="${this.disablePiP}"
        ?disableremoteplayback="${this.disableRemotePlayback}"
      >
        ${this.renderMediaContent()}
      </video>
    `;
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected handleLoadedMetadata(originalEvent: Event): void {
    this.dispatchEvent(
      new MediaTypeChangeEvent({
        detail: this.getMediaType(),
        originalEvent,
      }),
    );

    super.handleLoadedMetadata(originalEvent);
  }

  /**
   * Override to listen to slot changes.
   */
  protected handleUiSlotChange(): void {
    // no-op
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * A URL for an image to be shown while the video is downloading. If this attribute isn't
   * specified, nothing is displayed until the first frame is available, then the first frame is
   * shown as the poster frame.
   */
  @property()
  poster?: string;

  get currentPoster(): string {
    return this.poster ?? '';
  }

  /**
   * Determines what controls to show on the media element whenever the browser shows its own set
   * of controls (e.g. when the controls attribute is specified).
   *
   * @example 'nodownload nofullscreen noremoteplayback'
   */
  @property({ attribute: 'controls-list' })
  controlsList?: VideoControlsList;

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Whether the browser should automatically toggle picture-in-picture mode as
   * the user switches back and forth between this document and another document or application.
   */
  @property({ type: Boolean, attribute: 'auto-pip' })
  autoPiP?: boolean;

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Prevents the browser from suggesting a picture-in-picture context menu or
   * to request picture-in-picture automatically in some cases.
   */
  @property({ type: Boolean, attribute: 'disable-pip' })
  disablePiP?: boolean;

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Whether to disable the capability of remote playback in devices that are
   * attached using wired (HDMI, DVI, etc.) and wireless technologies (Miracast, Chromecast,
   * DLNA, AirPlay, etc).
   */
  @property({ type: Boolean, attribute: 'disable-remote-playback' })
  disableRemotePlayback?: boolean;

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  protected getMediaType(): MediaType {
    if (AUDIO_EXTENSIONS.test(this.currentSrc)) {
      return MediaType.Audio;
    }

    if (VIDEO_EXTENSIONS.test(this.currentSrc)) {
      return MediaType.Video;
    }

    return MediaType.Unknown;
  }
}
