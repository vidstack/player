import { html, property, query, TemplateResult } from 'lit-element';

import {
  playerContext,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
} from '../../../core';
import { FocusMixin } from '../../../shared/directives/FocusMixin';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { buildExportPartsAttr } from '../../../utils/dom';
import { currentSafariVersion } from '../../../utils/support';
import { Control } from '../control';
import { Toggle } from '../toggle';
import { PlaybackToggleProps } from './playback-toggle.types';

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
 * @csspart control-* - All `vds-control` parts re-exported with the `control` prefix such as `control-root`.
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
  @query('#root') rootEl!: Control;

  static get parts(): string[] {
    return ['root', 'control', ...Control.parts.map(part => `control-${part}`)];
  }

  // Transforming `paused` to `!paused` to indicate whether playback has initiated/resumed. Can't
  // use `isPlaying` becuase there could be a buffering delay (we want immediate feedback).
  @playerContext.paused.consume({ transform: p => !p })
  on = false;

  @property() label?: string = 'Play';

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
        @click="${this.handleTogglingPlayback}"
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
