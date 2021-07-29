import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';

import { ExtractContextRecordTypes } from '../../base/context';
import { discover, DiscoveryEvent } from '../../base/elements';
import { eventListener } from '../../base/events';
import { isNil } from '../../utils/unit';
import {
  MediaContainerConnectEvent,
  MediaContainerElement
} from '../container';
import { cloneMediaContextRecord, mediaContext } from '../context';
import { ControlsManager, IdleObserver } from '../controls';
import {
  EnterFullscreenRequestEvent,
  ExitFullscreenRequestEvent,
  MuteRequestEvent,
  PauseRequestEvent,
  PlayRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent,
  UnmuteRequestEvent,
  VolumeChangeRequestEvent
} from '../request.events';
import { mediaControllerStyles } from './styles';
import { WithMediaProviderBridge } from './WithMediaProviderBridge';

export const MEDIA_CONTROLLER_ELEMENT_TAG_NAME = 'vds-media-controller';

/**
 * Fired when the media controller connects to the DOM.
 *
 * @event
 * @bubbles
 * @composed
 */
export type MediaControllerConnectEvent =
  DiscoveryEvent<MediaControllerElement>;

/**
 * The media controller acts as a message bus between the media provider and all other
 * components, such as UI components. The main responsibilities are:
 *
 * - Provide the media context that is used to pass media state down to components (this
 * context is injected into and managed by the media provider).
 *
 * - Listen for media request events and fulfill them by calling the appropriate props/methods on
 * the current media provider.
 *
 * - Act as a proxy for the connected media provider element. As a proxy it will forward
 * attributes, properties, methods and events to/from the provider.
 *
 * @tagname vds-media-controller
 * @slot Used to pass in components that use/manage media state.
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
 *     <!-- UI components here. -->
 *   </vds-media-container>
 *
 *   <!-- Other components that use/manage media state here. -->
 * </vds-media-controller>
 * ```
 */
@discover('vds-media-controller-connect')
export class MediaControllerElement extends WithMediaProviderBridge(
  LitElement
) {
  static override get styles(): CSSResultGroup {
    return [mediaControllerStyles];
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  readonly controlsManager = new ControlsManager(this);

  readonly idleObserver = new IdleObserver(this);

  /**
   * An immutable snapshot of the current media state.
   */
  get mediaState(): Readonly<ExtractContextRecordTypes<typeof mediaContext>> {
    return cloneMediaContextRecord(this.ctx);
  }

  // -------------------------------------------------------------------------------------------
  // Media Container
  // -------------------------------------------------------------------------------------------

  protected _mediaContainer: MediaContainerElement | undefined;

  /**
   * The current media container that belongs to this controller. Defaults to `undefined` if
   * there is none.
   */
  get mediaContainer() {
    return this._mediaContainer;
  }

  @eventListener('vds-media-container-connect')
  protected _handleMediaContainerConnect(
    event: MediaContainerConnectEvent
  ): void {
    event.stopPropagation();
    this._handleMediaContainerDisconnect();
    const { element, onDisconnect } = event.detail;
    this._mediaContainer = element;
    onDisconnect(this._handleMediaContainerDisconnect.bind(this));
  }

  protected _handleMediaContainerDisconnect(): void {
    this._mediaContainer = undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Media Request Events
  // -------------------------------------------------------------------------------------------

  /**
   * Override this to allow media events to bubble up the DOM.
   *
   * @param event
   */
  protected _mediaRequestEventGateway(event: Event) {
    event.stopPropagation();
  }

  @eventListener('vds-mute-request')
  protected _handleMuteRequest(event: MuteRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this.muted = true;
  }

  @eventListener('vds-unmute-request')
  protected _handleUnmuteRequest(event: UnmuteRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this.muted = false;
  }

  @eventListener('vds-play-request')
  protected _handlePlayRequest(event: PlayRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this.paused = false;
  }

  @eventListener('vds-pause-request')
  protected _handlePauseRequest(event: PauseRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this.paused = true;
  }

  @eventListener('vds-seeking-request')
  protected _handleSeekingRequest(event: SeekingRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this.currentTime = event.detail;
  }

  @eventListener('vds-seek-request')
  protected _handleSeekRequest(event: SeekRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this.currentTime = event.detail;
  }

  @eventListener('vds-volume-change-request')
  protected _handleVolumeChangeRequest(event: VolumeChangeRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this.volume = event.detail;
  }

  @eventListener('vds-enter-fullscreen-request')
  protected async _handleEnterFullscreenRequest(
    event: EnterFullscreenRequestEvent
  ): Promise<void> {
    this._mediaRequestEventGateway(event);
    if (!isNil(this.mediaContainer)) {
      await this.mediaContainer.requestFullscreen();
    } else if (!isNil(this.mediaProvider)) {
      await this.mediaProvider.requestFullscreen();
    }
  }

  @eventListener('vds-exit-fullscreen-request')
  protected async _handleExitFullscreenRequest(
    event: ExitFullscreenRequestEvent
  ): Promise<void> {
    this._mediaRequestEventGateway(event);
    if (!isNil(this.mediaContainer)) {
      await this.mediaContainer.exitFullscreen();
    } else if (!isNil(this.mediaProvider)) {
      await this.mediaProvider.exitFullscreen();
    }
  }
}
