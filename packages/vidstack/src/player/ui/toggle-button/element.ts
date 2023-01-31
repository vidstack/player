import { signal } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';

import { toggleButtonProps } from './props';
import type { MediaToggleButtonElement } from './types';
import { useToggleButton } from './use-toggle-button';

declare global {
  interface HTMLElementTagNameMap {
    'media-toggle-button': MediaToggleButtonElement;
  }
}

export const ToggleButtonDefinition = defineCustomElement<MediaToggleButtonElement>({
  tagName: 'media-toggle-button',
  props: toggleButtonProps,
  setup({ host, props }) {
    const $pressed = signal(props.$defaultPressed()),
      toggle = useToggleButton(host, {
        $props: { ...props, $pressed },
        onPress,
      });

    host.setAttributes({
      pressed: $pressed,
    });

    function onPress() {
      if (props.$disabled()) return;
      $pressed.set((p) => !p);
    }

    return toggle;
  },
});
