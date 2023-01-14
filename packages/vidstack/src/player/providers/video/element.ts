import { defineCustomElement, onConnect } from 'maverick.js/element';
import { dispatchEvent, mergeProperties } from 'maverick.js/std';

import { htmlProviderProps } from '../html/props';
import { useHTMLProvider } from '../html/use-provider';
import type { VideoElement } from './types';
import { useVideoFullscreen } from './use-video-fullscreen';

declare global {
  interface HTMLElementTagNameMap {
    'vds-video': VideoElement;
  }
}

export const VideoDefinition = defineCustomElement<VideoElement>({
  tagName: 'vds-video',
  props: htmlProviderProps,
  setup({ host, props, accessors }) {
    const { members } = useHTMLProvider<VideoElement>(host.$el, {
      $props: props,
      fullscreen: useVideoFullscreen,
    });

    onConnect(() => {
      setTimeout(() => {
        dispatchEvent(host.el, 'view-type-change', { detail: 'video' });
      }, 0);
    });

    return mergeProperties(accessors(), members);
  },
});
