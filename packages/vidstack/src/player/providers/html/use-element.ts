import { ReadSignal, signal } from 'maverick.js';
import { onConnect } from 'maverick.js/element';

import { useMediaStore } from '../../media/context';
import {
  MediaControllerDelegate,
  useMediaControllerDelegate,
} from '../../media/element/controller/controller-delegate';
import { useMediaProvider } from '../../media/provider/use-media-provider';
import type { MediaSrc } from '../../media/types';
import type { HTMLProviderElement, HTMLProviderMembers, HTMLProviderProps } from './types';
import { useHTMLMediaElementAdapter } from './use-adapter';
import { useHTMLMediaElementConnect } from './use-connect';
import { useHTMLMediaElementEvents } from './use-events';

/**
 * This hook adapts the underlying media element such as `<audio>` or `<video>` to
 * satisfy the media provider interface, which generally involves providing a consistent API
 * for loading, managing, and tracking media state.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement}
 */
export function useHTMLMediaElement(
  $target: ReadSignal<HTMLProviderElement | null>,
  props: UseHTMLMediaElementProps = {},
): UseHTMLMediaElement {
  const $media = useMediaStore(),
    $mediaElement = signal<HTMLMediaElement | null>(null),
    adapter = useHTMLMediaElementAdapter($mediaElement),
    delegate = useMediaControllerDelegate();

  useMediaProvider($target);
  useHTMLMediaElementEvents($target, $mediaElement, $media, delegate, props);
  useHTMLMediaElementConnect($target, $mediaElement, $media, delegate, props);

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
    if (!el) delegate.srcChange({ src: '' });
  }

  return {
    members: {
      get mediaElement() {
        return $mediaElement();
      },
      get adapter() {
        return adapter;
      },
    },
    delegate,
  };
}

export interface UseHTMLMediaElement {
  members: Omit<HTMLProviderMembers, keyof HTMLProviderProps>;
  delegate: MediaControllerDelegate;
}

export interface UseHTMLMediaElementProps {
  /** return `true` if the abort has been handled. */
  onAbort?(event: Event): boolean;
  onPlay?(event: Event): void;
  onLoadStart?(event: Event): void;
  onLoadedMetadata?(event: Event): void;
  onSourcesChange?(sources: MediaSrc[]): void;
}
