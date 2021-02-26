import {
  CSSResultArray,
  html,
  property,
  PropertyValues,
  TemplateResult,
} from 'lit-element';
import {
  MediaType,
  PlayerState,
  ProviderMediaTypeChangeEvent,
  ProviderViewTypeChangeEvent,
  ViewType,
} from '../../core';
import { MediaFileProvider } from '../file';
import { ifDefined } from 'lit-html/directives/if-defined';
import { AUDIO_EXTENSIONS, VIDEO_EXTENSIONS } from './video.utils';
import { videoStyles } from './video.css';

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
        detail: this.getViewType(),
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
        id="media-element"
        poster="${ifDefined(this.currentPoster)}"
        preload="${ifDefined(this.preload)}"
        crossorigin="${ifDefined(this.crossOrigin)}"
        controlslist="${ifDefined(this.controlsList)}"
        ?autopictureinpicture="${this.autoPiP}"
        ?disablepictureinpicture="${this.disablePiP}"
        ?disableremoteplayback="${this.disableRemotePlayback}"
      >
        ${this.renderContent()}
      </video>
    `;
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  handleLoadedMetadata(originalEvent: Event): void {
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
  currentPoster?: string;

  /**
   * Determines what controls to show on the media element whenever the browser shows its own set
   * of controls (e.g. when the controls attribute is specified).
   *
   * @example 'nodownload nofullscreen noremoteplayback'
   */
  @property({ attribute: 'controls-list' })
  controlsList?: 'nodownload' | 'nofullscreen' | 'noremoteplayback';

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

  getViewType(): PlayerState['viewType'] {
    return ViewType.Video;
  }

  getMediaType(): PlayerState['mediaType'] {
    const currentSrc = this.getCurrentSrc();

    if (AUDIO_EXTENSIONS.test(currentSrc)) {
      return MediaType.Audio;
    }

    if (VIDEO_EXTENSIONS.test(currentSrc)) {
      return MediaType.Video;
    }

    return MediaType.Unknown;
  }

  getPoster(): PlayerState['currentPoster'] {
    return this.currentPoster ?? '';
  }
}
