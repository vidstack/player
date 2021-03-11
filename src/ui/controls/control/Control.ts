import { Disposal, listenTo } from '@wcom/events';
import clsx from 'clsx';
import {
  CSSResultArray,
  html,
  internalProperty,
  LitElement,
  property,
  query,
  TemplateResult,
} from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { deviceContext } from '../../../core';
import { FocusMixin } from '../../../shared/directives/FocusMixin';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { currentSafariVersion } from '../../../utils/support';
import { isUndefined } from '../../../utils/unit';
import { ControlProps } from './control.args';
import { controlStyles } from './control.css';
import { ControlType } from './control.types';

/**
 * Base control that is basically a naked (not styled) button that helps manage ARIA
 * attributes and normalizes any web-component or cross-browser related issues.
 *
 * ## Tag
 *
 * @tagname vds-control
 *
 * ## Slots
 *
 * @slot Used to pass content into the control `<button>`.
 *
 * ## CSS Parts
 *
 * @csspart root - The component's root element (`<button>`).
 * @csspart root-mobile - Applied to component's root element when the current device is mobile.
 *
 * ## Examples
 *
 * @example
 * ```html
 * <vds-control>
 *   <!-- ... -->
 * </vds-control>
 * ```
 *
 * @example
 * ```css
 * vds-control::part(root) {
 *   transform: scale(1);
 *   transition: transform 0.3s linear;
 * }
 *
 * vds-control::part(root):hover,
 * vds-control::part(root):focus {
 *   outline: 0;
 *   transform: scale(1.05);
 * }
 * ```
 */
export class Control extends FocusMixin(LitElement) implements ControlProps {
  static get styles(): CSSResultArray {
    return [controlStyles];
  }

  @internalProperty()
  @deviceContext.isMobileDevice.consume()
  protected isMobileDevice = deviceContext.isMobileDevice.defaultValue;

  protected disposal = new Disposal();

  @query('button') buttonEl?: HTMLButtonElement;

  connectedCallback(): void {
    super.connectedCallback();
    this.setupListeners();
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

  @property() type: ControlType = 'button';

  @property({ type: Boolean, reflect: true }) expanded?: boolean;

  @property({ type: Boolean, reflect: true }) pressed?: boolean;

  @property({ attribute: 'described-by' }) describedBy?: string;

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  createRenderRoot(): ShadowRoot {
    return this.attachShadow({
      mode: 'open',
      /**
       * This change disables delegatesFocus feature in shadow DOM in recent Safari, notably `14.x`.
       * Safari `14.x` introduced delegatesFocus, but using it causes the browser to crash.
       *
       * @op https://github.com/carbon-design-system/carbon-web-components/pull/496
       * @report https://bugs.webkit.org/show_bug.cgi?id=215622.
       */
      delegatesFocus: currentSafariVersion() <= 537,
    });
  }

  render(): TemplateResult {
    return html`
      <button
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
    return html`<slot @slotchange="${this.handleDefaultSlotChange}"></slot>`;
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
    return clsx({
      root: true,
      'root-mobile': this.isMobileDevice,
    });
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
    this.buttonEl?.click();
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected setupListeners(): void {
    this.disposal.add(
      listenTo(this, 'click', this.handleClickCapture.bind(this), {
        capture: true,
      }),
    );
  }

  protected handleClickCapture(event: Event): void | boolean {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
      return false;
    }
  }

  /**
   * Override to listen to slot changes.
   */
  protected handleDefaultSlotChange(): void {
    // no-op
  }
}
