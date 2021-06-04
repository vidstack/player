import { html } from 'lit';

import { VdsElement } from '../../../shared/elements';
import {
  MediaContainerElement,
  VdsMediaContainerConnectEvent,
} from '../container';
import { mediaContextProviderRecord } from '../media.context';
import {
  VdsEnterFullscreenRequestEvent,
  VdsExitFullscreenRequestEvent,
  VdsMuteRequestEvent,
  VdsPauseRequestEvent,
  VdsPlayRequestEvent,
  VdsSeekRequestEvent,
  VdsUnmuteRequestEvent,
  VdsVolumeChangeRequestEvent,
} from '../media-request.events';
import {
  MediaProviderElement,
  VdsMediaProviderConnectEvent,
} from '../provider';
import { mediaControllerStyles } from './media-controller.css';

/**
 * The media controller acts as a message bus between the media provider and all other
 * components, such as UI components. The two primary responsibilities are:
 *
 * - Provide the media context that is used to pass media state down to components (this
 * context is injected into and managed by the media provider).
 *
 * - Listen for media request events and fulfill them by calling the appropriate props/methods on
 * the current media provider.
 *
 * @tagname vds-media-controller
 *
 * @slot Used to pass in components that use/manage media state.
 *
 * @example
 * ```html
 * <vds-media-controller>
 *   <vds-media-container>
 *     <vds-video
 *       src="/media/video.mp4"
 *       poster="/media/poster.png"
 *       slot="media"
 *     >
 *       <!-- ... -->
 *     </vds-video>
 *
 *     <!-- UI components here. -->
 *   </vds-media-container>
 *
 *   <!-- Other components that use/manage media state here. -->
 * </vds-media-controller>
 * ```
 */
export class MediaControllerElement extends VdsElement {
	/** @type {import('@lit/reactive-element').CSSResultGroup} */
  static get styles() {
    return [mediaControllerStyles];
  }

  // -------------------------------------------------------------------------------------------
  // Context
  // -------------------------------------------------------------------------------------------

  /**
   * The media context record. Any property updated inside this object will trigger a context
   * update that will flow down to all consumer components. This record is consumed by
   * a media provider element as it's responsible for managing it (ie: updating context properties).
   *
   * @readonly
   * @internal Exposed for testing.
   */
  context = mediaContextProviderRecord.provide(this);

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  render() {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Media Container
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {MediaContainerElement | undefined}
   */
  _mediaContainer;

  /**
   * The current media container that belongs to this controller. Defaults to `undefined` if
   * there is none.
   * 
   * @returns {MediaContainerElement | undefined}
   */
  get mediaContainer() {
    return this._mediaContainer;
  }

  @eventListener(VdsMediaContainerConnectEvent.TYPE)
  protected handleMediaContainerConnect(
    e: VdsMediaContainerConnectEvent,
  ): void {
    const { container, onDisconnect } = e.detail;
    this._mediaContainer = container;
    onDisconnect(() => {
      this._mediaContainer = undefined;
    });
  }

  // -------------------------------------------------------------------------------------------
  // Media Provider
  // -------------------------------------------------------------------------------------------

  protected _mediaProvider?: MediaProviderElement;

  /**
   * The current media provider that belongs to this controller. Defaults to `undefined` if there
   * is none.
   */
  get mediaProvider(): MediaProviderElement | undefined {
    return this._mediaProvider;
  }

  @eventListener(VdsMediaProviderConnectEvent.TYPE)
  protected handleMediaProviderConnect(
    event: VdsMediaProviderConnectEvent,
  ): void {
    const { provider, onDisconnect } = event.detail;
    this._mediaProvider = provider;
    onDisconnect(() => {
      this._mediaProvider = undefined;
    });
  }

  // -------------------------------------------------------------------------------------------
  // Media Request Events
  // -------------------------------------------------------------------------------------------

  protected mediaRequestEventGateway(event: Event): void {
    event.stopPropagation();
  }

  @eventListener(VdsMuteRequestEvent.TYPE)
  protected handleMuteRequest(event: VdsMuteRequestEvent): void {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.muted = true;
    }
  }

  @eventListener(VdsUnmuteRequestEvent.TYPE)
  protected handleUnmuteRequest(event: VdsUnmuteRequestEvent): void {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.muted = false;
    }
  }

  @eventListener(VdsPlayRequestEvent.TYPE)
  protected handlePlayRequest(event: VdsPlayRequestEvent): void {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.paused = false;
    }
  }

  @eventListener(VdsPauseRequestEvent.TYPE)
  protected handlePauseRequest(event: VdsPauseRequestEvent): void {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.paused = true;
    }
  }

  @eventListener(VdsSeekRequestEvent.TYPE)
  protected handleSeekRequest(event: VdsSeekRequestEvent): void {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.currentTime = event.detail;
    }
  }

  @eventListener(VdsVolumeChangeRequestEvent.TYPE)
  protected handleVolumeChangeRequest(
    event: VdsVolumeChangeRequestEvent,
  ): void {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.volume = event.detail;
    }
  }

  @eventListener(VdsEnterFullscreenRequestEvent.TYPE)
  protected async handleEnterFullscreenRequest(
    e: VdsEnterFullscreenRequestEvent,
  ): Promise<void> {
    this.mediaRequestEventGateway(e);
    if (!isNil(this.mediaContainer)) {
      await this.mediaContainer.requestFullscreen();
    } else if (!isNil(this.mediaProvider)) {
      await this.mediaProvider.requestFullscreen();
    }
  }

  @eventListener(VdsExitFullscreenRequestEvent.TYPE)
  protected async handleExitFullscreenRequest(
    e: VdsExitFullscreenRequestEvent,
  ): Promise<void> {
    this.mediaRequestEventGateway(e);
    if (!isNil(this.mediaContainer)) {
      await this.mediaContainer.exitFullscreen();
    } else if (!isNil(this.mediaProvider)) {
      await this.mediaProvider.exitFullscreen();
    }
  }
}
