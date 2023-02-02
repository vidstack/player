import { peek, signal } from 'maverick.js';
import { dispatchEvent, isFunction, listenEvent } from 'maverick.js/std';

import type { FullscreenAdapter } from '../../../../../foundation/fullscreen/fullscreen';
import type { MediaContext } from '../../../context';

declare global {
  interface GlobalEventHandlersEventMap {
    webkitpresentationmodechanged: Event;
  }
}

/**
 * Contains the logic for handling presentation modes on Safari. This hook is used as a fallback
 * for when the native Fullscreen API is not available (i.e., iOS Safari).
 *
 * @see {@link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode}
 */
export function useVideoPresentation(
  video: HTMLVideoElement,
  { $player, logger, delegate }: MediaContext,
): VideoPresentationAdapter {
  const $mode = signal<WebKitPresentationMode>('inline'),
    $supported = () => isFunction(video.webkitSetPresentationMode);

  if ($supported()) {
    if (__DEV__) logger?.debug('adding `webkitpresentationmodechanged` listener');
    listenEvent(video, 'webkitpresentationmodechanged', onPresentationModeChange);
  }

  function onPresentationModeChange(event: Event) {
    if (__DEV__) {
      logger?.infoGroup('presentation mode change').labelledLog('Event', event).dispatch();
    }

    $mode.set(video.webkitPresentationMode!);

    dispatchEvent($player(), 'video-presentation-change', {
      detail: $mode(),
      trigger: event,
    });

    delegate.dispatch('fullscreen-change', {
      detail: $mode() === 'fullscreen',
      trigger: event,
    });
  }

  return {
    get mode() {
      return $mode();
    },
    get active() {
      return $mode() === 'fullscreen';
    },
    get supported() {
      return peek($supported);
    },
    async enter() {
      if (peek($mode) === 'fullscreen') return;
      await video.webkitSetPresentationMode!('fullscreen');
    },
    async exit() {
      if (peek($mode) === 'inline') return;
      await video.webkitSetPresentationMode!('inline');
    },
  };
}

export interface VideoPresentationAdapter extends FullscreenAdapter {
  /**
   * The current presentation mode, possible values include `inline`, `picture-in-picture` and
   * `fullscreen`.
   *
   * @signal
   * @defaultValue 'inline'
   * @see {@link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode}
   */
  readonly mode: WebKitPresentationMode;
}
