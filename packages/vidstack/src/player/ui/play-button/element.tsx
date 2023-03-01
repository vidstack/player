import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';
import { pausePaths, playPaths } from 'media-icons';

import { Icon } from '../../../icons/icon';
import { setARIALabel } from '../../../utils/dom';
import { useARIAKeyShortcuts } from '../../element/keyboard';
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
  setup({ host, props: { $disabled, $defaultAppearance } }) {
    const { $store: $media, remote } = useMedia(),
      $pressed = () => !$media.paused,
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      });

    useARIAKeyShortcuts(host, 'togglePaused');

    onAttach(() => {
      setARIALabel(host.el!, () => ($media.paused ? 'Play' : 'Pause'));
    });

    host.setAttributes({
      'default-appearance': $defaultAppearance,
      'data-paused': () => $media.paused,
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
