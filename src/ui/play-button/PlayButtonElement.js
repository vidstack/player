import { consumeContext, watchContext } from '@base/context/index.js';
import { mediaContext, MediaRemoteControl } from '@media/index.js';
import { setAttribute } from '@utils/dom.js';

import { ToggleButtonElement } from '../toggle-button/index.js';

export const PLAY_BUTTON_ELEMENT_TAG_NAME = 'vds-play-button';

/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-paused`: Applied when media playback has paused.
 * - `media-waiting`: Applied when playback has stopped because of a lack of temporary data.
 *
 * @tagname vds-play-button
 * @slot - Used to pass content into the play toggle for showing play/pause states.
 * @csspart button - The button element (`<button>`).
 * @example
 * ```html
 * <vds-play-button>
 *   <div class="play">Play</div>
 *   <div class="pause">Pause</div>
 * </vds-play-button>
 * ```
 * @example
 * ```css
 * vds-play-button:not([media-paused]) .play {
 *   display: none;
 * }
 *
 * vds-play-button[media-paused] .pause {
 *   display: none;
 * }
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
   * @protected
   * @type {boolean}
   */
  // Transforming `paused` to `!paused` to indicate whether playback has initiated/resumed. Can't
  // use `playing` because there could be a buffering delay (we want immediate feedback).
  @consumeContext(mediaContext.paused, { transform: (p) => !p })
  _pressed = false;

  _handleButtonClick(event) {
    if (this._pressed) {
      this._mediaRemote.pause(event);
    } else {
      this._mediaRemote.play(event);
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
   * @param {boolean} waiting
   */
  @watchContext(mediaContext.waiting)
  _handleWaitingContextUpdate(waiting) {
    setAttribute(this, 'media-waiting', waiting);
  }

  /**
   * @protected
   * @param {boolean} paused
   */
  @watchContext(mediaContext.paused)
  _handlePausedContextUpdate(paused) {
    setAttribute(this, 'media-paused', paused);
  }
}
