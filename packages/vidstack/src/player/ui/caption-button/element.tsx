import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';
import { closedCaptionsOnPaths, closedCaptionsPaths } from 'media-icons';

import { Icon } from '../../../icons/icon';
import { setARIALabel } from '../../../utils/dom';
import { useARIAKeyShortcuts } from '../../element/keyboard';
import { useMedia } from '../../media/context';
import { isTrackCaptionKind } from '../../media/tracks/text/text-track';
import { toggleButtonProps } from '../toggle-button/props';
import { useToggleButton } from '../toggle-button/use-toggle-button';
import type { MediaCaptionButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-caption-button': MediaCaptionButtonElement;
  }
}

export const CaptionButtonDefinition = defineCustomElement<MediaCaptionButtonElement>({
  tagName: 'media-caption-button',
  props: toggleButtonProps,
  setup({ host, props: { $disabled, $defaultAppearance }, accessors }) {
    const { $store: $media, remote } = useMedia(),
      $pressed = () => !!$media.textTrack,
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      });

    useARIAKeyShortcuts(host, 'toggleCaptions');

    onAttach(() => {
      setARIALabel(host.el!, () =>
        $media.textTrack ? 'Closed-Captions Off' : 'Closed-Captions On',
      );
    });

    host.setAttributes({
      'data-hidden': () => $media.textTracks.filter(isTrackCaptionKind).length == 0,
      'default-appearance': $defaultAppearance,
    });

    function onPress(event: Event) {
      if ($disabled()) return;
      remote.toggleCaptions(event);
    }

    return mergeProperties(toggle, accessors(), {
      $render: () => {
        return (
          <>
            <Icon paths={closedCaptionsOnPaths} slot="on" />
            <Icon paths={closedCaptionsPaths} slot="off" />
          </>
        );
      },
    });
  },
});
