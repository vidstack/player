import { LitElement } from 'lit';

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
import {
  MediaProviderConnectEvent,
  MediaProviderElement
} from '../provider/index.js';

const BRIDGE_DEFINED = Symbol('Vidstack.withMediaProviderBridge');

/**
 * @mixin
 * @template {import('../../utils').Constructor<import('lit').ReactiveElement>} T
 * @param {T} Base - The constructor to mix into.
 * @returns {T & import('../../utils').Constructor<import('./types').MediaProviderBridge>}
 */
export function WithMediaProviderBridge(Base) {
  class WithMediaProviderBridge extends Base {
    constructor(...args) {
      super(...args);
      this._defineForwardedMediaProviderProperties();
    }

    // -------------------------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------------------------

    /**
     * @protected
     * @readonly
     */
    _eventListenerController = new EventListenerController(this, {
      [MediaProviderConnectEvent.TYPE]: this._handleMediaProviderConnect,
      [FullscreenChangeEvent.TYPE]: this._handleFullscreenChange
    });

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
    _handleMediaProviderConnect(event) {
      event.stopPropagation();

      const { element, onDisconnect } = event.detail;

      if (this.mediaProvider === element) return;

      this._handleMediaProviderDisconnect();

      this._mediaProvider = element;

      this._attachMediaContextRecordToProvider();
      this._forwardMediaProviderAttributes();
      this._forwardMediaProviderEvents();
      this._flushMediaProviderConnectedQueue();

      onDisconnect(this._handleMediaProviderDisconnect.bind(this));
    }

    /**
     * @protected
     */
    _handleMediaProviderDisconnect() {
      this.mediaProviderDisconnectDisposal.empty();
      this._mediaProvider = undefined;
    }

    /**
     * @protected
     */
    _flushMediaProviderConnectedQueue() {
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
     * @readonly
     * @internal
     */
    ctx = provideContextRecord(this, mediaContext);

    /**
     * @protected
     */
    _attachMediaContextRecordToProvider() {
      if (isNil(this.mediaProvider)) return;

      // @ts-expect-error - Override readonly
      this.mediaProvider.ctx = this.ctx;

      this.mediaProviderDisconnectDisposal.add(() => {
        // @ts-expect-error - Override readonly
        this.mediaProvider.ctx = createMediaContextRecord();
      });
    }

    // -------------------------------------------------------------------------------------------
    // Forward Attributes
    // -------------------------------------------------------------------------------------------

    /**
     * @protected
     */
    _forwardMediaProviderAttributes() {
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
    _forwardMediaProviderEvents() {
      if (isNil(this.mediaProvider)) return;

      const ctor = /** @type {{ events?: string[] }} */ (
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
    _defineForwardedMediaProviderProperties() {
      // eslint-disable-next-line no-prototype-builtins
      if (this.constructor.prototype.hasOwnProperty(BRIDGE_DEFINED)) return;

      BRIDGED_MEDIA_PROVIDER_PROPERTIES.forEach((propName) => {
        const defaultValue =
          propName in mediaContext
            ? mediaContext[propName].initialValue
            : undefined;

        this._defineMediaProviderProperty(propName, defaultValue);
      });

      this.constructor.prototype[BRIDGE_DEFINED] = true;
    }

    /**
     * @protected
     * @param {string} propName
     * @param {any} [defaultValue]
     */
    _defineMediaProviderProperty(propName, defaultValue = undefined) {
      Object.defineProperty(this.constructor.prototype, propName, {
        get() {
          const value = this.mediaProvider?.[propName] ?? defaultValue;
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
    _handleFullscreenChange(event) {
      this.ctx.fullscreen = event.detail;
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
