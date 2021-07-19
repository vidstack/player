import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { StorybookControl } from '../../foundation/storybook/index.js';
import { getSlottedChildren, setAttribute } from '../../utils/dom.js';
import { isNil } from '../../utils/unit.js';
import { toggleElementStyles } from './styles.js';

export const TOGGLE_ELEMENT_TAG_NAME = 'vds-toggle';

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
export class ToggleElement extends LitElement {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [toggleElementStyles];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * Whether the toggle is in the `pressed` state.
   *
   * @type {boolean}
   */
  @property({ type: Boolean, reflect: true })
  pressed = false;

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  update(changedProperties) {
    if (changedProperties.has('pressed')) {
      this.toggle();
    }

    super.update(changedProperties);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.currentPressedSlotElement = undefined;
    this.currentNotPressedSlotElement = undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  render() {
    return this.renderToggle();
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderToggle() {
    return html`${this.renderPressedSlot()} ${this.renderNotPressedSlot()}`;
  }

  // -------------------------------------------------------------------------------------------
  // Pressed
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {HTMLElement | undefined}
   */
  currentPressedSlotElement;

  /**
   * The slotted element to display when the toggle is in the `pressed` state.
   *
   * @type {HTMLElement | undefined}
   */
  get pressedSlotElement() {
    return this.currentPressedSlotElement;
  }

  /**
   * @protected
   * @returns {string}
   */
  getPressedSlotName() {
    return 'pressed';
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderPressedSlot() {
    return html`<slot
      name=${this.getPressedSlotName()}
      @slotchange=${this.handlePressedSlotChange}
    ></slot>`;
  }

  /**
   * @protected
   */
  handlePressedSlotChange() {
    this.currentPressedSlotElement = /** @type {HTMLElement} */ (
      getSlottedChildren(this, this.getPressedSlotName())[0]
    );

    this.toggle();
  }

  // -------------------------------------------------------------------------------------------
  // Not Pressed
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {HTMLElement | undefined}
   */
  currentNotPressedSlotElement;

  /**
   * The slotted element to display when the toggle is in the `not-pressed` state.
   *
   * @type {HTMLElement | undefined}
   */
  get notPressedSlotElement() {
    return this.currentNotPressedSlotElement;
  }

  /**
   * @protected
   * @returns {string | undefined}
   */
  getNotPressedSlotName() {
    // Undefined here means use the default slot.
    return undefined;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderNotPressedSlot() {
    return html`<slot
      name=${ifDefined(this.getNotPressedSlotName())}
      @slotchange=${this.handleNotPressedSlotChange}
    ></slot>`;
  }

  /**
   * @protected
   */
  handleNotPressedSlotChange() {
    this.currentNotPressedSlotElement = /** @type {HTMLElement} */ (
      getSlottedChildren(this, this.getNotPressedSlotName())[0]
    );

    this.toggle();
  }

  // -------------------------------------------------------------------------------------------
  // Toggle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   */
  toggle() {
    this.toggleHiddenAttr(this.currentPressedSlotElement, !this.pressed);
    this.toggleHiddenAttr(this.currentNotPressedSlotElement, this.pressed);
  }

  /**
   * @protected
   * @param {HTMLElement | undefined} [el=undefined]
   * @param {boolean | undefined} [isHidden=undefined]
   */
  toggleHiddenAttr(el, isHidden) {
    if (!isNil(el)) {
      setAttribute(el, 'hidden', isHidden ? '' : undefined);
    }
  }
}

export const TOGGLE_ELEMENT_STORYBOOK_ARG_TYPES = {
  pressed: { control: StorybookControl.Boolean, defaultValue: false }
};
