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
 * @docs {@link https://www.vidstack.io/docs/player/components/ui/play-button}
 * @slot play - Used to override the default play icon.
 * @slot pause - Used to override the default pause icon.
 * @example
 * ```html
 * <vds-play-button></vds-play-button>
 * ```
 */
export interface PlayButtonElement
  extends HTMLCustomElement<PlayButtonProps, PlayButtonEvents>,
    PlayButtonMembers {}
