import { computed } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';

import { formatTime } from '../../../utils/time';
import { useMedia } from '../../media/context';
import type { MediaStore } from '../../media/store';
import { timeProps } from './props';
import type { MediaTimeElement, TimeProps } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-time': MediaTimeElement;
  }
}

export const TimeDefinition = defineCustomElement<MediaTimeElement>({
  tagName: 'media-time',
  props: timeProps,
  setup({ props: { $remainder, $padHours, $showHours, $type } }) {
    const $media = useMedia().$store;

    const $formattedTime = computed(() => {
      const seconds = getSeconds($type(), $media);
      const time = $remainder() ? Math.max(0, $media.duration - seconds) : seconds;
      return formatTime(time, $padHours(), $showHours());
    });

    return () => $formattedTime;
  },
});

function getSeconds(type: TimeProps['type'], $media: MediaStore) {
  switch (type) {
    case 'buffered':
      return $media.bufferedAmount;
    case 'seekable':
      return $media.seekableAmount;
    case 'duration':
      return $media.duration;
    default:
      return $media.currentTime;
  }
}
