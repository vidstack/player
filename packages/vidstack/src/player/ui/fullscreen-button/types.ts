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
   * (i.e., `<media-player>`) or `provider`. The `prefer-media` option will first see if the native
   * fullscreen API is available, if not it'll try the media provider.
   */
  target: MediaFullscreenRequestTarget | undefined;
}

export interface FullscreenButtonEvents extends ToggleButtonEvents {}

export interface FullscreenButtonMembers
  extends ToggleButtonMembers,
    Omit<FullscreenButtonProps, 'disabled'> {}

/**
 * A button for toggling the fullscreen mode of the player.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/fullscreen-button}
 * @see {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen}
 * @slot enter - Used to override the default enter fullscreen icon.
 * @slot exit - Used to override the default exit fullscreen icon.
 * @slot tooltip-top-left - Used to place a tooltip above the button in the left corner.
 * @slot tooltip-top-center - Used to place a tooltip above the button in the center.
 * @slot tooltip-top-right - Used to place a tooltip above the button in the right corner.
 * @slot tooltip-bottom-left - Used to place a tooltip below the button in the left corner.
 * @slot tooltip-bottom-center - Used to place a tooltip below the button in the center.
 * @slot tooltip-bottom-right - Used to place a tooltip below the button in the right corner.
 * @example
 * ```html
 * <media-fullscreen-button></media-fullscreen-button>
 * ```
 */
export interface MediaFullscreenButtonElement
  extends HTMLCustomElement<FullscreenButtonProps, FullscreenButtonEvents>,
    FullscreenButtonMembers {}
