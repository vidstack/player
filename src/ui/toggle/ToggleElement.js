import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

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
      this._toggle();
    }

    super.update(changedProperties);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._currentPressedSlotElement = undefined;
    this._currentNotPressedSlotElement = undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  render() {
    return this._renderToggle();
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderToggle() {
    return html`${this._renderPressedSlot()} ${this._renderNotPressedSlot()}`;
  }

  // -------------------------------------------------------------------------------------------
  // Pressed
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {HTMLElement | undefined}
   */
  _currentPressedSlotElement;

  /**
   * The slotted element to display when the toggle is in the `pressed` state.
   *
   * @type {HTMLElement | undefined}
   */
  get pressedSlotElement() {
    return this._currentPressedSlotElement;
  }

  /**
   * @protected
   * @returns {string}
   */
  _getPressedSlotName() {
    return 'pressed';
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderPressedSlot() {
    return html`<slot
      name=${this._getPressedSlotName()}
      @slotchange=${this._handlePressedSlotChange}
    ></slot>`;
  }

  /**
   * @protected
   */
  _handlePressedSlotChange() {
    this._currentPressedSlotElement = /** @type {HTMLElement} */ (
      getSlottedChildren(this, this._getPressedSlotName())[0]
    );

    this._toggle();
  }

  // -------------------------------------------------------------------------------------------
  // Not Pressed
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {HTMLElement | undefined}
   */
  _currentNotPressedSlotElement;

  /**
   * The slotted element to display when the toggle is in the `not-pressed` state.
   *
   * @type {HTMLElement | undefined}
   */
  get notPressedSlotElement() {
    return this._currentNotPressedSlotElement;
  }

  /**
   * @protected
   * @returns {string | undefined}
   */
  _getNotPressedSlotName() {
    // Undefined here means use the default slot.
    return undefined;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderNotPressedSlot() {
    return html`<slot
      name=${ifDefined(this._getNotPressedSlotName())}
      @slotchange=${this._handleNotPressedSlotChange}
    ></slot>`;
  }

  /**
   * @protected
   */
  _handleNotPressedSlotChange() {
    this._currentNotPressedSlotElement = /** @type {HTMLElement} */ (
      getSlottedChildren(this, this._getNotPressedSlotName())[0]
    );

    this._toggle();
  }

  // -------------------------------------------------------------------------------------------
  // Toggle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   */
  _toggle() {
    this._toggleHiddenAttr(this._currentPressedSlotElement, !this.pressed);
    this._toggleHiddenAttr(this._currentNotPressedSlotElement, this.pressed);
  }

  /**
   * @protected
   * @param {HTMLElement | undefined} [el=undefined]
   * @param {boolean | undefined} [isHidden=undefined]
   */
  _toggleHiddenAttr(el, isHidden) {
    if (!isNil(el)) {
      setAttribute(el, 'hidden', isHidden ? '' : undefined);
    }
  }
}
