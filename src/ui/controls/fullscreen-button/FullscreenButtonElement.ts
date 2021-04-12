import { property } from 'lit-element';

import { mediaContext } from '../../../core';
import { VdsUserFullscreenChangeEvent } from '../../../core/user/user.events';
import { ToggleButtonElement } from '../toggle-button';
import { FullscreenButtonElementProps } from './fullscreen-button.types';

/**
 * A button for toggling the fullscreen mode of the player.
 *
 * @tagname vds-fullscreen-button
 *
 * @slot enter - The content to show when the `fullscreen` state is `false`.
 * @slot exit - The content to show when the `fullscreen` state is `true`.
 *
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 *
 * @example
 * ```html
 * <vds-fullscreen-button>
 *   <!-- Showing -->
 *   <div slot="enter"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="exit" hidden></div>
 * </vds-fullscreen-button>
 * ```
 */
export class FullscreenButtonElement
  extends ToggleButtonElement
  implements FullscreenButtonElementProps {
  @mediaContext.fullscreen.consume()
  pressed = mediaContext.fullscreen.defaultValue;

  @property() label = 'Fullscreen';

  protected getPressedSlotName(): string {
    return 'exit';
  }

  protected getNotPressedSlotName(): string {
    return 'enter';
  }

  protected handleButtonClick(originalEvent: Event): void {
    this.dispatchEvent(
      new VdsUserFullscreenChangeEvent({
        originalEvent,
        detail: !this.pressed,
      }),
    );
  }
}
