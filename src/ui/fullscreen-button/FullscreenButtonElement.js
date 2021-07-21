import { state } from 'lit/decorators.js';

import { consumeContext } from '../../foundation/context/index.js';
import { mediaContext, MediaRemoteControl } from '../../media/index.js';
import { ToggleButtonElement } from '../toggle-button/index.js';

export const FULLSCREEN_BUTTON_ELEMENT_TAG_NAME = 'vds-fullscreen-button';

/**
 * A button for toggling the fullscreen mode of the player.
 *
 *
 * @tagname vds-fullscreen-button
 * @slot enter - The content to show when the `fullscreen` state is `false`.
 * @slot exit - The content to show when the `fullscreen` state is `true`.
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix.
 * @example
 * ```html
 * <vds-fullscreen-button>
 *   <!-- Showing -->
 *   <div slot="enter"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="exit" hidden></div>
 * </vds-fullscreen-button>
 * ```
 */
export class FullscreenButtonElement extends ToggleButtonElement {
  /**
   * @protected
   * @readonly
   */
  _mediaRemote = new MediaRemoteControl(this);

  label = 'Fullscreen';

  /**
   * @internal
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.fullscreen)
  pressed = mediaContext.fullscreen.initialValue;

  /**
   * The `enter` slotted element.
   *
   * @type {HTMLElement | undefined}
   */
  get enterSlotElement() {
    return this._currentNotPressedSlotElement;
  }

  /**
   * The `exit` slotted element.
   *
   * @type {HTMLElement | undefined}
   */
  get exitSlotElement() {
    return this._currentPressedSlotElement;
  }

  _getPressedSlotName() {
    return 'exit';
  }

  _getNotPressedSlotName() {
    return 'enter';
  }

  _handleButtonClick(event) {
    if (this.pressed) {
      this._mediaRemote.exitFullscreen(event);
    } else {
      this._mediaRemote.enterFullscreen(event);
    }
  }
}
