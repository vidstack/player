import { PascalCase } from '../types/string.js';
import { Callback, WritableKeys } from '../types/utils.js';
import { StorybookControlType } from './StorybookControlType.js';

export type StorybookPropArgTypes<Props> = {
	[P in WritableKeys<Props>]: StorybookArgType & {
		control: StorybookControl;
	};
};

export type StorybookEventArgTypes<Events> = {
	[P in keyof Events as DOMEventToPascalCase<P>]: Omit<
		StorybookArgType,
		'control' | 'labels' | 'options'
	> & {
		action: keyof Events;
	};
};

export type StorybookArgTypes<
	Props,
	Events = {}
> = StorybookPropArgTypes<Props> & StorybookEventArgTypes<Events>;

export type DOMEventToPascalCase<EventType> = `on${PascalCase<
	EventType & string
>}`;

export type StorybookArgs<Props, Events = {}> = StorybookPropArgs<Props> &
	StorybookActionArgs<Events>;

export type StorybookPropArgs<Props> = {
	[P in WritableKeys<Props>]: Props[P];
};

export type StorybookActionArgs<Events> = {
	[P in keyof Events as DOMEventToPascalCase<P>]: Callback<Events[P]>;
};

export type StorybookArgType = {
	name?: string;
	control?: StorybookControl;
	defaultValue?: unknown;
	labels?: string[];
	action?: string;
	options?: (string | number)[];
	table?: {
		disable?: boolean;
	};
};

export type StorybookControl =
	| false
	| StorybookControlType
	| {
			type?: StorybookControlType;
			disable?: boolean;
			// Number or Range
			min?: number;
			max?: number;
			step?: number;
	  };
