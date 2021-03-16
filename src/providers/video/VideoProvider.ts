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
import { VideoProviderProps } from './video.args';
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
 * @csspart root - The component's root element that wraps the video (`<div>`).
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
export class VideoProvider<EngineType = MediaFileProviderEngine>
  extends MediaFileProvider<EngineType>
  implements VideoProviderProps {
  static get styles(): CSSResultArray {
    return [videoStyles];
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.context.viewType = ViewType.Video;
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
        id="root"
        class="${this.getRootClassAttr()}"
        part="${this.getRootPartAttr()}"
        aria-busy="${this.getAriaBusy()}"
        style="${styleMap(this.getRootStyleMap())}"
      >
        ${this.renderVideo()}
        <slot name="ui" @slotchange="${this.handleUiSlotChange}"></slot>
      </div>
    `;
  }

  /**
   * Override this to modify root provider CSS Classes.
   */
  protected getRootClassAttr(): string {
    return '';
  }

  /**
   * Override this to modify root provider CSS Parts.
   */
  protected getRootPartAttr(): string {
    return 'root';
  }

  /**
   * Override this to modify root provider styles.
   */
  protected getRootStyleMap(): StyleInfo {
    return {
      'padding-bottom': this.getAspectRatioPadding(),
    };
  }

  /**
   * Override this to modify video CSS Parts.
   */
  protected getVideoPartAttr(): string {
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
        part="${this.getVideoPartAttr()}"
        src="${ifNonEmpty(this.shouldSetVideoSrcAttr() ? this.src : '')}"
        width="${ifNumber(this.width)}"
        height="${ifNumber(this.height)}"
        poster="${ifDefined(this.poster)}"
        preload="${ifNonEmpty(this.preload)}"
        crossorigin="${ifNonEmpty(this.crossOrigin)}"
        controlslist="${ifNonEmpty(this.controlsList)}"
        ?loop="${this.loop}"
        ?playsinline="${this.playsinline}"
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
    this.context.mediaType = this.getMediaType();
    this.dispatchEvent(
      new MediaTypeChangeEvent({
        detail: this.context.mediaType,
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

  @property()
  poster?: string;

  get currentPoster(): string {
    return this.poster ?? '';
  }

  @property({ attribute: 'controls-list' })
  controlsList?: VideoControlsList;

  @property({ type: Boolean, attribute: 'auto-pip' })
  autoPiP?: boolean;

  @property({ type: Boolean, attribute: 'disable-pip' })
  disablePiP?: boolean;

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
