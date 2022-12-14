import { defineCustomElement, onConnect } from 'maverick.js/element';
import { dispatchEvent, mergeProperties } from 'maverick.js/std';

import { useFullscreen } from '../../../foundation/fullscreen/use-fullscreen';
import { useHTMLProvider } from '../html/use-provider';
import { audioProviderProps } from './props';
import type { AudioElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-audio': AudioElement;
  }
}

export const AudioElementDefinition = defineCustomElement<AudioElement>({
  tagName: 'vds-audio',
  props: audioProviderProps,
  setup({ host, props, accessors }) {
    const $target = () => (host.$connected ? host.el : null),
      { members } = useHTMLProvider<AudioElement>($target, {
        $props: props,
        fullscreen: useFullscreen,
      });

    onConnect(() => {
      dispatchEvent(host.el, 'vds-view-type-change', { detail: 'audio' });
    });

    return mergeProperties(accessors(), members);
  },
});
