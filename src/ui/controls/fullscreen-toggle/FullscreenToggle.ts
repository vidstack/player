import { html, property, query, TemplateResult } from 'lit-element';

import { playerContext, VdsUserFullscreenChangeEvent } from '../../../core';
import { FocusMixin } from '../../../shared/directives/FocusMixin';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { buildExportPartsAttr } from '../../../utils/dom';
import { currentSafariVersion } from '../../../utils/support';
import { Control } from '../control';
import { Toggle } from '../toggle';
import { FullscreenToggleProps } from './fullscreen-toggle.types';

/**
 * A control for toggling the fullscreen mode of the player.
 *
 * ## Tag
 *
 * @tagname vds-fullscreen-toggle
 *
 * ## Slots
 *
 * @slot enter - The content to show when the `fullscreen` state is `false`.
 * @slot exit - The content to show when the `fullscreen` state is `true`.
 *
 * ## CSS Parts
 *
 * @csspart control - The root control (`<vds-control>`).
 * @csspart control-* - All `vds-control` parts re-exported with the `control` prefix such as `control-root`.
 *
 * ## Examples
 *
 * @example
 * ```html
 * <vds-fullscreen-toggle>
 *   <!-- Showing -->
 *   <div slot="enter"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="exit" hidden></div>
 * </vds-fullscreen-toggle>
 * ```
 */
export class FullscreenToggle
  extends FocusMixin(Toggle)
  implements FullscreenToggleProps {
  @query('#root') rootEl!: Control;

  static get parts(): string[] {
    return ['root', 'control', ...Control.parts.map(part => `control-${part}`)];
  }

  @playerContext.fullscreen.consume()
  on = playerContext.fullscreen.defaultValue;

  @property() label?: string = 'Fullscreen';

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
        @click="${this.handleTogglingFullscreen}"
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

  protected getOnSlotName(): string {
    return 'exit';
  }

  protected getOffSlotName(): string {
    return 'enter';
  }

  protected handleTogglingFullscreen(originalEvent: Event): void {
    this.dispatchEvent(
      new VdsUserFullscreenChangeEvent({
        originalEvent,
        detail: !this.on,
      }),
    );
  }
}
