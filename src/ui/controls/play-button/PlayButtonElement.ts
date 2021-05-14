import { property } from 'lit/decorators.js';

import {
  mediaContext,
  VdsPauseRequestEvent,
  VdsPlayRequestEvent,
} from '../../../core';
import { ToggleButtonElement } from '../toggle-button';
import { PlayButtonElementProps } from './play-button.types';

/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 * @tagname vds-play-button
 *
 * @slot play - The content to show when the `paused` state is `true`.
 * @slot pause - The content to show when the `paused` state is `false`.
 *
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 *
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
export class PlayButtonElement
  extends ToggleButtonElement
  implements PlayButtonElementProps {
  // Transforming `paused` to `!paused` to indicate whether playback has initiated/resumed. Can't
  // use `playing` becuase there could be a buffering delay (we want immediate feedback).
  @mediaContext.paused.consume({ transform: p => !p })
  pressed = false;

  @property() label = 'Play';

  protected getPressedSlotName(): string {
    return 'pause';
  }

  protected getNotPressedSlotName(): string {
    return 'play';
  }

  protected handleButtonClick(originalEvent: Event): void {
    const RequestEvent = this.pressed
      ? VdsPauseRequestEvent
      : VdsPlayRequestEvent;

    this.dispatchEvent(new RequestEvent({ originalEvent }));
  }
}
