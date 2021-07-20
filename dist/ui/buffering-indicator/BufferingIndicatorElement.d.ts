export const BUFFERING_INDICATOR_ELEMENT_TAG_NAME: "vds-buffering-indicator";
/**
 * Display an indicator when either the provider/media is booting or media playback has
 * stopped because of a lack of temporary data.
 *
 * ⚠️ **IMPORTANT:** The styling is left to you, it will only apply the following attributes:
 *
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-waiting`: Applied when playback has stopped because of a lack of temporary data.
 *
 * @tagname vds-buffering-indicator
 * @slot Used to pass in the content to be displayed while buffering.
 * @example
 * ```html
 * <vds-buffering-indicator>
 *   <!-- ... -->
 * </vds-buffering-indicator>
 * ```
 * @example
 * ```css
 * vds-buffering-indicator {
 *   opacity: 0;
 *   transition: opacity 0.3s ease-out;
 *   transition-delay: 500ms;
 * }
 *
 * vds-buffering-indicator[media-waiting],
 * vds-buffering-indicator:not([media-can-play]) {
 *   opacity: 1;
 * }
 * ```
 */
export class BufferingIndicatorElement extends VdsElement {
    /** @type {import('lit').CSSResultGroup} */
    static get styles(): import("lit").CSSResultGroup;
    /** @type {import('../../foundation/context/types').ContextConsumerDeclarations} */
    static get contextConsumers(): import("../../foundation/context/types").ContextConsumerDeclarations<any>;
    /**
     * @protected
     * @type {boolean}
     */
    protected mediaCanPlay: boolean;
    /**
     * @protected
     * @type {boolean}
     */
    protected mediaWaiting: boolean;
}
export namespace BUFFERING_INDICATOR_ELEMENT_STORYBOOK_ARG_TYPES {
    namespace mediaCanPlay {
        const control: string;
        const defaultValue: boolean;
    }
    namespace mediaBuffering {
        const control_1: string;
        export { control_1 as control };
        const defaultValue_1: boolean;
        export { defaultValue_1 as defaultValue };
    }
}
import { VdsElement } from "../../foundation/elements/VdsElement.js";
