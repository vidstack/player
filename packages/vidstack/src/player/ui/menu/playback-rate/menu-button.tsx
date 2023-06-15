import { defineElement, type HTMLCustomElement } from 'maverick.js/element';
import odometerPaths from 'media-icons/dist/icons/odometer.js';

import { MenuButton, type MenuButtonAPI } from '../menu-button';
import type { MenuButtonProps } from '../menu-button';
import { renderMenuButtonContent } from '../render';

declare global {
  interface MaverickElements {
    'media-playback-rate-menu-button': MediaPlaybackRateMenuButtonElement;
  }
}

/**
 * This component is a pre-styled menu button that controls the opening and closing of a playback
 * rate menu.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/playback-rate-menu}
 * @example
 * ```html
 * <media-menu>
 *   <media-playback-rate-menu-button label="Speed"></media-playback-rate-menu-button>
 *   <media-playback-rate-menu-items></media-playback-rate-menu-items>
 * </media-menu>
 * ```
 */
export class PlaybackRateMenuButton extends MenuButton<PlaybackRateMenuButtonAPI> {
  static override el = defineElement<PlaybackRateMenuButtonAPI>({
    tagName: 'media-playback-rate-menu-button',
    props: { disabled: false, label: 'Speed' },
  });

  override render() {
    const { label } = this.$props;
    return renderMenuButtonContent({
      label,
      iconPaths: odometerPaths,
    });
  }
}

export interface PlaybackRateMenuButtonAPI extends MenuButtonAPI {
  props: PlaybackRateMenuButtonProps;
}

export interface PlaybackRateMenuButtonProps extends MenuButtonProps {
  label: string;
}

export interface MediaPlaybackRateMenuButtonElement
  extends HTMLCustomElement<PlaybackRateMenuButton> {}
