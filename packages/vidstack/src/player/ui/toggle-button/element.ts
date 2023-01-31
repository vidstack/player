import { signal } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';

import { toggleButtonProps } from './props';
import type { ToggleButtonElement } from './types';
import { useToggleButton } from './use-toggle-button';

export const ToggleButtonDefinition = defineCustomElement<ToggleButtonElement>({
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
