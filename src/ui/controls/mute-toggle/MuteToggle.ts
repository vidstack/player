import { property } from 'lit-element';

import { playerContext, VdsUserMutedChangeEvent } from '../../../core';
import { ToggleControl } from '../toggle-control';
import { MuteToggleProps } from './mute-toggle.types';

/**
 * A control for toggling the muted state of the player.
 *
 * @tagname vds-mute-toggle
 *
 * @slot mute - The content to show when the `muted` state is `false`.
 * @slot unmute - The content to show when the `muted` state is `true`.
 *
 * @csspart control - The root control (`<vds-control>`).
 * @csspart control-* - All `vds-control` parts re-exported with the `control` prefix such as `control-root`.
 *
 * @example
 * ```html
 * <vds-mute-toggle>
 *   <!-- Showing -->
 *   <div slot="mute"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="unmute" hidden></div>
 * </vds-mute-toggle>
 * ```
 */
export class MuteToggle extends ToggleControl implements MuteToggleProps {
  @playerContext.muted.consume()
  on = playerContext.muted.defaultValue;

  @property() label = 'Mute';

  protected getOnSlotName(): string {
    return 'unmute';
  }

  protected getOffSlotName(): string {
    return 'mute';
  }

  protected handleControlClick(originalEvent: Event): void {
    this.dispatchEvent(
      new VdsUserMutedChangeEvent({
        originalEvent,
        detail: !this.on,
      }),
    );
  }
}
