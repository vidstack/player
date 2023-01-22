import { effect, signal } from 'maverick.js';
import { defineCustomElement, onConnect } from 'maverick.js/element';

import { preconnect } from '../../../utils/network';
import { useMediaStore } from '../../media/context';
import { useMediaRemoteControl } from '../../media/remote-control';
import { posterProps } from './props';
import type { PosterElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-poster': PosterElement;
  }
}

export const PosterDefinition = defineCustomElement<PosterElement>({
  tagName: 'vds-poster',
  props: posterProps,
  setup({ host, props: { $alt } }) {
    const $media = useMediaStore(),
      remote = useMediaRemoteControl(host.$el);

    const $imgSrc = () => ($media.canLoad && $media.poster.length ? $media.poster : null),
      $imgAlt = () => ($imgSrc() ? $alt() : null),
      $imgLoading = signal(false),
      $imgLoaded = signal(false),
      $imgError = signal(false);

    host.setAttributes({
      'img-loading': $imgLoading,
      'img-loaded': $imgLoaded,
      'img-error': $imgError,
    });

    onConnect(() => {
      window.requestAnimationFrame(() => {
        if (!$media.canLoad) preconnect($media.poster);
      });

      remote.hidePoster();
      return () => remote.showPoster();
    });

    effect(() => {
      const loading = $media.canLoad && !!$media.poster;
      $imgLoading.set(loading);
      $imgLoaded.set(false);
      $imgError.set(false);
    });

    function onLoad() {
      $imgLoading.set(false);
      $imgLoaded.set(true);
    }

    function onError() {
      $imgLoading.set(false);
      $imgError.set(true);
    }

    return () => <img src={$imgSrc()} alt={$imgAlt()} $on:load={onLoad} $on:error={onError} />;
  },
});
