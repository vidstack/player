import { defineCustomElement, onConnect } from 'maverick.js/element';
import { dispatchEvent, mergeProperties } from 'maverick.js/std';

import { useHTMLProvider } from '../html/use-provider';
import { videoProviderProps } from './props';
import type { VideoElement } from './types';
import { useVideoFullscreen } from './use-video-fullscreen';

export const VideoElementDefinition = defineCustomElement<VideoElement>({
  tagName: 'vds-video',
  props: videoProviderProps,
  setup({ host, props, accessors }) {
    const $target = () => (host.$connected ? host.el : null);
    const { members } = useHTMLProvider($target, props, useVideoFullscreen);

    onConnect(() => {
      dispatchEvent(host.el, 'vds-view-type-change', { detail: 'video' });
    });

    return mergeProperties(accessors(), members);
  },
});
