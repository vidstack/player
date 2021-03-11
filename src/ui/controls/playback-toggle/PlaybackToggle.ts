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
import { PlaybackToggleProps } from './playback-toggle.args';

/**
 * A control for toggling the playback state (play/pause) of the current media.
 *
 * ## Tag
 *
 * @tagname vds-playback-toggle
 *
 * ## Slots
 *
 * @slot play - The content to show when the `paused` state is `true`.
 * @slot pause - The content to show when the `paused` state is `false`.
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
export class PlaybackToggle
  extends FocusMixin(Toggle)
  implements PlaybackToggleProps {
  // Transforming `paused` to `!paused` to indicate whether playback has initiated/resumed. Can't
  // use `isPlaying` becuase there could be a buffering delay (we want immediate feedback).
  @playerContext.paused.consume({ transform: p => !p })
  on = false;

  @query('vds-control') controlEl?: Control;

  @property() label?: string = 'Play';

  @property({ type: Boolean, reflect: true }) disabled = false;

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
    return 'pause';
  }

  protected getOffSlotName(): string {
    return 'play';
  }

  protected handleTogglingPlayback(originalEvent: Event): void {
    const Request = this.on ? UserPauseRequestEvent : UserPlayRequestEvent;

    this.dispatchEvent(
      new Request({
        originalEvent,
      }),
    );
  }
}
