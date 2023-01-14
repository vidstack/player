import { effect } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';

import { setAttributeIfEmpty } from '../../../utils/dom';
import { round } from '../../../utils/number';
import { useMediaRemoteControl } from '../../media/remote-control';
import { useMediaStore } from '../../media/store';
import type { SliderDragValueChangeEvent, SliderValueChangeEvent } from '../slider/events';
import { useSlider } from '../slider/use-slider';
import { volumeSliderProps } from './props';
import type { VolumeSliderElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-volume-slider': VolumeSliderElement;
  }
}

export const VolumeSliderDefinition = defineCustomElement<VolumeSliderElement>({
  tagName: 'vds-volume-slider',
  props: volumeSliderProps,
  setup({ host, props, accessors }) {
    const $media = useMediaStore(),
      { $store, members } = useSlider(
        host,
        {
          $props: props,
          readonly: true,
          aria: { valueMin: 0, valueMax: 100 },
          onValueChange: onVolumeChange,
          onDragValueChange: onVolumeChange,
        },
        accessors,
      ),
      remote = useMediaRemoteControl(host.$el);

    onAttach(() => {
      setAttributeIfEmpty(host.el!, 'aria-label', 'Media volume');
    });

    effect(() => {
      $store.value = $media.volume * 100;
    });

    function onVolumeChange(event: SliderValueChangeEvent | SliderDragValueChangeEvent) {
      const mediaVolume = round(event.detail / 100, 3);
      remote.changeVolume(mediaVolume, event);
    }

    return mergeProperties(members, {
      // redeclare the following properties to ensure they're read only.
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
