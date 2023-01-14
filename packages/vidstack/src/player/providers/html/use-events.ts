import { effect, ReadSignal } from 'maverick.js';
import { dispatchEvent, DOMEvent, isNil, listenEvent, useDisposalBin } from 'maverick.js/std';

import { useRAFLoop } from '../../../foundation/hooks/use-raf-loop';
import { useLogger } from '../../../foundation/logger/use-logger';
import { getMediaTypeFromExt } from '../../../utils/mime';
import { getNumberOfDecimalPlaces } from '../../../utils/number';
import type { MediaPlayEvent } from '../../media/events';
import { onMediaReady, onMediaSrcChange } from '../../media/provider/internal';
import { ATTEMPTING_AUTOPLAY } from '../../media/state';
import type { MediaStore } from '../../media/store';
import type { MediaErrorCode } from '../../media/types';
import type { HTMLProviderElement } from './types';
import type { UseHTMLProviderProps } from './use-provider';

export const ENGINE = Symbol(__DEV__ ? 'ENGINE' : 0);
export const IGNORE_NEXT_ABORT = Symbol(__DEV__ ? 'IGNORE_NEXT_ABORT' : 0);

/**
 * This is hook is mainly responsible for listening to events fired by a `HTMLMediaElement` and
 * dispatching the respective Vidstack media events (e.g., `canplay` -> `can-play`).
 */
export function useHTMLProviderEvents<T extends HTMLProviderElement>(
  $target: ReadSignal<T | null>,
  $mediaElement: ReadSignal<HTMLMediaElement | null>,
  $media: MediaStore,
  props: UseHTMLProviderProps<T>,
): void {
  // An un-debounced waiting tracker (waiting is debounced inside the media controller).
  let provider: HTMLProviderElement | null = null,
    media: HTMLMediaElement | null = null,
    logger = __DEV__ ? useLogger($target) : undefined,
    disposal = useDisposalBin(),
    isMediaWaiting = false,
    attachedLoadStartEventListeners = false,
    attachedCanPlayEventListeners = false;

  /**
   * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
   * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
   * resolve that by retrieving time updates in a request animation frame loop.
   */
  const timeRafLoop = useRAFLoop(() => {
    if (!media) return;
    const newTime = media.currentTime;
    if ($media.currentTime !== newTime) updateCurrentTime(newTime);
  });

  effect(() => {
    provider = $target();
    media = $mediaElement();
    if (provider && media) attachInitialEventListeners();
    return () => {
      timeRafLoop.stop();
      disposal.empty();
      isMediaWaiting = false;
      attachedLoadStartEventListeners = false;
      attachedCanPlayEventListeners = false;
    };
  });

  function attachMediaEventListener(
    eventType: keyof HTMLElementEventMap,
    handler: (event: Event) => void,
  ) {
    return listenEvent(
      media!,
      eventType,
      __DEV__
        ? (event) => {
            logger
              ?.debugGroup(`📺 fired \`${event.type}\``)
              .labelledLog('Event', event)
              .labelledLog('Media', { ...$media })
              .dispatch();

            handler(event);
          }
        : handler,
    );
  }

  function attachInitialEventListeners() {
    attachMediaEventListener('loadstart', onLoadStart);
    attachMediaEventListener('abort', onAbort);
    attachMediaEventListener('emptied', onEmptied);
    attachMediaEventListener('error', onError);
    if (__DEV__) {
      logger?.debug('attached initial media event listeners');
    }
  }

  function attachLoadStartEventListeners() {
    if (attachedLoadStartEventListeners) return;
    disposal.add(
      attachMediaEventListener('loadeddata', onLoadedData),
      attachMediaEventListener('loadedmetadata', onLoadedMetadata),
      attachMediaEventListener('canplay', onCanPlay),
      attachMediaEventListener('canplaythrough', onCanPlayThrough),
      attachMediaEventListener('durationchange', onDurationChange),
      attachMediaEventListener('progress', onProgress),
      attachMediaEventListener('stalled', onStalled),
      attachMediaEventListener('suspend', onSuspend),
    );
    attachedLoadStartEventListeners = true;
  }

  function attachCanPlayEventListeners() {
    if (attachedCanPlayEventListeners) return;
    disposal.add(
      attachMediaEventListener('play', onPlay),
      attachMediaEventListener('pause', onPause),
      attachMediaEventListener('playing', onPlaying),
      attachMediaEventListener('ratechange', onRateChange),
      attachMediaEventListener('seeked', onSeeked),
      attachMediaEventListener('seeking', onSeeking),
      attachMediaEventListener('ended', onEnded),
      attachMediaEventListener('volumechange', onVolumeChange),
      attachMediaEventListener('waiting', onWaiting),
    );
    attachedCanPlayEventListeners = true;
  }

  function updateCurrentTime(newTime: number, trigger?: Event) {
    if (!media) return;
    dispatchEvent(provider, 'time-update', {
      // Avoid errors where `currentTime` can have higher precision than duration.
      detail: {
        currentTime: Math.min(newTime, media.duration),
        played: media.played,
      },
      trigger,
    });
  }

  function onSourceChange() {
    const source = $media.sources.find((src) => src.src === media!.currentSrc);
    onMediaSrcChange($media, provider!, source ?? { src: media!.currentSrc }, logger);
    onMediaTypeChange();
  }

  function onAbort(event: Event) {
    if (props.onAbort?.(event) || media![IGNORE_NEXT_ABORT]) {
      media![IGNORE_NEXT_ABORT] = false;
      return;
    }

    onSourceChange();
    dispatchEvent(provider, 'abort', { trigger: event });
  }

  function onLoadStart(event: Event) {
    if (media!.networkState === 3) {
      onAbort(event);
      return;
    }

    if (!media![ENGINE]) onSourceChange();
    attachLoadStartEventListeners();
    dispatchEvent(provider, 'load-start', { trigger: event });
  }

  function onEmptied(event: Event) {
    dispatchEvent(provider, 'emptied', { trigger: event });
  }

  function onLoadedData(event: Event) {
    dispatchEvent(provider, 'loaded-data', { trigger: event });
  }

  function onLoadedMetadata(event: Event) {
    onMediaTypeChange();
    attachCanPlayEventListeners();

    // Sync volume state before metadata.
    dispatchEvent(provider, 'volume-change', {
      detail: { volume: media!.volume, muted: media!.muted },
    });

    dispatchEvent(provider, 'loaded-metadata', { trigger: event });

    props.onLoadedMetadata?.(event);
  }

  function onMediaTypeChange() {
    const isLive = !Number.isFinite(media!.duration);
    const mediaType = isLive ? 'live-video' : getMediaTypeFromExt($media.source);
    if (mediaType !== $media.mediaType) {
      dispatchEvent(provider, 'media-type-change', { detail: mediaType });
    }
  }

  function onPlay(event: Event) {
    const playEvent = new DOMEvent('play', {
      trigger: event,
    }) as MediaPlayEvent;
    playEvent.autoplay = $media[ATTEMPTING_AUTOPLAY];
    provider!.dispatchEvent(playEvent);
  }

  function onPause(event: Event) {
    // Avoid seeking events triggering pause.
    if (media!.readyState === 1 && !isMediaWaiting) return;
    isMediaWaiting = false;
    timeRafLoop.stop();
    dispatchEvent(provider, 'pause', { trigger: event });
  }

  function onCanPlay(event: Event) {
    onMediaReady($media, provider!, media!.duration, event, logger);
  }

  function onCanPlayThrough(event: Event) {
    if ($media.started) return;
    dispatchEvent(provider, 'can-play-through', {
      trigger: event,
      detail: { duration: media!.duration },
    });
  }

  function onPlaying(event: Event) {
    isMediaWaiting = false;
    dispatchEvent(provider, 'playing', { trigger: event });
    timeRafLoop.start();
  }

  function onStalled(event: Event) {
    dispatchEvent(provider, 'stalled', { trigger: event });
    if (media!.readyState < 3) {
      isMediaWaiting = true;
      dispatchEvent(provider, 'waiting', { trigger: event });
    }
  }

  function onWaiting(event: Event) {
    if (media!.readyState < 3) {
      isMediaWaiting = true;
      dispatchEvent(provider, 'waiting', { trigger: event });
    }
  }

  function onEnded(event: Event) {
    timeRafLoop.stop();
    updateCurrentTime(media!.duration, event);
    dispatchEvent(provider, 'end', { trigger: event });
    if ($media.loop) {
      onLoop();
    } else {
      dispatchEvent(provider, 'ended', { trigger: event });
    }
  }

  function onDurationChange(event: Event) {
    if ($media.ended) updateCurrentTime(media!.duration, event);
    dispatchEvent(provider, 'duration-change', {
      detail: media!.duration,
      trigger: event,
    });
  }

  function onVolumeChange(event: Event) {
    dispatchEvent(provider, 'volume-change', {
      detail: {
        volume: media!.volume,
        muted: media!.muted,
      },
      trigger: event,
    });
  }

  function onSeeked(event: Event) {
    dispatchEvent(provider, 'seeked', {
      detail: media!.currentTime,
      trigger: event,
    });

    // HLS: If precision has increased by seeking to the end, we'll call `play()` to properly end.
    if (
      Math.trunc(media!.currentTime) === Math.trunc(media!.duration) &&
      getNumberOfDecimalPlaces(media!.duration) > getNumberOfDecimalPlaces(media!.currentTime)
    ) {
      updateCurrentTime(media!.duration, event);
      if (!media!.ended) {
        try {
          provider!.play();
        } catch (e) {
          // no-op
        }
      }
    }
  }

  function onSeeking(event: Event) {
    dispatchEvent(provider, 'seeking', {
      detail: media!.currentTime,
      trigger: event,
    });
  }

  function onProgress(event: Event) {
    dispatchEvent(provider, 'progress', {
      detail: {
        buffered: media!.buffered,
        seekable: media!.seekable,
      },
      trigger: event,
    });
  }

  function onLoop() {
    const hasCustomControls = isNil(provider!.controls);
    // Forcefully hide controls to prevent flashing when looping. Calling `play()` at end
    // of media may show a flash of native controls on iOS, even if `controls` property is not set.
    if (hasCustomControls) media!.controls = false;
    dispatchEvent(provider, 'loop-request');
  }

  function onSuspend(event: Event) {
    dispatchEvent(provider, 'suspend', { trigger: event });
  }

  function onRateChange(event: Event) {
    // TODO: no-op for now but we'll add playback rate support later.
  }

  function onError(event: Event) {
    const mediaError = media!.error;
    if (!mediaError) return;
    dispatchEvent(provider, 'error', {
      detail: {
        message: mediaError.message,
        code: mediaError.code as MediaErrorCode,
        mediaError: mediaError,
      },
      trigger: event,
    });
  }
}
