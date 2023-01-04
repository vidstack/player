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
 * 💡 The following attributes are applied:
 *
 * - `paused`: Applied when media playback has paused.
 *
 * @slot - Used to pass content into the play toggle for showing play/pause states.
 * @example
 * ```html
 * <vds-play-button>
 *   <div class="play">Play</div>
 *   <div class="pause">Pause</div>
 * </vds-play-button>
 * ```
 * @example
 * ```css
 * vds-play-button:not([paused]) .play {
 *   display: none;
 * }
 *
 * vds-play-button[paused] .pause {
 *   display: none;
 * }
 * ```
 */
export interface PlayButtonElement
  extends HTMLCustomElement<PlayButtonProps, PlayButtonEvents>,
    PlayButtonMembers {}
