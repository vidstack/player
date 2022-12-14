import { effect, peek, ReadSignal, signal } from 'maverick.js';
import { dispatchEvent, isFunction, listenEvent } from 'maverick.js/std';

import type {
  UseFullscreen,
  UseFullscreenProps,
} from '../../../../foundation/fullscreen/use-fullscreen';
import { useLogger } from '../../../../foundation/logger/use-logger';
import type { VideoElement } from '../types';

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
  $target: ReadSignal<VideoElement | null>,
  props: UseFullscreenProps,
): UseVideoPresentation {
  const $video = () => $target()?.mediaElement as HTMLVideoElement | null,
    $mode = signal<WebKitPresentationMode>('inline'),
    $supported = () => isFunction($video()?.webkitSetPresentationMode),
    logger = __DEV__ ? useLogger($target) : undefined;

  effect(() => {
    const video = $video();

    if (!video) {
      $mode.set('inline');
      return;
    }

    if ($supported()) {
      if (__DEV__) logger?.debug('adding `webkitpresentationmodechanged` listener');
      listenEvent(video, 'webkitpresentationmodechanged', onPresentationModeChange);
    }
  });

  function onPresentationModeChange(event: Event) {
    if (__DEV__) {
      logger?.infoGroup('presentation mode change').labelledLog('Event', event).dispatch();
    }

    $mode.set($video()!.webkitPresentationMode!);

    dispatchEvent($target(), 'vds-video-presentation-change', {
      detail: $mode(),
      triggerEvent: event,
    });

    dispatchEvent($target(), 'vds-fullscreen-change', {
      detail: $mode() === 'fullscreen',
      triggerEvent: event,
    });
  }

  function throwIfNotSupported() {
    if (!$supported()) {
      throw Error(__DEV__ ? '[vidstack] WebKit presentation API not available' : '');
    }
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
    async requestFullscreen() {
      await peek(async () => {
        if ($mode() === 'fullscreen') return;
        throwIfNotSupported();
        await props.onBeforeRequest?.();
        $video()!.webkitSetPresentationMode!('fullscreen');
      });
    },
    async exitFullscreen() {
      await peek(async () => {
        if ($mode() === 'inline') return;
        throwIfNotSupported();
        await props.onBeforeExit?.();
        $video()!.webkitSetPresentationMode!('inline');
      });
    },
  };
}

export interface UseVideoPresentation extends UseFullscreen {
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
