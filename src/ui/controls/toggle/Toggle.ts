import {
  CSSResultArray,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';

import { getSlottedChildren, setAttribute } from '../../../utils/dom';
import { isNil } from '../../../utils/unit';
import { toggleStyles } from './toggle.css';

/**
 * A toggle component to render different state depending on whether it's `on` or `off`. This
 * component will always render both the `on` and `off` slots regardless of the current
 * state so you can perform CSS animations. A `hidden` attribute will be applied to the slot
 * that's currently `off`.
 *
 * ## Tag
 *
 * @tagname vds-toggle
 *
 * ## Slots
 *
 * @slot on - The content to show when the toggle is `on`.
 * @slot off - The content to show when the toggle is `off`.
 *
 * ## Example
 *
 * @example
 * ```html
 * <vds-toggle on>
 *   <!-- Showing -->
 *   <div slot="on"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="off" hidden></div>
 * </vds-toggle>
 * ```
 */
export class Toggle extends LitElement {
  static get styles(): CSSResultArray {
    return [toggleStyles];
  }

  protected currentOnSlotElement?: HTMLElement;

  protected currentOffSlotElement?: HTMLElement;

  protected _on = false;

  /**
   * Whether the toggle is in the `on` state.
   */
  @property({ type: Boolean, reflect: true })
  get on(): boolean {
    return this._on;
  }

  set on(isOn: boolean) {
    this._on = isOn;
    this.toggle();
  }

  render(): TemplateResult {
    return html`${this.renderOnSlot()} ${this.renderOffSlot()}`;
  }

  disconnectedCallback(): void {
    this.currentOnSlotElement = undefined;
    this.currentOffSlotElement = undefined;
  }

  // -------------------------------------------------------------------------------------------
  // On
  // -------------------------------------------------------------------------------------------

  protected getOnSlotName(): string {
    return 'on';
  }

  protected renderOnSlot(): TemplateResult {
    return html`<slot
      name=${this.getOnSlotName()}
      @slotchange="${this.handleOnSlotChange}"
    ></slot>`;
  }

  protected handleOnSlotChange(): void {
    this.currentOnSlotElement = getSlottedChildren(
      this,
      this.getOnSlotName(),
    )[0] as HTMLElement;

    this.toggle();
  }

  // -------------------------------------------------------------------------------------------
  // Off
  // -------------------------------------------------------------------------------------------

  protected getOffSlotName(): string {
    return 'off';
  }

  protected renderOffSlot(): TemplateResult {
    return html`<slot
      name=${this.getOffSlotName()}
      @slotchange="${this.handleOffSlotChange}"
    ></slot>`;
  }

  protected handleOffSlotChange(): void {
    this.currentOffSlotElement = getSlottedChildren(
      this,
      this.getOffSlotName(),
    )[0] as HTMLElement;

    this.toggle();
  }

  // -------------------------------------------------------------------------------------------
  // Toggle
  // -------------------------------------------------------------------------------------------

  protected toggle(): void {
    this.toggleHiddenAttr(this.currentOnSlotElement, !this._on);
    this.toggleHiddenAttr(this.currentOffSlotElement, this._on);
  }

  protected toggleHiddenAttr(el?: HTMLElement, isHidden?: boolean): void {
    if (!isNil(el)) {
      setAttribute(el, 'hidden', isHidden ? '' : undefined);
    }
  }
}
