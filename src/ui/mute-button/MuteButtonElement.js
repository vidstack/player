import { state } from 'lit/decorators.js';

import { consumeContext } from '../../foundation/context/index.js';
import { mediaContext, MediaRemoteControl } from '../../media/index.js';
import { ToggleButtonElement } from '../toggle-button/index.js';

export const MUTE_BUTTON_ELEMENT_TAG_NAME = 'vds-mute-button';

/**
 * A button for toggling the muted state of the player.
 *
 * @tagname vds-mute-button
 * @slot mute - The content to show when the `muted` state is `false`.
 * @slot unmute - The content to show when the `muted` state is `true`.
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix.
 * @example
 * ```html
 * <vds-mute-button>
 *   <!-- Showing -->
 *   <div slot="mute"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="unmute" hidden></div>
 * </vds-mute-button>
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
   * @internal
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.muted)
  pressed = mediaContext.muted.initialValue;

  /**
   * The `mute` slotted element.
   *
   * @type {HTMLElement | undefined}
   */
  get muteSlotElement() {
    return this._currentNotPressedSlotElement;
  }

  /**
   * The `unmute` slotted element.
   *
   * @type {HTMLElement | undefined}
   */
  get unmuteSlotElement() {
    return this._currentPressedSlotElement;
  }

  _getPressedSlotName() {
    return 'unmute';
  }

  _getNotPressedSlotName() {
    return 'mute';
  }

  _handleButtonClick(event) {
    if (this.pressed) {
      this._mediaRemote.unmute(event);
    } else {
      this._mediaRemote.mute(event);
    }
  }
}
