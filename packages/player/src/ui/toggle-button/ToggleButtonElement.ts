import {
  eventListener,
  focusVisiblePolyfill,
  isKeyboardClick,
  isKeyboardEvent,
  logElementLifecycle,
  setAttribute,
  setAttributeIfEmpty,
} from '@vidstack/foundation';
import {
  type CSSResultGroup,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { property } from 'lit/decorators.js';

import { toggleButtonElementStyles } from './styles';

/**
 * The foundation for any toggle button such as a `play-button` or `mute-button`.
 *
 * @tagname vds-toggle-button
 * @slot - Used to pass content into the toggle for showing pressed and not pressed states.
 * @example
 * ```html
 * <vds-toggle-button aria-label="Some action">
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
    return [];
  }

  constructor() {
    super();
    if (__DEV__) logElementLifecycle(this);

    focusVisiblePolyfill(this);

    (['pointerdown', 'keydown'] as const).forEach((eventType) => {
      eventListener(this, eventType, (event) => {
        if (this.disabled || (isKeyboardEvent(event) && !isKeyboardClick(event))) {
          return;
        }

        this._handleButtonClick(event);
      });
    });
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
   * Whether the underlying button should be disabled (non-interactive).
   *
   * @defaultValue false
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

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
    this.pressed = !this.pressed;
  }

  protected readonly _handleButtonClickCapture = eventListener(
    this,
    'click',
    (event) => {
      if (this.disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    { capture: true },
  );
}
