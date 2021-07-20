export const PLAY_BUTTON_ELEMENT_TAG_NAME: "vds-play-button";
/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 *
 * @tagname vds-play-button
 * @slot play - The content to show when the `paused` state is `true`.
 * @slot pause - The content to show when the `paused` state is `false`.
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 * @example
 * ```html
 * <vds-play-button>
 *   <!-- Showing -->
 *   <div slot="play"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="pause" hidden></div>
 * </vds-play-button>
 * ```
 */
export class PlayButtonElement extends ToggleButtonElement {
    /** @type {import('../../../foundation/context/types').ContextConsumerDeclarations} */
    static get contextConsumers(): import("../../../foundation/context/types").ContextConsumerDeclarations<any>;
    /**
     * @protected
     * @readonly
     */
    protected readonly remoteControl: MediaRemoteControl;
    /**
     * The `play` slotted element.
     *
     * @type {HTMLElement | undefined}
     */
    get playSlotElement(): HTMLElement | undefined;
    /**
     * The `pause` slotted element.
     *
     * @type {HTMLElement | undefined}
     */
    get pauseSlotElement(): HTMLElement | undefined;
}
export const PLAY_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES: {
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
    mediaPaused: {
        control: string;
        defaultValue: boolean;
    };
    onPlayRequest: {
        action: "vds-play-request";
        table: {
            disable: boolean;
        };
    };
    onPauseRequest: {
        action: "vds-pause-request";
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
