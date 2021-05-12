import { CSSResultGroup, html, PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators';
import { ifDefined } from 'lit/directives/if-defined';

import {
  MediaType,
  VdsMediaTypeChangeEvent,
  VdsViewTypeChangeEvent,
  ViewType,
} from '../../core';
import { ifNonEmpty } from '../../shared/directives/if-non-empty';
import { ifNumber } from '../../shared/directives/if-number';
import { Html5MediaElement, Html5MediaElementEngine } from '../html5';
import { VideoFullscreenController } from './fullscreen';
import {
  VideoPresentationController,
  VideoPresentationControllerHost,
} from './presentation';
import { videoElementStyles } from './video.css';
import { VideoElementProps } from './video.types';
import { AUDIO_EXTENSIONS, VIDEO_EXTENSIONS } from './video.utils';

/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element.
 *
 * @tagname vds-video
 *
 * @slot Used to pass in `<source>`/`<track>` elements to the underlying HTML5 media player.
 * @slot ui - Used to pass in `<vds-ui>` to customize the player user interface.
 *
 * @csspart root - The component's root element that wraps the video (`<div>`).
 * @csspart video - The video element (`<video>`).
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
export class VideoElement<EngineType = Html5MediaElementEngine>
  extends Html5MediaElement<EngineType>
  implements VideoElementProps, VideoPresentationControllerHost {
  protected mediaEl?: HTMLVideoElement;

  static get styles(): CSSResultGroup {
    return [videoElementStyles];
  }

  static get parts(): string[] {
    return ['root', 'video'];
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.context.viewType = ViewType.Video;
    this.dispatchEvent(
      new VdsViewTypeChangeEvent({
        detail: ViewType.Video,
      }),
    );
  }

  firstUpdated(changedProps: PropertyValues): void {
    this.mediaEl = this.shadowRoot?.querySelector('video') as HTMLVideoElement;
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
        ?autoplay="${this.autoplay}"
        ?loop="${this.loop}"
        ?playsinline="${this.playsinline}"
        ?controls="${this.controls}"
        ?autopictureinpicture="${this.autoPiP}"
        ?disablepictureinpicture="${this.disablePiP}"
        ?disableremoteplayback="${this.disableRemotePlayback}"
        .defaultMuted="${this.defaultMuted ?? this.muted}"
        .defaultPlaybackRate="${this.defaultPlaybackRate ?? 1}"
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
      new VdsMediaTypeChangeEvent({
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
  get poster(): string {
    return this.context.currentPoster;
  }

  set poster(newPoster: string) {
    this.contextQueue.queue('currentPoster', () => {
      this.context.currentPoster = newPoster;
      this.requestUpdate();
    });
  }

  @property({ type: Boolean, attribute: 'autopictureinpicture' })
  autoPiP?: boolean;

  @property({ type: Boolean, attribute: 'disablepictureinpicture' })
  disablePiP?: boolean;

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

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  get videoElement(): HTMLVideoElement | undefined {
    return this.mediaEl;
  }

  presentationController = new VideoPresentationController(this);

  fullscreenController = new VideoFullscreenController(
    this,
    this.screenOrientationController,
    this.presentationController,
  );
}
