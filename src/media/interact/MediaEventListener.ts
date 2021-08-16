import { ReactiveController, ReactiveControllerHost } from 'lit';

import {
  isReactiveElementProto,
  throwIfTC39Decorator
} from '../../base/elements/decorators';
import { DisposalBin, listen } from '../../base/events';
import { Logger } from '../../base/logger';
import { DEV_MODE } from '../../global/env';
import { Values } from '../../global/helpers';
import { keysOf } from '../../utils/object';
import { isFunction, isNil, noop } from '../../utils/unit';
import { MediaControllerConnectEvent } from '../controller/MediaControllerElement';
import { MediaEvents } from '../events';

export type MediaEventListenerTuple = Values<
  {
    [P in keyof MediaEvents]: [P, (event: MediaEvents[P]) => void];
  }
>;

export type MediaEventListenerTupleArray = MediaEventListenerTuple[];

export type MediaEventListenerRecord = {
  [P in keyof MediaEvents]?: (event: MediaEvents[P]) => void;
};

/**
 * A controller to simplify attaching event listeners to a media controller below in the DOM.
 * Listens for a connect event from the media controller and then attaches event listeners
 * directly on it. This is required because media events don't bubble by default.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { MediaEventListener, PlayEvent, CanPlayEvent } from '@vidstack/elements';
 *
 * class MyElement extends LitElement {
 *   mediaEventListeners = new MediaEventListener(this, {
 *     'vds-play': this.handlePlay,
 *     'vds-can-play': this.handleCanPlay
 *   });
 *
 *   handlePlay(event: PlayEvent) {
 *     // ...
 *   }
 *
 *   handleCanPlay(event: CanPlayEvent) {
 *     // ...
 *   }
 * }
 * ```
 */
export class MediaEventListener implements ReactiveController {
  protected readonly _eventListeners: MediaEventListenerTupleArray;

  protected readonly _logger!: Logger;

  protected readonly _listenerDisposal: DisposalBin;

  protected _ref?: Element;

  protected _disposeConnectEventListener = noop;

  constructor(
    protected readonly _host: ReactiveControllerHost,
    eventListeners: MediaEventListenerRecord = {}
  ) {
    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger = new Logger(_host, { owner: this });
    }
    /* c8 ignore stop */

    this._listenerDisposal = new DisposalBin(
      _host,
      /* c8 ignore next */
      DEV_MODE && { name: 'listenerDisposal', owner: this }
    );

    this._eventListeners = keysOf(eventListeners).reduce(
      (listeners, eventType) => [
        ...listeners,
        [eventType, eventListeners[eventType]]
      ],
      [] as any
    );

    if (_host instanceof Element) this.setRef(_host);
    _host.addController(this);
  }

  hostDisconnected() {
    this._listenerDisposal.empty();
  }

  addListener<EventType extends keyof MediaEvents>(
    type: EventType,
    listener: (event: MediaEvents[EventType]) => void | Promise<void>
  ) {
    // @ts-expect-error
    this._eventListeners.push([type, listener]);
  }

  /**
   * Set a reference to a DOM element that this controller will use to listen to a connect
   * event from a `MediaControllerElement`.
   */
  setRef(newRef?: Element) {
    if (this._ref !== newRef) {
      if (!isNil(newRef)) {
        /* c8 ignore start */
        if (DEV_MODE) {
          this._logger.debug('ref change', newRef);
        }
        /* c8 ignore stop */

        this._disposeConnectEventListener();
        this._disposeConnectEventListener = listen(
          newRef,
          'vds-media-controller-connect',
          this._handleMediaControllerConnectEvent.bind(this)
        );
      }

      this._ref = newRef;
    }
  }

  protected _handleMediaControllerConnectEvent(
    event: MediaControllerConnectEvent
  ) {
    this._listenerDisposal.empty();

    const { element: mediaController, onDisconnect } = event.detail;

    this._eventListeners.forEach(([type, listener]) => {
      const dispose = listen(mediaController, type, listener.bind(this._host));
      this._listenerDisposal.add(dispose);
    });

    onDisconnect(() => {
      this._listenerDisposal.empty();
    });
  }
}

const CONTROLLER = Symbol('Vidstack.mediaEventListener');

/**
 * A decorator to simplify attaching event listeners to a media controller below in the DOM.
 * Listens for a connect event from the media controller and then attaches the decorated method
 * as a listener directly on it. This is required because media events don't bubble by default.
 *
 * @param type - The name of the event to listen to.
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { mediaEventListener, PlayEvent, CanPlayEvent } from '@vidstack/elements';
 *
 * class MyElement extends LitElement {
 *   \@mediaEventListener('vds-play')
 *   handlePlay(event: PlayEvent) {
 *     // ...
 *   }
 *
 *   \@mediaEventListener('vds-can-play')
 *   handleCanPlay(event: CanPlayEvent) {
 *     // ...
 *   }
 * }
 * ```
 */
export function mediaEventListener(type: keyof MediaEvents): MethodDecorator {
  return function (proto, methodName) {
    const decoratorName = mediaEventListener.name;

    // TODO: implement when spec formalized.
    throwIfTC39Decorator(decoratorName, proto);

    if (isReactiveElementProto(decoratorName, proto)) {
      const ctor = proto.constructor;

      ctor.addInitializer((host) => {
        if (!isFunction(host[methodName])) return;

        const controller =
          host[CONTROLLER] ?? (host[CONTROLLER] = new MediaEventListener(host));

        const listener = host[methodName].bind(host);
        controller.addListener(type, listener);
      });
    }
  };
}
