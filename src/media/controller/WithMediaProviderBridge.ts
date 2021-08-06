import { LitElement, ReactiveElement } from 'lit';

import { provideContextRecord } from '../../base/context';
import {
  DisposalBin,
  eventListener,
  listen,
  redispatchEvent
} from '../../base/events';
import {
  FullscreenChangeEvent,
  FullscreenController
} from '../../base/fullscreen';
import { Logger } from '../../base/logger';
import { RequestQueue } from '../../base/queue';
import { ScreenOrientationController } from '../../base/screen-orientation';
import { DEV_MODE } from '../../env';
import { Constructor } from '../../helpers';
import {
  getElementAttributes,
  observeAndForwardAttributes
} from '../../utils/dom';
import { isFunction, isNil, isNull, isUndefined, noop } from '../../utils/unit';
import { createMediaContextRecord, mediaContext } from '../context';
import {
  MediaProviderConnectEvent,
  MediaProviderElement
} from '../provider/MediaProviderElement';
import {
  MediaProviderBridge,
  MediaProviderBridgedMethods,
  MediaProviderBridgedProperties
} from './types';

const BRIDGE_DEFINED = Symbol('Vidstack.withMediaProviderBridge');

/**
 * @param Base - The constructor to mix into.
 */
export function WithMediaProviderBridge<T extends Constructor<ReactiveElement>>(
  Base: T
): T & Constructor<MediaProviderBridge> {
  class WithMediaProviderBridge extends Base {
    /* c8 ignore next */
    protected readonly _logger = DEV_MODE && new Logger(this);

    constructor(...args: any[]) {
      super(...args);
      this._defineForwardedMediaProviderProperties();
    }

    // -------------------------------------------------------------------------------------------
    // Media Provider Connect
    // -------------------------------------------------------------------------------------------

    readonly mediaProviderConnectedQueue = new RequestQueue(
      this,
      /* c8 ignore next */
      DEV_MODE && {
        name: 'mediaProviderConnectedQueue',
        owner: this
      }
    );

    readonly mediaProviderDisconnectDisposal = new DisposalBin(
      this,
      /* c8 ignore next */
      DEV_MODE && { name: 'mediaProviderDisconnectDisposal', owner: this }
    );

    protected _mediaProvider: MediaProviderElement | undefined;

    get mediaProvider() {
      return this._mediaProvider;
    }

    @eventListener('vds-media-provider-connect')
    protected _handleMediaProviderConnect(event: MediaProviderConnectEvent) {
      event.stopPropagation();

      const { element, onDisconnect } = event.detail;

      if (this.mediaProvider === element) return;

      /* c8 ignore start */
      if (DEV_MODE) {
        this._logger
          .infoGroup('media provider connected')
          .appendWithLabel('Provider', element)
          .end();
      }
      /* c8 ignore stop */

      this._handleMediaProviderDisconnect();

      this._mediaProvider = element;

      this._attachMediaContextRecordToProvider();
      this._forwardMediaProviderAttributes();
      this._forwardMediaProviderEvents();
      this._flushMediaProviderConnectedQueue();

      onDisconnect(this._handleMediaProviderDisconnect.bind(this));
    }

    protected _handleMediaProviderDisconnect() {
      if (isNil(this.mediaProvider)) return;

      /* c8 ignore start */
      if (DEV_MODE) {
        this._logger
          .infoGroup('media provider disconnected')
          .appendWithLabel('Provider', this.mediaProvider)
          .end();
      }
      /* c8 ignore stop */

      this.mediaProviderDisconnectDisposal.empty();
      this._mediaProvider = undefined;
    }

    protected _flushMediaProviderConnectedQueue() {
      this.mediaProviderConnectedQueue.flush();
      this.mediaProviderConnectedQueue.serveImmediately = true;

      this.mediaProviderDisconnectDisposal.add(() => {
        this.mediaProviderConnectedQueue.serveImmediately = false;
        this.mediaProviderConnectedQueue.reset();
      });
    }

    @eventListener('vds-error')
    protected _logErrors(event: Event) {
      /* c8 ignore start */
      if (DEV_MODE) {
        this._logger
          .errorGroup(event.type)
          .appendWithLabel('Context', this.ctx)
          .appendWithLabel('Event', event)
          .appendWithLabel('Provider', this.mediaProvider)
          .end();
      }
      /* c8 ignore stop */
    }

    // -------------------------------------------------------------------------------------------
    // Forward Context
    // -------------------------------------------------------------------------------------------

    /** @internal */
    readonly ctx = provideContextRecord(this, mediaContext);

    protected _attachMediaContextRecordToProvider() {
      if (isNil(this.mediaProvider)) return;

      // @ts-expect-error - Override readonly
      this.mediaProvider.ctx = this.ctx;

      /* c8 ignore start */
      if (DEV_MODE) {
        this._logger
          .infoGroup('attached context record')
          .appendWithLabel('Provider', this.mediaProvider)
          .appendWithLabel('Context', this.ctx)
          .end();
      }
      /* c8 ignore stop */

      this.mediaProviderDisconnectDisposal.add(() => {
        // @ts-expect-error - Override readonly
        this.mediaProvider.ctx = createMediaContextRecord();
      });
    }

    // -------------------------------------------------------------------------------------------
    // Forward Attributes
    // -------------------------------------------------------------------------------------------

    protected _forwardMediaProviderAttributes() {
      if (isNil(this.mediaProvider)) return;

      const ctor = this.mediaProvider.constructor as typeof LitElement;
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
        attributes,
        /* c8 ignore next */
        !DEV_MODE
          ? noop
          : (attrName, attrValue) => {
              /* c8 ignore start */
              if (DEV_MODE) {
                this._logger
                  .debugGroup(`🔗 forwarding attr \`${attrName}\` to provider`)
                  .appendWithLabel('Attribute name', attrName)
                  .appendWithLabel('Attribute value', attrValue)
                  .appendWithLabel('Provider', this.mediaProvider)
                  .end();
              }
              /* c8 ignore stop */
            }
      );

      this.mediaProviderDisconnectDisposal.add(() => {
        observer.disconnect();
      });
    }

    // -------------------------------------------------------------------------------------------
    // Forward Events
    // -------------------------------------------------------------------------------------------

    protected _forwardMediaProviderEvents() {
      if (isNil(this.mediaProvider)) return;

      const ctor = this.mediaProvider.constructor as {
        events?: (keyof GlobalEventHandlersEventMap)[];
      };

      const events = ctor.events ?? [];

      for (const eventType of events) {
        const dispose = listen(
          this.mediaProvider,
          eventType,
          (event: Event) => {
            /* c8 ignore start */
            if (DEV_MODE) {
              this._logger
                .debugGroup(
                  `🔗 forwarding event \`${eventType}\` from provider`
                )
                .appendWithLabel('Event', event)
                .appendWithLabel('Provider', this.mediaProvider)
                .end();
            }
            /* c8 ignore stop */

            redispatchEvent(this, event);
          }
        );

        this.mediaProviderDisconnectDisposal.add(dispose);
      }
    }

    // -------------------------------------------------------------------------------------------
    // Forward Properties
    // -------------------------------------------------------------------------------------------

    protected _defineForwardedMediaProviderProperties() {
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

    protected _defineMediaProviderProperty(
      propName: string,
      defaultValue: any = undefined
    ) {
      Object.defineProperty(this.constructor.prototype, propName, {
        get() {
          const value = this.mediaProvider?.[propName] ?? defaultValue;
          return isFunction(value) ? value.bind(this.mediaProvider) : value;
        },
        set(value) {
          this.mediaProviderConnectedQueue.queue(
            `bridgedProp::${propName}`,
            () => {
              if (!isNil(this.mediaProvider)) {
                this.mediaProvider[propName] = value;
              }
            }
          );
        }
      });
    }

    // -------------------------------------------------------------------------------------------
    // Fullscreen
    // -------------------------------------------------------------------------------------------

    readonly fullscreenController = new FullscreenController(
      this,
      new ScreenOrientationController(this)
    );

    override async requestFullscreen(): Promise<void> {
      if (this.fullscreenController.isRequestingNativeFullscreen) {
        return super.requestFullscreen();
      }

      return this.fullscreenController.requestFullscreen();
    }

    async exitFullscreen(): Promise<void> {
      return this.fullscreenController.exitFullscreen();
    }

    @eventListener('vds-fullscreen-change')
    protected _handleFullscreenChange(event: FullscreenChangeEvent): void {
      this.ctx.fullscreen = event.detail;
    }
  }

  // TODO: fix later.
  // @ts-expect-error
  return WithMediaProviderBridge;
}

export const BRIDGED_MEDIA_PROVIDER_PROPERTIES: (
  | keyof MediaProviderBridgedProperties
  | keyof MediaProviderBridgedMethods
)[] = [
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
