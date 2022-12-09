import { effect, ReadSignal } from 'maverick.js';
import { dispatchEvent, isNull, setAttribute } from 'maverick.js/std';

import { useLogger } from '../../../foundation/logger/use-logger';
import { isArrayEqual } from '../../../utils/array';
import { CAN_LOAD_POSTER, MediaState } from '../../media/state';
import type { HtmlMediaProviderElement } from './types';
import { IGNORE_NEXT_ABORT, IGNORE_NEXT_EMPTIED } from './use-events';

export function useHtmlMediaElementConnect(
  $target: ReadSignal<HtmlMediaProviderElement | null>,
  $mediaElement: ReadSignal<HTMLMediaElement | null>,
  $media: MediaState,
) {
  const logger = __DEV__ ? useLogger($target) : undefined;

  effect(() => {
    const provider = $target(),
      media = $mediaElement();

    if ($media.canLoad && !isNull(provider) && !isNull(media)) {
      return onMediaElementConnect(provider, media);
    }

    if (__DEV__) {
      logger
        ?.infoGroup('Media element disconnected')
        .labelledLog('Media Element', $mediaElement())
        .dispatch();
    }

    return;
  });

  function onMediaElementConnect(provider: HtmlMediaProviderElement, media: HTMLMediaElement) {
    // Update or remove any attributes that we manage.
    if (media.hasAttribute('loop')) provider.loop = true;
    media.removeAttribute('loop');
    media.removeAttribute('poster');
    setAttribute(media, 'controls', provider.controls);

    // We call this here again mainly for iOS since it uses the video presentation API.
    if (!$media.canFullscreen && provider.fullscreen.supported) {
      dispatchEvent(provider, 'vds-fullscreen-support-change', {
        detail: provider.fullscreen.supported,
      });
    }

    if (
      $media[CAN_LOAD_POSTER] &&
      provider.poster.length > 0 &&
      media.getAttribute('poster') !== provider.poster
    ) {
      media.setAttribute('poster', provider.poster);
    }

    startPreloadingMedia(media);

    if (__DEV__) {
      logger?.infoGroup('Media element connected').labelledLog('Media Element', media).dispatch();
    }

    handleSrcChange();
    const observer = new MutationObserver(handleSrcChange);
    observer.observe(media, { attributeFilter: ['src'], subtree: true });
    return () => observer.disconnect();
  }

  function startPreloadingMedia(media: HTMLMediaElement) {
    if ($media.canPlay) return;
    media.setAttribute('preload', $target()!.preload);

    if (media.networkState >= 1) {
      media[IGNORE_NEXT_ABORT] = true;
      media[IGNORE_NEXT_EMPTIED] = true;
      setTimeout(() => {
        media[IGNORE_NEXT_ABORT] = false;
        media[IGNORE_NEXT_EMPTIED] = false;
      }, 0);
    }

    media.load();
  }

  function handleSrcChange() {
    const sources = getMediaSources();
    const prevSources = $media.src;
    if (!isArrayEqual(prevSources, sources)) {
      dispatchEvent($target(), 'vds-src-change', {
        detail: sources,
      });
    }
  }

  function getMediaSources() {
    const resources = [
      $mediaElement()?.src,
      ...Array.from($mediaElement()?.querySelectorAll('source') ?? []).map((source) => source.src),
    ].filter(Boolean);
    return Array.from(new Set(resources)) as string[];
  }
}
