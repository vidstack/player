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
 * Walks up the event chain (following each `triggerEvent`) and returns the origin event
 * that started the chain.
 *
 * @param event
 */
export function getOriginEvent(event: VdsEvent): Event | undefined {
  let triggerEvent = event.triggerEvent as VdsEvent;

  while (triggerEvent && triggerEvent.triggerEvent) {
    triggerEvent = triggerEvent.triggerEvent as VdsEvent;
  }

  return triggerEvent;
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
): GlobalEventHandlersEventMap[EventType] {
  return new VdsEvent(type, eventInit);
}

export function isVdsEvent(
  event: Event | undefined
): event is VdsEvent<unknown> {
  // eslint-disable-next-line no-prototype-builtins
  return event?.hasOwnProperty('triggerEvent') ?? false;
}
