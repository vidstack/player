import { setAttribute, setAttributeIfEmpty } from '@vidstack/foundation';
import { property } from 'lit/decorators.js';

import {
  type MediaFullscreenRequestTarget,
  MediaRemoteControl,
  mediaStoreSubscription,
} from '../../media';
import { ToggleButtonElement } from '../toggle-button';

/**
 * A button for toggling the fullscreen mode of the player.
 *
 * 💡 The following media attributes are applied:
 *
 * - `media-fullscreen`: Applied when the media has entered fullscreen.
 *
 * 🚨 The `hidden` attribute will be present on this element in the event fullscreen cannot be
 * requested (no support). There are default styles for this by setting the `display` property to
 * `none`. Important to be aware of this and update it according to your needs.
 *
 * @tagname vds-fullscreen-button
 * @slot - Used to pass content into the fullscreen toggle for showing enter/exit states.
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

  /**
   * The target element on which to request fullscreen on. The target can be the media controller
   * or provider.
   *
   * @default 'provider'
   */
  @property({ attribute: 'fullscreen-target' })
  fullscreenTarget?: MediaFullscreenRequestTarget;

  constructor() {
    super();

    mediaStoreSubscription(this, 'fullscreen', ($fullscreen) => {
      this.pressed = $fullscreen;
      setAttribute(this, 'media-fullscreen', $fullscreen);
    });
    mediaStoreSubscription(this, 'canFullscreen', ($canFullscreen) => {
      setAttribute(this, 'hidden', !$canFullscreen);
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    setAttributeIfEmpty(this, 'aria-label', 'Fullscreen');
  }

  protected override _handleButtonClick(event: Event) {
    if (this.disabled) return;

    if (this.pressed) {
      this._mediaRemote.exitFullscreen(this.fullscreenTarget, event);
    } else {
      this._mediaRemote.enterFullscreen(this.fullscreenTarget, event);
    }
  }
}
