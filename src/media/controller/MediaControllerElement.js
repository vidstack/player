import { html, LitElement } from 'lit';

import {
  DiscoveryEvent,
  ElementDiscoveryController
} from '../../foundation/elements/index.js';
import { EventListenerController } from '../../foundation/events/index.js';
import { storybookAction } from '../../foundation/storybook/index.js';
import { isNil } from '../../utils/unit.js';
import {
  MediaContainerConnectEvent,
  MediaContainerElement
} from '../container/index.js';
import {
  ControlsChangeEvent,
  ControlsManager,
  IdleChangeEvent,
  IdleObserver
} from '../controls/index.js';
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
} from '../request.events.js';
import { mediaControllerStyles } from './styles.js';
import { WithMediaProviderBridge } from './WithMediaProviderBridge.js';

export const MEDIA_CONTROLLER_ELEMENT_TAG_NAME = 'vds-media-controller';

/**
 * Fired when the media controller connects to the DOM.
 *
 * @bubbles
 * @composed
 * @augments {DiscoveryEvent<MediaControllerElement>}
 */
export class MediaControllerConnectEvent extends DiscoveryEvent {
  /** @readonly */
  static TYPE = 'vds-media-controller-connect';
}

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
export class MediaControllerElement extends WithMediaProviderBridge(
  LitElement
) {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [mediaControllerStyles];
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   */
  discoveryController = new ElementDiscoveryController(
    this,
    MediaControllerConnectEvent
  );

  /**
   * @protected
   * @readonly
   */
  eventListenerController = new EventListenerController(this, {
    [MediaContainerConnectEvent.TYPE]: this.handleMediaContainerConnect,
    [MuteRequestEvent.TYPE]: this.handleMuteRequest,
    [UnmuteRequestEvent.TYPE]: this.handleUnmuteRequest,
    [PlayRequestEvent.TYPE]: this.handlePlayRequest,
    [PauseRequestEvent.TYPE]: this.handlePauseRequest,
    [SeekRequestEvent.TYPE]: this.handleSeekRequest,
    [VolumeChangeRequestEvent.TYPE]: this.handleVolumeChangeRequest,
    [EnterFullscreenRequestEvent.TYPE]: this.handleEnterFullscreenRequest,
    [ExitFullscreenRequestEvent.TYPE]: this.handleExitFullscreenRequest
  });

  render() {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Controls Manager
  // -------------------------------------------------------------------------------------------

  /**
   * @readonly
   */
  controlsManager = new ControlsManager(this);

  /**
   * @readonly
   */
  idleObserver = new IdleObserver(this);

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
   * @type {MediaContainerElement | undefined}
   */
  get mediaContainer() {
    return this._mediaContainer;
  }

  /**
   * @protected
   * @param {MediaContainerConnectEvent} event
   */
  handleMediaContainerConnect(event) {
    event.stopPropagation();
    this.handleMediaContainerDisconnect();
    const { element, onDisconnect } = event.detail;
    this._mediaContainer = element;
    onDisconnect(this.handleMediaContainerDisconnect.bind(this));
  }

  /**
   * @protected
   */
  handleMediaContainerDisconnect() {
    this._mediaContainer = undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Media Request Events
  // -------------------------------------------------------------------------------------------

  /**
   * Override this to allow media events to bubble up the DOM.
   *
   * @protected
   * @param {Event} event
   */
  mediaRequestEventGateway(event) {
    event.stopPropagation();
  }

  /**
   * @protected
   * @param {MuteRequestEvent} event
   */
  handleMuteRequest(event) {
    this.mediaRequestEventGateway(event);
    this.muted = true;
  }

  /**
   * @protected
   * @param {UnmuteRequestEvent} event
   */
  handleUnmuteRequest(event) {
    this.mediaRequestEventGateway(event);
    this.muted = false;
  }

  /**
   * @protected
   * @param {PlayRequestEvent} event
   */
  handlePlayRequest(event) {
    this.mediaRequestEventGateway(event);
    this.paused = false;
  }

  /**
   * @protected
   * @param {PauseRequestEvent} event
   */
  handlePauseRequest(event) {
    this.mediaRequestEventGateway(event);
    this.paused = true;
  }

  /**
   * @protected
   * @param {SeekRequestEvent} event
   */
  handleSeekRequest(event) {
    this.mediaRequestEventGateway(event);
    this.currentTime = event.detail;
  }

  /**
   * @protected
   * @param {VolumeChangeRequestEvent} event
   */
  handleVolumeChangeRequest(event) {
    this.mediaRequestEventGateway(event);
    this.volume = event.detail;
  }

  /**
   * @protected
   * @param {EnterFullscreenRequestEvent} event
   * @returns {Promise<void>}
   */
  async handleEnterFullscreenRequest(event) {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaContainer)) {
      await this.mediaContainer.requestFullscreen();
    } else if (!isNil(this.mediaProvider)) {
      await this.mediaProvider.requestFullscreen();
    }
  }

  /**
   * @protected
   * @param {ExitFullscreenRequestEvent} event
   * @returns {Promise<void>}
   */
  async handleExitFullscreenRequest(event) {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaContainer)) {
      await this.mediaContainer.exitFullscreen();
    } else if (!isNil(this.mediaProvider)) {
      await this.mediaProvider.exitFullscreen();
    }
  }
}

export const MEDIA_CONTROLLER_ELEMENT_STORYBOOK_ARG_TYPES = {
  onControlsChange: storybookAction(ControlsChangeEvent.TYPE),
  onEnterFullscreenRequest: storybookAction(EnterFullscreenRequestEvent.TYPE),
  onExitFullscreenRequest: storybookAction(ExitFullscreenRequestEvent.TYPE),
  onIdleChange: storybookAction(IdleChangeEvent.TYPE),
  onMuteRequest: storybookAction(MuteRequestEvent.TYPE),
  onPauseRequest: storybookAction(PauseRequestEvent.TYPE),
  onPlayRequest: storybookAction(PlayRequestEvent.TYPE),
  onSeekingRequest: storybookAction(SeekingRequestEvent.TYPE),
  onSeekRequest: storybookAction(SeekRequestEvent.TYPE),
  onUnmuteRequest: storybookAction(UnmuteRequestEvent.TYPE),
  onVolumeChangeRequest: storybookAction(VolumeChangeRequestEvent.TYPE)
};
