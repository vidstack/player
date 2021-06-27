import { VdsCustomEvent } from '.';

export interface VdsEventInit<DetailType> extends CustomEventInit<DetailType> {
  readonly originalEvent?: Event;
}

export type EventCallback = <EventType extends Event>(event: EventType) => void;

export type EventHandlerRecord = {
  [EventType in keyof GlobalEventHandlersEventMap]?: (
    event: GlobalEventHandlersEventMap[EventType]
  ) => void;
};

export type VdsEvents<EventRecordType> = {
  [EventType in Extract<
    keyof EventRecordType,
    string
  > as `vds-${EventType}`]: EventRecordType[EventType];
};

export type ExtractCustomEventDetail<EventType extends CustomEvent> =
  EventType extends CustomEvent<infer X> ? X : void;

export type ExtractCustomEventInit<EventType extends CustomEventInit> =
  EventType extends CustomEvent<infer X> ? VdsEventInit<X> : VdsEventInit<any>;

export type ExtractVdsEventInit<EventType extends VdsCustomEvent<unknown>> =
  EventType extends VdsCustomEvent<infer X>
    ? VdsEventInit<X>
    : VdsEventInit<any>;
