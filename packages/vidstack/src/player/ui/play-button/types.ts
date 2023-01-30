import type { HTMLCustomElement } from 'maverick.js/element';

import type {
  ToggleButtonEvents,
  ToggleButtonMembers,
  ToggleButtonProps,
} from '../toggle-button/types';

export interface PlayButtonProps extends ToggleButtonProps {}

export interface PlayButtonEvents extends ToggleButtonEvents {}

export interface PlayButtonMembers extends ToggleButtonMembers {}

/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/play-button}
 * @slot play - Used to override the default play icon.
 * @slot pause - Used to override the default pause icon.
 * @example
 * ```html
 * <media-play-button></media-play-button>
 * ```
 */
export interface MediaPlayButtonElement
  extends HTMLCustomElement<PlayButtonProps, PlayButtonEvents>,
    PlayButtonMembers {}
