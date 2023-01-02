import { defineCustomElement } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';

import { useMediaRemoteControl } from '../../media/remote-control';
import { useMediaStore } from '../../media/store';
import { toggleButtonProps } from '../toggle-button/props';
import { useToggleButton } from '../toggle-button/use-toggle-button';
import type { FullscreenButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-fullscreen-button': FullscreenButtonElement;
  }
}

export const FullscreenButtonDefinition = defineCustomElement<FullscreenButtonElement>({
  tagName: 'vds-fullscreen-button',
  props: {
    ...toggleButtonProps,
    target: { initial: 'media' },
  },
  setup({ host, props: { $target, $disabled }, accessors }) {
    const $media = useMediaStore(),
      $pressed = () => $media.fullscreen,
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      }),
      remote = useMediaRemoteControl(host.$el);

    host.setAttributes({
      hidden: () => !$media.canFullscreen,
      fullscreen: () => $media.fullscreen,
      'aria-label': () => ($media.fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'),
    });

    function onPress(event: Event) {
      if ($disabled()) return;
      $pressed()
        ? remote.exitFullscreen($target(), event)
        : remote.enterFullscreen($target(), event);
    }

    return mergeProperties(toggle, accessors());
  },
});

export default FullscreenButtonDefinition;
