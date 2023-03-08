import throttle from 'just-throttle';
import { effect } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { dispatchEvent, mergeProperties } from 'maverick.js/std';

import { setAttributeIfEmpty } from '../../../utils/dom';
import { round } from '../../../utils/number';
import { useMedia } from '../../media/context';
import { createSlider } from '../slider/create';
import type { SliderDragValueChangeEvent, SliderValueChangeEvent } from '../slider/events';
import { volumeSliderProps } from './props';
import type { MediaVolumeSliderElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-volume-slider': MediaVolumeSliderElement;
  }
}

export const VolumeSliderDefinition = defineCustomElement<MediaVolumeSliderElement>({
  tagName: 'media-volume-slider',
  props: volumeSliderProps,
  setup({ host, props, accessors }) {
    const { $store: $media, remote } = useMedia(),
      { $store, members } = createSlider(
        host,
        {
          $props: props,
          readonly: true,
          aria: { valueMin: 0, valueMax: 100 },
          onValueChange: throttle(onVolumeChange, 25),
        },
        accessors,
      );

    onAttach(() => {
      setAttributeIfEmpty(host.el!, 'aria-label', 'Media volume');
    });

    effect(() => {
      const newValue = $media.muted ? 0 : $media.volume * 100;
      $store.value = newValue;
      dispatchEvent(host.el, 'value-change', { detail: newValue });
    });

    function onVolumeChange(event: SliderValueChangeEvent | SliderDragValueChangeEvent) {
      if (!event.trigger) return;
      const mediaVolume = round(event.detail / 100, 3);
      remote.changeVolume(mediaVolume, event);
    }

    return mergeProperties(members, {
      // redeclare the following properties to ensure they're read-only.
      get min() {
        return members.min;
      },
      get max() {
        return members.max;
      },
      get value() {
        return members.value;
      },
    });
  },
});
