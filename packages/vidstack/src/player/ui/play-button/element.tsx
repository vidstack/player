import { pausePaths, playPaths } from '@vidstack/icons';
import { defineCustomElement } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';

import { Icon } from '../../../icons/icon';
import { useMedia } from '../../media/context';
import { toggleButtonProps } from '../toggle-button/props';
import { useToggleButton } from '../toggle-button/use-toggle-button';
import type { MediaPlayButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-play-button': MediaPlayButtonElement;
  }
}

export const PlayButtonDefinition = defineCustomElement<MediaPlayButtonElement>({
  tagName: 'media-play-button',
  props: toggleButtonProps,
  setup({ host, props: { $disabled } }) {
    const { $store: $media, remote } = useMedia(),
      $pressed = () => !$media.paused,
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      });

    host.setAttributes({
      paused: () => $media.paused,
      'aria-label': () => ($media.paused ? 'Play' : 'Pause'),
    });

    function onPress(event: Event) {
      if ($disabled()) return;
      $pressed() ? remote.pause(event) : remote.play(event);
    }

    return mergeProperties(toggle, {
      $render: () => {
        return (
          <>
            <Icon paths={playPaths} slot="play" />
            <Icon paths={pausePaths} slot="pause" />
          </>
        );
      },
    });
  },
});
