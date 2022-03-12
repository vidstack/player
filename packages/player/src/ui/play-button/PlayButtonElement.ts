import { setAttribute, setAttributeIfEmpty } from '@vidstack/foundation';

import { MediaRemoteControl, mediaStoreSubscription } from '../../media/index.js';
import { ToggleButtonElement } from '../toggle-button/index.js';

/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 * 💡 The following media attributes are applied:
 *
 * - `media-paused`: Applied when media playback has paused.
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

    mediaStoreSubscription(this, 'paused', ($paused) => {
      this.pressed = !$paused;
      setAttribute(this, 'media-paused', $paused);
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
