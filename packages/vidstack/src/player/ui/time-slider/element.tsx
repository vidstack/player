import throttle from 'just-throttle';
import { effect, provideContext } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { DOMEvent, isKeyboardEvent, kebabToCamelCase, mergeProperties } from 'maverick.js/std';

import { setAttributeIfEmpty } from '../../../utils/dom';
import { formatSpokenTime, formatTime } from '../../../utils/time';
import { useMedia } from '../../media/context';
import { createSlider } from '../slider/create';
import type {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderDragValueChangeEvent,
  SliderValueChangeEvent,
} from '../slider/events';
import { sliderValueFormattersContext } from '../slider/format';
import { timeSliderProps } from './props';
import type { MediaTimeSliderElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-time–slider': MediaTimeSliderElement;
  }
}

export const TimeSliderDefinition = defineCustomElement<MediaTimeSliderElement>({
  tagName: 'media-time-slider',
  props: timeSliderProps,
  setup({
    host,
    props: { $pauseWhileDragging, $seekingRequestThrottle, $disabled, ...props },
    accessors,
  }) {
    const { $store: $media, remote } = useMedia(),
      { $store, members } = createSlider(
        host,
        {
          $props: {
            ...props,
            $disabled: () => $disabled() || !$media.canSeek,
          },
          readonly: true,
          aria: { valueMin: 0, valueMax: 100, valueText: getSpokenText },
          onValueChange,
          onDragStart,
          onDragEnd,
          onDragValueChange,
        },
        accessors,
      );

    onAttach(() => {
      setAttributeIfEmpty(host.el!, 'aria-label', 'Media time');
    });

    effect(() => {
      $store.value = getPercent($media.currentTime);
    });

    let dispatchSeeking: typeof seeking & { cancel(): void };
    effect(() => {
      dispatchSeeking = throttle(seeking, $seekingRequestThrottle());
    });

    function seeking(time: number, event: Event) {
      remote.seeking(time, event);
    }

    function seek(time: number, percent: number, event: Event) {
      if ($media.live && percent >= 99) {
        remote.seekToLiveEdge(event);
        return;
      }

      remote.seek(time, event);
    }

    let keyboardTimeout;
    function timedSeek(event: DOMEvent<number>) {
      dispatchSeeking.cancel();

      const percent = event.detail,
        time = getTime(percent);

      if (isKeyboardEvent(event.originEvent)) {
        window.clearTimeout(keyboardTimeout);
        seeking(time, event);
        keyboardTimeout = setTimeout(() => {
          seek(time, percent, event);
        }, 300);
      } else {
        seek(time, percent, event);
      }
    }

    function onValueChange(event: SliderValueChangeEvent) {
      if (isKeyboardEvent(event.originEvent)) timedSeek(event);
    }

    let wasPlayingBeforeDragStart = false;
    function onDragStart(event: SliderDragStartEvent) {
      if ($pauseWhileDragging()) {
        wasPlayingBeforeDragStart = !$media.paused;
        remote.pause(event);
      }
    }

    function onDragValueChange(event: SliderDragValueChangeEvent) {
      dispatchSeeking(getTime(event.detail), event);
    }

    function onDragEnd(event: SliderDragEndEvent) {
      timedSeek(event);
      if ($pauseWhileDragging() && wasPlayingBeforeDragStart) {
        remote.play(event);
      }
    }

    function getTime(percent: number) {
      return $media.seekableStart + (percent / 100) * $media.duration;
    }

    function getPercent(time: number) {
      const rate = Math.max(
        0,
        Math.min(
          1,
          $media.liveEdge
            ? 1
            : (Math.min(time, $media.duration) - $media.seekableStart) / $media.duration,
        ),
      );

      return Number.isNaN(rate) ? 0 : Number.isFinite(rate) ? rate * 100 : 100;
    }

    function getSpokenText() {
      const time = getTime($store.value);
      return Number.isFinite(time)
        ? `${formatSpokenTime(time)} out of ${formatSpokenTime($media.duration)}`
        : 'live';
    }

    provideContext(sliderValueFormattersContext, {
      value(percent) {
        const time = getTime(percent);
        return Number.isFinite(time)
          ? ($media.live ? time - $media.duration : time).toFixed(0)
          : 'LIVE';
      },
      time(percent, padHours, showHours) {
        const time = getTime(percent);
        return Number.isFinite(time)
          ? `${$media.live ? '-' : ''}${formatTime(
              $media.live ? Math.abs(time - $media.duration) : time,
              padHours,
              showHours,
            )}`
          : 'LIVE';
      },
    });

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
