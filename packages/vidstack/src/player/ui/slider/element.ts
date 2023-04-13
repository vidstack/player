import { defineCustomElement } from 'maverick.js/element';

import { sliderProps } from './props';
import { setupSlider } from './setup';
import type { MediaSliderElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-slider': MediaSliderElement;
  }
}

export const SliderDefinition = defineCustomElement<MediaSliderElement>({
  tagName: 'media-slider',
  props: sliderProps,
  setup({ host, props, accessors }) {
    const { members } = setupSlider(host, { $props: props }, accessors);
    return members;
  },
});
