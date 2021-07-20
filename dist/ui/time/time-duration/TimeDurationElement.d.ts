export const TIME_DURATION_ELEMENT_TAG_NAME: "vds-time-duration";
/**
 * Formats and displays the `duration` of the current media. Do not mess with the component's
 * `seconds` property as it's automatically managed.
 *
 * @tagname vds-time-duration
 * @csspart root - The component's root element (`<time>`).
 * @example
 * ```html
 * <vds-time-duration
 *   label="Duration"
 *   pad-hours
 *   always-show-hours
 * ></vds-time-duration>
 * ```
 * @example
 * ```css
 * vds-time-duration::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeDurationElement extends TimeElement {
    /** @type {import('../../../foundation/context/types').ContextConsumerDeclarations} */
    static get contextConsumers(): import("../../../foundation/context/types").ContextConsumerDeclarations<any>;
}
export const TIME_DURATION_ELEMENT_STORYBOOK_ARG_TYPES: {
    seconds: {
        table: {
            disable: boolean;
        };
    };
    mediaDuration: {
        control: string;
        defaultValue: number;
    };
    alwaysShowHours: {
        control: string;
        defaultValue: boolean;
    };
    label: {
        control: string;
    };
    padHours: {
        control: string;
        defaultValue: boolean;
    };
};
import { TimeElement } from "../time/TimeElement.js";
