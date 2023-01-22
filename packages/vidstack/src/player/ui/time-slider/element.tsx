import throttle from 'just-throttle';
import { effect } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { isKeyboardEvent, mergeProperties } from 'maverick.js/std';

import { setAttributeIfEmpty } from '../../../utils/dom';
import { formatSpokenTime } from '../../../utils/time';
import { useMediaStore } from '../../media/context';
import { useMediaRemoteControl } from '../../media/remote-control';
import type {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderDragValueChangeEvent,
  SliderValueChangeEvent,
} from '../slider/events';
import { useSlider } from '../slider/use-slider';
import { timeSliderProps } from './props';
import type { TimeSliderElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-time–slider': TimeSliderElement;
  }
}

export const TimeSliderDefinition = defineCustomElement<TimeSliderElement>({
  tagName: 'vds-time-slider',
  props: timeSliderProps,
  setup({ host, props: { $pauseWhileDragging, $seekingRequestThrottle, ...props }, accessors }) {
    const $media = useMediaStore(),
      { $store, members } = useSlider(
        host,
        {
          $props: props,
          readonly: true,
          aria: {
            valueMin: 0,
            valueMax: 100,
            valueNow: () => Math.round($store.fillPercent),
            valueText: () =>
              // `currentTime` out of `duration`
              `${formatSpokenTime($store.value)} out of ${formatSpokenTime($store.max)}`,
          },
          onValueChange,
          onDragStart,
          onDragEnd,
          onDragValueChange,
        },
        accessors,
      ),
      remote = useMediaRemoteControl(host.$el);

    onAttach(() => {
      setAttributeIfEmpty(host.el!, 'aria-label', 'Media time');
    });

    effect(() => {
      $store.value = $media.currentTime;
    });

    effect(() => {
      $store.max = $media.duration;
    });

    let dispatchSeeking: typeof seeking & { cancel(): void };
    effect(() => {
      dispatchSeeking = throttle(seeking, $seekingRequestThrottle());
    });

    function seeking(time: number, event: Event) {
      remote.seeking(time, event);
    }

    function onValueChange(event: SliderValueChangeEvent) {
      if (isKeyboardEvent(event.originEvent)) {
        dispatchSeeking.cancel();
        remote.seek(event.detail, event);
      }
    }

    let wasPlayingBeforeDragStart = false;
    function onDragStart(event: SliderDragStartEvent) {
      if ($pauseWhileDragging()) {
        wasPlayingBeforeDragStart = !$media.paused;
        remote.pause(event);
      }
    }

    function onDragValueChange(event: SliderDragValueChangeEvent) {
      dispatchSeeking(event.detail, event);
    }

    function onDragEnd(event: SliderDragEndEvent) {
      dispatchSeeking.cancel();
      remote.seek(event.detail, event);
      if ($pauseWhileDragging() && wasPlayingBeforeDragStart) {
        remote.play(event);
      }
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
      $render: () => {
        return (
          <>
            <div part="track"></div>
            <div part="track track-fill"></div>
            <div part="track track-progress"></div>
            <div part="thumb-container">
              <div part="thumb"></div>
            </div>
          </>
        );
      },
    });
  },
});
