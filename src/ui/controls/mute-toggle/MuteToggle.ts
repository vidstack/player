import { html, property, query, TemplateResult } from 'lit-element';

import { playerContext, UserMutedChangeRequestEvent } from '../../../core';
import { FocusMixin } from '../../../shared/directives/FocusMixin';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { currentSafariVersion } from '../../../utils/support';
import { Control } from '../control';
import { Toggle } from '../toggle';

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
 * @csspart control-root - The root control's root (`<button>`).
 * @csspart control-root-mobile - The root control's root (`<button>`) when the current device is mobile.
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
export class MuteToggle extends FocusMixin(Toggle) {
  @playerContext.muted.consume()
  on = playerContext.muted.defaultValue;

  @query('vds-control') controlEl?: Control;

  /**
   * **ARIA** The `aria-label` property of the underlying playback control.
   *
   * @required
   */
  @property() label?: string = 'Mute';

  /**
   * Whether the underlying control should be disabled (not-interactable).
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * **ARIA** - Identifies the element (or elements) that describes the underlying control.
   */
  @property({ attribute: 'described-by' }) describedBy?: string;

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
        class="${this.getRootClassAttr()}"
        part="${this.getRootPartAttr()}"
        label="${ifNonEmpty(this.label)}"
        ?pressed="${this.on}"
        ?disabled="${this.disabled}"
        described-by="${ifNonEmpty(this.describedBy)}"
        @click="${this.handleTogglingMute}"
        exportparts="root: control-root, root-mobile: control-root-mobile"
      >
        ${this.renderToggle()}
      </vds-control>
    `;
  }

  click(): void {
    if (this.disabled) return;
    this.controlEl?.click();
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
