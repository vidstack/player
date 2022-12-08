import type { ReadSignal } from 'maverick.js';

import { useFullscreen } from '../../../foundation/fullscreen/use-fullscreen';
import type { MediaProviderAdapter, MediaProviderProps } from '../../media/provider/types';
import { useMediaProvider } from '../../media/provider/use-media-provider';
import { useMediaState } from '../../media/store';
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
  $provider: MediaProviderProps,
) {
  const $media = useMediaState(),
    { $mediaElement, onDefaultSlotChange } = useHtmlMediaElementConnect($target, $media),
    adapter = useHtmlMediaElementAdapter($target, $mediaElement, $media),
    members = useMediaProvider($target, {
      $provider,
      adapter,
      useFullscreen,
    });

  useHtmlMediaElementEvents($target, $mediaElement, $media);

  return {
    members,
    adapter,
    onDefaultSlotChange,
  };
}

export interface UseHtmlMediaElement extends MediaProviderAdapter {
  readonly mediaElement: HTMLMediaElement | null;
}
