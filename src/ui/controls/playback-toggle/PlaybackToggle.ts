import { html, property, query, TemplateResult } from 'lit-element';

import {
  playerContext,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
} from '../../../core';
import { FocusMixin } from '../../../shared/directives/FocusMixin';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { currentSafariVersion } from '../../../utils/support';
import { Control } from '../control';
import { Toggle } from '../toggle';

/**
 * A control for toggling the playback state (play/pause) of the current media.
 *
 * ## Tag
 *
 * @tagname vds-playback-toggle
 *
 * ## Slots
 *
 * @slot play - The content to show when the `paused` state is `false`.
 * @slot pause - The content to show when the `paused` state is `true`.
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
 * <vds-playback-toggle>
 *   <!-- Showing -->
 *   <div slot="play"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="pause" hidden></div>
 * </vds-playback-toggle>
 * ```
 */
export class PlaybackToggle extends FocusMixin(Toggle) {
  @playerContext.paused.consume()
  on = playerContext.paused.defaultValue;

  @query('vds-control') controlEl?: Control;

  /**
   * **ARIA** The `aria-label` property of the underlying playback control.
   *
   * @required
   */
  @property() label?: string = 'Pause';

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
        class="${this.buildRootClassAttr()}"
        part="${this.buildRootClassAttr()}"
        label="${ifNonEmpty(this.label)}"
        ?pressed="${this.on}"
        ?disabled="${this.disabled}"
        described-by="${ifNonEmpty(this.describedBy)}"
        @click="${this.handleTogglingPlayback}"
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
  protected buildRootClassAttr(): string {
    return 'root';
  }

  /**
   * Override this to modify root CSS parts.
   */
  protected buildRootPartAttr(): string {
    return 'root control';
  }

  protected getOnSlotName(): string {
    return 'play';
  }

  protected getOffSlotName(): string {
    return 'pause';
  }

  protected handleTogglingPlayback(originalEvent: Event): void {
    const Request = this.on ? UserPlayRequestEvent : UserPauseRequestEvent;

    this.dispatchEvent(
      new Request({
        originalEvent,
      }),
    );
  }
}
