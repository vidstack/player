import { computed } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';

import { round } from '../../../utils/number';
import { formatTime } from '../../../utils/time';
import { useSliderStore } from '../slider/store';
import { sliderValueTextProps } from './props';
import type { MediaSliderValueTextElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-value-text': MediaSliderValueTextElement;
  }
}

export const SliderValueTextDefinition = defineCustomElement<MediaSliderValueTextElement>({
  tagName: 'media-slider-value-text',
  props: sliderValueTextProps,
  setup({ props: { $type, $format, $decimalPlaces, $padHours, $showHours } }) {
    const $slider = useSliderStore();

    const $text = computed(() => {
      const value = $type() === 'current' ? $slider.value : $slider.pointerValue;
      const format = $format();
      if (format === 'percent') {
        const range = $slider.max - $slider.min;
        const percent = (value / range) * 100;
        return round(percent, $decimalPlaces()) + '﹪';
      } else if (format === 'time') {
        return formatTime(value, $padHours(), $showHours());
      } else {
        return value.toFixed(2);
      }
    });

    return () => <span>{$text()}</span>;
  },
});
