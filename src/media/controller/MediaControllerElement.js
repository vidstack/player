import { html, LitElement } from 'lit';

import { ElementDiscoveryController } from '../../foundation/elements/index.js';
import { EventListenerController } from '../../foundation/events/index.js';
import { isNil } from '../../utils/unit.js';
import { MediaContainerElement } from '../container/index.js';
import { cloneMediaContextRecord, mediaContext } from '../context.js';
import { ControlsManager, IdleObserver } from '../controls/index.js';
import { mediaControllerStyles } from './styles.js';
import { WithMediaProviderBridge } from './WithMediaProviderBridge.js';

export const MEDIA_CONTROLLER_ELEMENT_TAG_NAME = 'vds-media-controller';

/**
 * Fired when the media controller connects to the DOM.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {import('../../foundation/elements').DiscoveryEvent<MediaControllerElement>} MediaControllerConnectEvent
 */

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
  _discoveryController = new ElementDiscoveryController(this, {
    eventType: 'vds-media-controller-connect'
  });

  /**
   * @protected
   * @readonly
   */
  _eventListenerController = new EventListenerController(this, {
    'vds-media-container-connect': this._handleMediaContainerConnect,
    'vds-mute-request': this._handleMuteRequest,
    'vds-unmute-request': this._handleUnmuteRequest,
    'vds-play-request': this._handlePlayRequest,
    'vds-pause-request': this._handlePauseRequest,
    'vds-seeking-request': this._handleSeekingRequest,
    'vds-seek-request': this._handleSeekRequest,
    'vds-volume-change-request': this._handleVolumeChangeRequest,
    'vds-enter-fullscreen-request': this._handleEnterFullscreenRequest,
    'vds-exit-fullscreen-request': this._handleExitFullscreenRequest
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
   * @param {import('../container/MediaContainerElement').MediaContainerConnectEvent} event
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
   * @param {import('../request.events').MuteRequestEvent} event
   */
  _handleMuteRequest(event) {
    this._mediaRequestEventGateway(event);
    this.muted = true;
  }

  /**
   * @protected
   * @param {import('../request.events').UnmuteRequestEvent} event
   */
  _handleUnmuteRequest(event) {
    this._mediaRequestEventGateway(event);
    this.muted = false;
  }

  /**
   * @protected
   * @param {import('../request.events').PlayRequestEvent} event
   */
  _handlePlayRequest(event) {
    this._mediaRequestEventGateway(event);
    this.paused = false;
  }

  /**
   * @protected
   * @param {import('../request.events').PauseRequestEvent} event
   */
  _handlePauseRequest(event) {
    this._mediaRequestEventGateway(event);
    this.paused = true;
  }

  /**
   * @protected
   * @param {import('../request.events').SeekRequestEvent} event
   */
  _handleSeekingRequest(event) {
    this._mediaRequestEventGateway(event);
    this.currentTime = event.detail;
  }

  /**
   * @protected
   * @param {import('../request.events').SeekRequestEvent} event
   */
  _handleSeekRequest(event) {
    this._mediaRequestEventGateway(event);
    this.currentTime = event.detail;
  }

  /**
   * @protected
   * @param {import('../request.events').VolumeChangeRequestEvent} event
   */
  _handleVolumeChangeRequest(event) {
    this._mediaRequestEventGateway(event);
    this.volume = event.detail;
  }

  /**
   * @protected
   * @param {import('../request.events').EnterFullscreenRequestEvent} event
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
   * @param {import('../request.events').ExitFullscreenRequestEvent} event
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
