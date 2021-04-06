import { html, property, query, TemplateResult } from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { FocusMixin } from '../../../shared/mixins/FocusMixin';
import { buildExportPartsAttr } from '../../../utils/dom';
import { currentSafariVersion } from '../../../utils/support';
import { noop } from '../../../utils/unit';
import { Control } from '../control';
import { Toggle } from '../toggle';
import { ToggleControlProps } from './toggle-control.types';

/**
 * The foundation for any toggle control such as a `playback-toggle` or `mute-toggle`.
 *
 * @tagname vds-toggle-control
 *
 * @csspart control - The root control (`<vds-control>`).
 * @csspart control-* - All `vds-control` parts re-exported with the `control` prefix such as `control-root`.
 *
 * @slot on - The content to show when the toggle is `on`.
 * @slot off - The content to show when the toggle is `off`.
 *
 * @example
 * ```html
 * <vds-toggle-control label="Some action">
 *   <!-- Showing -->
 *   <div slot="on"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="off" hidden></div>
 * </vds-toggle-control>
 * ```
 */
export class ToggleControl
  extends FocusMixin(Toggle)
  implements ToggleControlProps {
  @query('#root') rootEl!: Control;

  static get parts(): string[] {
    return ['root', 'control', ...Control.parts.map(part => `control-${part}`)];
  }

  @property() label?: string;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ attribute: 'described-by' }) describedBy?: string;

  /**
   * The component's root element.
   */
  get rootElement(): Control {
    return this.rootEl;
  }

  createRenderRoot(): ShadowRoot {
    return this.attachShadow({
      mode: 'open',
      // See Control for more information.
      delegatesFocus: currentSafariVersion() <= 537,
    });
  }

  render(): TemplateResult {
    return html`
      <vds-control
        id="root"
        class="${this.getRootClassAttr()}"
        part="${this.getRootPartAttr()}"
        label="${ifNonEmpty(this.label)}"
        ?pressed="${this.on}"
        ?disabled="${this.disabled}"
        described-by="${ifNonEmpty(this.describedBy)}"
        @click="${this.handleControlClick}"
        exportparts="${this.getRootExportPartsAttr()}"
      >
        ${this.renderToggle()}
      </vds-control>
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
    return 'root control';
  }

  protected getRootExportPartsAttr(): string {
    return buildExportPartsAttr(Control.parts, 'control');
  }

  /**
   * Override this to modify on click behaviour.
   */
  protected handleControlClick(event: Event): void {
    noop(event);
    this.on = !this.on;
  }
}
