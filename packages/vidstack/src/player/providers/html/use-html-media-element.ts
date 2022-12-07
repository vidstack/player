import { onDisconnect } from 'maverick.js/element';
import { dispatchEvent, useHost } from 'maverick.js/std';

import type { MediaProviderAdapter } from '../../media/provider/types';
import { useMediaState } from '../../media/store';
import type { MediaType } from '../../media/types';
import { useRAFLoop } from './use-raf-loop';

/**
 * This hook adapts the underlying media element such as `<audio>` or `<video>` to
 * satisfy the media provider contract, which generally involves providing a consistent API
 * for loading, managing, and tracking media state.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement}
 */
function useHtmlMediaElement() {
  let host = useHost(),
    $media = useMediaState(),
    mediaElement: HTMLMediaElement | null = null,
    isMediaWaiting = false;

  const rafLoop = useRAFLoop(() => {
    if (!mediaElement) return;
    const newTime = mediaElement.currentTime;
    if ($media.currentTime !== newTime) {
      dispatchEvent(host.el, 'vds-time-update');
    }
  });

  onDisconnect(() => {
    isMediaWaiting = false;
  });

  //
}

export interface UseHtmlMediaElement extends MediaProviderAdapter {
  readonly mediaElement: HTMLMediaElement | null;
  //
}

export const AUDIO_EXTENSIONS =
  /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v|avi)($|\?)/i;

function getMediaTypeFromExt(src: string): MediaType {
  if (AUDIO_EXTENSIONS.test(src)) return 'audio';
  if (VIDEO_EXTENSIONS.test(src)) return 'video';
  return 'unknown';
}
