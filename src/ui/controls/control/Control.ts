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
 * @csspart root - The root component element (`<button>`).
 * @csspart root-mobile - Applied to root component when the current device is mobile.
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
export class Control extends FocusMixin(LitElement) {
  public static get styles(): CSSResultArray {
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

  /**
   * **ARIA** The `aria-label` property of the control.
   *
   * @required
   */
  @property() label!: string;

  /**
   * **ARIA** - Identifies the element (or elements) whose contents or presence are controlled by
   * the current control. See related `aria-owns`.
   */
  @property() controls?: string;

  /**
   * Indicates the availability and type of interactive popup element, such as menu or dialog,
   * that can be triggered by the control.
   */
  @property({ type: Boolean, attribute: 'has-popup' }) hasPopup?: boolean;

  /**
   * Whether the control should be hidden.
   */
  @property({ type: Boolean, reflect: true }) hidden = false;

  /**
   * Whether the control should be disabled (not-interactable).
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Sets the default behaviour of the button.
   *
   * - `submit`: The button submits the form data to the server. This is the default if the
   * attribute is not specified for buttons associated with a <form>, or if the attribute is an
   * empty or invalid value.
   *
   * - `reset`: The button resets all the controls to their initial values,
   * like `<input type="reset">`. (This behavior tends to annoy users.)
   *
   * - `button`: The button has no default behavior, and does nothing when pressed by default. It
   * can have client-side scripts listen to the element's events, which are triggered when the
   * events occur.
   */
  @property() type: ControlType = 'button';

  /**
   * **ARIA** - Indicates whether the control, or another grouping element it controls, is
   * currently expanded or collapsed.
   */
  @property({ type: Boolean, reflect: true }) expanded?: boolean;

  /**
   * **ARIA** - Indicates the current "pressed" state of toggle buttons. See related `aria-checked`
   * and `aria-selected`.
   */
  @property({ type: Boolean, reflect: true }) pressed?: boolean;

  /**
   * **ARIA** - Identifies the element (or elements) that describes the control. See related
   * `aria-labelledby`.
   */
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
        class="${this.buildRootClassAttr()}"
        part="${this.buildRootPartAttr()}"
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
  protected buildRootClassAttr(): string {
    return 'root';
  }

  /**
   * Override this to modify CSS Parts.
   */
  protected buildRootPartAttr(): string {
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
    super.click();
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
