import { ReadSignal, signal, tick } from 'maverick.js';
import { onConnect } from 'maverick.js/element';

import { useFullscreen } from '../../../foundation/fullscreen/use-fullscreen';
import { onCurrentSrcChange } from '../../media/provider/internal';
import type { MediaProviderAdapter } from '../../media/provider/types';
import { useMediaProvider } from '../../media/provider/use-media-provider';
import { useMediaState } from '../../media/store';
import type { HtmlMediaElementProps } from './props';
import type { HtmlMediaProviderElement } from './types';
import { useHtmlMediaElementAdapter } from './use-adapter';
import { useHtmlMediaElementConnect } from './use-connect';
import { useHtmlMediaElementEvents } from './use-events';

/**
 * This hook adapts the underlying media element such as `<audio>` or `<video>` to
 * satisfy the media provider contract, which generally involves providing a consistent API
 * for loading, managing, and tracking media state.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement}
 */
export function useHtmlMediaElement(
  $target: ReadSignal<HtmlMediaProviderElement | null>,
  $provider: HtmlMediaElementProps,
) {
  const $media = useMediaState(),
    $mediaElement = signal<HTMLMediaElement | null>(null),
    adapter = useHtmlMediaElementAdapter($target, $mediaElement, $media),
    members = useMediaProvider($target, {
      $provider,
      adapter,
      useFullscreen,
    });

  useHtmlMediaElementEvents($target, $mediaElement, $media);
  useHtmlMediaElementConnect($target, $mediaElement, $media);

  onConnect(() => {
    onDefaultSlotChange();
    const observer = new MutationObserver(onDefaultSlotChange);
    observer.observe($target()!, { childList: true });
    return () => observer.disconnect();
  });

  function onDefaultSlotChange() {
    const el = $target()!.firstElementChild as HTMLMediaElement | null;

    if (el && !/^(audio|video)$/i.test(el.tagName)) {
      throw Error(
        __DEV__
          ? `[vidstack]: expected <audio> or <video> in default slot. Received: <${el.tagName}>.`
          : '',
      );
    }

    $mediaElement.set(el);
    // Reset src and tracking if media element is removed.
    if (!el) onCurrentSrcChange($media, $target()!, '');
  }

  return {
    members,
    adapter,
  };
}

export interface UseHtmlMediaElement extends MediaProviderAdapter {
  readonly mediaElement: HTMLMediaElement | null;
}
