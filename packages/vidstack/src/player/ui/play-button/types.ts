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
 * @slot - Used to override the play/pause icons.
 * @example
 * ```html
 * <vds-play-button></vds-play-button>
 * ```
 */
export interface PlayButtonElement
  extends HTMLCustomElement<PlayButtonProps, PlayButtonEvents>,
    PlayButtonMembers {}
