import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';

import { ifNonEmpty } from '../../../foundation/directives/index.js';
import { VdsElement, WithFocus } from '../../../foundation/elements/index.js';
import { listen } from '../../../foundation/events/index.js';
import { storybookAction } from '../../../foundation/storybook/helpers.js';
import { StorybookControlType } from '../../../foundation/storybook/StorybookControlType.js';
import { isUndefined } from '../../../utils/unit.js';
import { buttonElementStyles } from './styles.js';

export const BUTTON_ELEMENT_TAG_NAME = 'vds-button';

/** @typedef {'button' | 'submit' | 'reset' | 'menu'} ButtonType */

/**
 * Base control that is basically a naked (not styled) button that helps manage ARIA
 * attributes and normalizes any web-component or cross-browser related issues.
 *
 * @tagname vds-button
 *
 * @slot Used to pass content into the button.
 *
 * @csspart root - The component's root element (`<button>`).
 *
 * @example
 * ```html
 * <vds-button>
 *   <!-- ... -->
 * </vds-button>
 * ```
 *
 * @example
 * ```css
 * vds-button::part(root) {
 *   transform: scale(1);
 *   transition: transform 0.3s linear;
 * }
 *
 * vds-button::part(root):hover,
 * vds-button::part(root):focus {
 *   outline: 0;
 *   transform: scale(1.05);
 * }
 * ```
 */
export class ButtonElement extends WithFocus(VdsElement) {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [buttonElementStyles];
  }

  /** @type {string[]} */
  static get parts() {
    return ['root'];
  }

  constructor() {
    super();

    // Properties
    /**
     * ♿ **ARIA:** The `aria-label` property of the button.
     *
     * @type {string | undefined}
     */
    this.label = undefined;

    /**
     * ♿ **ARIA:** Identifies the element (or elements) whose contents or presence are controlled by
     * the current button. See related `aria-owns`.
     *
     * @type {string | undefined}
     */
    this.controls = undefined;

    /**
     * Indicates the availability and type of interactive popup element, such as menu or dialog,
     * that can be triggered by the button.
     *
     * @type {boolean | undefined}
     */
    this.hasPopup = undefined;

    /**
     * Whether the button should be hidden.
     *
     * @type {boolean}
     */
    this.hidden = false;

    /**
     * Whether the button should be disabled (not-interactable).
     *
     * @type {boolean}
     */
    this.disabled = false;

    /**
     * Sets the default behaviour of the button.
     *
     * @type {ButtonType}
     */
    this.type = 'button';

    /**
     * ♿ **ARIA:** Indicates whether the button, or another grouping element it controls, is
     * currently expanded or collapsed.
     *
     * @type {boolean | undefined}
     */
    this.expanded = undefined;

    /**
     * ♿ **ARIA:** Indicates the current "pressed" state of toggle buttons. See related `aria-checked`
     * and `aria-selected`.
     *
     * @type {boolean | undefined}
     */
    this.pressed = undefined;

    /**
     * ♿ **ARIA:** Identifies the element (or elements) that describes the button. See related
     * `aria-labelledby`.
     *
     * @type {string | undefined}
     */
    this.describedBy = undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /** @type {import('lit').PropertyDeclarations} */
  static get properties() {
    return {
      label: {},
      controls: {},
      hasPopup: { type: Boolean, attribute: 'has-popup' },
      hidden: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      type: { reflect: true },
      expanded: { type: Boolean, reflect: true },
      pressed: { type: Boolean, reflect: true },
      describedBy: { reflect: true, attribute: 'described-by' }
    };
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  connectedCallback() {
    super.connectedCallback();
    this.addDefaultEventListeners();
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {import('lit/directives/ref').Ref<HTMLButtonElement>}
   */
  rootRef = createRef();

  /**
   * The component's root element.
   *
   * @type {HTMLButtonElement}
   */
  get rootElement() {
    return /** @type {HTMLButtonElement} */ (this.rootRef.value);
  }

  render() {
    return html`
      <button
        id="root"
        class=${this.getRootClassAttr()}
        part=${this.getRootPartAttr()}
        type=${ifNonEmpty(this.type)}
        aria-label=${ifNonEmpty(this.label)}
        aria-controls=${ifNonEmpty(this.controls)}
        aria-haspopup=${ifDefined(this.hasAriaPopupMenu())}
        aria-pressed=${ifDefined(this.isAriaPressed())}
        aria-expanded=${ifDefined(this.isAriaExpanded())}
        aria-describedby=${ifNonEmpty(this.describedBy)}
        ?hidden=${this.hidden}
        ?disabled=${this.disabled}
        ${ref(this.rootRef)}
      >
        ${this.renderRootChildren()}
      </button>
    `;
  }

  /**
   * Override this to modify content rendered inside root control (`<button>`).
   *
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderRootChildren() {
    return html`${this.renderDefaultSlot()}`;
  }

  /**
   * Override this to modify rendering of default slot.
   *
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderDefaultSlot() {
    return html`<slot></slot>`;
  }

  /**
   * Override this to modify CSS Classes.
   *
   * @protected
   * @returns {string}
   */
  getRootClassAttr() {
    return 'root';
  }

  /**
   * Override this to modify CSS Parts.
   *
   * @protected
   * @returns {string}
   */
  getRootPartAttr() {
    return 'root';
  }

  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------

  /**
   * The `aria-pressed` attribute value.
   *
   * @protected
   * @returns {'true' | 'false' | undefined}
   */
  isAriaPressed() {
    if (isUndefined(this.pressed)) return undefined;
    return this.pressed ? 'true' : 'false';
  }

  /**
   * The `aria-expanded` attribute value.
   *
   * @protected
   * @returns {'true' | 'false' | undefined}
   */
  isAriaExpanded() {
    if (isUndefined(this.controls)) return undefined;
    return this.expanded ? 'true' : 'false';
  }

  /**
   * The `aria-haspopup` attribute value.
   *
   * @protected
   * @returns {'true' | undefined}
   */
  hasAriaPopupMenu() {
    if (isUndefined(this.hasPopup)) return undefined;
    return this.hasPopup ? 'true' : undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  // Forward click event to button and prevent it from working when disabled.
  click() {
    if (this.disabled) return;
    this.rootElement.click();
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   */
  addDefaultEventListeners() {
    this.disconnectDisposal.add(
      listen(this, 'click', this.handleClickCapture.bind(this), {
        capture: true
      })
    );
  }

  /**
   * @protected
   * @param {Event} event
   * @returns {void | boolean}
   */
  handleClickCapture(event) {
    if (!this.disabled) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    return false;
  }
}

export const BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  controls: { control: StorybookControlType.Text },
  describedBy: { control: StorybookControlType.Text },
  disabled: { control: StorybookControlType.Boolean },
  expanded: { control: StorybookControlType.Boolean },
  hasPopup: { control: StorybookControlType.Boolean },
  hidden: { control: StorybookControlType.Boolean },
  label: { control: StorybookControlType.Text },
  pressed: { control: StorybookControlType.Boolean },
  title: { control: StorybookControlType.Text, defaultValue: 'Title' },
  type: {
    control: StorybookControlType.Select,
    options: ['button', 'submit', 'reset', 'menu'],
    defaultValue: 'button'
  },
  onClick: storybookAction('click'),
  onFocus: storybookAction('focus'),
  onBlur: storybookAction('blur')
};
