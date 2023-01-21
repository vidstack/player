import { defineCustomElement } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';

import { htmlProviderProps } from '../html/props';
import type { VideoElement } from './types';
import { useVideoElement } from './use-element';

declare global {
  interface HTMLElementTagNameMap {
    'vds-video': VideoElement;
  }
}

export const VideoDefinition = defineCustomElement<VideoElement>({
  tagName: 'vds-video',
  props: htmlProviderProps,
  setup({ host, accessors }) {
    return mergeProperties(accessors(), useVideoElement(host.$el).members);
  },
});
