import { consumeContext, watchContext } from '@base/context/index';
import { mediaContext, MediaRemoteControl } from '@media/index';
import { setAttribute } from '@utils/dom';

import { ToggleButtonElement } from '../toggle-button/index';

export const MUTE_BUTTON_ELEMENT_TAG_NAME = 'vds-mute-button';

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

  @consumeContext(mediaContext.muted)
  protected override _pressed = mediaContext.muted.initialValue;

  protected override _handleButtonClick(event: Event) {
    if (this._pressed) {
      this._mediaRemote.unmute(event);
    } else {
      this._mediaRemote.mute(event);
    }
  }

  @watchContext(mediaContext.canPlay)
  protected _handleCanPlayContextUpdate(canPlay: boolean) {
    setAttribute(this, 'media-can-play', canPlay);
  }

  @watchContext(mediaContext.muted)
  protected _handleMutedContextUpdate(muted: boolean) {
    setAttribute(this, 'media-muted', muted);
  }
}
