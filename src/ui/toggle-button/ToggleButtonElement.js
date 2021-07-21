import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

import { ifNonEmpty, on } from '../../foundation/directives/index.js';
import { WithFocus } from '../../foundation/elements/index.js';
import { toggleButtonElementStyles } from './styles.js';

export const TOGGLE_BUTTON_ELEMENT_TAG_NAME = 'vds-toggle-button';

/**
 * The foundation for any toggle button such as a `play-button` or `mute-button`.
 *
 *
 * @tagname vds-toggle-button
 * @csspart button - The button element (`<button>`).
 * @slot - Used to pass content into the toggle for showing pressed and not pressed states.
 * @example
 * ```html
 * <vds-toggle-button label="Some action">
 *   <div class="pressed">Pressed</div>
 *   <div class="not-pressed">Not Pressed</div>
 * </vds-toggle-button>
 * ```
 * @example
 * ```css
 * vds-toggle-button[pressed] .pressed {
 *   display: none;
 * }
 *
 * vds-toggle-button:not([pressed]) .not-pressed {
 *  display: none;
 * }
 * ```
 */
export class ToggleButtonElement extends WithFocus(LitElement) {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [toggleButtonElementStyles];
  }

  /** @type {string[]} */
  static get parts() {
    return ['button'];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * ♿ **ARIA:** The `aria-label` property of the underlying button.
   *
   * @type {string | undefined}
   */
  @property()
  label;

  /**
   * Whether the underlying button should be disabled (not-interactable).
   *
   * @type {boolean}
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * ♿ **ARIA:** Identifies the element (or elements) that describes the underlying button.
   *
   * @type {string | undefined}
   */
  @property({ attribute: 'described-by', reflect: true })
  describedBy;

  /**
   * @protected
   * @type {boolean}
   */
  @property({ attribute: 'pressed', type: Boolean, reflect: true })
  _pressed = false;

  /**
   * Whether the toggle is in the `pressed` state.
   *
   * @returns {boolean}
   */
  get isPressed() {
    return this._pressed;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  render() {
    return this._renderButton();
  }

  // -------------------------------------------------------------------------------------------
  // Button
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {import('lit/directives/ref').Ref<HTMLButtonElement>}
   */
  _buttonRef = createRef();

  /**
   * The component's `<button>` element.
   *
   * @type {HTMLButtonElement}
   */
  get buttonElement() {
    return /** @type {HTMLButtonElement} */ (this._buttonRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderButton() {
    return html`
      <button
        id="button"
        part=${this._getButtonPartAttr()}
        aria-label=${ifNonEmpty(this.label)}
        aria-pressed=${this._pressed ? 'true' : 'false'}
        aria-described-by=${ifNonEmpty(this.describedBy)}
        ?disabled=${this.disabled}
        ${on('click', this._handleButtonClick)}
        ${on('click', this._handleButtonClickCapture, { capture: true })}
        ${ref(this._buttonRef)}
      >
        ${this._renderButtonChildren()}
      </button>
    `;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderButtonChildren() {
    return this._renderDefaultSlot();
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderDefaultSlot() {
    return html`<slot></slot>`;
  }

  /**
   * Override this to modify root CSS parts.
   *
   * @protected
   * @returns {string}
   */
  _getButtonPartAttr() {
    return 'button';
  }

  click() {
    if (this.disabled) return;
    this.buttonElement.click();
  }

  /**
   * @protected
   * @param {Event} event
   */
  _handleButtonClick(event) {
    this._pressed = !this._pressed;
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {boolean}
   */
  _handleButtonClickCapture(event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }

    return true;
  }
}
