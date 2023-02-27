import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';
import { fullscreenExitPaths, fullscreenPaths } from 'media-icons';

import { Icon } from '../../../icons/icon';
import { setARIALabel } from '../../../utils/dom';
import { useMedia } from '../../media/context';
import { toggleButtonProps } from '../toggle-button/props';
import { useToggleButton } from '../toggle-button/use-toggle-button';
import type { MediaFullscreenButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-fullscreen-button': MediaFullscreenButtonElement;
  }
}

export const FullscreenButtonDefinition = defineCustomElement<MediaFullscreenButtonElement>({
  tagName: 'media-fullscreen-button',
  props: {
    ...toggleButtonProps,
    target: { initial: 'prefer-media' },
  },
  setup({ host, props: { $target, $disabled, $defaultAppearance }, accessors }) {
    const { $store: $media, remote } = useMedia(),
      $pressed = () => $media.fullscreen,
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      });

    onAttach(() => {
      setARIALabel(host.el!, () => ($media.fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'));
    });

    host.setAttributes({
      hidden: () => !$media.canFullscreen,
      fullscreen: () => $media.fullscreen,
      'default-appearance': $defaultAppearance,
    });

    function onPress(event: Event) {
      if ($disabled()) return;
      $pressed()
        ? remote.exitFullscreen($target(), event)
        : remote.enterFullscreen($target(), event);
    }

    return mergeProperties(toggle, accessors(), {
      $render: () => {
        return (
          <>
            <Icon paths={fullscreenPaths} slot="enter" />
            <Icon paths={fullscreenExitPaths} slot="exit" />
          </>
        );
      },
    });
  },
});
