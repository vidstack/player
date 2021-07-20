export const TIME_CURRENT_ELEMENT_TAG_NAME: "vds-time-current";
/**
 * Formats and displays the `currentTime` of media playback. Do not mess with the component's
 * `seconds` property as it's automatically managed.
 *
 *
 * @tagname vds-time-current
 * @csspart root - The component's root element (`<time>`).
 * @example
 * ```html
 * <vds-time-current
 *   label="Current time"
 *   pad-hours
 *   always-show-hours
 * ></vds-time-current>
 * ```
 * @example
 * ```css
 * vds-time-current::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeCurrentElement extends TimeElement {
    /** @type {import('../../../foundation/context/types').ContextConsumerDeclarations} */
    static get contextConsumers(): import("../../../foundation/context/types").ContextConsumerDeclarations<any>;
}
export const TIME_CURRENT_ELEMENT_STORYBOOK_ARG_TYPES: {
    seconds: {
        table: {
            disable: boolean;
        };
    };
    mediaCurrentTime: {
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
