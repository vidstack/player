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

export const AudioDefinition = defineCustomElement<AudioElement>({
  tagName: 'vds-audio',
  props: htmlProviderProps,
  setup({ host, props, accessors }) {
    const { members } = useHTMLProvider<AudioElement>(host.$el, {
      $props: props,
      fullscreen: useFullscreen,
    });

    onConnect(() => {
      setTimeout(() => {
        dispatchEvent(host.el, 'vds-view-type-change', { detail: 'audio' });
      }, 0);
    });

    return mergeProperties(accessors(), members);
  },
});

export default AudioDefinition;
