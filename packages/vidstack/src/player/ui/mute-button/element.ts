import { computed } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';

import { useMediaRemoteControl } from '../../media/remote-control';
import { useMediaStore } from '../../media/store';
import { toggleButtonProps } from '../toggle-button/props';
import { useToggleButton } from '../toggle-button/use-toggle-button';
import type { MuteButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-mute-button': MuteButtonElement;
  }
}

export const MuteButtonDefinition = defineCustomElement<MuteButtonElement>({
  tagName: 'vds-mute-button',
  props: toggleButtonProps,
  setup({ host, props: { $disabled } }) {
    const $media = useMediaStore(),
      $pressed = computed(() => $media.muted || $media.volume === 0),
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      }),
      remote = useMediaRemoteControl(host.$el);

    host.setAttributes({
      muted: $pressed,
      'aria-label': () => ($pressed() ? 'Unmute' : 'Mute'),
    });

    function onPress(event: Event) {
      if ($disabled()) return;
      $pressed() ? remote.unmute(event) : remote.mute(event);
    }

    return toggle;
  },
});

export default MuteButtonDefinition;
