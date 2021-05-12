import { property } from 'lit/decorators';

import {
  mediaContext,
  VdsMuteRequestEvent,
  VdsUnmuteRequestEvent,
} from '../../../core';
import { ToggleButtonElement } from '../toggle-button';
import { MuteButtonElementProps } from './mute-button.types';

/**
 * A button for toggling the muted state of the player.
 *
 * @tagname vds-mute-button
 *
 * @slot mute - The content to show when the `muted` state is `false`.
 * @slot unmute - The content to show when the `muted` state is `true`.
 *
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 *
 * @example
 * ```html
 * <vds-mute-button>
 *   <!-- Showing -->
 *   <div slot="mute"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="unmute" hidden></div>
 * </vds-mute-button>
 * ```
 */
export class MuteButtonElement
  extends ToggleButtonElement
  implements MuteButtonElementProps {
  @mediaContext.muted.consume()
  pressed = mediaContext.muted.defaultValue;

  @property() label = 'Mute';

  protected getPressedSlotName(): string {
    return 'unmute';
  }

  protected getNotPressedSlotName(): string {
    return 'mute';
  }

  protected handleButtonClick(originalEvent: Event): void {
    const RequestEvent = this.pressed
      ? VdsUnmuteRequestEvent
      : VdsMuteRequestEvent;

    this.dispatchEvent(new RequestEvent({ originalEvent }));
  }
}
