import { defineCustomElement, onAttach } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { useMediaRemoteControl } from '../../media/remote-control';
import { useMediaState } from '../../media/store';
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
  setup({ host, props }) {
    const $target = () => (host.$connected ? host.el : null),
      $media = useMediaState(),
      toggle = useToggleButton(host, $target, () => !$media.paused, {
        $props: props,
        onPress,
      }),
      remote = useMediaRemoteControl($target);

    onAttach(() => {
      setAttribute(host.el!, 'paused', () => $media.paused);
      setAttribute(host.el!, 'aria-label', () => ($media.paused ? 'Play' : 'Pause'));
    });

    function onPress(event: Event) {
      if (props.disabled) return;
      toggle.pressed ? remote.pause(event) : remote.play(event);
    }

    return toggle;
  },
});

export default PlayButtonDefinition;
