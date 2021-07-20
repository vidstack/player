export const MEDIA_UI_ELEMENT_TAG_NAME: "vds-media-ui";
/**
 * Simple container that holds a collection of user interface components.
 *
 * This is a general container to hold your UI components but it also enables you to show/hide
 * the player UI when media is not ready for playback by applying styles to the `root/root-hidden`
 * CSS parts. It also handles showing/hiding UI depending on whether native UI can't be
 * hidden (*cough* iOS).
 *
 * ⚠️ **IMPORTANT:** The styling is left to you, it will only apply the `root-hidden` CSS part.
 *
 * @tagname vds-media-ui
 * @slot Used to pass in UI components.
 * @csspart root - The component's root element (`<div>`).
 * @csspart root-hidden - Applied when the media is NOT ready for playback and the UI should be hidden.
 */
export class MediaUiElement extends VdsElement {
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
    protected mediaFullscreen: boolean;
    /**
     * @protected
     * @type {boolean}
     */
    protected mediaIsVideoView: boolean;
    /**
     * @protected
     * @type {boolean}
     */
    protected mediaPlaysinline: boolean;
    /**
     * @protected
     * @readonly
     * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
     */
    protected readonly rootRef: import('lit/directives/ref').Ref<HTMLDivElement>;
    /**
     * The component's root element.
     *
     * @type {HTMLDivElement}
     */
    get rootElement(): HTMLDivElement;
    /**
     * Override this to modify the content rendered inside the root UI container.
     *
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderRootChildren(): import('lit').TemplateResult;
    /**
     * Override this to modify rendering of default slot.
     *
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderDefaultSlot(): import('lit').TemplateResult;
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
    /**
     * Whether the UI should be hidden.
     *
     * @protected
     * @returns {boolean}
     */
    protected isUiHidden(): boolean;
}
import { VdsElement } from "../../foundation/elements/VdsElement.js";
