import { computed } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { useMediaRemoteControl } from '../../media/remote-control';
import { useMediaState } from '../../media/store';
import { toggleButtonProps } from '../toggle-button/props';
import { useToggleButton } from '../toggle-button/use-toggle-button';
import type { MuteButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-mute-button': MuteButtonElement;
  }
}

export const MuteButtonElementDefinition = defineCustomElement<MuteButtonElement>({
  tagName: 'vds-mute-button',
  props: toggleButtonProps,
  setup({ host, props }) {
    const $target = () => (host.$connected ? host.el : null),
      $media = useMediaState(),
      $muted = computed(() => $media.muted || $media.volume === 0),
      toggle = useToggleButton(host, $target, $muted, {
        $props: props,
        onPress,
      }),
      remote = useMediaRemoteControl($target);

    onAttach(() => {
      setAttribute(host.el!, 'muted', $muted);
      setAttribute(host.el!, 'aria-label', () => ($muted() ? 'Unmute' : 'Mute'));
    });

    function onPress(event: Event) {
      if (props.disabled) return;
      toggle.pressed ? remote.unmute(event) : remote.mute(event);
    }

    return toggle;
  },
});
