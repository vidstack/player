import { consumeContext, watchContext } from '../../base/context';
import { CanPlay, mediaContext, MediaRemoteControl } from '../../media';
import { setAttribute } from '../../utils/dom';
import { ToggleButtonElement } from '../toggle-button';

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
  protected readonly _mediaRemote = new MediaRemoteControl(this);

  override label = 'Fullscreen';

  @consumeContext(mediaContext.fullscreen)
  override pressed = mediaContext.fullscreen.initialValue;

  @consumeContext(mediaContext.canPlay)
  protected _mediaCanPlay = mediaContext.canPlay.initialValue;

  protected override _handleButtonClick(event: Event) {
    if (this.pressed) {
      this._mediaRemote.exitFullscreen(event);
    } else {
      this._mediaRemote.enterFullscreen(event);
    }
  }

  @watchContext(mediaContext.canPlay)
  protected _handleCanPlayContextUpdate(canPlay: CanPlay) {
    setAttribute(this, 'media-can-play', canPlay);
  }

  @watchContext(mediaContext.canRequestFullscreen)
  protected _handleCanRequestFullscreenContextUpdate(
    canRequestFullscreen: boolean
  ) {
    if (!this._mediaCanPlay) return;
    setAttribute(this, 'hidden', !canRequestFullscreen);
  }

  @watchContext(mediaContext.fullscreen)
  protected _handleFullscreenContextUpdate(fullscreen: boolean) {
    setAttribute(this, 'media-fullscreen', fullscreen);
  }
}
