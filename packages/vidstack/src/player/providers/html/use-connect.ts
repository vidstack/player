import { effect, peek, ReadSignal } from 'maverick.js';
import { dispatchEvent, isNull, setAttribute } from 'maverick.js/std';

import { useLogger } from '../../../foundation/logger/use-logger';
import { CAN_LOAD_POSTER } from '../../media/state';
import type { MediaStore } from '../../media/store';
import type { MediaSrc } from '../../media/types';
import type { HTMLProviderElement } from './types';
import { IGNORE_NEXT_ABORT } from './use-events';
import type { UseHTMLProviderProps } from './use-provider';

/**
 * Handles the DOM connection and disconnection of the underlying HTML media element (e.g.,
 * `<audio>` or `<video>`). This hook uses the `MutationObserver` to observer child changes to the
 * given provider element (`$target`) and
 */
export function useHTMLProviderConnect(
  $target: ReadSignal<HTMLProviderElement | null>,
  $mediaElement: ReadSignal<HTMLMediaElement | null>,
  $media: MediaStore,
  props: UseHTMLProviderProps<any>,
): void {
  const logger = __DEV__ ? useLogger($target) : undefined;

  effect(() => {
    const provider = $target(),
      media = $mediaElement();

    if ($media.canLoad && !isNull(provider) && !isNull(media)) {
      return peek(() => onMediaElementConnect(provider, media));
    }
  });

  function onMediaElementConnect(provider: HTMLProviderElement, media: HTMLMediaElement) {
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
      setAttribute(media, 'poster', provider.poster);
    }

    if (!$media.canPlay) {
      setAttribute(media, 'preload', $target()!.preload);
    }

    if (media.networkState === 1 || media.networkState === 2) {
      media[IGNORE_NEXT_ABORT] = true;
    }

    onSourcesChange();
    const observer = new MutationObserver(onSourcesChange);

    observer.observe(media, {
      attributeFilter: ['src', 'type'],
      subtree: true,
      childList: true,
    });

    if (__DEV__) {
      logger?.infoGroup('Media element connected').labelledLog('Media Element', media).dispatch();
    }

    return () => {
      if (__DEV__) {
        logger
          ?.infoGroup('Media element disconnected')
          .labelledLog('Media Element', media)
          .dispatch();
      }

      observer.disconnect();
    };
  }

  function onSourcesChange() {
    const sources = getMediaResources(),
      prev = $media.sources,
      equal = sources.length === prev.length && sources.every((src, i) => src.src === prev[i].src);

    props.onSourcesChange?.(sources);

    if (!equal) {
      dispatchEvent($target(), 'vds-sources-change', { detail: sources });
      $mediaElement()?.load();
    }
  }

  function getMediaResources(): MediaSrc[] {
    const media = $mediaElement()!;
    return [
      media.src && { src: media.src },
      ...Array.from(media.querySelectorAll('source') ?? []).map(
        (source) => source.src && { src: source.src, type: source.type },
      ),
    ].filter(Boolean) as MediaSrc[];
  }
}
