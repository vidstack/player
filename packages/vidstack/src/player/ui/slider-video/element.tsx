import { effect, signal } from 'maverick.js';
import { defineCustomElement, onConnect } from 'maverick.js/element';
import { dispatchEvent } from 'maverick.js/std';

import { useMedia } from '../../media/context';
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
      $slider = useSliderStore(),
      { $store: $media } = useMedia(),
      $videoSrc = () => ($media.canLoad ? $src() : null),
      $hidden = () => !!$error() || !Number.isFinite($media.duration);

    host.setAttributes({
      'data-loading': () => !$canPlay() && !$hidden(),
      'data-hidden': $hidden,
    });

    effect(() => {
      if ($canPlay() && videoElement && Number.isFinite($media.duration)) {
        videoElement.currentTime = $slider.pointerRate * $media.duration;
      }
    });

    effect(() => {
      // reset on src change
      $src();
      $canPlay.set(false);
      $error.set(false);
    });

    onConnect(() => {
      if (videoElement!.readyState >= 2) onCanPlay();
    });

    function onCanPlay(trigger?: Event) {
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
        src={$videoSrc()}
        part="video"
        $on:canplay={onCanPlay}
        $on:error={onError}
        $ref={(el) => void (videoElement = el)}
        style="max-width: unset;"
      ></video>
    );
  },
});
