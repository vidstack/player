import { defineCustomElement } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';

import { htmlProviderProps } from '../html/props';
import { useHTMLMediaElement } from '../html/use-element';
import type { AudioElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-audio': AudioElement;
  }
}

export const AudioDefinition = defineCustomElement<AudioElement>({
  tagName: 'vds-audio',
  props: htmlProviderProps,
  setup({ host, accessors }) {
    return mergeProperties(accessors(), useHTMLMediaElement(host.$el).members);
  },
});
