export const MUTE_BUTTON_ELEMENT_TAG_NAME: "vds-mute-button";
/**
 * A button for toggling the muted state of the player.
 *
 * @tagname vds-mute-button
 * @slot mute - The content to show when the `muted` state is `false`.
 * @slot unmute - The content to show when the `muted` state is `true`.
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 * @example
 * ```html
 * <vds-mute-button>
 *   <!-- Showing -->
 *   <div slot="mute"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="unmute" hidden></div>
 * </vds-mute-button>
 * ```
 */
export class MuteButtonElement extends ToggleButtonElement {
    /** @type {import('../../../foundation/context/types').ContextConsumerDeclarations} */
    static get contextConsumers(): import("../../../foundation/context/types").ContextConsumerDeclarations<any>;
    /**
     * @protected
     * @readonly
     */
    protected readonly remoteControl: MediaRemoteControl;
    /**
     * The `mute` slotted element.
     *
     * @type {HTMLElement | undefined}
     */
    get muteSlotElement(): HTMLElement | undefined;
    /**
     * The `unmute` slotted element.
     *
     * @type {HTMLElement | undefined}
     */
    get unmuteSlotElement(): HTMLElement | undefined;
}
export const MUTE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES: {
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
    mediaMuted: {
        control: string;
        defaultValue: boolean;
    };
    onMuteRequest: {
        action: "vds-mute-request";
        table: {
            disable: boolean;
        };
    };
    onUnmuteRequest: {
        action: "vds-unmute-request";
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
