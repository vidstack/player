import { LIB_PREFIX } from '../../shared/constants';
import { VdsCustomEvent } from '../shared/events';

export interface VdsEventInit<DetailType> extends CustomEventInit<DetailType> {
	readonly originalEvent?: Event;
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
