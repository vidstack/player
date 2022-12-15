import type { HTMLCustomElement } from 'maverick.js/element';

import type { MediaFullscreenRequestTarget } from '../../media/request-events';
import type {
  ToggleButtonEvents,
  ToggleButtonMembers,
  ToggleButtonProps,
} from '../toggle-button/types';

export interface FullscreenButtonProps extends ToggleButtonProps {
  /**
   * The target element on which to request fullscreen on. The target can be the `media`
   * (i.e., `<vds-media>`) or `provider` (e.g., `<vds-video>`) element.
   */
  target: MediaFullscreenRequestTarget | undefined;
}

export interface FullscreenButtonEvents extends ToggleButtonEvents {}

export interface FullscreenButtonMembers extends ToggleButtonMembers, FullscreenButtonProps {}

/**
 * A button for toggling the fullscreen mode of the player.
 *
 * 💡 The following attributes are applied:
 *
 * - `fullscreen`: Applied when the media has entered fullscreen.
 *
 * 🚨 The `hidden` attribute will be present on this element in the event fullscreen cannot be
 * requested (no support). There are default styles for this by setting the `display` property to
 * `none`. Important to be aware of this and update it according to your needs.
 *
 * @tagname vds-fullscreen-button
 * @slot - Used to pass content into the fullscreen toggle for showing enter/exit states.
 * @example
 * ```html
 * <vds-fullscreen-button>
 *   <div class="enter">Enter</div>
 *   <div class="exit">Exit</div>
 * </vds-fullscreen-button>
 * ```
 * @example
 * ```css
 * vds-fullscreen-button[fullscreen] .enter {
 *   display: none;
 * }
 *
 * vds-fullscreen-button:not([fullscreen]) .exit {
 *   display: none;
 * }
 * ```
 */
export interface FullscreenButtonElement
  extends HTMLCustomElement<FullscreenButtonProps, FullscreenButtonEvents>,
    FullscreenButtonMembers {}
