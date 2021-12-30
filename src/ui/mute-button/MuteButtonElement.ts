import {
  hostedMediaServiceSubscription,
  MediaRemoteControl
} from '../../media';
import { setAttribute } from '../../utils/dom';
import { ToggleButtonElement } from '../toggle-button';

/**
 * A button for toggling the muted state of the player.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-muted`: Applied when media audio has been muted.
 *
 * @tagname vds-mute-button
 * @slot - Used to pass content into the mute toggle for showing mute/unmute states.
 * @csspart button - The button element (`<button>`).
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

  override label = 'Mute';

  constructor() {
    super();
    hostedMediaServiceSubscription(this, ({ context }) => {
      this.pressed = context.muted;
      setAttribute(this, 'media-can-play', context.canPlay);
      setAttribute(this, 'media-muted', context.muted);
    });
  }

  protected override _handleButtonClick(event: Event) {
    if (this.pressed) {
      this._mediaRemote.unmute(event);
    } else {
      this._mediaRemote.mute(event);
    }
  }
}
