import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';
import { pictureInPictureExitPaths, pictureInPicturePaths } from 'media-icons';

import { Icon } from '../../../icons/icon';
import { setARIALabel } from '../../../utils/dom';
import { useARIAKeyShortcuts } from '../../element/keyboard';
import { useMedia } from '../../media/context';
import { toggleButtonProps } from '../toggle-button/props';
import { useToggleButton } from '../toggle-button/use-toggle-button';
import type { MediaPIPButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-pip-button': MediaPIPButtonElement;
  }
}

export const PIPButtonDefinition = defineCustomElement<MediaPIPButtonElement>({
  tagName: 'media-pip-button',
  props: toggleButtonProps,
  setup({ host, props: { $disabled, $defaultAppearance }, accessors }) {
    const { $store: $media, remote } = useMedia(),
      $pressed = () => $media.pictureInPicture,
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      });

    useARIAKeyShortcuts(host, 'togglePictureInPicture');

    onAttach(() => {
      setARIALabel(host.el!, () =>
        $media.pictureInPicture ? 'Exit Picture In Picture' : 'Enter Picture In Picture',
      );
    });

    host.setAttributes({
      'data-hidden': () => !$media.canPictureInPicture,
      'data-pip': () => $media.pictureInPicture,
      'default-appearance': $defaultAppearance,
    });

    function onPress(event: Event) {
      if ($disabled()) return;
      $pressed() ? remote.exitPictureInPicture(event) : remote.enterPictureInPicture(event);
    }

    return mergeProperties(toggle, accessors(), {
      $render: () => {
        return (
          <>
            <Icon paths={pictureInPicturePaths} slot="enter" />
            <Icon paths={pictureInPictureExitPaths} slot="exit" />
          </>
        );
      },
    });
  },
});
