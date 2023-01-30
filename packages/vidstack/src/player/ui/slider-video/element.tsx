import { effect, signal } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';
import { dispatchEvent } from 'maverick.js/std';

import { useSliderStore } from '../slider/store';
import { sliderVideoProps } from './props';
import type { MediaSliderVideoElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-video': MediaSliderVideoElement;
  }
}

export const SliderVideoDefinition = defineCustomElement<MediaSliderVideoElement>({
  tagName: 'media-slider-video',
  props: sliderVideoProps,
  setup({ host, props: { $src } }) {
    let videoElement: HTMLVideoElement | null = null;

    const $canPlay = signal(false),
      $error = signal(false),
      $slider = useSliderStore();

    host.setAttributes({
      'can-play': $canPlay,
      error: $error,
    });

    effect(() => {
      if ($canPlay() && videoElement) videoElement.currentTime = $slider.pointerValue;
    });

    effect(() => {
      // reset on src change
      $src();
      $canPlay.set(false);
      $error.set(false);
    });

    function onCanPlay(trigger: Event) {
      $canPlay.set(true);
      dispatchEvent(host.el, 'can-play', { trigger });
    }

    function onError(trigger: Event) {
      $error.set(true);
      dispatchEvent(host.el, 'error', { trigger });
    }

    return () => (
      <video
        muted
        playsinline
        preload="auto"
        src={$src()}
        $on:canplay={onCanPlay}
        $on:error={onError}
        $ref={(el) => void (videoElement = el)}
      ></video>
    );
  },
});
