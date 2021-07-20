export const FULLSCREEN_BUTTON_ELEMENT_TAG_NAME: "vds-fullscreen-button";
/**
 * A button for toggling the fullscreen mode of the player.
 *
 *
 * @tagname vds-fullscreen-button
 * @slot enter - The content to show when the `fullscreen` state is `false`.
 * @slot exit - The content to show when the `fullscreen` state is `true`.
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 * @example
 * ```html
 * <vds-fullscreen-button>
 *   <!-- Showing -->
 *   <div slot="enter"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="exit" hidden></div>
 * </vds-fullscreen-button>
 * ```
 */
export class FullscreenButtonElement extends ToggleButtonElement {
    /** @type {import('../../../foundation/context/types').ContextConsumerDeclarations} */
    static get contextConsumers(): import("../../../foundation/context/types").ContextConsumerDeclarations<any>;
    /**
     * @protected
     * @readonly
     */
    protected readonly remoteControl: MediaRemoteControl;
    /**
     * The `enter` slotted element.
     *
     * @type {HTMLElement | undefined}
     */
    get enterSlotElement(): HTMLElement | undefined;
    /**
     * The `exit` slotted element.
     *
     * @type {HTMLElement | undefined}
     */
    get exitSlotElement(): HTMLElement | undefined;
}
export const FULLSCREEN_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES: {
    label: {
        control: string;
        defaultValue: string;
    };
    pressed: {
        control: string;
        table: {
            disable: boolean;
        };
    };
    mediaFullscreen: {
        control: string;
        defaultValue: boolean;
    };
    onEnterFullscreenRequest: {
        action: "vds-enter-fullscreen-request";
        table: {
            disable: boolean;
        };
    };
    onExitFullscreenRequest: {
        action: "vds-exit-fullscreen-request";
        table: {
            disable: boolean;
        };
    };
    describedBy: {
        control: string;
    };
    disabled: {
        control: string;
    };
    onClick: {
        action: "click";
        table: {
            disable: boolean;
        };
    };
    onFocus: {
        action: "focus";
        table: {
            disable: boolean;
        };
    };
    onBlur: {
        action: "blur";
        table: {
            disable: boolean;
        };
    };
};
import { ToggleButtonElement } from "../toggle-button/ToggleButtonElement.js";
import { MediaRemoteControl } from "../../../media/controller/MediaRemoteControl.js";
