import { effect, peek, signal } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';
import { noop } from 'maverick.js/std';
import { parseResponse, VTTCue } from 'media-captions';

import { useMedia } from '../../media/context';
import { useSliderStore } from '../slider/store';
import type { MediaSliderThumbnailElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-thumbnail': MediaSliderThumbnailElement;
  }
}

export const SliderThumbnailDefinition = defineCustomElement<MediaSliderThumbnailElement>({
  tagName: 'media-slider-thumbnail',
  props: { src: { initial: '' } },
  setup({ host, props: { $src } }) {
    const $img = signal<HTMLImageElement | null>(null),
      $imgSrc = signal(''),
      $imgLoaded = signal(false),
      $coords = signal<ThumbnailCoords | null>(null),
      $cues = signal<VTTCue[] | null>(null),
      $activeCue = signal<VTTCue | null>(null),
      $hidden = () => !Number.isFinite($media.duration),
      $slider = useSliderStore(),
      { $store: $media } = useMedia(),
      $crossorigin = () => $media.crossorigin;

    host.setAttributes({
      'data-loading': () => !$hidden() && !$imgLoaded(),
      'data-hidden': $hidden,
    });

    // Load thumbnail VTT cues.
    effect(() => {
      if (!$media.canLoad) return;

      $imgLoaded.set(false);

      const controller = new AbortController();
      parseResponse(fetch($src(), { signal: controller.signal }))
        .then(({ cues }) => $cues.set(cues))
        .catch(noop);

      return () => {
        controller.abort();
        $cues.set(null);
      };
    });

    // Find active cue.
    effect(() => {
      const cues = $cues();

      if (!cues || !Number.isFinite($media.duration)) {
        $activeCue.set(null);
        return;
      }

      const currentTime = $slider.pointerRate * $media.duration;

      for (let i = 0; i < cues.length; i++) {
        if (currentTime >= cues[i].startTime && currentTime <= cues[i].endTime) {
          $activeCue.set(cues[i]);
          break;
        }
      }
    });

    // Resolve current thumbnail src and coordinates
    effect(() => {
      const cue = $activeCue();

      if (!cue) {
        $imgSrc.set('');
        $coords.set(null);
        return;
      }

      const [_src, _coords] = (cue.text || '').split('#');
      const [_props, _values] = _coords.split('=');

      $imgSrc.set(
        !/https?:/.test(_src)
          ? `${peek($src).split('/').slice(0, -1).join('/')}${_src.replace(/^\/?/, '/')}`.replace(
              /^\/\//,
              '/',
            )
          : _src,
      );

      if (_props && _values) {
        const coords = {},
          values = _values.split(',');
        for (let i = 0; i < _props.length; i++) coords[_props[i]] = +values[i];
        $coords.set(coords as ThumbnailCoords);
      } else {
        $coords.set(null);
      }
    });

    effect(() => {
      $imgSrc();
      $imgLoaded.set(false);
    });

    const styleReverts: (() => void)[] = [];
    function applyStyle(el: HTMLElement, name: string, value: string, priority?: string) {
      el.style.setProperty(name, value, priority);
      styleReverts.push(() => el.style.removeProperty(name));
    }

    effect(() => {
      const img = $img(),
        coords = $coords();

      if (!img || !coords || !$imgLoaded()) {
        for (const revert of styleReverts) revert();
        return;
      }

      const { w, h, x, y } = coords,
        { maxWidth, maxHeight, minWidth, minHeight } = getComputedStyle(host.el!),
        minRatio = Math.max(parseInt(minWidth) / w, parseInt(minHeight) / h),
        maxRatio = Math.min(parseInt(maxWidth) / w, parseInt(maxHeight) / h),
        scale = maxRatio < 1 ? maxRatio : minRatio > 1 ? minRatio : 1;

      styleReverts.length = 0;
      applyStyle(host.el!, '--thumbnail-width', `${w * scale}px`);
      applyStyle(host.el!, '--thumbnail-height', `${h * scale}px`);
      applyStyle(img, 'width', `${img.naturalWidth * scale}px`);
      applyStyle(img, 'height', `${img.naturalHeight * scale}px`);
      applyStyle(img, 'transform', `translate(-${x * scale}px, -${y * scale}px)`);
    });

    return () => (
      <div part="container">
        <img
          src={$imgSrc()}
          crossorigin={$crossorigin()}
          part="img"
          loading="eager"
          decoding="async"
          $on:load={() => $imgLoaded.set(true)}
          $ref={$img.set}
        />
      </div>
    );
  },
});

interface ThumbnailCoords {
  w: number;
  h: number;
  x: number;
  y: number;
}
