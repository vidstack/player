import { html } from 'lit';

import { provideContextRecord } from '../../shared/context/index.js';
import { VdsElement } from '../../shared/elements/index.js';
import { bindEventListeners } from '../../shared/events/index.js';
import { storybookAction } from '../../shared/storybook/index.js';
import { isNil } from '../../utils/unit.js';
import {
  MediaContainerConnectEvent,
  MediaContainerElement
} from '../container/index.js';
import { createMediaContextRecord, mediaContext } from '../media.context.js';
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
} from '../media-request.events.js';
import { MediaPluginManager } from '../plugin/index.js';
import {
  MediaProviderConnectEvent,
  MediaProviderElement
} from '../provider/index.js';
import { mediaControllerStyles } from './css.js';

export const MEDIA_CONTROLLER_ELEMENT_TAG_NAME = 'vds-media-controller';

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
 * - Be the host for the plugins manager so that other elements can become plugins to extend
 * its functionality. Attributes, properties (including methods), and events can be forwarded
 * or "bridged" between the plugin and this controller. In other words, the media controller
 * behaves as a proxy for media plugins which are other elements nested inside it.
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
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [mediaControllerStyles];
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  connectedCallback() {
    super.connectedCallback();
    this.bindEventListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Plugin
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   */
  mediaPluginManager = new MediaPluginManager(this);

  // -------------------------------------------------------------------------------------------
  // Event Bindings
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @returns {void}
   */
  bindEventListeners() {
    const events = {
      [MediaContainerConnectEvent.TYPE]: this.handleMediaContainerConnect,
      [MediaProviderConnectEvent.TYPE]: this.handleMediaProviderConnect,
      [MuteRequestEvent.TYPE]: this.handleMuteRequest,
      [UnmuteRequestEvent.TYPE]: this.handleUnmuteRequest,
      [PlayRequestEvent.TYPE]: this.handlePlayRequest,
      [PauseRequestEvent.TYPE]: this.handlePauseRequest,
      [SeekRequestEvent.TYPE]: this.handleSeekRequest,
      [VolumeChangeRequestEvent.TYPE]: this.handleVolumeChangeRequest,
      [EnterFullscreenRequestEvent.TYPE]: this.handleEnterFullscreenRequest,
      [ExitFullscreenRequestEvent.TYPE]: this.handleExitFullscreenRequest
    };

    bindEventListeners(this, events, this.disconnectDisposal);
  }

  // -------------------------------------------------------------------------------------------
  // Context
  // -------------------------------------------------------------------------------------------

  /**
   * The media context record. Any property updated inside this object will trigger a context
   * update that will flow down to all consumer components. This record is injected into a
   * a media provider element (see `handleMediaProviderConnect`) as it's responsible for managing
   * it (ie: updating context properties).
   *
   * @readonly
   * @internal Exposed for testing.
   */
  context = provideContextRecord(this, mediaContext);

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
   * @readonly
   * @type {MediaContainerElement | undefined}
   */
  get mediaContainer() {
    return this._mediaContainer;
  }

  /**
   * @protected
   * @param {MediaContainerConnectEvent} event
   * @returns {void}
   */
  handleMediaContainerConnect(event) {
    this.handleMediaContainerDisconnect();
    const { container, onDisconnect } = event.detail;
    this._mediaContainer = container;
    onDisconnect(this.handleMediaContainerDisconnect.bind(this));
  }

  /**
   * @protected
   * @returns {void}
   */
  handleMediaContainerDisconnect() {
    this._mediaContainer = undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Media Provider
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {MediaProviderElement | undefined}
   */
  _mediaProvider;

  /**
   * The current media provider that belongs to this controller. Defaults to `undefined` if there
   * is none.
   *
   * @readonly
   * @type {MediaProviderElement | undefined}
   */
  get mediaProvider() {
    return this._mediaProvider;
  }

  /**
   * @protected
   * @param {MediaProviderConnectEvent} event
   * @returns {void}
   */
  handleMediaProviderConnect(event) {
    this.handleMediaProviderDisconnect();

    // Ignore re-dispatched events.
    if (isNil(event.detail?.provider)) return;

    const { provider, onDisconnect } = event.detail;
    this._mediaProvider = provider;
    /**
     * Using type `any` to bypass readonly `context`. We are injecting our context object into the
     * `MediaProviderElement` so it can be managed by it.
     */
    /** @type {any} */ (provider).context = this.context;
    onDisconnect(this.handleMediaProviderDisconnect.bind(this));
  }

  /**
   * @protected
   * @returns {void}
   */
  handleMediaProviderDisconnect() {
    if (!isNil(this.mediaProvider)) {
      /**
       * Using type `any` to bypass readonly `context`. Detach the media context.
       */
      /** @type {any} */ (this.mediaProvider).context =
        createMediaContextRecord();
    }

    this._mediaProvider = undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Media Request Events
  // -------------------------------------------------------------------------------------------

  /**
   * Override this to allow media events to bubble up the DOM.
   *
   * @protected
   * @param {Event} event
   * @returns {void}
   */
  mediaRequestEventGateway(event) {
    event.stopPropagation();
  }

  /**
   * @protected
   * @param {MuteRequestEvent} event
   * @returns {void}
   */
  handleMuteRequest(event) {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.muted = true;
    }
  }

  /**
   * @protected
   * @param {UnmuteRequestEvent} event
   * @returns {void}
   */
  handleUnmuteRequest(event) {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.muted = false;
    }
  }

  /**
   * @protected
   * @param {PlayRequestEvent} event
   * @returns {void}
   */
  handlePlayRequest(event) {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.paused = false;
    }
  }

  /**
   * @protected
   * @param {PauseRequestEvent} event
   * @returns {void}
   */
  handlePauseRequest(event) {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.paused = true;
    }
  }

  /**
   * @protected
   * @param {SeekRequestEvent} event
   * @returns {void}
   */
  handleSeekRequest(event) {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.currentTime = event.detail;
    }
  }

  /**
   * @protected
   * @param {VolumeChangeRequestEvent} event
   * @returns {void}
   */
  handleVolumeChangeRequest(event) {
    this.mediaRequestEventGateway(event);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.volume = event.detail;
    }
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

/**
 * @readonly
 * @type {import('./types').MediaControllerElementStorybookArgTypes}
 */
export const MEDIA_CONTROLLER_ELEMENT_STORYBOOK_ARG_TYPES = {
  onVdsEnterFullscreenRequest: storybookAction(
    EnterFullscreenRequestEvent.TYPE
  ),
  onVdsExitFullscreenRequest: storybookAction(ExitFullscreenRequestEvent.TYPE),
  onVdsMuteRequest: storybookAction(MuteRequestEvent.TYPE),
  onVdsPauseRequest: storybookAction(PauseRequestEvent.TYPE),
  onVdsPlayRequest: storybookAction(PlayRequestEvent.TYPE),
  onVdsSeekingRequest: storybookAction(SeekingRequestEvent.TYPE),
  onVdsSeekRequest: storybookAction(SeekRequestEvent.TYPE),
  onVdsUnmuteRequest: storybookAction(UnmuteRequestEvent.TYPE),
  onVdsVolumeChangeRequest: storybookAction(VolumeChangeRequestEvent.TYPE)
};
