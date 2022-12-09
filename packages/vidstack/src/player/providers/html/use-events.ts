import { effect, ReadSignal } from 'maverick.js';
import { dispatchEvent, DOMEvent, isNil, listenEvent, useDisposalBin } from 'maverick.js/std';

import { useRAFLoop } from '../../../foundation/hooks/use-raf-loop';
import { useLogger } from '../../../foundation/logger/use-logger';
import { getMediaTypeFromExt } from '../../../utils/mime';
import { getNumberOfDecimalPlaces } from '../../../utils/number';
import type { MediaPlayEvent } from '../../media/events';
import { onCurrentSrcChange, onMediaReady } from '../../media/provider/internal';
import { ATTEMPTING_AUTOPLAY, MediaState } from '../../media/state';
import type { MediaErrorCode } from '../../media/types';
import type { HtmlMediaProviderElement } from './types';

export const IGNORE_NEXT_ABORT = Symbol(__DEV__ ? 'IGNORE_NEXT_ABORT' : 0);
export const IGNORE_NEXT_EMPTIED = Symbol(__DEV__ ? 'IGNORE_NEXT_EMPTIED' : 0);

export function useHtmlMediaElementEvents(
  $target: ReadSignal<HtmlMediaProviderElement | null>,
  $mediaElement: ReadSignal<HTMLMediaElement | null>,
  $media: MediaState,
): void {
  // An un-debounced waiting tracker (waiting is debounced inside the media controller).
  let provider: HtmlMediaProviderElement | null = null,
    media: HTMLMediaElement | null = null,
    logger = __DEV__ ? useLogger($target) : undefined,
    disposal = useDisposalBin(),
    isMediaWaiting = false,
    attachedLoadStartEventListeners = false,
    attachedCanPlayEventListeners = false;

  /**
   * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
   * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
   * resolve that by retreiving time updates in a request animation frame loop.
   */
  const timeRafLoop = useRAFLoop(() => {
    const media = $mediaElement();
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
      attachMediaEventListener('progress', onProgress),
      attachMediaEventListener('ratechange', onRateChange),
      attachMediaEventListener('seeked', onSeeked),
      attachMediaEventListener('seeking', onSeeking),
      attachMediaEventListener('ended', onEnded),
      attachMediaEventListener('volumechange', onVolumeChange),
      attachMediaEventListener('waiting', onWaiting),
    );
    attachedCanPlayEventListeners = true;
  }

  function updateCurrentTime(newTime: number, triggerEvent?: Event) {
    if (!media) return;
    dispatchEvent(provider, 'vds-time-update', {
      // Avoid errors where `currentTime` can have higher precision than duration.
      detail: {
        currentTime: Math.min(newTime, media.duration),
        played: media.played,
      },
      triggerEvent,
    });
  }

  function onAbort(event?: Event) {
    if (media![IGNORE_NEXT_ABORT]) return;
    const srcChangeEvent = onCurrentSrcChange($media, provider!, '', logger);
    if (srcChangeEvent) onMediaTypeChange(srcChangeEvent);
    dispatchEvent(provider, 'vds-abort', { triggerEvent: event });
  }

  function onLoadStart(event: Event) {
    const srcChangeEvent = onCurrentSrcChange($media, provider!, media!.currentSrc, logger);
    if (srcChangeEvent) onMediaTypeChange(srcChangeEvent);

    if (media!.currentSrc === '') {
      onAbort();
      return;
    }

    attachLoadStartEventListeners();

    dispatchEvent(provider, 'vds-load-start', {
      triggerEvent: event,
      detail: getMediaMetadata(),
    });
  }

  function onEmptied(event: Event) {
    if (media![IGNORE_NEXT_EMPTIED]) return;
    dispatchEvent(provider, 'vds-emptied', { triggerEvent: event });
  }

  function onLoadedData(event: Event) {
    dispatchEvent(provider, 'vds-loaded-data', { triggerEvent: event });
  }

  function onLoadedMetadata(event: Event) {
    attachCanPlayEventListeners();

    // Sync volume state before metadata.
    dispatchEvent(provider, 'vds-volume-change', {
      detail: {
        volume: media!.volume,
        muted: media!.muted,
      },
    });

    dispatchEvent(provider, 'vds-loaded-metadata', {
      triggerEvent: event,
      detail: getMediaMetadata(),
    });
  }

  function onMediaTypeChange(event: Event) {
    dispatchEvent(provider, 'vds-media-type-change', {
      detail: getMediaTypeFromExt($media.currentSrc),
      triggerEvent: event,
    });
  }

  function onPlay(event: Event) {
    const playEvent = new DOMEvent('vds-play', {
      triggerEvent: event,
    }) as MediaPlayEvent;
    playEvent.autoplay = $media[ATTEMPTING_AUTOPLAY];
    provider!.dispatchEvent(playEvent);
  }

  function onPause(event: Event) {
    // Avoid seeking events triggering pause.
    if (media!.readyState === 1 && !isMediaWaiting) return;
    isMediaWaiting = false;
    timeRafLoop.stop();
    dispatchEvent(provider, 'vds-pause', { triggerEvent: event });
  }

  function onCanPlay(event: Event) {
    onMediaReady($media, provider!, media!.duration, event, logger);
  }

  function onCanPlayThrough(event: Event) {
    if ($media.started) return;
    dispatchEvent(provider, 'vds-can-play-through', {
      triggerEvent: event,
      detail: { duration: media!.duration },
    });
  }

  function onPlaying(event: Event) {
    isMediaWaiting = false;
    dispatchEvent(provider, 'vds-playing', { triggerEvent: event });
    timeRafLoop.start();
  }

  function onStalled(event: Event) {
    dispatchEvent(provider, 'vds-stalled', { triggerEvent: event });
    if (media!.readyState < 3) {
      isMediaWaiting = true;
      dispatchEvent(provider, 'vds-waiting', { triggerEvent: event });
    }
  }

  function onWaiting(event: Event) {
    if (media!.readyState < 3) {
      isMediaWaiting = true;
      dispatchEvent(provider, 'vds-waiting', { triggerEvent: event });
    }
  }

  function onEnded(event: Event) {
    timeRafLoop.stop();
    updateCurrentTime(media!.duration, event);
    dispatchEvent(provider, 'vds-end', { triggerEvent: event });
    if ($media.loop) {
      onLoop();
    } else {
      dispatchEvent(provider, 'vds-ended', { triggerEvent: event });
    }
  }

  function onDurationChange(event: Event) {
    if ($media.ended) updateCurrentTime(media!.duration, event);
    dispatchEvent(provider, 'vds-duration-change', {
      detail: media!.duration,
      triggerEvent: event,
    });
  }

  function onVolumeChange(event: Event) {
    dispatchEvent(provider, 'vds-volume-change', {
      detail: {
        volume: media!.volume,
        muted: media!.muted,
      },
      triggerEvent: event,
    });
  }

  function onSeeked(event: Event) {
    dispatchEvent(provider, 'vds-seeked', {
      detail: media!.currentTime,
      triggerEvent: event,
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
    dispatchEvent(provider, 'vds-seeking', {
      detail: media!.currentTime,
      triggerEvent: event,
    });
  }

  function onProgress(event: Event) {
    dispatchEvent(provider, 'vds-progress', {
      detail: {
        buffered: media!.buffered,
        seekable: media!.seekable,
      },
      triggerEvent: event,
    });
  }

  function onLoop() {
    const hasCustomControls = isNil(provider!.controls);
    // Forcefully hide controls to prevent flashing when looping. Calling `play()` at end
    // of media may show a flash of native controls on iOS, even if `controls` property is not set.
    if (hasCustomControls) media!.controls = false;
    dispatchEvent(provider, 'vds-loop-request');
  }

  function onSuspend(event: Event) {
    dispatchEvent(provider, 'vds-suspend', { triggerEvent: event });
  }

  function onRateChange(event: Event) {
    // TODO: no-op for now but we'll add playback rate support later.
  }

  function onError(event: Event) {
    const mediaError = media!.error;
    if (!mediaError) return;
    dispatchEvent(provider, 'vds-error', {
      detail: {
        message: mediaError.message,
        code: mediaError.code as MediaErrorCode,
        mediaError: mediaError,
      },
      triggerEvent: event,
    });
  }

  function getMediaMetadata() {
    return {
      src: $media.src, // Set before metadata is retrieved.
      currentSrc: media!.currentSrc,
      duration: media!.duration || 0,
      poster: (media as HTMLVideoElement).poster,
      mediaType: getMediaTypeFromExt($media.currentSrc),
      viewType: $media.viewType,
    };
  }
}
