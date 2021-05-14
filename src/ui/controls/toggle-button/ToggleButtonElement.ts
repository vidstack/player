// ** Dependencies **
import '../button/vds-button';

import { html, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { WithFocus } from '../../../shared/mixins/WithFocus';
import { buildExportPartsAttr } from '../../../utils/dom';
import { noop } from '../../../utils/unit';
import { ButtonElement } from '../button';
import { ToggleElement } from '../toggle';
import { ToggleButtonElementProps } from './toggle-button.types';

/**
 * The foundation for any toggle button such as a `play-button` or `mute-button`.
 *
 * @tagname vds-toggle-button
 *
 * @csspart button - The root button component (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 *
 * @slot The content to show when the toggle is not pressed.
 * @slot pressed - The content to show when the toggle is pressed.
 *
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
export class ToggleButtonElement
  extends WithFocus(ToggleElement)
  implements ToggleButtonElementProps {
  @query('#root') rootEl!: ButtonElement;

  static get parts(): string[] {
    return [
      'root',
      'button',
      ...ButtonElement.parts.map(part => `button-${part}`),
    ];
  }

  @property() label?: string;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ attribute: 'described-by' }) describedBy?: string;

  get rootElement(): ButtonElement {
    return this.rootEl;
  }

  protected render(): TemplateResult {
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
      >
        ${this.renderToggle()}
      </vds-button>
    `;
  }

  click(): void {
    if (this.disabled) return;
    this.rootEl?.click();
  }

  /**
   * Override this to modify root CSS Classes.
   */
  protected getRootClassAttr(): string {
    return 'root';
  }

  /**
   * Override this to modify root CSS parts.
   */
  protected getRootPartAttr(): string {
    return 'root button';
  }

  /**
   * Override this to modify root CSS export parts.
   */
  protected getRootExportPartsAttr(): string {
    return buildExportPartsAttr(ButtonElement.parts, 'button');
  }

  /**
   * Override this to modify on button click behaviour.
   */
  protected handleButtonClick(event: Event): void {
    noop(event);
    this.pressed = !this.pressed;
  }
}
