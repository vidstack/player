import { defineCustomElement } from 'maverick.js/element';

import { createSlider } from './create';
import { sliderProps } from './props';
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
    const { members } = createSlider(host, { $props: props }, accessors);
    return members;
  },
});
