import { mediaContext } from '../../../media/index.js';
import { StorybookControlType } from '../../../shared/storybook/index.js';
import {
	TimeElement,
	VDS_TIME_ELEMENT_STORYBOOK_ARG_TYPES
} from '../time/index.js';

export const VDS_TIME_CURRENT_ELEMENT_TAG_NAME = 'vds-time-current';

/** @typedef {import('./types').CurrentTimeDisplay} CurrentTimeDisplay */

/**
 * Formats and displays the `currentTime` of media playback. Do not mess with the component's
 * `seconds` property as it's automatically managed.
 *
 * @implements {CurrentTimeDisplay}
 *
 * @tagname vds-time-current
 *
 * @csspart root - The component's root element (`<time>`).
 *
 * @example
 * ```html
 * <vds-time-current
 *   label="Current time"
 *   pad-hours
 *   always-show-hours
 * ></vds-time-current>
 * ```
 *
 * @example
 * ```css
 * vds-time-current::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeCurrentElement extends TimeElement {
	constructor() {
		super();

		// Properties
		this.label = 'Current time';

		// Context
		/** @internal @readonly @type {number} */
		this.seconds = mediaContext.currentTime.initialValue;
	}

	/** @type {import('../../../shared/context').ContextConsumerDeclarations} */
	static get contextConsumers() {
		return {
			seconds: mediaContext.currentTime
		};
	}
}

/**
 * @readonly
 * @type {import('./types').TimeCurrentElementStorybookArgTypes}
 */
export const VDS_TIME_CURRENT_ELEMENT_STORYBOOK_ARG_TYPES = {
	...VDS_TIME_ELEMENT_STORYBOOK_ARG_TYPES,
	// @ts-ignore
	seconds: { table: { disable: true } },
	mediaCurrentTime: { control: StorybookControlType.Number, defaultValue: 1800 }
};
