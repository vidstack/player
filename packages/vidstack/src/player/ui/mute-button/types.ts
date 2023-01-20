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
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/mute-button}
 * @slot volume-muted - Used to override the default muted icon.
 * @slot volume-low - Used to override the default volume low icon.
 * @slot volume-high - Used to override the default volume high icon.
 * @example
 * ```html
 * <vds-mute-button></vds-mute-button>
 * ```
 */
export interface MuteButtonElement
  extends HTMLCustomElement<MuteButtonProps, MuteButtonEvents>,
    MuteButtonMembers {}
