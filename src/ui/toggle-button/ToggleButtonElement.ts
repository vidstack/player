import {
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult
} from 'lit';
import { property } from 'lit/decorators.js';

import { WithFocus } from '../../base/elements';
import { hostedEventListener } from '../../base/events';
import { logElementLifecycle } from '../../base/logger';
import { setAttribute, setAttributeIfEmpty } from '../../utils/dom';
import { toggleButtonElementStyles } from './styles';

/**
 * The foundation for any toggle button such as a `play-button` or `mute-button`.
 *
 * @tagname vds-toggle-button
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
export class ToggleButtonElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [toggleButtonElementStyles];
  }

  static get parts(): string[] {
    return ['button'];
  }

  constructor() {
    super();
    if (__DEV__) logElementLifecycle(this);
    hostedEventListener(this, 'click', this._handleButtonClick.bind(this));
  }

  override connectedCallback(): void {
    super.connectedCallback();
    setAttributeIfEmpty(this, 'tabindex', '0');
    setAttributeIfEmpty(this, 'role', 'button');
    this._updateAriaPressedAttr();
  }

  protected override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('pressed')) {
      this._updateAriaPressedAttr();
    }
  }

  protected _updateAriaPressedAttr() {
    setAttribute(this, 'aria-pressed', this.pressed ? 'true' : 'false');
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * Whether the toggle is currently in a `pressed` state.
   */
  @property({ type: Boolean })
  pressed = false;

  /**
   * Whether the underlying button should be disabled (not-interactable).
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

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
    return this._renderDefaultSlot();
  }

  protected _renderDefaultSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected _handleButtonClick(event: Event) {
    if (this.disabled) return;
    this.pressed = !this.pressed;
  }

  protected readonly _handleButtonClickCapture = hostedEventListener(
    this,
    'click',
    (event) => {
      if (this.disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    { capture: true }
  );
}
