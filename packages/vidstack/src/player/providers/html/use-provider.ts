import { ReadSignal, signal, Signals } from 'maverick.js';
import { InferCustomElementProps, onConnect } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';

import type { useFullscreen } from '../../../foundation/fullscreen/use-fullscreen';
import { onMediaSrcChange } from '../../media/provider/internal';
import type { MediaProviderAdapter } from '../../media/provider/types';
import { useMediaProvider } from '../../media/provider/use-media-provider';
import { useMediaStore } from '../../media/store';
import type { MediaSrc } from '../../media/types';
import type { HTMLProviderElement, HTMLProviderMembers, HTMLProviderProps } from './types';
import { useHTMLProviderAdapter } from './use-adapter';
import { useHTMLProviderConnect } from './use-connect';
import { useHTMLProviderEvents } from './use-events';

/**
 * This hook adapts the underlying media element such as `<audio>` or `<video>` to
 * satisfy the media provider interface, which generally involves providing a consistent API
 * for loading, managing, and tracking media state.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement}
 */
export function useHTMLProvider<T extends HTMLProviderElement>(
  $target: ReadSignal<T | null>,
  props: UseHTMLProviderProps<T>,
): UseHTMLProvider {
  const $media = useMediaStore(),
    $mediaElement = signal<HTMLMediaElement | null>(null),
    adapter = useHTMLProviderAdapter($target, $mediaElement, $media),
    members = useMediaProvider($target, {
      ...props,
      adapter,
    });

  useHTMLProviderEvents($target, $mediaElement, $media, props);
  useHTMLProviderConnect($target, $mediaElement, $media, props);

  onConnect(() => {
    onDefaultSlotChange();
    const observer = new MutationObserver(onDefaultSlotChange);
    observer.observe($target()!, { childList: true });
    return () => observer.disconnect();
  });

  function onDefaultSlotChange() {
    const target = $target()!;
    const tagNameRE = /audio|video/i;
    const el = Array.from(target.children).find((el) =>
      tagNameRE.test(el.tagName),
    ) as HTMLMediaElement | null;

    if (__DEV__ && !el) {
      console.warn('[vidstack] failed to find <audio> or <video> element in default slot.');
    }

    $mediaElement.set(el);
    // Reset src and tracking if media element is removed.
    if (!el) onMediaSrcChange($media, $target()!, { src: '' });
  }

  return {
    members: mergeProperties(members, {
      get mediaElement() {
        return $mediaElement();
      },
    }),
    adapter,
  };
}

export interface UseHTMLProvider {
  members: Omit<HTMLProviderMembers, keyof HTMLProviderProps>;
  adapter: MediaProviderAdapter;
}

export interface UseHTMLProviderProps<T extends HTMLProviderElement> {
  $props: Signals<InferCustomElementProps<T>>;
  fullscreen: typeof useFullscreen<T>;
  /** return `true` if the abort has been handled. */
  onAbort?(event: Event): boolean;
  onPlay?(event: Event): void;
  onLoadStart?(event: Event): void;
  onLoadedMetadata?(event: Event): void;
  onSourcesChange?(sources: MediaSrc[]): void;
}
