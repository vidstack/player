import {
  isReactiveElementProto,
  throwIfTC39Decorator
} from '../../foundation/elements/decorators.js';
import { ElementDisposalController } from '../../foundation/elements/index.js';
import { listen } from '../../foundation/events/index.js';
import { keysOf } from '../../utils/object.js';
import { isFunction } from '../../utils/unit.js';

/**
 * @typedef {import('lit').ReactiveElement} MediaEventListenerControllerHost
 */

/**
 * @typedef {import('../../utils').Values<{
 *   [P in keyof import('../events').MediaEvents]: [P, (event: import('../events').MediaEvents[P]) => void]
 * }>} MediaEventListenerTuple
 */

/**
 * @typedef {MediaEventListenerTuple[]} MediaEventListenerTupleArray
 */

/**
 * @typedef {{
 *  [P in keyof import('../events').MediaEvents]?: (event: import('../events').MediaEvents[P]) => void;
 *  }} MediaEventListenerRecord
 */

/**
 * A controller to simplify attaching event listeners to a media controller below in the DOM.
 * Listens for a connect event from the media controller and then attaches event listeners
 * directly on it. This is required because media events don't bubble by default.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { MediaEventListenerController, PlayEvent, CanPlayEvent } from '@vidstack/elements';
 *
 * class MyElement extends LitElement {
 *   mediaEventListeners = new MediaEventListenerController(this, {
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
export class MediaEventListenerController {
  /**
   * @param {MediaEventListenerControllerHost} host
   * @param {MediaEventListenerRecord} eventListeners
   */
  constructor(host, eventListeners) {
    /**
     * @protected
     * @readonly
     * @type {MediaEventListenerControllerHost}
     */
    this._host = host;

    /**
     * @protected
     * @readonly
     * @type {MediaEventListenerTupleArray}
     */
    this._eventListeners = keysOf(eventListeners).reduce(
      (listeners, eventType) => [
        ...listeners,
        [eventType, eventListeners[eventType]]
      ],
      /** @type {any} */ ([])
    );

    /**
     * @protected
     * @readonly
     * @type {ElementDisposalController}
     */
    this._disposal = new ElementDisposalController(host);

    listen(
      host,
      'vds-media-controller-connect',
      this._handleMediaControllerConnectEvent.bind(this)
    );
  }

  /**
   * @param {MediaEventListenerTuple} listener
   */
  addListener(listener) {
    this._eventListeners.push(listener);
  }

  /**
   * @protected
   * @param {import('./MediaControllerElement').MediaControllerConnectEvent} event
   */
  _handleMediaControllerConnectEvent(event) {
    this._disposal.empty();

    const { element: mediaController, onDisconnect } = event.detail;

    this._eventListeners.forEach(([type, listener]) => {
      const dispose = listen(mediaController, type, listener.bind(this._host));
      this._disposal.add(dispose);
    });

    onDisconnect(() => {
      this._disposal.empty();
    });
  }
}

const CONTROLLER = Symbol('Vidstack.mediaEventListener');

/**
 * A decorator to simplify attaching event listeners to a media controller below in the DOM.
 * Listens for a connect event from the media controller and then attaches the decorated method
 * as a listener directly on it. This is required because media events don't bubble by default.
 *
 * @param {keyof import('../events').MediaEvents} type - The name of the event to listen to.
 * @returns {MethodDecorator}
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
export function mediaEventListener(type) {
  return function (proto, methodName) {
    const decoratorName = mediaEventListener.name;

    // TODO: implement when spec formalized.
    throwIfTC39Decorator(decoratorName, proto);

    if (isReactiveElementProto(decoratorName, proto)) {
      const ctor = proto.constructor;

      ctor.addInitializer((host) => {
        if (!isFunction(host[methodName])) return;

        const controller =
          host[CONTROLLER] ??
          (host[CONTROLLER] = new MediaEventListenerController(host, {}));

        const listener = host[methodName].bind(host);
        controller.addListener([type, listener]);
      });
    }
  };
}
