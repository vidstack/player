import { effect } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { listenEvent, mergeProperties } from 'maverick.js/std';

import { setAttributeIfEmpty } from '../../../utils/dom';
import { round } from '../../../utils/number';
import { useMediaRemoteControl } from '../../media/remote-control';
import { useMediaStore } from '../../media/store';
import { useSlider } from '../slider/use-slider';
import { volumeSliderProps } from './props';
import type { VolumeSliderElement } from './types';

export const VolumeSliderDefinition = defineCustomElement<VolumeSliderElement>({
  tagName: 'vds-volume-slider',
  props: volumeSliderProps,
  setup({ host, props, accessors }) {
    const $media = useMediaStore(),
      { $store, members } = useSlider(host, props, accessors),
      remote = useMediaRemoteControl(host.$el);

    onAttach(() => {
      setAttributeIfEmpty(host.el!, 'aria-label', 'Media volume');
    });

    effect(() => {
      $store.value = $media.volume * 100;
    });

    effect(() => {
      const target = host.$el();
      if (!target) return;
      listenEvent(target, 'vds-slider-value-change', onVolumeChange);
      listenEvent(target, 'vds-slider-drag-value-change', onVolumeChange);
    });

    function onVolumeChange(event: Event) {
      const newVolume = $store.value;
      const mediaVolume = round(newVolume / 100, 3);
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
