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
 * @slot tooltip-top-left - Used to place a tooltip above the button in the left corner.
 * @slot tooltip-top-center - Used to place a tooltip above the button in the center.
 * @slot tooltip-top-right - Used to place a tooltip above the button in the right corner.
 * @slot tooltip-bottom-left - Used to place a tooltip below the button in the left corner.
 * @slot tooltip-bottom-center - Used to place a tooltip below the button in the center.
 * @slot tooltip-bottom-right - Used to place a tooltip below the button in the right corner.
 * @example
 * ```html
 * <media-mute-button></media-mute-button>
 * ```
 */
export interface MediaMuteButtonElement
  extends HTMLCustomElement<MuteButtonProps, MuteButtonEvents>,
    MuteButtonMembers {}
