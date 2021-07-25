import {
  consumeContext,
  watchContext
} from '../../foundation/context/index.js';
import { mediaContext, MediaRemoteControl } from '../../media/index.js';
import { setAttribute } from '../../utils/dom.js';
import { ToggleButtonElement } from '../toggle-button/index.js';

export const FULLSCREEN_BUTTON_ELEMENT_TAG_NAME = 'vds-fullscreen-button';

/**
 * A button for toggling the fullscreen mode of the player.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-fullscreen`: Applied when the media has entered fullscreen.
 *
 * 🚨 The `hidden` attribute will be present on this element in the event fullscreen cannot be
 * requested (no support). There are default styles for this by setting the `display` property to
 * `none`. Important to be aware of this and update it according to your needs.
 *
 * @tagname vds-fullscreen-button
 * @slot - Used to pass content into the fullscreen toggle for showing enter/exit states.
 * @csspart button - The button element (`<button>`).
 * @example
 * ```html
 * <vds-fullscreen-button>
 *   <div class="enter">Enter</div>
 *   <div class="exit">Exit</div>
 * </vds-fullscreen-button>
 * ```
 * @example
 * ```css
 * vds-fullscreen-button[media-fullscreen] .enter {
 *   display: none;
 * }
 *
 * vds-fullscreen-button:not([media-fullscreen]) .exit {
 *   display: none;
 * }
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
   * @protected
   * @type {boolean}
   */
  @consumeContext(mediaContext.fullscreen)
  _pressed = mediaContext.fullscreen.initialValue;

  /**
   * @protected
   * @type {boolean}
   */
  @consumeContext(mediaContext.canPlay)
  _mediaCanPlay = mediaContext.canPlay.initialValue;

  _handleButtonClick(event) {
    if (this._pressed) {
      this._mediaRemote.exitFullscreen(event);
    } else {
      this._mediaRemote.enterFullscreen(event);
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
   * @param {boolean} canRequestFullscreen
   */
  @watchContext(mediaContext.canRequestFullscreen)
  _handleCanRequestFullscreenContextUpdate(canRequestFullscreen) {
    if (!this._mediaCanPlay) return;
    setAttribute(this, 'hidden', !canRequestFullscreen);
  }

  /**
   * @protected
   * @param {boolean} fullscreen
   */
  @watchContext(mediaContext.fullscreen)
  _handleFullscreenContextUpdate(fullscreen) {
    setAttribute(this, 'media-fullscreen', fullscreen);
  }
}
