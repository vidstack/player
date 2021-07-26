export type VdsEventInit<DetailType> = CustomEventInit<DetailType> & {
  readonly originalEvent?: Event;
};

export class VdsEvent<DetailType = unknown> extends CustomEvent<DetailType> {
  readonly originalEvent?: Event;

  /**
   * Walks up the event chain (following each `originalEvent`) and returns the origin event
   * that started the chain.
   */
  get originEvent(): Event | undefined {
    return getOriginEvent(this);
  }

  /**
   * Walks up the event chain (following each `originalEvent`) and determines whether the initial
   * event was triggered by the end user (ie: check whether `isTrusted` on the `originEvent` `true`).
   */
  get isOriginTrusted(): boolean {
    return this.originEvent?.isTrusted ?? false;
  }

  constructor(type: string, eventInit: VdsEventInit<DetailType> = {}) {
    super(type, eventInit);

    this.originalEvent = eventInit.originalEvent;

    // 🚨 The following is for iOS <14 since events are constructed with `Event.initEvent()`.
    // eslint-disable-next-line no-prototype-builtins
    if (!this.hasOwnProperty('originEvent')) {
      Object.defineProperties(this, {
        originEvent: {
          get() {
            return getOriginEvent(this);
          }
        },
        isOriginTrusted: {
          get() {
            return getOriginEvent(this)?.isTrusted ?? false;
          }
        }
      });
    }
  }
}

/**
 * Walks up the event chain (following each `originalEvent`) and returns the origin event
 * that started the chain.
 *
 * @param event
 */
export function getOriginEvent(event: VdsEvent): Event | undefined {
  let originalEvent = event.originalEvent as VdsEvent;

  while (originalEvent && originalEvent.originalEvent) {
    originalEvent = originalEvent.originalEvent as VdsEvent;
  }

  return originalEvent;
}

export function redispatchEvent(
  target: EventTarget,
  event: Event | CustomEvent | VdsEvent
) {
  if (event.bubbles && event.composed) return;

  const newEvent = new VdsEvent(event.type, {
    originalEvent: (event as VdsEvent).originalEvent ?? event,
    detail: (event as CustomEvent).detail,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    composed: event.composed
  });

  target.dispatchEvent(newEvent);
}

export type ExtractEventDetail<Event> = Event extends VdsEvent<infer I>
  ? I
  : never;

export type ExtractEventInit<Event> = VdsEventInit<ExtractEventDetail<Event>>;

/**
 * Helps build a `VdsEvent` with type safety.
 *
 * @param type
 * @param eventInit
 */
export function vdsEvent<EventType extends keyof GlobalEventHandlersEventMap>(
  type: EventType,
  eventInit: ExtractEventInit<GlobalEventHandlersEventMap[EventType]> = {}
): VdsEvent<ExtractEventDetail<GlobalEventHandlersEventMap[EventType]>> {
  return new VdsEvent(type, eventInit);
}

/**
 * A disposal bin used to add cleanup callbacks that can be called when required.
 */
export class DisposalBin {
  // @ts-expect-error
  protected _disposal: (() => void)[] = this._disposal ?? [];

  add(callback?: () => void) {
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

export type GlobalEventHandlerMap = {
  [EventType in keyof GlobalEventHandlersEventMap]?: (
    event: GlobalEventHandlersEventMap[EventType]
  ) => void | Promise<void>;
};

/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 *
 * @param target - The target to listen for the events on.
 * @param type - The name of the event to listen to.
 * @param listener - The function to be called when the event is fired.
 * @param options - Configures the event listener.
 * @returns Stop listening cleanup function.
 * @example
 * ```ts
 * const disposeListener = listen(window, 'resize', () => {});
 *
 * // Stop listening.
 * disposeListener();
 * ```
 */
export function listen<EventType extends keyof GlobalEventHandlerMap>(
  target: EventTarget,
  type: EventType,
  listener: GlobalEventHandlerMap[EventType],
  options?: boolean | EventListenerOptions | AddEventListenerOptions
): () => void {
  target.addEventListener(type, listener as EventListener, options);

  return () => {
    target.removeEventListener(type, listener as EventListener, options);
  };
}

export function isPointerEvent(
  event: Event | undefined
): event is PointerEvent {
  return event?.type.includes('pointer') ?? false;
}

export function isVdsEvent(
  event: Event | undefined
): event is VdsEvent<unknown> {
  // eslint-disable-next-line no-prototype-builtins
  return event?.hasOwnProperty('originalEvent') ?? false;
}
