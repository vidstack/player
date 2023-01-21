import type { ReadSignal } from 'maverick.js';
import { setAttribute } from 'maverick.js/std';

import type { MediaAdapter } from '../../media/element/controller/types';

export function useHTMLMediaElementAdapter(
  $mediaElement: ReadSignal<HTMLMediaElement | null>,
): MediaAdapter {
  return {
    get paused() {
      return $mediaElement()?.paused ?? true;
    },
    get muted() {
      return $mediaElement()?.muted ?? false;
    },
    set muted(muted) {
      $mediaElement()!.muted = muted;
    },
    get volume() {
      return $mediaElement()?.volume ?? 1;
    },
    set volume(volume) {
      $mediaElement()!.volume = volume;
    },
    get currentTime() {
      return $mediaElement()?.currentTime ?? 0;
    },
    set currentTime(time) {
      $mediaElement()!.currentTime = time;
    },
    get playsinline() {
      return $mediaElement()?.hasAttribute('playsinline') ?? false;
    },
    set playsinline(playsinline) {
      setAttribute($mediaElement()!, 'playsinline', playsinline);
    },
    async play() {
      return $mediaElement()?.play();
    },
    async pause() {
      return $mediaElement()?.pause();
    },
  };
}
