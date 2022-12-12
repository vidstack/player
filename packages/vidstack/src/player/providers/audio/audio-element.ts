import { defineCustomElement, onConnect } from 'maverick.js/element';
import { dispatchEvent, mergeProperties } from 'maverick.js/std';

import { useHTMLProvider } from '../html/use-provider';
import { audioProviderProps } from './props';
import type { AudioElement } from './types';

export const AudioElementDefinition = defineCustomElement<AudioElement>({
  tagName: 'vds-audio',
  props: audioProviderProps,
  setup({ host, props, accessors }) {
    const $target = () => (host.$connected ? host.el : null);
    const { members } = useHTMLProvider($target, props);

    onConnect(() => {
      dispatchEvent(host.el, 'vds-view-type-change', { detail: 'audio' });
    });

    return mergeProperties(accessors(), members);
  },
});
