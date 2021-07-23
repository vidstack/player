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
export class VdsEvent extends CustomEvent {
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
    let originalEvent = /** @type {VdsEvent<unknown>} */ (this.originalEvent);

    while (originalEvent && originalEvent.originalEvent) {
      originalEvent = /** @type {VdsEvent<unknown>} */ (
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
   * @param {string} type
   * @param {VdsEventInit<DetailType>} [eventInit]
   */
  constructor(type, eventInit = {}) {
    super(type, eventInit);
    this.originalEvent = eventInit.originalEvent;
  }
}

/**
 * @param {EventTarget} target
 * @param {Event | CustomEvent | VdsEvent} event
 */
export function redispatchEvent(target, event) {
  if (event.bubbles && event.composed) return;

  const newEvent = new VdsEvent(event.type, {
    originalEvent: /** @type {VdsEvent} */ (event).originalEvent ?? event,
    detail: /** @type {CustomEvent} */ (event).detail,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    composed: event.composed
  });

  target.dispatchEvent(newEvent);
}

/**
 * @template Event
 * @typedef {Event extends VdsEvent<infer I> ? I : never} ExtractEventDetail
 */

/**
 * @template Event
 * @typedef {VdsEventInit<ExtractEventDetail<Event>>} ExtractEventInit
 */

/**
 * Helps build a `VdsEvent` with type safety.
 *
 * @template {keyof GlobalEventHandlersEventMap} EventType
 * @param {EventType} type
 * @param {ExtractEventInit<GlobalEventHandlersEventMap[EventType]>} [eventInit]
 * @returns {VdsEvent<ExtractEventDetail<GlobalEventHandlersEventMap[EventType]>>}
 */
export function vdsEvent(type, eventInit) {
  return new VdsEvent(type, eventInit);
}

/**
 * A disposal bin used to add cleanup callbacks that can be called when required.
 */
export class DisposalBin {
  /**
   * @protected
   * @type {(() => void)[]}
   */
  _disposal = this._disposal ?? [];

  /**
   * @param {() => void} [callback]
   */
  add(callback) {
    if (callback) this._disposal.push(callback);
  }

  /**
   * Dispose of callbacks.
   */
  empty() {
    this._disposal.forEach((fn) => fn());
    this._disposal = [];
  }
}

/**
 * @typedef {{
 *  [EventType in keyof GlobalEventHandlersEventMap]?: (event: GlobalEventHandlersEventMap[EventType]) => void | Promise<void>;
 * }} GlobalEventHandlerMap
 */

/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 *
 * @template {keyof GlobalEventHandlerMap} EventType
 * @param {EventTarget} target - The target to listen for the events on.
 * @param {EventType} type - The name of the event to listen to.
 * @param {GlobalEventHandlerMap[EventType]} listener - The function to be called when the event is fired.
 * @param {boolean | EventListenerOptions | AddEventListenerOptions} [options] - Configures the event listener.
 * @returns {() => void} Stop listening cleanup function.
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
 * @param {Event | undefined} [event]
 * @returns {event is PointerEvent}
 */
export function isPointerEvent(event) {
  return event?.type.includes('pointer') ?? false;
}

/**
 * @param {Event | undefined} [event]
 * @returns {event is VdsEvent<unknown>}
 */
export function isVdsEvent(event) {
  // eslint-disable-next-line no-prototype-builtins
  return event?.hasOwnProperty('originalEvent') ?? false;
}
