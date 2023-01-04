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
 * 💡 The following attributes are applied:
 *
 * - `muted`: Applied when media audio has been muted.
 *
 * @slot - Used to pass content into the mute toggle for showing mute/unmute states.
 * @example
 * ```html
 * <vds-mute-button>
 *   <div class="mute">Mute</div>
 *   <div class="unmute">Unmute</div>
 * </vds-mute-button>
 * ```
 * @example
 * ```css
 * vds-mute-button[muted] .mute {
 *   display: none;
 * }
 *
 * vds-mute-button:not([muted]) .unmute {
 *   display: none;
 * }
 * ```
 */
export interface MuteButtonElement
  extends HTMLCustomElement<MuteButtonProps, MuteButtonEvents>,
    MuteButtonMembers {}
