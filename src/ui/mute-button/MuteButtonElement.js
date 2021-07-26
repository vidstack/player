import { consumeContext, watchContext } from '@base/context/index.js';
import { mediaContext, MediaRemoteControl } from '@media/index.js';
import { setAttribute } from '@utils/dom.js';

import { ToggleButtonElement } from '../toggle-button/index.js';

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
  /**
   * @protected
   * @readonly
   */
  _mediaRemote = new MediaRemoteControl(this);

  label = 'Mute';

  /**
   * @protected
   * @type {boolean}
   */
  @consumeContext(mediaContext.muted)
  _pressed = mediaContext.muted.initialValue;

  _handleButtonClick(event) {
    if (this._pressed) {
      this._mediaRemote.unmute(event);
    } else {
      this._mediaRemote.mute(event);
    }
  }

  /**
   * @protected
   * @param {boolean} canPlay
   */
  @watchContext(mediaContext.canPlay)
  _handleCanPlayContextUpdate(canPlay) {
    setAttribute(this, 'media-can-play', canPlay);
  }

  /**
   * @protected
   * @param {boolean} muted
   */
  @watchContext(mediaContext.muted)
  _handleMutedContextUpdate(muted) {
    setAttribute(this, 'media-muted', muted);
  }
}
