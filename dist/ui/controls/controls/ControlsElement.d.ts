export const CONTROLS_ELEMENT_TAG_NAME: "vds-controls";
/**
 * Container for holding individual media controls.
 *
 * ⚠️ **IMPORTANT:** The styling is left to you, it will only apply the following attributes:
 *
 * - `hidden`: Applied when the controls should be hidden and not available to the user.
 * - `idle`: Applied when there is no user activity for a given period, `hidden` should have greater priority.
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-paused`: Applied when media is paused.
 * - `media-view-type`: Applied with the media view type such as `audio` or `video`.
 *
 * @tagname vds-controls
 * @slot Used to pass in controls.
 * @example
 * ```html
 * <vds-controls>
 *   <vds-play-button></vds-play-button>
 *   <vds-scrubber></vds-scrubber>
 *   <vds-fullscreen-button></vds-fullscreen-button>
 * </vds-controls>
 * ```
 * @example
 * ```css
 * vds-controls {
 *   opacity: 1;
 *   transition: opacity 0.3s ease-out;
 * }
 *
 * vds-controls[hidden] {
 *   display: none;
 * }
 *
 * vds-controls[idle] {
 *   opacity: 0;
 * }
 * ```
 */
export class ControlsElement extends VdsElement {
    /** @type {import('lit').CSSResultGroup} */
    static get styles(): import("lit").CSSResultGroup;
    /**
     * @type {import('../../../foundation/context/types').ContextConsumerDeclarations}
     */
    static get contextConsumers(): import("../../../foundation/context/types").ContextConsumerDeclarations<any>;
    /**
     * @protected
     * @readonly
     */
    protected readonly managedControls: ManagedControls;
    /**
     * @protected
     * @readonly
     * @type {boolean}
     */
    protected readonly mediaCanPlay: boolean;
    /**
     * @type {boolean}
     */
    controlsHidden: boolean;
    /**
     * @protected
     * @readonly
     * @type {boolean}
     */
    protected readonly controlsIdle: boolean;
    /**
     * @protected
     * @readonly
     * @type {boolean}
     */
    protected readonly mediaPaused: boolean;
    /**
     * @protected
     * @readonly
     * @type {ViewType}
     */
    protected readonly mediaViewType: ViewType;
}
import { VdsElement } from "../../../foundation/elements/VdsElement.js";
import { ManagedControls } from "../../../media/controls/ManagedControls.js";
import { ViewType } from "../../../media/ViewType.js";
