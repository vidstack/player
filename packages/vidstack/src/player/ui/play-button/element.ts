import { defineCustomElement, onAttach } from 'maverick.js/element';

import { useMediaRemoteControl } from '../../media/remote-control';
import { useMediaStore } from '../../media/store';
import { toggleButtonProps } from '../toggle-button/props';
import { useToggleButton } from '../toggle-button/use-toggle-button';
import type { PlayButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-play-button': PlayButtonElement;
  }
}

export const PlayButtonDefinition = defineCustomElement<PlayButtonElement>({
  tagName: 'vds-play-button',
  props: toggleButtonProps,
  setup({ host, props: { $disabled } }) {
    const $media = useMediaStore(),
      $pressed = () => !$media.paused,
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      }),
      remote = useMediaRemoteControl(host.$el);

    host.setAttributes({
      paused: () => $media.paused,
      'aria-label': () => ($media.paused ? 'Play' : 'Pause'),
    });

    function onPress(event: Event) {
      if ($disabled()) return;
      $pressed() ? remote.pause(event) : remote.play(event);
    }

    return toggle;
  },
});

export default PlayButtonDefinition;
