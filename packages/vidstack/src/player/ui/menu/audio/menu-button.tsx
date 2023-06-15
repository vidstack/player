import { defineElement, type HTMLCustomElement } from 'maverick.js/element';
import musicPaths from 'media-icons/dist/icons/music.js';

import { MenuButton, type MenuButtonAPI } from '../menu-button';
import type { MenuButtonProps } from '../menu-button';
import { renderMenuButtonContent } from '../render';

declare global {
  interface MaverickElements {
    'media-audio-menu-button': MediaAudioMenuButtonElement;
  }
}

/**
 * This component is a pre-styled menu button that controls the opening and closing of a audio
 * tracks menu.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/audio-menu}
 * @example
 * ```html
 * <media-menu>
 *   <media-audio-menu-button label="Audio"></media-audio-menu-button>
 *   <media-audio-menu-items></media-audio-menu-items>
 * </media-menu>
 * ```
 */
export class AudioMenuButton extends MenuButton<AudioMenuButtonAPI> {
  static override el = defineElement<AudioMenuButtonAPI>({
    tagName: 'media-audio-menu-button',
    props: { disabled: false, label: 'Audio' },
  });

  override render() {
    const { label } = this.$props;
    return renderMenuButtonContent({
      label,
      iconPaths: musicPaths,
    });
  }
}

export interface AudioMenuButtonAPI extends MenuButtonAPI {
  props: AudioMenuButtonProps;
}

export interface AudioMenuButtonProps extends MenuButtonProps {
  label: string;
}

export interface MediaAudioMenuButtonElement extends HTMLCustomElement<AudioMenuButton> {}
