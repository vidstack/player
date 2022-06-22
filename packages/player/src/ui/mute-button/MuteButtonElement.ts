import { setAttribute, setAttributeIfEmpty } from '@vidstack/foundation';

import { MediaRemoteControl, mediaStoreSubscription } from '../../media';
import { ToggleButtonElement } from '../toggle-button';

/**
 * A button for toggling the muted state of the player.
 *
 * 💡 The following attributes are applied:
 *
 * - `muted`: Applied when media audio has been muted.
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
 * vds-mute-button[muted] .mute {
 *   display: none;
 * }
 *
 * vds-mute-button:not([muted]) .unmute {
 *   display: none;
 * }
 * ```
 */
export class MuteButtonElement extends ToggleButtonElement {
  protected readonly _mediaRemote = new MediaRemoteControl(this);

  protected _volume = 1;
  protected _muted = false;

  constructor() {
    super();

    mediaStoreSubscription(this, 'volume', ($volume) => {
      this._volume = $volume;
      this._handleMutedChange();
    });

    mediaStoreSubscription(this, 'muted', ($muted) => {
      this._muted = $muted;
      this._handleMutedChange();
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    setAttributeIfEmpty(this, 'aria-label', 'Mute');
  }

  protected _handleMutedChange() {
    const muted = this._muted || this._volume === 0;
    this.pressed = muted;
    setAttribute(this, 'muted', muted);
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
