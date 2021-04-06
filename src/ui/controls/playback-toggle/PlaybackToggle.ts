import { property } from 'lit-element';

import { playerContext } from '../../../core';
import {
  VdsUserPauseEvent,
  VdsUserPlayEvent,
} from '../../../core/user/user.events';
import { ToggleControl } from '../toggle-control';
import { PlaybackToggleProps } from './playback-toggle.types';

/**
 * A control for toggling the playback state (play/pause) of the current media.
 *
 * @tagname vds-playback-toggle
 *
 * @slot play - The content to show when the `paused` state is `true`.
 * @slot pause - The content to show when the `paused` state is `false`.
 *
 * @csspart control - The root control (`<vds-control>`).
 * @csspart control-* - All `vds-control` parts re-exported with the `control` prefix such as `control-root`.
 *
 * @example
 * ```html
 * <vds-playback-toggle>
 *   <!-- Showing -->
 *   <div slot="play"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="pause" hidden></div>
 * </vds-playback-toggle>
 * ```
 */
export class PlaybackToggle
  extends ToggleControl
  implements PlaybackToggleProps {
  // Transforming `paused` to `!paused` to indicate whether playback has initiated/resumed. Can't
  // use `isPlaying` becuase there could be a buffering delay (we want immediate feedback).
  @playerContext.paused.consume({ transform: p => !p })
  on = false;

  @property() label = 'Play';

  protected getOnSlotName(): string {
    return 'pause';
  }

  protected getOffSlotName(): string {
    return 'play';
  }

  protected handleControlClick(originalEvent: Event): void {
    const Request = this.on ? VdsUserPauseEvent : VdsUserPlayEvent;
    this.dispatchEvent(new Request({ originalEvent }));
  }
}
