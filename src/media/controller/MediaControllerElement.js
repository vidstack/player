import { html, LitElement } from 'lit';

import {
  DiscoveryEvent,
  ElementDiscoveryController
} from '../../foundation/elements/index.js';
import { EventListenerController } from '../../foundation/events/index.js';
import { isNil } from '../../utils/unit.js';
import {
  MediaContainerConnectEvent,
  MediaContainerElement
} from '../container/index.js';
import { cloneMediaContextRecord, mediaContext } from '../context.js';
import { ControlsManager, IdleObserver } from '../controls/index.js';
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
  _discoveryController = new ElementDiscoveryController(
    this,
    MediaControllerConnectEvent
  );

  /**
   * @protected
   * @readonly
   */
  _eventListenerController = new EventListenerController(this, {
    [MediaContainerConnectEvent.TYPE]: this._handleMediaContainerConnect,
    [MuteRequestEvent.TYPE]: this._handleMuteRequest,
    [UnmuteRequestEvent.TYPE]: this._handleUnmuteRequest,
    [PlayRequestEvent.TYPE]: this._handlePlayRequest,
    [PauseRequestEvent.TYPE]: this._handlePauseRequest,
    [SeekingRequestEvent.TYPE]: this._handleSeekingRequest,
    [SeekRequestEvent.TYPE]: this._handleSeekRequest,
    [VolumeChangeRequestEvent.TYPE]: this._handleVolumeChangeRequest,
    [EnterFullscreenRequestEvent.TYPE]: this._handleEnterFullscreenRequest,
    [ExitFullscreenRequestEvent.TYPE]: this._handleExitFullscreenRequest
  });

  render() {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * @readonly
   */
  controlsManager = new ControlsManager(this);

  /**
   * @readonly
   */
  idleObserver = new IdleObserver(this);

  /**
   * An immutable snapshot of the current media state.
   *
   * @type {Readonly<import('../../foundation/context').ExtractContextRecordTypes<typeof mediaContext>>}
   */
  get mediaState() {
    return cloneMediaContextRecord(this.ctx);
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
   * @type {MediaContainerElement | undefined}
   */
  get mediaContainer() {
    return this._mediaContainer;
  }

  /**
   * @protected
   * @param {MediaContainerConnectEvent} event
   */
  _handleMediaContainerConnect(event) {
    event.stopPropagation();
    this._handleMediaContainerDisconnect();
    const { element, onDisconnect } = event.detail;
    this._mediaContainer = element;
    onDisconnect(this._handleMediaContainerDisconnect.bind(this));
  }

  /**
   * @protected
   */
  _handleMediaContainerDisconnect() {
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
  _mediaRequestEventGateway(event) {
    event.stopPropagation();
  }

  /**
   * @protected
   * @param {MuteRequestEvent} event
   */
  _handleMuteRequest(event) {
    this._mediaRequestEventGateway(event);
    this.muted = true;
  }

  /**
   * @protected
   * @param {UnmuteRequestEvent} event
   */
  _handleUnmuteRequest(event) {
    this._mediaRequestEventGateway(event);
    this.muted = false;
  }

  /**
   * @protected
   * @param {PlayRequestEvent} event
   */
  _handlePlayRequest(event) {
    this._mediaRequestEventGateway(event);
    this.paused = false;
  }

  /**
   * @protected
   * @param {PauseRequestEvent} event
   */
  _handlePauseRequest(event) {
    this._mediaRequestEventGateway(event);
    this.paused = true;
  }

  /**
   * @protected
   * @param {SeekRequestEvent} event
   */
  _handleSeekingRequest(event) {
    this._mediaRequestEventGateway(event);
    this.currentTime = event.detail;
  }

  /**
   * @protected
   * @param {SeekRequestEvent} event
   */
  _handleSeekRequest(event) {
    this._mediaRequestEventGateway(event);
    this.currentTime = event.detail;
  }

  /**
   * @protected
   * @param {VolumeChangeRequestEvent} event
   */
  _handleVolumeChangeRequest(event) {
    this._mediaRequestEventGateway(event);
    this.volume = event.detail;
  }

  /**
   * @protected
   * @param {EnterFullscreenRequestEvent} event
   * @returns {Promise<void>}
   */
  async _handleEnterFullscreenRequest(event) {
    this._mediaRequestEventGateway(event);
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
  async _handleExitFullscreenRequest(event) {
    this._mediaRequestEventGateway(event);
    if (!isNil(this.mediaContainer)) {
      await this.mediaContainer.exitFullscreen();
    } else if (!isNil(this.mediaProvider)) {
      await this.mediaProvider.exitFullscreen();
    }
  }
}
