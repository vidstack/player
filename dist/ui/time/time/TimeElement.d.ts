export const TIME_ELEMENT_TAG_NAME: "vds-time";
/**
 * Formats and displays a length of time given in `seconds`.
 *
 * @tagname vds-time
 * @csspart root - The component's root element (`<time>`).
 * @example
 * ```html
 * <vds-time seconds="50"></vds-time>
 * ```
 * @example
 * ```html
 * <vds-time
 *   label="Current time"
 *   seconds="3650"
 *   pad-hours
 *   always-show-hours
 * ></vds-time>
 * ```
 * @example
 * ```css
 * vds-time::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeElement extends VdsElement {
    /** @type {import('lit').CSSResultGroup} */
    static get styles(): import("lit").CSSResultGroup;
    /** @type {import('lit').PropertyDeclarations} */
    static get properties(): import("lit").PropertyDeclarations;
    /**
     * ♿ **ARIA:** The `aria-label` property of the time.
     *
     * @type {string | undefined}
     */
    label: string | undefined;
    /**
     * The length of time in seconds.
     *
     * @type {number}
     */
    seconds: number;
    /**
     * Whether the time should always show the hours unit, even if the time is less than
     * 1 hour.
     *
     * @type {boolean}
     * @example `20:30` -> `0:20:35`
     */
    alwaysShowHours: boolean;
    /**
     * Whether the hours unit should be padded with zeroes to a length of 2.
     *
     * @type {boolean}
     * @example `1:20:03` -> `01:20:03`
     */
    padHours: boolean;
    /**
     * @protected
     * @readonly
     * @type {import('lit/directives/ref').Ref<HTMLTimeElement>}
     */
    protected readonly rootRef: import('lit/directives/ref').Ref<HTMLTimeElement>;
    /**
     * The component's root element.
     *
     * @type {HTMLTimeElement}
     */
    get rootElement(): HTMLTimeElement;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderRootChildren(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string} The seconds formatted into human readable form.
     */
    protected getFormattedTime(): string;
    /**
     * @protected
     * @returns {string} A valid HTML5 duration.
     * @see https://www.w3.org/TR/2014/REC-html5-20141028/infrastructure.html#valid-duration-string
     */
    protected getFormattedDuration(): string;
    /**
     * Override this to modify root CSS Classes.
     *
     * @protected
     * @returns {string}
     */
    protected getRootClassAttr(): string;
    /**
     * Override this to modify root CSS parts.
     *
     * @protected
     * @returns {string}
     */
    protected getRootPartAttr(): string;
}
export namespace TIME_ELEMENT_STORYBOOK_ARG_TYPES {
    namespace alwaysShowHours {
        const control: string;
        const defaultValue: boolean;
    }
    namespace label {
        const control_1: string;
        export { control_1 as control };
    }
    namespace padHours {
        const control_2: string;
        export { control_2 as control };
        const defaultValue_1: boolean;
        export { defaultValue_1 as defaultValue };
    }
    namespace seconds {
        const control_3: string;
        export { control_3 as control };
        const defaultValue_2: number;
        export { defaultValue_2 as defaultValue };
    }
}
import { VdsElement } from "../../../foundation/elements/VdsElement.js";
