import { computed } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';
import { mutePaths, volumeHighPaths, volumeLowPaths } from 'media-icons';

import { Icon } from '../../../icons/icon';
import { setARIALabel } from '../../../utils/dom';
import { useARIAKeyShortcuts } from '../../element/keyboard';
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
  setup({ host, props: { $disabled, $defaultAppearance } }) {
    const { $store: $media, remote } = useMedia(),
      $pressed = computed(() => $media.muted || $media.volume === 0),
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      });

    useARIAKeyShortcuts(host, 'toggleMuted');

    onAttach(() => {
      setARIALabel(host.el!, () => ($pressed() ? 'Unmute' : 'Mute'));
    });

    host.setAttributes({
      'data-muted': $pressed,
      'data-volume': getVolumeText,
      'default-appearance': $defaultAppearance,
    });

    function getVolumeText() {
      if ($media.muted || $media.volume === 0) return 'muted';
      else if ($media.volume >= 0.5) return 'high';
      else if ($media.volume < 0.5) return 'low';
    }

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
