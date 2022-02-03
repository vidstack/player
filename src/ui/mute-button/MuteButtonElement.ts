import { hostedMediaStoreSubscription, MediaRemoteControl } from '../../media';
import { setAttribute, setAttributeIfEmpty } from '../../utils/dom';
import { ToggleButtonElement } from '../toggle-button';

/**
 * A button for toggling the muted state of the player.
 *
 * 💡 The following media attributes are applied:
 *
 * - `media-muted`: Applied when media audio has been muted.
 *
 * @tagname vds-mute-button
 * @slot - Used to pass content into the mute toggle for showing mute/unmute states.
 * @example
 * ```html
 * <vds-mute-button>
 *   <div class="mute">Mute</div>
 *   <div class="unmute">Unmute</div>
 * </vds-mute-button>
 * ```
 * @example
 * ```css
 * vds-mute-button[media-muted] .mute {
 *   display: none;
 * }
 *
 * vds-mute-button:not([media-muted]) .unmute {
 *   display: none;
 * }
 * ```
 */
export class MuteButtonElement extends ToggleButtonElement {
  protected readonly _mediaRemote = new MediaRemoteControl(this);

  constructor() {
    super();
    hostedMediaStoreSubscription(this, 'muted', ($muted) => {
      this.pressed = $muted;
      setAttribute(this, 'media-muted', $muted);
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    setAttributeIfEmpty(this, 'aria-label', 'Mute');
  }

  protected override _handleButtonClick(event: Event) {
    if (this.disabled) return;

    if (this.pressed) {
      this._mediaRemote.unmute(event);
    } else {
      this._mediaRemote.mute(event);
    }
  }
}
