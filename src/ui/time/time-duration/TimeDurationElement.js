import { mediaContext } from '../../../media/index.js';
import { StorybookControlType } from '../../../shared/storybook/index.js';
import {
	TimeElement,
	VDS_TIME_ELEMENT_STORYBOOK_ARG_TYPES
} from '../time/index.js';

export const VDS_TIME_DURATION_ELEMENT_TAG_NAME = 'vds-time-duration';

/**
 * Formats and displays the `duration` of the current media. Do not mess with the component's
 * `seconds` property as it's automatically managed.
 *
 * @tagname vds-time-duration
 *
 * @csspart root - The component's root element (`<time>`).
 *
 * @example
 * ```html
 * <vds-time-duration
 *   label="Duration"
 *   pad-hours
 *   always-show-hours
 * ></vds-time-duration>
 * ```
 *
 * @example
 * ```css
 * vds-time-duration::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeDurationElement extends TimeElement {
	constructor() {
		super();

		// Properties
		this.label = 'Duration';

		// Context
		/** @internal @readonly @type {number} */
		this.seconds = mediaContext.currentTime.initialValue;
	}

	/** @type {import('../../../shared/context').ContextConsumerDeclarations} */
	static get contextConsumers() {
		return {
			seconds: {
				context: mediaContext.duration,
				// Duration can be -1 when unknown but we want to display >=0.
				transform: (d) => (d >= 0 ? d : 0)
			}
		};
	}
}

/**
 * @readonly
 * @type {import('./types').TimeDurationElementStorybookArgTypes}
 */
export const VDS_TIME_DURATION_ELEMENT_STORYBOOK_ARG_TYPES = {
	...VDS_TIME_ELEMENT_STORYBOOK_ARG_TYPES,
	// @ts-ignore
	seconds: { table: { disable: true } },
	mediaDuration: { control: StorybookControlType.Number, defaultValue: 1800 }
};
