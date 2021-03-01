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
  ProviderMediaTypeChangeEvent,
  ProviderViewTypeChangeEvent,
  ViewType,
} from '../../core';
import { isNumber } from '../../utils';
import { MediaFileProvider } from '../file';
import { videoStyles } from './video.css';
import { VideoControlsList } from './video.types';
import { AUDIO_EXTENSIONS, VIDEO_EXTENSIONS } from './video.utils';

/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element.
 *
 * @example
 * ```html
 * <vds-player>
 *  <vds-video poster="/media/poster.png">
 *    <source src="/media/video.mp4" type="video/mp4" />
 *    <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" label="English" />
 *  </vds-video>
 *   <!-- ... -->
 * </vds-player>
 * ```
 *
 * @tagname vds-video
 *
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export class VideoProvider extends MediaFileProvider {
  public static get styles(): CSSResultArray {
    return [videoStyles];
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.dispatchEvent(
      new ProviderViewTypeChangeEvent({
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

  protected render(): TemplateResult {
    return html`
      <video
        width="${ifDefined(isNumber(this.width) ? this.width : undefined)}"
        poster="${ifDefined(this.poster)}"
        preload="${ifDefined(this.preload)}"
        crossorigin="${ifDefined(this.crossOrigin)}"
        controlslist="${ifDefined(this.controlsList)}"
        ?controls="${this.controls}"
        ?autopictureinpicture="${this.autoPiP}"
        ?disablepictureinpicture="${this.disablePiP}"
        ?disableremoteplayback="${this.disableRemotePlayback}"
        style="${styleMap(this.buildStyleMap())}"
      >
        ${this.renderContent()}
      </video>
    `;
  }

  protected buildStyleMap(): StyleInfo {
    return {
      'padding-bottom': this.getAspectRatioPadding(),
    };
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected handleLoadedMetadata(originalEvent: Event): void {
    this.dispatchEvent(
      new ProviderMediaTypeChangeEvent({
        detail: this.getMediaType(),
        originalEvent,
      }),
    );

    super.handleLoadedMetadata(originalEvent);
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
