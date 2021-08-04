import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

import { ifNonEmpty } from '../../base/directives';
import { WithFocus } from '../../base/elements';
import { eventListener } from '../../base/events';
import { ElementLogger } from '../../base/logger';
import { DEV_MODE } from '../../env';
import { toggleButtonElementStyles } from './styles';

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
  static override get styles(): CSSResultGroup {
    return [toggleButtonElementStyles];
  }

  static get parts(): string[] {
    return ['button'];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  protected readonly _logger = DEV_MODE && new ElementLogger(this);

  /**
   * Whether the toggle is currently in a `pressed` state.
   */
  @property({ type: Boolean, reflect: true })
  pressed = false;

  /**
   * ♿ **ARIA:** The `aria-label` property of the underlying button.
   */
  @property()
  label: string | undefined;

  /**
   * Whether the underlying button should be disabled (not-interactable).
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * ♿ **ARIA:** Identifies the element (or elements) that describes the underlying button.
   */
  @property({ attribute: 'described-by', reflect: true })
  describedBy: string | undefined;

  /**
   * Whether the toggle is in the `pressed` state.
   */
  get isPressed() {
    return this.pressed;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override render(): TemplateResult {
    return this._renderButton();
  }

  // -------------------------------------------------------------------------------------------
  // Button
  // -------------------------------------------------------------------------------------------

  protected _buttonRef = createRef<HTMLButtonElement>();

  /**
   * The component's `<button>` element.
   */
  get buttonElement() {
    return this._buttonRef.value;
  }

  protected _renderButton(): TemplateResult {
    return html`
      <button
        id="button"
        part="button"
        aria-label=${ifNonEmpty(this.label)}
        aria-pressed=${this.pressed ? 'true' : 'false'}
        aria-described-by=${ifNonEmpty(this.describedBy)}
        ?disabled=${this.disabled}
        @click=${this._handleButtonClick}
        ${ref(this._buttonRef)}
      >
        ${this._renderButtonChildren()}
      </button>
    `;
  }

  protected _renderButtonChildren(): TemplateResult {
    return this._renderDefaultSlot();
  }

  protected _renderDefaultSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  override click() {
    if (this.disabled) return;
    this.buttonElement?.click();
  }

  protected _handleButtonClick(event: Event) {
    this.pressed = !this.pressed;
  }

  @eventListener('click', { capture: true })
  protected _handleButtonClickCapture(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }

    return true;
  }
}
