import { property } from 'lit-element';

import { playerContext } from '../../../core';
import { VdsUserFullscreenChangeEvent } from '../../../core/user/user.events';
import { ToggleControl } from '../toggle-control';
import { FullscreenToggleProps } from './fullscreen-toggle.types';

/**
 * A control for toggling the fullscreen mode of the player.
 *
 * @tagname vds-fullscreen-toggle
 *
 * @slot enter - The content to show when the `fullscreen` state is `false`.
 * @slot exit - The content to show when the `fullscreen` state is `true`.
 *
 * @csspart control - The root control (`<vds-control>`).
 * @csspart control-* - All `vds-control` parts re-exported with the `control` prefix such as `control-root`.
 *
 * @example
 * ```html
 * <vds-fullscreen-toggle>
 *   <!-- Showing -->
 *   <div slot="enter"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="exit" hidden></div>
 * </vds-fullscreen-toggle>
 * ```
 */
export class FullscreenToggle
  extends ToggleControl
  implements FullscreenToggleProps {
  @playerContext.fullscreen.consume()
  on = playerContext.fullscreen.defaultValue;

  @property() label = 'Fullscreen';

  protected getOnSlotName(): string {
    return 'exit';
  }

  protected getOffSlotName(): string {
    return 'enter';
  }

  protected handleControlClick(originalEvent: Event): void {
    this.dispatchEvent(
      new VdsUserFullscreenChangeEvent({
        originalEvent,
        detail: !this.on,
      }),
    );
  }
}
