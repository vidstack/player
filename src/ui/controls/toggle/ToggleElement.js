import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { VdsElement } from '../../../shared/elements/index.js';
import { StorybookControlType } from '../../../shared/storybook/index.js';
import { getSlottedChildren, setAttribute } from '../../../utils/dom.js';
import { isNil } from '../../../utils/unit.js';
import { toggleElementStyles } from './css.js';

export const VDS_TOGGLE_ELEMENT_TAG_NAME = 'vds-toggle';

/** @typedef {import('./types').Toggle} Toggle */

/**
 * A toggle component to render different state depending on whether it's pressed or not. This
 * component will always render both the `pressed` and the default slots regardless of the current
 * state so you can perform CSS animations. A `hidden` attribute will be applied to the slot
 * that's currently not active.
 *
 * @implements {Toggle}
 *
 * @tagname vds-toggle
 *
 * @slot The content to show when the toggle is not pressed.
 * @slot pressed - The content to show when the toggle is pressed.
 *
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
  static get styles() {
    return [toggleElementStyles];
  }

  constructor() {
    super();

    // Properties
    /** @type {boolean} */
    this.pressed = false;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /** @type {import('lit').PropertyDeclarations} */
  static get properties() {
    return {
      pressed: { type: Boolean, reflect: true }
    };
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  disconnectedCallback() {
    super.disconnectedCallback();
    this.currentPressedSlotElement = undefined;
    this.currentNotPressedSlotElement = undefined;
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has('pressed')) {
      this.toggle();
    }
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
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
   */
  toggle() {
    this.toggleHiddenAttr(this.currentPressedSlotElement, !this.pressed);
    this.toggleHiddenAttr(this.currentNotPressedSlotElement, this.pressed);
  }

  /**
   * @protected
   * @param {HTMLElement | undefined} [el=undefined]
   * @param {boolean | undefined} [isHidden=undefined]
   * @returns {void}
   */
  toggleHiddenAttr(el, isHidden) {
    if (!isNil(el)) {
      setAttribute(el, 'hidden', isHidden ? '' : undefined);
    }
  }
}

/**
 * @readonly
 * @type {import('./types').ToggleElementStorybookArgTypes}
 */
export const VDS_TOGGLE_ELEMENT_STORYBOOK_ARG_TYPES = {
  pressed: { control: StorybookControlType.Boolean, defaultValue: false }
};
