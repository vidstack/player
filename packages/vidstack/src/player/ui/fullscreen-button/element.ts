import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties, setAttribute } from 'maverick.js/std';

import { useMediaRemoteControl } from '../../media/remote-control';
import { useMediaState } from '../../media/store';
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
  setup({ host, props, accessors }) {
    const $target = () => (host.$connected ? host.el : null),
      $media = useMediaState(),
      toggle = useToggleButton(host, $target, () => $media.fullscreen, {
        $props: props,
        onPress,
      }),
      remote = useMediaRemoteControl($target);

    onAttach(() => {
      setAttribute(host.el!, 'hidden', () => !$media.canFullscreen);
      setAttribute(host.el!, 'fullscreen', () => $media.fullscreen);
      setAttribute(host.el!, 'aria-label', () =>
        $media.fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen',
      );
    });

    function onPress(event: Event) {
      if (props.disabled) return;
      toggle.pressed
        ? remote.exitFullscreen(props.target, event)
        : remote.enterFullscreen(props.target, event);
    }

    return mergeProperties(toggle, accessors());
  },
});

export default FullscreenButtonDefinition;
