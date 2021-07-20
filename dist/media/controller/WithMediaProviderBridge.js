import { provideContextRecord } from '../../foundation/context/index.js';
import {
  DisposalBin,
  EventListenerController,
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
import { MediaProviderConnectEvent } from '../provider/index.js';
const BRIDGE_DEFINED = Symbol('bridge_defined');
/**
 * @mixin
 * @template {import('../../foundation/types').Constructor<import('lit').ReactiveElement>} T
 * @param {T} Base - The constructor to mix into.
 * @returns {T & import('../../foundation/types').Constructor<import('./types').MediaProviderBridge>}
 */
export function WithMediaProviderBridge(Base) {
  class WithMediaProviderBridge extends Base {
    constructor(...args) {
      super(...args);
      // -------------------------------------------------------------------------------------------
      // Lifecycle
      // -------------------------------------------------------------------------------------------
      /**
       * @protected
       * @readonly
       */
      this.eventListenerController = new EventListenerController(this, {
        [MediaProviderConnectEvent.TYPE]: this.handleMediaProviderConnect,
        [FullscreenChangeEvent.TYPE]: this.handleFullscreenChange
      });
      // -------------------------------------------------------------------------------------------
      // Media Provider Connect
      // -------------------------------------------------------------------------------------------
      /**
       * @readonly
       */
      this.mediaProviderConnectedQueue = new RequestQueue();
      /**
       * @readonly
       */
      this.mediaProviderDisconnectDisposal = new DisposalBin();
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
      this.context = provideContextRecord(this, mediaContext);
      // -------------------------------------------------------------------------------------------
      // Fullscreen
      // -------------------------------------------------------------------------------------------
      /**
       * @readonly
       */
      this.fullscreenController = new FullscreenController(
        this,
        new ScreenOrientationController(this)
      );
      this.defineForwardedMediaProviderProperties();
    }
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
      const { element, onDisconnect } = event.detail;
      if (this.mediaProvider === element) return;
      this.handleMediaProviderDisconnect();
      this._mediaProvider = element;
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
      var _a;
      if (isNil(this.mediaProvider)) return;
      const ctor = /** @type {typeof VdsElement} */ (
        this.mediaProvider.constructor
      );
      const events = (_a = ctor.events) !== null && _a !== void 0 ? _a : [];
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
      // eslint-disable-next-line no-prototype-builtins
      if (this.constructor.prototype.hasOwnProperty(BRIDGE_DEFINED)) return;
      BRIDGED_MEDIA_PROVIDER_PROPERTIES.forEach((propName) => {
        const defaultValue =
          propName in mediaContext
            ? mediaContext[propName].initialValue
            : undefined;
        this.defineMediaProviderProperty(propName, defaultValue);
      });
      this.constructor.prototype[BRIDGE_DEFINED] = true;
    }
    /**
     * @protected
     * @param {string} propName
     * @param {any} [defaultValue]
     */
    defineMediaProviderProperty(propName, defaultValue = undefined) {
      Object.defineProperty(this.constructor.prototype, propName, {
        get() {
          var _a, _b;
          const value =
            (_b =
              (_a = this.mediaProvider) === null || _a === void 0
                ? void 0
                : _a[propName]) !== null && _b !== void 0
              ? _b
              : defaultValue;
          return isFunction(value) ? value.bind(this.mediaProvider) : value;
        },
        set(value) {
          this.mediaProviderConnectedQueue.queue(`bridge${propName}`, () => {
            if (!isNil(this.mediaProvider)) {
              this.mediaProvider[propName] = value;
            }
          });
        }
      });
    }
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
 * @readonly
 * @type {(keyof import('./types').MediaProviderBridgedProperties | keyof import('./types').MediaProviderBridgedMethods)[]}
 */
export const BRIDGED_MEDIA_PROVIDER_PROPERTIES = [
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
  'requestPictureInPicture',
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
