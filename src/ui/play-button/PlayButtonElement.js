import { state } from 'lit/decorators.js';

import { consumeContext } from '../../foundation/context/index.js';
import {
  mediaContext,
  MediaRemoteControl,
  PauseRequestEvent,
  PlayRequestEvent
} from '../../media/index.js';
import { ToggleButtonElement } from '../toggle-button/index.js';

export const PLAY_BUTTON_ELEMENT_TAG_NAME = 'vds-play-button';

/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 *
 * @tagname vds-play-button
 * @slot play - The content to show when the `paused` state is `true`.
 * @slot pause - The content to show when the `paused` state is `false`.
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix.
 * @example
 * ```html
 * <vds-play-button>
 *   <!-- Showing -->
 *   <div slot="play"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="pause" hidden></div>
 * </vds-play-button>
 * ```
 */
export class PlayButtonElement extends ToggleButtonElement {
  /**
   * @protected
   * @readonly
   */
  _mediaRemote = new MediaRemoteControl(this);

  label = 'Play';

  /**
   * @internal
   * @type {boolean}
   */
  // Transforming `paused` to `!paused` to indicate whether playback has initiated/resumed. Can't
  // use `playing` because there could be a buffering delay (we want immediate feedback).
  @state()
  @consumeContext(mediaContext.paused, { transform: (p) => !p })
  pressed = false;

  /**
   * The `play` slotted element.
   *
   * @type {HTMLElement | undefined}
   */
  get playSlotElement() {
    return this._currentNotPressedSlotElement;
  }

  /**
   * The `pause` slotted element.
   *
   * @type {HTMLElement | undefined}
   */
  get pauseSlotElement() {
    return this._currentPressedSlotElement;
  }

  _getPressedSlotName() {
    return 'pause';
  }

  _getNotPressedSlotName() {
    return 'play';
  }

  _handleButtonClick(event) {
    if (this.pressed) {
      this._mediaRemote.pause(event);
    } else {
      this._mediaRemote.play(event);
    }
  }
}
