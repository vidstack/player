import { Disposal, listenTo } from '@wcom/events';
import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators';
import { ifDefined } from 'lit/directives/if-defined';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { WithFocus } from '../../../shared/mixins/WithFocus';
import { isUndefined } from '../../../utils/unit';
import { buttonElementStyles } from './button.css';
import { ButtonElementProps, ButtonType } from './button.types';

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
export class ButtonElement
  extends WithFocus(LitElement)
  implements ButtonElementProps {
  @query('#root') rootEl!: HTMLButtonElement;

  static get styles(): CSSResultGroup {
    return [buttonElementStyles];
  }

  static get parts(): string[] {
    return ['root'];
  }

  protected disposal = new Disposal();

  connectedCallback(): void {
    super.connectedCallback();
    this.addDefaultEventListeners();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disposal.empty();
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  @property() label?: string;

  @property() controls?: string;

  @property({ type: Boolean, attribute: 'has-popup' }) hasPopup?: boolean;

  @property({ type: Boolean, reflect: true }) hidden = false;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property() type: ButtonType = 'button';

  @property({ type: Boolean, reflect: true }) expanded?: boolean;

  @property({ type: Boolean, reflect: true }) pressed?: boolean;

  @property({ attribute: 'described-by' }) describedBy?: string;

  get rootElement(): HTMLButtonElement {
    return this.rootEl;
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  render(): TemplateResult {
    return html`
      <button
        id="root"
        class="${this.getRootClassAttr()}"
        part="${this.getRootPartAttr()}"
        type="${ifNonEmpty(this.type)}"
        aria-label="${ifNonEmpty(this.label)}"
        aria-controls="${ifNonEmpty(this.controls)}"
        aria-haspopup="${ifDefined(this.hasAriaPopupMenu())}"
        aria-pressed="${ifDefined(this.isAriaPressed())}"
        aria-expanded="${ifDefined(this.isAriaExpanded())}"
        aria-describedby="${ifNonEmpty(this.describedBy)}"
        ?hidden="${this.hidden}"
        ?disabled="${this.disabled}"
      >
        ${this.renderRootContent()}
      </button>
    `;
  }

  /**
   * Override this to modify content rendered inside root control (`<button>`).
   */
  protected renderRootContent(): TemplateResult {
    return html`${this.renderDefaultSlot()}`;
  }

  /**
   * Override this to modify rendering of default slot.
   */
  protected renderDefaultSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  /**
   * Override this to modify CSS Classes.
   */
  protected getRootClassAttr(): string {
    return 'root';
  }

  /**
   * Override this to modify CSS Parts.
   */
  protected getRootPartAttr(): string {
    return 'root';
  }

  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------

  /**
   * The `aria-pressed` attribute value.
   */
  protected isAriaPressed(): 'true' | 'false' | undefined {
    if (isUndefined(this.pressed)) return undefined;
    return this.pressed ? 'true' : 'false';
  }

  /**
   * The `aria-expanded` attribute value.
   */
  protected isAriaExpanded(): 'true' | 'false' | undefined {
    if (isUndefined(this.controls)) return undefined;
    return this.expanded ? 'true' : 'false';
  }

  /**
   * The `aria-haspopup` attribute value.
   */
  protected hasAriaPopupMenu(): 'true' | undefined {
    if (isUndefined(this.hasPopup)) return undefined;
    return this.hasPopup ? 'true' : undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  // Forward click event to button and prevent it from working when disabled.
  click(): void {
    if (this.disabled) return;
    this.rootEl?.click();
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected addDefaultEventListeners(): void {
    this.disposal.add(
      listenTo(this, 'click', this.handleClickCapture.bind(this), {
        capture: true,
      }),
    );
  }

  protected handleClickCapture(event: Event): void | boolean {
    if (!this.disabled) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    return false;
  }
}
