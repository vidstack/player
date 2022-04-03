export type VdsEventInit<DetailType> = CustomEventInit<DetailType> & {
  readonly triggerEvent?: Event;
};

export class VdsEvent<DetailType = unknown> extends CustomEvent<DetailType> {
  /**
   * The preceding event that was responsible for this event being fired.
   */
  readonly triggerEvent?: Event;

  /**
   * Walks up the event chain (following each `triggerEvent`) and returns the origin event
   * that started the chain.
   */
  get originEvent(): Event {
    return getOriginEvent(this) ?? this;
  }

  /**
   * Walks up the event chain (following each `triggerEvent`) and determines whether the initial
   * event was triggered by the end user (ie: check whether `isTrusted` on the `originEvent` `true`).
   */
  get isOriginTrusted(): boolean {
    return this.originEvent?.isTrusted ?? false;
  }

  constructor(type: string, eventInit: VdsEventInit<DetailType> = {}) {
    super(type, eventInit);

    this.triggerEvent = eventInit.triggerEvent;

    // 🚨 The following is for iOS <14 since events are constructed with `Event.initEvent()`.
    // eslint-disable-next-line no-prototype-builtins
    if (!this.hasOwnProperty('originEvent')) {
      Object.defineProperties(this, {
        originEvent: {
          get() {
            return getOriginEvent(this) ?? this;
          },
        },
        isOriginTrusted: {
          get() {
            return getOriginEvent(this)?.isTrusted ?? false;
          },
        },
      });
    }
  }
}

export type ExtractEventDetail<Event> = Event extends VdsEvent<infer I> ? I : never;

export type ExtractEventInit<Event> = VdsEventInit<ExtractEventDetail<Event>>;

/**
 * Helps build a `VdsEvent` with type safety.
 */
export function vdsEvent<EventType extends keyof GlobalEventHandlersEventMap>(
  type: EventType,
  eventInit: ExtractEventInit<GlobalEventHandlersEventMap[EventType]> = {},
): GlobalEventHandlersEventMap[EventType] {
  return new VdsEvent(type, eventInit);
}

export function isVdsEvent(event: Event | undefined): event is VdsEvent<unknown> {
  // eslint-disable-next-line no-prototype-builtins
  return event?.hasOwnProperty('triggerEvent') ?? false;
}

/**
 * Walks up the event chain (following each `triggerEvent`) and returns the origin event
 * that started the chain.
 */
export function getOriginEvent(event: VdsEvent): Event | undefined {
  let triggerEvent = event.triggerEvent as VdsEvent;

  while (triggerEvent && triggerEvent.triggerEvent) {
    triggerEvent = triggerEvent.triggerEvent as VdsEvent;
  }

  return triggerEvent;
}

export type WalkCallbackTypes<T> = T | false | undefined | null | void;

/**
 * Walks an event chain on a given `event`, and invokes the given `callback` for each
 * trigger event.
 *
 * @param event - The event on which to follow the chain.
 * @param callback - Invoked for each trigger event in the chain. If a `value` is returned by
 * this callback, the walk will end and `[event, value]` will be returned.
 */
export function walkTriggerEventChain<T>(
  event: Event,
  callback: (event: Event) => NonNullable<T> | void,
): [event: Event, value: NonNullable<T>] | undefined {
  if (!isVdsEvent(event)) return;

  let triggerEvent = event.triggerEvent as VdsEvent;

  while (triggerEvent && triggerEvent.triggerEvent) {
    const returnValue = callback(triggerEvent);
    if (returnValue) return [triggerEvent, returnValue];
    triggerEvent = triggerEvent.triggerEvent as VdsEvent;
  }

  return;
}

/**
 * Attempts to find a trigger event with a given `eventType` on the event chain.
 *
 * @param event - The event on which to look for a trigger event.
 * @param eventType - The type of event to find.
 */
export function findTriggerEvent<T extends keyof GlobalEventHandlersEventMap>(
  event: Event,
  eventType: T,
): GlobalEventHandlersEventMap[T] | undefined {
  return walkTriggerEventChain(event, (e) => e.type === eventType)?.[0];
}

/**
 * Whether a trigger event with the given `eventType` exists can be found in the event chain.
 *
 * @param event - The event on which to look for a trigger event.
 * @param eventType - The type of event to find.
 */
export function hasTriggerEvent<T extends keyof GlobalEventHandlersEventMap>(
  event: Event,
  eventType: T,
): boolean {
  return !!findTriggerEvent(event, eventType);
}

/**
 * Appends the given `triggerEvent` to the event chain. This means the new origin event will be
 * the origin of the given `triggerEvent`, or the `triggerEvent` itself (if no chain exists on the
 * trigger).
 *
 * @param event - The event on which to extend the trigger event chain.
 * @param triggerEvent - The trigger event that will becoming the new origin event.
 */
export function appendTriggerEvent(event: VdsEvent, triggerEvent?: Event) {
  // @ts-expect-error - override readonly
  (getOriginEvent(event) ?? event).triggerEvent = triggerEvent;
}
