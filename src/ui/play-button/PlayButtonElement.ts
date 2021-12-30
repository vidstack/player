import {
  hostedMediaServiceSubscription,
  MediaRemoteControl
} from '../../media';
import { setAttribute } from '../../utils/dom';
import { ToggleButtonElement } from '../toggle-button';

/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-paused`: Applied when media playback has paused.
 * - `media-waiting`: Applied when playback has stopped because of a lack of temporary data.
 * - `media-ended`: Applied when playback has reached the end.
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
  protected readonly _mediaRemote = new MediaRemoteControl(this);

  override label = 'Play';

  constructor() {
    super();
    hostedMediaServiceSubscription(this, ({ context }) => {
      this.pressed = !context.paused;
      setAttribute(this, 'media-can-play', context.canPlay);
      setAttribute(this, 'media-waiting', context.waiting);
      setAttribute(this, 'media-paused', context.paused);
      setAttribute(this, 'media-ended', context.ended);
    });
  }

  protected override _handleButtonClick(event: Event) {
    if (this.pressed) {
      this._mediaRemote.pause(event);
    } else {
      this._mediaRemote.play(event);
    }
  }
}
