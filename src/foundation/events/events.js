/**
 * @template DetailType
 * @typedef {{
 *   readonly originalEvent?: Event;
 * } & CustomEventInit<DetailType>} VdsEventInit
 */

/**
 * @template DetailType
 * @augments CustomEvent<DetailType>
 */
export class VdsCustomEvent extends CustomEvent {
  /**
   * @type {string}
   * @readonly
   */
  static TYPE;

  /**
   * @type {boolean}
   * @readonly
   */
  static DEFAULT_BUBBLES = false;

  /**
   * @type {boolean}
   * @readonly
   */
  static DEFAULT_COMPOSED = false;

  /**
   * @type {Event | undefined}
   * @readonly
   */
  originalEvent;

  /**
   * Walks up the event chain (following each `originalEvent`) and returns the origin event
   * that started the chain.
   *
   * @type {Event | undefined}
   */
  get originEvent() {
    let originalEvent = /** @type {VdsCustomEvent<unknown>} */ (
      this.originalEvent
    );

    while (originalEvent && originalEvent.originalEvent) {
      originalEvent = /** @type {VdsCustomEvent<unknown>} */ (
        originalEvent.originalEvent
      );
    }

    return originalEvent;
  }

  /**
   * Walks up the event chain (following each `originalEvent`) and determines whether the initial
   * event was triggered by the end user (ie: check whether `isTrusted` on the `originEvent` `true`).
   *
   * @type {boolean}
   */
  get isOriginTrusted() {
    return this.originEvent?.isTrusted ?? false;
  }

  /**
   * @param {VdsEventInit<DetailType>} [eventInit]
   * @param {string} [type]
   * @param {boolean} [final]
   */
  constructor(eventInit = {}, type = '', final = false) {
    super(type, eventInit);

    this.originalEvent = eventInit.originalEvent;

    type = type || /** @type {typeof VdsCustomEvent} */ (this.constructor).TYPE;

    eventInit.bubbles =
      eventInit.bubbles ||
      /** @type {typeof VdsCustomEvent} */ (this.constructor).DEFAULT_BUBBLES;

    eventInit.composed =
      eventInit.composed ||
      /** @type {typeof VdsCustomEvent} */ (this.constructor).DEFAULT_COMPOSED;

    if (!final) {
      // TODO: This might cause problems if an event has a constructor that differs.
      return new /** @type {typeof VdsCustomEvent} */ (this.constructor)(
        eventInit,
        type,
        true
      );
    }
  }
}

/**
 * @param {EventTarget} target
 * @param {Event | CustomEvent | VdsCustomEvent} event
 */
export function redispatchEvent(target, event) {
  class VdsRedispatchedEvent extends VdsCustomEvent {
    static TYPE = event.type;
  }

  const newEvent = new VdsRedispatchedEvent({
    originalEvent: /** @type {VdsCustomEvent} */ (event).originalEvent ?? event,
    detail: /** @type {CustomEvent} */ (event).detail,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    composed: event.composed
  });

  target.dispatchEvent(newEvent);
}

/**
 * A disposal bin used to add cleanup callbacks that can be called when required.
 */
export class DisposalBin {
  /**
   * @protected
   * @type {import('../types').Callback<void>[]}
   */
  disposal = this.disposal ?? [];

  /**
   * @param {import('../types').Callback<void>} [callback]
   */
  add(callback) {
    if (callback) this.disposal.push(callback);
  }

  /**
   */
  empty() {
    this.disposal.forEach((fn) => fn());
    this.disposal = [];
  }
}

/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 *
 * @template {Event} ListenedEvent
 * @param {EventTarget} target - The target to listen for the events on.
 * @param {string} type - The name of the event to listen to.
 * @param {(event: ListenedEvent) => void} listener - The function to be called when the event is fired.
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options] - Configures the event listener.
 * @returns {import('../types').Unsubscribe}
 * @example
 * ```ts
 * const disposeListener = listen(window, 'resize', () => {});
 *
 * // Stop listening.
 * disposeListener();
 * ```
 */
export function listen(target, type, listener, options) {
  target.addEventListener(
    type,
    /** @type {EventListener} */ (listener),
    options
  );

  return () => {
    target.removeEventListener(
      type,
      /** @type {EventListener} */ (listener),
      options
    );
  };
}

/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 *
 * @template {keyof GlobalEventHandlersEventMap} EventType
 * @param {EventTarget} target - The target to listen for the events on.
 * @param {EventType} type - The name of the event to listen to.
 * @param {(event: GlobalEventHandlersEventMap[EventType]) => void} listener - The function to be called when the event is fired.
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options] - Configures the event listener.
 * @returns {import('../types').Unsubscribe}
 */
export function listenGlobalEvent(target, type, listener, options) {
  target.addEventListener(type, /** @type {any} */ (listener), options);
  return () => {
    target.removeEventListener(type, /** @type {any} */ (listener), options);
  };
}

/**
 * @typedef {{
 *  [EventType in keyof GlobalEventHandlersEventMap]?: (event: GlobalEventHandlersEventMap[EventType]) => void;
 * }} EventHandlerRecord
 */

/**
 * @param {EventTarget} target
 * @param {EventHandlerRecord} record
 * @param {DisposalBin} disposal
 * @param {{ receiver?: any }} [options]
 */
export function bindEventListeners(target, record, disposal, options = {}) {
  Object.keys(record).forEach((eventType) => {
    const dispose = listen(
      target,
      eventType,
      record[eventType].bind(options.receiver ?? target)
    );
    disposal.add(dispose);
  });
}
