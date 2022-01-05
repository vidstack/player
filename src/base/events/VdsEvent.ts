export type VdsEventInit<DetailType> = CustomEventInit<DetailType> & {
  readonly originalEvent?: Event;
};

export class VdsEvent<DetailType = unknown> extends CustomEvent<DetailType> {
  readonly originalEvent?: Event;

  /**
   * Walks up the event chain (following each `originalEvent`) and returns the origin event
   * that started the chain.
   */
  get originEvent(): Event {
    return getOriginEvent(this) ?? this;
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
  return event?.hasOwnProperty('originalEvent') ?? false;
}
