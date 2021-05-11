import { LIB_PREFIX } from './constants';
import { Writeable } from './types';

export type EventRecord = {
  [EventType: string]: VdsCustomEvent<unknown>;
};

export interface VdsEventInit<DetailType> extends CustomEventInit<DetailType> {
  readonly originalEvent?: Event;
}

export interface VdsCustomEventConstructor<DetailType> {
  readonly TYPE: string;
  new (eventInit?: VdsEventInit<DetailType>): VdsCustomEvent<DetailType>;
}

export type VdsEvents<EventRecordType> = {
  [EventType in Extract<
    keyof EventRecordType,
    string
  > as `${typeof LIB_PREFIX}-${EventType}`]: EventRecordType[EventType];
};

export type ExtractEventDetailType<Type> = Type extends VdsCustomEvent<infer X>
  ? X
  : void;

export class VdsCustomEvent<DetailType> extends CustomEvent<DetailType> {
  static readonly TYPE: string;

  readonly originalEvent?: Event;

  /**
   * Walks up the event chain (following each `originalEvent`) and returns the origin event
   * that started the chain.
   */
  get originEvent(): Event | undefined {
    let originalEvent = this.originalEvent as VdsCustomEvent<unknown>;

    while (originalEvent && originalEvent.originalEvent) {
      originalEvent = originalEvent.originalEvent as VdsCustomEvent<unknown>;
    }

    return originalEvent;
  }

  /**
   * Walks up the event chain (following each `originalEvent`) and determines whether the initial
   * event was triggered by the end user (ie: check whether `isTrusted` on the `originEvent` `true`).
   */
  get isOriginTrusted(): boolean {
    return this.originEvent?.isTrusted ?? false;
  }

  constructor(typeArg: string, eventInit?: VdsEventInit<DetailType>) {
    const { originalEvent, ...init } = eventInit ?? {};
    super(typeArg, init);
    this.originalEvent = originalEvent;
  }
}

export function redispatchNativeEvent(
  el: HTMLElement,
  originalEvent: Event,
): void {
  const event = new VdsCustomEvent(originalEvent.type, {
    originalEvent,
    bubbles: originalEvent.bubbles,
    cancelable: originalEvent.cancelable,
    composed: originalEvent.composed,
  });

  const constructor = (event.constructor as unknown) as Writeable<
    VdsCustomEventConstructor<unknown>
  >;

  constructor.TYPE = originalEvent.type;

  el.dispatchEvent(event);
}
