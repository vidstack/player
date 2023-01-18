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
 * @docs {@link https://www.vidstack.io/docs/player/components/ui/fullscreen-button}
 * @slot enter - Used to override the default enter fullscreen icon.
 * @slot exit - Used to override the default exit fullscreen icon.
 * @example
 * ```html
 * <vds-fullscreen-button></vds-fullscreen-button>
 * ```
 */
export interface FullscreenButtonElement
  extends HTMLCustomElement<FullscreenButtonProps, FullscreenButtonEvents>,
    FullscreenButtonMembers {}
