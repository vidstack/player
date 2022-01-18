import { hostedMediaStoreSubscription, MediaRemoteControl } from '../../media';
import { setAttribute, setAttributeIfEmpty } from '../../utils/dom';
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

  constructor() {
    super();
    hostedMediaStoreSubscription(this, 'canPlay', ($canPlay) => {
      setAttribute(this, 'media-can-play', $canPlay);
    });
    hostedMediaStoreSubscription(this, 'waiting', ($waiting) => {
      setAttribute(this, 'media-waiting', $waiting);
    });
    hostedMediaStoreSubscription(this, 'paused', ($paused) => {
      this.pressed = !$paused;
      setAttribute(this, 'media-paused', $paused);
    });
    hostedMediaStoreSubscription(this, 'ended', ($ended) => {
      setAttribute(this, 'media-ended', $ended);
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    setAttributeIfEmpty(this, 'aria-label', 'Play');
  }

  protected override _handleButtonClick(event: Event) {
    if (this.disabled) return;

    if (this.pressed) {
      this._mediaRemote.pause(event);
    } else {
      this._mediaRemote.play(event);
    }
  }
}
