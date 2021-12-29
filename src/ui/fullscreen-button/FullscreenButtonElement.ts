import { MediaRemoteControl, subscribeToMediaService } from '../../media';
import { setAttribute } from '../../utils/dom';
import { ToggleButtonElement } from '../toggle-button';

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

  constructor() {
    super();
    subscribeToMediaService(this, ({ context }) => {
      this.pressed = context.fullscreen;
      setAttribute(this, 'media-can-play', context.canPlay);
      setAttribute(this, 'hidden', !context.canRequestFullscreen);
      setAttribute(this, 'media-fullscreen', context.fullscreen);
    });
  }

  protected override _handleButtonClick(event: Event) {
    if (this.pressed) {
      this._mediaRemote.exitFullscreen(event);
    } else {
      this._mediaRemote.enterFullscreen(event);
    }
  }
}
