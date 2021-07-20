export const TIME_PROGRESS_ELEMENT_TAG_NAME: "vds-time-progress";
/**
 * Formats and displays the progression of playback. The output is displayed as
 * `{currentTime}{timeSeparator}{duration}`.
 *
 * @tagname vds-time-progress
 * @csspart root - The component's root element (`<div>`).
 * @csspart current-time - The `vds-time-current` component.
 * @csspart current-time-* - All `vds-time` parts re-exported with the `current-time` prefix such as `current-time-root`.
 * @csspart duration - The `vds-time-duration` component.
 * @csspart duration-* - All `vds-time` parts re-exported with the `duration` prefix such as `duration-root`.
 * @csspart separator - The time separator element (`<span>`).
 * @example
 * ```html
 * <vds-time-progress
 *   current-time-label="Current time"
 *   duration-label="Duration"
 *   pad-hours
 *   always-show-hours
 * ></vds-time-progress>
 * ```
 * @example
 * ```css
 * vds-time-progress::part(current-time) {
 *   font-size: 16px;
 * }
 *
 * vds-time-progress::part(duration) {
 *   font-size: 16px;
 * }
 *
 * vds-time-progress::part(separator) {
 *   margin: 0 2px;
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeProgressElement extends VdsElement {
    /** @type {import('lit').CSSResultGroup} */
    static get styles(): import("lit").CSSResultGroup;
    /** @type {import('lit').PropertyDeclarations} */
    static get properties(): import("lit").PropertyDeclarations;
    /**
     * ♿ **ARIA:** The `aria-label` property for the current time.
     *
     * @type {string}
     */
    currentTimeLabel: string;
    /**
     * A string that is used to separate the current time and duration.
     *
     * @type {string}
     */
    timeSeparator: string;
    /**
     * ♿ **ARIA:** The `aria-label` property for the duration.
     *
     * @type {string}
     */
    durationLabel: string;
    alwaysShowHours: boolean;
    padHours: boolean;
    /**
     * @protected
     * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
     */
    protected rootRef: import('lit/directives/ref').Ref<HTMLDivElement>;
    /**
     * The component's root element.
     *
     * @type {HTMLDivElement}
     */
    get rootElement(): HTMLDivElement;
    /**
     * @protected
     * @type {import('lit/directives/ref').Ref<TimeCurrentElement>}
     */
    protected timeCurrentRef: import('lit/directives/ref').Ref<TimeCurrentElement>;
    /**
     * The underlying `vds-time-current` component.
     *
     * @type {TimeCurrentElement}
     */
    get timeCurrentElement(): TimeCurrentElement;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderTimeCurrent(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getTimeCurrentPartAttr(): string;
    /**
     * @protected
     * @returns {string}
     */
    protected getTimeCurrentExportPartsAttr(): string;
    /**
     * @protected
     * @type {import('lit/directives/ref').Ref<TimeDurationElement>}
     */
    protected timeDurationRef: import('lit/directives/ref').Ref<TimeDurationElement>;
    /**
     * The underlying `vds-time-duration` component.
     *
     * @type {TimeCurrentElement}
     */
    get timeDurationElement(): TimeCurrentElement;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderTimeDuration(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getTimeDurationPartAttr(): string;
    /**
     * @protected
     * @returns {string}
     */
    protected getTimeDurationExportPartsAttr(): string;
    /**
     * @protected
     * @type {import('lit/directives/ref').Ref<HTMLSpanElement>}
     */
    protected separatorRef: import('lit/directives/ref').Ref<HTMLSpanElement>;
    /**
     * The separator element.
     *
     * @type {HTMLSpanElement}
     */
    get separatorElement(): HTMLSpanElement;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderTimeSeparator(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getTimeSeparatorPartAttr(): string;
}
export namespace TIME_PROGRESS_ELEMENT_STORYBOOK_ARG_TYPES {
    namespace alwaysShowHours {
        const control: string;
        const defaultValue: boolean;
    }
    namespace currentTimeLabel {
        const control_1: string;
        export { control_1 as control };
        const defaultValue_1: string;
        export { defaultValue_1 as defaultValue };
    }
    namespace durationLabel {
        const control_2: string;
        export { control_2 as control };
        const defaultValue_2: string;
        export { defaultValue_2 as defaultValue };
    }
    namespace padHours {
        const control_3: string;
        export { control_3 as control };
        const defaultValue_3: boolean;
        export { defaultValue_3 as defaultValue };
    }
    namespace timeSeparator {
        const control_4: string;
        export { control_4 as control };
        const defaultValue_4: string;
        export { defaultValue_4 as defaultValue };
    }
    namespace mediaCurrentTime {
        const control_5: string;
        export { control_5 as control };
        const defaultValue_5: number;
        export { defaultValue_5 as defaultValue };
    }
    namespace mediaDuration {
        const control_6: string;
        export { control_6 as control };
        const defaultValue_6: number;
        export { defaultValue_6 as defaultValue };
    }
}
import { VdsElement } from "../../../foundation/elements/VdsElement.js";
import { TimeCurrentElement } from "../time-current/TimeCurrentElement.js";
import { TimeDurationElement } from "../time-duration/TimeDurationElement.js";
