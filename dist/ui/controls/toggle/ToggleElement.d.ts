export const TOGGLE_ELEMENT_TAG_NAME: "vds-toggle";
/**
 * A toggle component to render different state depending on whether it's pressed or not. This
 * component will always render both the `pressed` and the default slots regardless of the current
 * state so you can perform CSS animations. A `hidden` attribute will be applied to the slot
 * that's currently not active.
 *
 * @tagname vds-toggle
 * @slot The content to show when the toggle is not pressed.
 * @slot pressed - The content to show when the toggle is pressed.
 * @example
 * ```html
 * <vds-toggle pressed>
 *   <!-- Showing -->
 *   <div slot="pressed"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div hidden></div>
 * </vds-toggle>
 * ```
 */
export class ToggleElement extends VdsElement {
    /** @type {import('lit').CSSResultGroup} */
    static get styles(): import("lit").CSSResultGroup;
    /** @type {import('lit').PropertyDeclarations} */
    static get properties(): import("lit").PropertyDeclarations;
    /**
     * Whether the toggle is in the `pressed` state.
     *
     * @type {boolean}
     */
    pressed: boolean;
    /**
     * @protected
     * @type {HTMLElement | undefined}
     */
    protected currentPressedSlotElement: HTMLElement | undefined;
    /**
     * @protected
     * @type {HTMLElement | undefined}
     */
    protected currentNotPressedSlotElement: HTMLElement | undefined;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderToggle(): import('lit').TemplateResult;
    /**
     * The slotted element to display when the toggle is in the `pressed` state.
     *
     * @type {HTMLElement | undefined}
     */
    get pressedSlotElement(): HTMLElement | undefined;
    /**
     * @protected
     * @returns {string}
     */
    protected getPressedSlotName(): string;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderPressedSlot(): import('lit').TemplateResult;
    /**
     * @protected
     */
    protected handlePressedSlotChange(): void;
    /**
     * The slotted element to display when the toggle is in the `not-pressed` state.
     *
     * @type {HTMLElement | undefined}
     */
    get notPressedSlotElement(): HTMLElement | undefined;
    /**
     * @protected
     * @returns {string | undefined}
     */
    protected getNotPressedSlotName(): string | undefined;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderNotPressedSlot(): import('lit').TemplateResult;
    /**
     * @protected
     */
    protected handleNotPressedSlotChange(): void;
    /**
     * @protected
     */
    protected toggle(): void;
    /**
     * @protected
     * @param {HTMLElement | undefined} [el=undefined]
     * @param {boolean | undefined} [isHidden=undefined]
     */
    protected toggleHiddenAttr(el?: HTMLElement | undefined, isHidden?: boolean | undefined): void;
}
export namespace TOGGLE_ELEMENT_STORYBOOK_ARG_TYPES {
    namespace pressed {
        const control: string;
        const defaultValue: boolean;
    }
}
import { VdsElement } from "../../../foundation/elements/VdsElement.js";
