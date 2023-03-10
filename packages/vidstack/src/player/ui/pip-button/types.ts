import type { HTMLCustomElement } from 'maverick.js/element';

import type {
  ToggleButtonEvents,
  ToggleButtonMembers,
  ToggleButtonProps,
} from '../toggle-button/types';

export interface PIPButtonProps extends ToggleButtonProps {}

export interface PIPButtonEvents extends ToggleButtonEvents {}

export interface PIPButtonMembers extends ToggleButtonMembers, Omit<PIPButtonProps, 'disabled'> {}

/**
 * A button for toggling the picture-in-picture (PIP) mode of the player.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/pip-button}
 * @see {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture}
 * @slot enter - Used to override the default enter PIP icon.
 * @slot exit - Used to override the default exit PIP icon.
 * @slot tooltip-top-left - Used to place a tooltip above the button in the left corner.
 * @slot tooltip-top-center - Used to place a tooltip above the button in the center.
 * @slot tooltip-top-right - Used to place a tooltip above the button in the right corner.
 * @slot tooltip-bottom-left - Used to place a tooltip below the button in the left corner.
 * @slot tooltip-bottom-center - Used to place a tooltip below the button in the center.
 * @slot tooltip-bottom-right - Used to place a tooltip below the button in the right corner.
 * @example
 * ```html
 * <media-pip-button></media-pip-button>
 * ```
 */
export interface MediaPIPButtonElement
  extends HTMLCustomElement<PIPButtonProps, PIPButtonEvents>,
    PIPButtonMembers {}
