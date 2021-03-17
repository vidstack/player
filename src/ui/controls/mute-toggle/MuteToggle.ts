import { html, property, query, TemplateResult } from 'lit-element';

import { playerContext, UserMutedChangeRequestEvent } from '../../../core';
import { FocusMixin } from '../../../shared/directives/FocusMixin';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { buildExportPartsAttr } from '../../../utils/dom';
import { currentSafariVersion } from '../../../utils/support';
import { Control } from '../control';
import { Toggle } from '../toggle';
import { MuteToggleProps } from './mute-toggle.types';

/**
 * A control for toggling the muted state of the player.
 *
 * ## Tag
 *
 * @tagname vds-mute-toggle
 *
 * ## Slots
 *
 * @slot mute - The content to show when the `muted` state is `false`.
 * @slot unmute - The content to show when the `muted` state is `true`.
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
 * <vds-mute-toggle>
 *   <!-- Showing -->
 *   <div slot="mute"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="unmute" hidden></div>
 * </vds-mute-toggle>
 * ```
 */
export class MuteToggle extends FocusMixin(Toggle) implements MuteToggleProps {
  @query('#root') rootEl!: Control;

  static get parts(): string[] {
    return ['root', 'control', ...Control.parts.map(part => `control-${part}`)];
  }

  @playerContext.muted.consume()
  on = playerContext.muted.defaultValue;

  @property() label?: string = 'Mute';

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
        @click="${this.handleTogglingMute}"
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
    return 'unmute';
  }

  protected getOffSlotName(): string {
    return 'mute';
  }

  protected handleTogglingMute(originalEvent: Event): void {
    this.dispatchEvent(
      new UserMutedChangeRequestEvent({
        originalEvent,
        detail: !this.on,
      }),
    );
  }
}
