// ** Dependencies **
import '../button/define.js';

import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import { ifNonEmpty } from '../../../foundation/directives/index.js';
import { WithFocus } from '../../../foundation/elements/index.js';
import {
  storybookAction,
  StorybookControlType
} from '../../../foundation/storybook/index.js';
import { buildExportPartsAttr } from '../../../utils/dom.js';
import { ButtonElement } from '../button/index.js';
import { ToggleElement } from '../toggle/index.js';
import { toggleButtonElementStyles } from './styles.js';

export const TOGGLE_BUTTON_ELEMENT_TAG_NAME = 'vds-toggle-button';

/**
 * The foundation for any toggle button such as a `play-button` or `mute-button`.
 *
 *
 * @tagname vds-toggle-button
 * @csspart button - The root button component (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 * @slot The content to show when the toggle is not pressed.
 * @slot pressed - The content to show when the toggle is pressed.
 * @example
 * ```html
 * <vds-toggle-button label="Some action">
 *   <!-- Showing -->
 *   <div slot="pressed"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div hidden></div>
 * </vds-toggle-button>
 * ```
 */
export class ToggleButtonElement extends WithFocus(ToggleElement) {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [super.styles, toggleButtonElementStyles];
  }

  /** @type {string[]} */
  static get parts() {
    return [
      'root',
      'button',
      ...ButtonElement.parts.map((part) => `button-${part}`)
    ];
  }

  constructor() {
    super();

    // Properties
    /**
     * ♿ **ARIA:** The `aria-label` property of the underlying button.
     *
     * @type {string | undefined}
     */
    this.label = undefined;

    /**
     * Whether the underlying button should be disabled (not-interactable).
     *
     * @type {boolean}
     */
    this.disabled = false;

    /**
     * ♿ **ARIA:** Identifies the element (or elements) that describes the underlying button.
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
      disabled: { type: Boolean, reflect: true },
      describedBy: { reflect: true, attribute: 'described-by' }
    };
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {import('lit/directives/ref').Ref<ButtonElement>}
   */
  rootRef = createRef();

  /**
   * The component's root element.
   *
   * @type {ButtonElement}
   */
  get rootElement() {
    return /** @type {ButtonElement} */ (this.rootRef.value);
  }

  render() {
    return html`
      <vds-button
        id="root"
        class=${this.getRootClassAttr()}
        part=${this.getRootPartAttr()}
        label=${ifNonEmpty(this.label)}
        ?pressed=${this.pressed}
        ?disabled=${this.disabled}
        described-by=${ifNonEmpty(this.describedBy)}
        @click=${this.handleButtonClick}
        exportparts=${this.getRootExportPartsAttr()}
        ${ref(this.rootRef)}
      >
        ${this.renderToggle()}
      </vds-button>
    `;
  }

  click() {
    if (this.disabled) return;
    this.rootElement.click();
  }

  /**
   * Override this to modify root CSS Classes.
   *
   * @protected
   * @returns {string}
   */
  getRootClassAttr() {
    return 'root';
  }

  /**
   * Override this to modify root CSS parts.
   *
   * @protected
   * @returns {string}
   */
  getRootPartAttr() {
    return 'root button';
  }

  /**
   * Override this to modify root CSS export parts.
   *
   * @protected
   * @returns {string}
   */
  getRootExportPartsAttr() {
    return buildExportPartsAttr(ButtonElement.parts, 'button');
  }

  /**
   * Override this to modify on button click behaviour.
   *
   * @protected
   * @param {Event} event
   */
  handleButtonClick(event) {
    this.pressed = !this.pressed;
  }
}

export const TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  label: { control: StorybookControlType.Text },
  describedBy: { control: StorybookControlType.Text },
  disabled: { control: StorybookControlType.Boolean },
  pressed: { control: StorybookControlType.Boolean, defaultValue: false },
  onClick: storybookAction('click'),
  onFocus: storybookAction('focus'),
  onBlur: storybookAction('blur')
};
