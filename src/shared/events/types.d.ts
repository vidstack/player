import { LIB_PREFIX } from '../constants';
import { VdsCustomEvent } from '.';

export interface VdsEventInit<DetailType> extends CustomEventInit<DetailType> {
	readonly originalEvent?: Event;
}

export interface EventHandlerRecord {
	[eventType: string]: (event: Event) => void;
}

export type VdsEvents<EventRecordType> = {
	[EventType in Extract<
		keyof EventRecordType,
		string
	> as `${typeof LIB_PREFIX}-${EventType}`]: EventRecordType[EventType];
};

export type ExtractCustomEventDetail<
	EventType extends CustomEvent
> = EventType extends CustomEvent<infer X> ? X : void;

export type ExtractCustomEventInit<
	EventType extends CustomEventInit
> = EventType extends CustomEvent<infer X>
	? VdsEventInit<X>
	: VdsEventInit<any>;

export type ExtractVdsEventInit<
	EventType extends VdsCustomEvent
> = EventType extends VdsCustomEvent<infer X>
	? VdsEventInit<X>
	: VdsEventInit<any>;
