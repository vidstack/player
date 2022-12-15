import { defineCustomElement, onConnect } from 'maverick.js/element';
import { dispatchEvent, mergeProperties } from 'maverick.js/std';

import { useFullscreen } from '../../../foundation/fullscreen/use-fullscreen';
import { htmlProviderProps } from '../html/props';
import { useHTMLProvider } from '../html/use-provider';
import type { AudioElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-audio': AudioElement;
  }
}

export const AudioElementDefinition = defineCustomElement<AudioElement>({
  tagName: 'vds-audio',
  props: htmlProviderProps,
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
