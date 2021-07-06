import { provideContextRecord } from '../../foundation/context/index.js';
import { VdsElement } from '../../foundation/elements/index.js';
import {
  bindEventListeners,
  DisposalBin,
  listen,
  redispatchEvent
} from '../../foundation/events/index.js';
import {
  FullscreenChangeEvent,
  FullscreenController
} from '../../foundation/fullscreen/index.js';
import { RequestQueue } from '../../foundation/queue/index.js';
import { ScreenOrientationController } from '../../foundation/screen-orientation/index.js';
import {
  getElementAttributes,
  observeAndForwardAttributes
} from '../../utils/dom.js';
import { isFunction, isNil, isNull } from '../../utils/unit.js';
import { createMediaContextRecord, mediaContext } from '../context.js';
import {
  MediaProviderConnectEvent,
  MediaProviderElement
} from '../provider/index.js';

/**
 * @typedef {Pick<import('../../providers/video').VideoElement, ForwardedMediaProviderProps>} MediaProviderBridgedProperties
 */

/**
 * @typedef {MediaProviderBridgedProperties & {
 *   readonly _mediaProvider: MediaProviderElement | undefined;
 *   readonly fullscreenController: FullscreenController;
 *   readonly mediaProviderConnectedQueue: RequestQueue;
 *   readonly mediaProviderDisconnectDisposal: DisposalBin;
 *   exitFullscreen(): Promise<void>;
 * }} MediaProviderBridge
 */

/**
 * @mixin
 * @template {import('../../foundation/types/utils').Constructor<import('lit').ReactiveElement>} T
 * @param {T} Base - The constructor to mix into.
 * @returns {T & import('../../foundation/types/utils').Constructor<MediaProviderBridge>}
 */
export function WithMediaProviderBridge(Base) {
  class WithMediaProviderBridge extends Base {
    constructor(...args) {
      super(...args);
      this.defineForwardedMediaProviderProperties();
    }

    // -------------------------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------------------------

    /**
     * @readonly
     */
    disconnectDisposal = new DisposalBin();

    connectedCallback() {
      super.connectedCallback();

      const events = {
        [MediaProviderConnectEvent.TYPE]: this.handleMediaProviderConnect,
        [FullscreenChangeEvent.TYPE]: this.handleFullscreenChange
      };

      bindEventListeners(this, events, this.disconnectDisposal);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.disconnectDisposal.empty();
    }

    // -------------------------------------------------------------------------------------------
    // Media Provider Connect
    // -------------------------------------------------------------------------------------------

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
     * @type {MediaProviderElement | undefined}
     */
    _mediaProvider;

    /**
     * @type {MediaProviderElement | undefined}
     */
    get mediaProvider() {
      return this._mediaProvider;
    }

    /**
     * @protected
     * @param {MediaProviderConnectEvent} event
     */
    handleMediaProviderConnect(event) {
      event.stopPropagation();

      if (this.mediaProvider === event.detail?.provider) return;

      this.handleMediaProviderDisconnect();

      const { provider, onDisconnect } = event.detail;

      this._mediaProvider = provider;

      this.attachMediaContextRecordToProvider();
      this.forwardMediaProviderAttributes();
      this.forwardMediaProviderEvents();
      this.flushMediaProviderConnectedQueue();

      onDisconnect(this.handleMediaProviderDisconnect.bind(this));
    }

    /**
     * @protected
     */
    handleMediaProviderDisconnect() {
      this.mediaProviderDisconnectDisposal.empty();
      this._mediaProvider = undefined;
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

    // -------------------------------------------------------------------------------------------
    // Forward Context
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

    // -------------------------------------------------------------------------------------------
    // Forward Attributes
    // -------------------------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------------------------
    // Forward Events
    // -------------------------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------------------------
    // Forward Properties
    // -------------------------------------------------------------------------------------------

    /**
     * @protected
     */
    defineForwardedMediaProviderProperties() {
      FORWARDED_MEDIA_PROVIDER_PROPS.forEach((propName) => {
        const defaultVaue =
          propName in mediaContext
            ? mediaContext[propName].initialValue
            : undefined;
        this.defineMediaProviderProperty(propName, defaultVaue);
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
          this.mediaProviderConnectedQueue.queue(`bridge${propName}`, () => {
            if (!isNil(this.mediaProvider)) {
              this.mediaProvider[propName] = value;
            }
          });
        }
      });
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

    /**
     * @protected
     * @param {FullscreenChangeEvent} event
     */
    handleFullscreenChange(event) {
      this.context.fullscreen = event.detail;
    }
  }

  return /** @type {any} */ (WithMediaProviderBridge);
}

/**
 * @typedef {'autoPiP'
 *  | 'autoplay'
 *  | 'buffered'
 *  | 'canPlay'
 *  | 'canPlayThrough'
 *  | 'canPlayType'
 *  | 'canRequestFullscreen'
 *  | 'captureStream'
 *  | 'controls'
 *  | 'controlsList'
 *  | 'crossOrigin'
 *  | 'currentPoster'
 *  | 'currentSrc'
 *  | 'currentTime'
 *  | 'defaultMuted'
 *  | 'defaultPlaybackRate'
 *  | 'disablePiP'
 *  | 'disableRemotePlayback'
 *  | 'duration'
 *  | 'ended'
 *  | 'error'
 *  | 'fullscreen'
 *  | 'fullscreenOrientation'
 *  | 'height'
 *  | 'live'
 *  | 'load'
 *  | 'loop'
 *  | 'mediaType'
 *  | 'muted'
 *  | 'networkState'
 *  | 'pause'
 *  | 'paused'
 *  | 'play'
 *  | 'played'
 *  | 'playing'
 *  | 'playsinline'
 *  | 'poster'
 *  | 'preload'
 *  | 'readyState'
 *  | 'seekable'
 *  | 'seeking'
 *  | 'shouldPlayType'
 *  | 'src'
 *  | 'srcObject'
 *  | 'started'
 *  | 'viewType'
 *  | 'volume'
 *  | 'waiting'
 *  | 'width'
 * } ForwardedMediaProviderProps
 */

/**
 * @readonly
 * @type {ForwardedMediaProviderProps[]}
 */
export const FORWARDED_MEDIA_PROVIDER_PROPS = [
  'autoPiP',
  'autoplay',
  'buffered',
  'canPlay',
  'canPlayThrough',
  'canPlayType',
  'canRequestFullscreen',
  'captureStream',
  'controls',
  'controlsList',
  'crossOrigin',
  'currentPoster',
  'currentSrc',
  'currentTime',
  'defaultMuted',
  'defaultPlaybackRate',
  'disablePiP',
  'disableRemotePlayback',
  'duration',
  'ended',
  'error',
  'fullscreen',
  'fullscreenOrientation',
  'height',
  'live',
  'load',
  'loop',
  'mediaType',
  'muted',
  'networkState',
  'pause',
  'paused',
  'play',
  'played',
  'playing',
  'playsinline',
  'poster',
  'preload',
  'readyState',
  'seekable',
  'seeking',
  'shouldPlayType',
  'src',
  'srcObject',
  'started',
  'viewType',
  'volume',
  'waiting',
  'width'
];
