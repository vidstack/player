import { TimeElementProps } from '../time.js';
import { TimeCurrentElement } from '../time-current.js';
import { TimeDurationElement } from '../time-duration.js';

export type TimeProgressDisplay = TimeProgressElementProps;

export type TimeProgressElementProps = Omit<
	TimeElementProps,
	'rootElement' | 'seconds' | 'label'
> & {
	/**
	 * ♿ **ARIA:** The `aria-label` property for the current time.
	 */
	currentTimeLabel: string;

	/**
	 * ♿ **ARIA:** The `aria-label` property for the duration.
	 */
	durationLabel: string;

	/**
	 * A string that is used to separate the current time and duration.
	 */
	timeSeparator: string;

	/**
	 * The component's root element.
	 *
	 * @default HTMLDivElement
	 */
	readonly rootElement: HTMLDivElement;

	/**
	 * The underlying `vds-time-current` component.
	 *
	 * @default TimeCurrent
	 */
	readonly timeCurrentElement: TimeCurrentElement;

	/**
	 * The underlying `vds-time-duration` component.
	 *
	 * @default TimeDuration
	 */
	readonly timeDurationElement: TimeDurationElement;

	/**
	 * The separator element.
	 *
	 * @default HTMLSpanElement
	 */
	readonly separatorElement: HTMLSpanElement;
};
