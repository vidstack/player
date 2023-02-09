import { mutePaths, volumeHighPaths, volumeLowPaths } from '@vidstack/icons';
import { computed } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';

import { Icon } from '../../../icons/icon';
import { useMedia } from '../../media/context';
import { toggleButtonProps } from '../toggle-button/props';
import { useToggleButton } from '../toggle-button/use-toggle-button';
import type { MediaMuteButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-mute-button': MediaMuteButtonElement;
  }
}

export const MuteButtonDefinition = defineCustomElement<MediaMuteButtonElement>({
  tagName: 'media-mute-button',
  props: toggleButtonProps,
  setup({ host, props: { $disabled } }) {
    const { $store: $media, remote } = useMedia(),
      $pressed = computed(() => $media.muted || $media.volume === 0),
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      });

    host.setAttributes({
      muted: $pressed,
      'volume-low': () => !$media.muted && $media.volume > 0 && $media.volume < 0.5,
      'volume-high': () => !$media.muted && $media.volume >= 0.5,
      'aria-label': () => ($pressed() ? 'Unmute' : 'Mute'),
    });

    function onPress(event: Event) {
      if ($disabled()) return;
      $pressed() ? remote.unmute(event) : remote.mute(event);
    }

    return mergeProperties(toggle, {
      $render: () => {
        return (
          <>
            <Icon paths={volumeHighPaths} slot="volume-high" />
            <Icon paths={volumeLowPaths} slot="volume-low" />
            <Icon paths={mutePaths} slot="volume-muted" />
          </>
        );
      },
    });
  },
});
