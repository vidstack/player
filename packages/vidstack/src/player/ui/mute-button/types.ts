import type { HTMLCustomElement } from 'maverick.js/element';

import type {
  ToggleButtonEvents,
  ToggleButtonMembers,
  ToggleButtonProps,
} from '../toggle-button/types';

export interface MuteButtonProps extends ToggleButtonProps {}

export interface MuteButtonEvents extends ToggleButtonEvents {}

export interface MuteButtonMembers extends ToggleButtonMembers {}

/**
 * A button for toggling the muted state of the player.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/ui/mute-button}
 * @slot - Used to override the volume low, high, and muted icons.
 * @example
 * ```html
 * <vds-mute-button></vds-mute-button>
 * ```
 */
export interface MuteButtonElement
  extends HTMLCustomElement<MuteButtonProps, MuteButtonEvents>,
    MuteButtonMembers {}
