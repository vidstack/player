import { EventListenerController } from '../../foundation/events/index.js';
import { MediaControllerConnectEvent } from './MediaControllerElement.js';
/**
 * @typedef {import('lit').ReactiveElement} MediaEventObserverHost
 */
/**
 * @typedef {{
 *  [P in keyof import('../events').MediaEvents]?: (event: import('../events').MediaEvents[P]) => void;
 *  }} MediaEventHandlerRecord
 */
/**
 * A controller to simplify attaching media event handlers to the nearest media controller. This
 * observer is to observe state on a controller below in the DOM. If the controller is above you
 * in the DOM then consider using `mediaContext`.
 *
 * @example
 * ```ts
 * import { MediaEventObserver, PlayEvent, CanPlayEvent } from '@vidstack/elements';
 *
 * class MyElement extends HTMLElement {
 *   mediaEventObserver = new MediaEventObserver(this, {
 *     [PlayEvent.TYPE]: this.handlePlay,
 *     [CanPlayEvent.TYPE]: this.handleCanPlay
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
export class MediaEventObserver {
  /**
   * @param {MediaEventObserverHost} host
   * @param {MediaEventHandlerRecord} eventHandlers
   */
  constructor(host, eventHandlers) {
    /**
     * @protected
     * @readonly
     * @type {MediaEventObserverHost}
     */
    this.host = host;
    /**
     * @protected
     * @readonly
     * @type {MediaEventHandlerRecord}
     */
    this.eventHandlers = eventHandlers;
    /**
     * @protected
     * @readonly
     * @type {EventListenerController}
     */
    this.controllerEventListeners = new EventListenerController(host, {
      [MediaControllerConnectEvent.TYPE]:
        this.handleMediaControllerConnectEvent.bind(this)
    });
    /**
     * @protected
     * @type {EventListenerController}
     */
    this.mediaEventListeners = new EventListenerController(host, {});
  }
  /**
   * @protected
   * @param {MediaControllerConnectEvent} event
   */
  handleMediaControllerConnectEvent(event) {
    this.mediaEventListeners.removeListeners();
    const { element: mediaController } = event.detail;
    this.mediaEventListeners = new EventListenerController(
      this.host,
      this.eventHandlers,
      {
        target: mediaController,
        receiver: this.host
      }
    );
  }
}
