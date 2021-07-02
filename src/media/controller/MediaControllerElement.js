import { html } from 'lit';

import { provideContextRecord } from '../../foundation/context/index.js';
import { VdsElement } from '../../foundation/elements/index.js';
import {
  bindEventListeners,
  DisposalBin,
  listen,
  redispatchEvent
} from '../../foundation/events/index.js';
import { FullscreenController } from '../../foundation/fullscreen/index.js';
import { RequestQueue } from '../../foundation/queue/index.js';
import { ScreenOrientationController } from '../../foundation/screen-orientation/index.js';
import { storybookAction } from '../../foundation/storybook/index.js';
import {
  getElementAttributes,
  observeAndForwardAttributes
} from '../../utils/dom.js';
import { isFunction, isNil, isNull } from '../../utils/unit.js';
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
import {
  MediaProviderConnectEvent,
  MediaProviderElement
} from '../provider/index.js';
import { FORWARDED_MEDIA_PROVDER_PROPS } from './forward.js';
import { mediaControllerStyles } from './styles.js';

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
 * - Act as a proxy for the connected media provider element. As a proxy it will forward
 * attributes, properties, methods and events to/from the provider.
 *
 * @template {MediaProviderElement} MediaProvider
 * @tagname vds-media-controller
 * @slot Used to pass in components that use/manage media state.
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

  constructor() {
    super();
    this.defineForwardedMediaProviderProperties();
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
  // Event Bindings
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
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
   * @internal
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
    this.handleMediaContainerDisconnect();
    const { container, onDisconnect } = event.detail;
    this._mediaContainer = container;
    onDisconnect(this.handleMediaContainerDisconnect.bind(this));
  }

  /**
   * @protected
   */
  handleMediaContainerDisconnect() {
    this._mediaContainer = undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Media Provider
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {MediaProvider | undefined}
   */
  _mediaProvider;

  /**
   * The current media provider that belongs to this controller. Defaults to `undefined` if there
   * is none.
   *
   * @type {MediaProvider | undefined}
   */
  get mediaProvider() {
    return this._mediaProvider;
  }

  /**
   * @readonly
   */
  mediaProviderConnectedQueue = new RequestQueue();

  /**
   * @readonly
   */
  mediaProviderDisconnectDisposal = new DisposalBin();

  /**
   * @protected
   * @param {MediaProviderConnectEvent} event
   */
  handleMediaProviderConnect(event) {
    if (this.mediaProvider === event.detail?.provider) return;

    this.handleMediaProviderDisconnect();

    const { provider, onDisconnect } = event.detail;

    this._mediaProvider = provider;

    this.attachMediaContextRecordToProvider();
    this.forwardMediaProviderAttributes();
    this.forwardMediaProviderEvents();
    this.addFullscreenControllerToProvider();
    this.flushMediaProviderConnectedQueue();

    onDisconnect(this.handleMediaProviderDisconnect.bind(this));
  }

  /**
   * @protected
   */
  flushMediaProviderConnectedQueue() {
    this.mediaProviderConnectedQueue.flush();
    this.mediaProviderConnectedQueue.serveImmediately = true;

    this.mediaProviderDisconnectDisposal.add(() => {
      this.mediaProviderConnectedQueue.serveImmediately = false;
      this.mediaProviderConnectedQueue.reset();
    });
  }

  /**
   * @protected
   */
  attachMediaContextRecordToProvider() {
    if (isNil(this.mediaProvider)) return;

    /** @type {any} */ (this.mediaProvider).context = this.context;

    this.mediaProviderDisconnectDisposal.add(() => {
      /** @type {any} */ (this.mediaProvider).context =
        createMediaContextRecord();
    });
  }

  /**
   * @protected
   */
  addFullscreenControllerToProvider() {
    if (isNil(this.mediaProvider)) return;
    const dispose = this.mediaProvider.addFullscreenController(
      this.fullscreenController
    );
    this.mediaProviderDisconnectDisposal.add(dispose);
  }

  /**
   * @protected
   */
  forwardMediaProviderAttributes() {
    if (isNil(this.mediaProvider)) return;

    const ctor = /** @type {typeof import('lit').LitElement} */ (
      this.mediaProvider.constructor
    );

    const attributes = getElementAttributes(ctor);

    // Forward initial attributes.
    for (const attrName of attributes) {
      const attrValue = this.getAttribute(attrName);
      if (!isNull(attrValue)) {
        this.mediaProvider.setAttribute(attrName, attrValue);
      }
    }

    const observer = observeAndForwardAttributes(
      this,
      this.mediaProvider,
      attributes
    );

    this.mediaProviderDisconnectDisposal.add(() => {
      observer.disconnect();
    });
  }

  /**
   * @protected
   */
  forwardMediaProviderEvents() {
    if (isNil(this.mediaProvider)) return;

    const ctor = /** @type {typeof VdsElement} */ (
      this.mediaProvider.constructor
    );

    const events = ctor.events ?? [];

    for (const eventType of events) {
      const dispose = listen(this.mediaProvider, eventType, (event) => {
        redispatchEvent(this, event);
      });

      this.mediaProviderDisconnectDisposal.add(dispose);
    }
  }

  /**
   * @protected
   */
  defineForwardedMediaProviderProperties() {
    FORWARDED_MEDIA_PROVDER_PROPS.forEach((prop) => {
      const defaultVaue =
        prop in mediaContext ? mediaContext[prop].initialValue : undefined;
      this.defineMediaProviderProperty(prop, defaultVaue);
    });
  }

  /**
   * @protected
   * @param {string} propName
   * @param {any} [defaultValue]
   */
  defineMediaProviderProperty(propName, defaultValue = undefined) {
    Object.defineProperty(this, propName, {
      get: () => {
        const value = this.mediaProvider?.[propName] ?? defaultValue;
        return isFunction(value) ? value.bind(this.mediaProvider) : value;
      },
      set: (value) => {
        this.mediaProviderConnectedQueue.queue(`controller${propName}`, () => {
          if (!isNil(this.mediaProvider)) {
            this.mediaProvider[propName] = value;
          }
        });
      }
    });
  }

  /**
   * @protected
   */
  handleMediaProviderDisconnect() {
    this.mediaProviderDisconnectDisposal.empty();
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
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.muted = true;
    }
  }

  /**
   * @protected
   * @param {UnmuteRequestEvent} event
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

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  /**
   * @readonly
   */
  fullscreenController = new FullscreenController(
    this,
    new ScreenOrientationController(this)
  );

  /**
   * @returns {Promise<void>}
   */
  async requestFullscreen() {
    if (this.fullscreenController.isRequestingNativeFullscreen) {
      return super.requestFullscreen();
    }

    return this.fullscreenController.requestFullscreen();
  }

  /**
   * @returns {Promise<void>}
   */
  async exitFullscreen() {
    return this.fullscreenController.exitFullscreen();
  }
}

export const MEDIA_CONTROLLER_ELEMENT_STORYBOOK_ARG_TYPES = {
  onEnterFullscreenRequest: storybookAction(EnterFullscreenRequestEvent.TYPE),
  onExitFullscreenRequest: storybookAction(ExitFullscreenRequestEvent.TYPE),
  onMuteRequest: storybookAction(MuteRequestEvent.TYPE),
  onPauseRequest: storybookAction(PauseRequestEvent.TYPE),
  onPlayRequest: storybookAction(PlayRequestEvent.TYPE),
  onSeekingRequest: storybookAction(SeekingRequestEvent.TYPE),
  onSeekRequest: storybookAction(SeekRequestEvent.TYPE),
  onUnmuteRequest: storybookAction(UnmuteRequestEvent.TYPE),
  onVolumeChangeRequest: storybookAction(VolumeChangeRequestEvent.TYPE)
};
