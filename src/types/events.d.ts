import { LIB_PREFIX } from '../../shared/constants';
import { VdsCustomEvent } from '../../shared/events';

export interface VdsEventInit<DetailType> extends CustomEventInit<DetailType> {
	readonly originalEvent?: Event;
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
