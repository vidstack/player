import clsx from 'clsx';
import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

import { consumeContext } from '../../base/context';
import { discover, DiscoveryEvent } from '../../base/elements';
import { eventListener } from '../../base/events';
import {
  FullscreenChangeEvent,
  FullscreenController
} from '../../base/fullscreen';
import { ScreenOrientationController } from '../../base/screen-orientation';
import { getSlottedChildren } from '../../utils/dom';
import { isNil, isString, isUndefined } from '../../utils/unit';
import { mediaContext } from '../context';
import {
  MediaProviderConnectEvent,
  MediaProviderElement
} from '../provider/MediaProviderElement';
import { mediaContainerElementStyles } from './styles';

export const MEDIA_CONTAINER_ELEMENT_TAG_NAME = `vds-media-container`;

/**
 * Fired when the media container connects to the DOM.
 *
 * @event
 * @bubbles
 * @composed
 */
export type MediaContainerConnectEvent = DiscoveryEvent<MediaContainerElement>;

/**
 * Simple container for a media provider and the media user interface (UI).
 *
 *
 * @tagname vds-media-container
 * @slot Used to pass in UI components.
 * @slot media - Used to pass in a media provider element.
 * @csspart root - The component's root element (`<div>`).
 * @csspart media-container - The media container element (`<div>`).
 * @example
 * ```html
 * <vds-media-controller>
 *   <vds-media-container>
 *     <vds-video
 *       src="/media/video.mp4"
 *       poster="/media/poster.png"
 *     >
 *       <!-- ... -->
 *     </vds-video>
 *
 *     <vds-media-ui>
 *       <!-- UI components here. -->
 *     </vds-media-ui>
 *   </vds-media-container>
 * </vds-media-controller>
 * ```
 */
@discover('vds-media-container-connect')
export class MediaContainerElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [mediaContainerElementStyles];
  }

  static get parts(): string[] {
    return ['root', 'media'];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The aspect ratio of the container expressed as `width:height` (`16:9`). This is only applied if
   * the `viewType` is `video` and the media is not in fullscreen mode. Defaults to `undefined`.
   */
  @property({ attribute: 'aspect-ratio' }) aspectRatio: string | undefined;

  // -------------------------------------------------------------------------------------------
  // Context
  // -------------------------------------------------------------------------------------------

  @state()
  @consumeContext(mediaContext.canPlay)
  protected _mediaCanPlay = false;

  @state()
  @consumeContext(mediaContext.fullscreen)
  protected _mediaFullscreen = false;

  @state()
  @consumeContext(mediaContext.isVideoView)
  protected _mediaIsVideoView = false;

  // -------------------------------------------------------------------------------------------
  // Render - Root
  // -------------------------------------------------------------------------------------------

  protected readonly _rootRef = createRef<HTMLDivElement>();

  /**
   * The component's root element.
   */
  get rootElement() {
    return this._rootRef.value;
  }

  protected override render(): TemplateResult {
    return html`
      <div
        id="root"
        aria-busy=${this._mediaCanPlay ? 'false' : 'true'}
        class=${clsx({
          'with-aspect-ratio': this._shouldApplyAspectRatio()
        })}
        part="root"
        style=${styleMap({
          'padding-bottom': this._getAspectRatioPadding()
        })}
        ${ref(this._rootRef)}
      >
        ${this._renderRootChildren()}
      </div>
    `;
  }

  /**
   * Override this to modify the content rendered inside the root cotnainer.
   */
  protected _renderRootChildren(): TemplateResult {
    return html`${this._renderMedia()}${this._renderDefaultSlot()}`;
  }

  /**
   * Override this to modify rendering of default slot.
   */
  protected _renderDefaultSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Aspect Ratio
  // -------------------------------------------------------------------------------------------

  protected _shouldApplyAspectRatio(): boolean {
    return (
      this._mediaIsVideoView &&
      !this._mediaFullscreen &&
      isString(this.aspectRatio) &&
      /\d{1,2}:\d{1,2}/.test(this.aspectRatio)
    );
  }

  protected _calcAspectRatio(): number {
    if (!this._shouldApplyAspectRatio()) return NaN;
    const [width, height] = (this.aspectRatio ?? '16:9').split(':');
    return (100 / Number(width)) * Number(height);
  }

  protected _getAspectRatioPadding(maxPadding = '100vh'): string | undefined {
    const ratio = this._calcAspectRatio();
    if (isNaN(ratio)) return undefined;
    return `min(${maxPadding}, ${this._calcAspectRatio()}%)`;
  }

  // -------------------------------------------------------------------------------------------
  // Render - Media
  // -------------------------------------------------------------------------------------------

  protected _mediaProvider: MediaProviderElement | undefined;

  get mediaProvider() {
    return this._mediaProvider;
  }

  protected readonly _mediaContainerRef = createRef<HTMLDivElement>();

  /**
   * The media container element.
   */
  get mediaContainerElement() {
    return this._mediaContainerRef.value;
  }

  protected _renderMedia(): TemplateResult {
    return html`
      <div
        id="media-container"
        part="media-container"
        ${ref(this._mediaContainerRef)}
      >
        ${this._renderMediaSlot()}
      </div>
    `;
  }

  protected _renderMediaSlot(): TemplateResult {
    return html`
      <slot name="media" @slotchange="${this._handleMediaSlotChange}"></slot>
    `;
  }

  protected _hasMediaProviderConnectedViaEvent = false;

  protected _handleMediaSlotChange() {
    if (this._hasMediaProviderConnectedViaEvent) return;

    const mediaProvider = getSlottedChildren(
      this,
      'media'
    )[0] as MediaProviderElement;

    // Not a bulletproof check, but it's a good enough safety-check to warn devs if they pass the
    // wrong element.
    if (!isNil(mediaProvider) && isUndefined(mediaProvider.play)) {
      throw Error('Invalid media element given to `media` slot.');
    }

    this._mediaProvider = mediaProvider;
  }

  @eventListener('vds-media-provider-connect')
  protected _handleMediaProviderConnect(event: MediaProviderConnectEvent) {
    const { element, onDisconnect } = event.detail;

    this._mediaProvider = element;
    this._hasMediaProviderConnectedViaEvent = true;

    onDisconnect(() => {
      this._mediaProvider = undefined;
      this._hasMediaProviderConnectedViaEvent = false;
    });
  }

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  readonly fullscreenController = new FullscreenController(
    this,
    new ScreenOrientationController(this)
  );

  override async requestFullscreen(): Promise<void> {
    if (this._shouldFullscreenMediaProvider()) {
      return this.mediaProvider?.requestFullscreen();
    }

    if (this.fullscreenController.isRequestingNativeFullscreen) {
      return super.requestFullscreen();
    }

    return this.fullscreenController.requestFullscreen();
  }

  async exitFullscreen(): Promise<void> {
    if (this._shouldFullscreenMediaProvider()) {
      return this.mediaProvider?.exitFullscreen();
    }

    return this.fullscreenController.exitFullscreen();
  }

  /**
   * Whether to fallback to attempting fullscreen directly on the media provider if the native
   * Fullscreen API is not available. For example, on iOS Safari this will handle managing
   * fullscreen via the Safari presentation API (see `VideoPresentationController.ts`).
   */
  protected _shouldFullscreenMediaProvider(): boolean {
    return (
      !this.fullscreenController.isSupportedNatively &&
      !isNil(this.mediaProvider)
    );
  }

  @eventListener('vds-fullscreen-change')
  protected _handleFullscreenChange(event: FullscreenChangeEvent): void {
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.ctx.fullscreen = event.detail;
    }
  }
}
