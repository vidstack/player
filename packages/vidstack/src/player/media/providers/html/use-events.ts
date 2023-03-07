import { onDispose } from 'maverick.js';
import { dispatchEvent, isNil, listenEvent, useDisposalBin } from 'maverick.js/std';

import { createRAFLoop } from '../../../../foundation/hooks/raf-loop';
import { isHLSSrc } from '../../../../utils/mime';
import { getNumberOfDecimalPlaces } from '../../../../utils/number';
import { IS_SAFARI } from '../../../../utils/support';
import type { MediaCanPlayDetail } from '../../events';
import type { MediaErrorCode } from '../../types';
import type { MediaSetupContext } from '../types';
import type { HTMLMediaProvider } from './provider';

/**
 * This is hook is mainly responsible for listening to events fired by a `HTMLMediaElement` and
 * dispatching the respective Vidstack media events (e.g., `canplay` -> `can-play`).
 */
export function useHTMLMediaElementEvents(
  provider: HTMLMediaProvider,
  { player, $store: $media, delegate, logger }: MediaSetupContext,
): void {
  const disposal = useDisposalBin();

  let isMediaWaiting = false,
    attachedLoadStartEventListeners = false,
    attachedCanPlayEventListeners = false;

  /**
   * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
   * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
   * resolve that by retrieving time updates in a request animation frame loop.
   */
  const timeRafLoop = createRAFLoop(() => {
    const newTime = provider.currentTime;
    if ($media.currentTime !== newTime) updateCurrentTime(newTime);
  });

  attachInitialEventListeners();

  onDispose(() => {
    timeRafLoop.stop();
    disposal.empty();
  });

  function attachMediaEventListener(
    eventType: keyof HTMLElementEventMap,
    handler: (event: Event) => void,
  ) {
    return listenEvent(
      provider.media,
      eventType,
      __DEV__
        ? (event) => {
            logger
              ?.debugGroup(`📺 fired \`${event.type}\``)
              .labelledLog('Event', event)
              .labelledLog('Media Store', { ...$media })
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
      attachMediaEventListener('play', onPlay),
      attachMediaEventListener('progress', onProgress),
      attachMediaEventListener('stalled', onStalled),
      attachMediaEventListener('suspend', onSuspend),
    );
    attachedLoadStartEventListeners = true;
  }

  function attachCanPlayEventListeners() {
    if (attachedCanPlayEventListeners) return;
    disposal.add(
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
    delegate.dispatch('time-update', {
      // Avoid errors where `currentTime` can have higher precision.
      detail: {
        currentTime: Math.min(newTime, $media.seekableEnd),
        played: provider.media.played,
      },
      trigger,
    });
  }

  function onAbort(event: Event) {
    delegate.dispatch('abort', { trigger: event });
  }

  function onLoadStart(event: Event) {
    if (provider.media.networkState === 3) {
      onAbort(event);
      return;
    }

    attachLoadStartEventListeners();
    delegate.dispatch('load-start', { trigger: event });
  }

  function onEmptied(event: Event) {
    delegate.dispatch('emptied', { trigger: event });
  }

  function onLoadedData(event: Event) {
    delegate.dispatch('loaded-data', { trigger: event });
  }

  function onLoadedMetadata(event: Event) {
    onStreamTypeChange();
    attachCanPlayEventListeners();

    // Sync volume state before metadata.
    delegate.dispatch('volume-change', {
      detail: { volume: provider.media.volume, muted: provider.media.muted },
    });

    delegate.dispatch('loaded-metadata', { trigger: event });

    // Native HLS does not reliably fire `canplay` event.
    if (IS_SAFARI && isHLSSrc($media.source)) {
      delegate.ready(getCanPlayDetail(), event);
    }
  }

  function getCanPlayDetail(): MediaCanPlayDetail {
    return {
      duration: provider.media.duration,
      buffered: provider.media.buffered,
      seekable: provider.media.seekable,
    };
  }

  function onStreamTypeChange() {
    if ($media.streamType !== 'unknown') return;
    const isLive = !Number.isFinite(provider.media.duration);
    delegate.dispatch('stream-type-change', {
      detail: isLive ? 'live' : 'on-demand',
    });
  }

  function onPlay(event: Event) {
    delegate.dispatch('play', { trigger: event });
  }

  function onPause(event: Event) {
    // Avoid seeking events triggering pause.
    if (provider.media.readyState === 1 && !isMediaWaiting) return;
    isMediaWaiting = false;
    timeRafLoop.stop();
    delegate.dispatch('pause', { trigger: event });
  }

  function onCanPlay(event: Event) {
    delegate.ready(getCanPlayDetail(), event);
  }

  function onCanPlayThrough(event: Event) {
    if ($media.started) return;
    delegate.dispatch('can-play-through', {
      trigger: event,
      detail: getCanPlayDetail(),
    });
  }

  function onPlaying(event: Event) {
    isMediaWaiting = false;
    delegate.dispatch('playing', { trigger: event });
    timeRafLoop.start();
  }

  function onStalled(event: Event) {
    delegate.dispatch('stalled', { trigger: event });
    if (provider.media.readyState < 3) {
      isMediaWaiting = true;
      delegate.dispatch('waiting', { trigger: event });
    }
  }

  function onWaiting(event: Event) {
    if (provider.media.readyState < 3) {
      isMediaWaiting = true;
      delegate.dispatch('waiting', { trigger: event });
    }
  }

  function onEnded(event: Event) {
    timeRafLoop.stop();
    updateCurrentTime(provider.media.duration, event);
    delegate.dispatch('end', { trigger: event });
    if ($media.loop) {
      onLoop();
    } else {
      delegate.dispatch('ended', { trigger: event });
    }
  }

  function onDurationChange(event: Event) {
    if ($media.ended) updateCurrentTime(provider.media.duration, event);
    delegate.dispatch('duration-change', {
      detail: provider.media.duration,
      trigger: event,
    });
  }

  function onVolumeChange(event: Event) {
    delegate.dispatch('volume-change', {
      detail: {
        volume: provider.media.volume,
        muted: provider.media.muted,
      },
      trigger: event,
    });
  }

  function onSeeked(event: Event) {
    delegate.dispatch('seeked', {
      detail: provider.media.currentTime,
      trigger: event,
    });

    // HLS: If precision has increased by seeking to the end, we'll call `play()` to properly end.
    if (
      Math.trunc(provider.media.currentTime) === Math.trunc(provider.media.duration) &&
      getNumberOfDecimalPlaces(provider.media.duration) >
        getNumberOfDecimalPlaces(provider.media.currentTime)
    ) {
      updateCurrentTime(provider.media.duration, event);
      if (!provider.media.ended) {
        dispatchEvent(player, 'media-play-request', { trigger: event });
      }
    }
  }

  function onSeeking(event: Event) {
    delegate.dispatch('seeking', {
      detail: provider.media.currentTime,
      trigger: event,
    });
  }

  function onProgress(event: Event) {
    delegate.dispatch('progress', {
      detail: {
        buffered: provider.media.buffered,
        seekable: provider.media.seekable,
      },
      trigger: event,
    });
  }

  function onLoop() {
    const hasCustomControls = isNil(provider.media.controls);
    // Forcefully hide controls to prevent flashing when looping. Calling `play()` at end
    // of media may show a flash of native controls on iOS, even if `controls` property is not set.
    if (hasCustomControls) provider.media.controls = false;
    dispatchEvent(player, 'media-loop-request');
  }

  function onSuspend(event: Event) {
    delegate.dispatch('suspend', { trigger: event });
  }

  function onRateChange(event: Event) {
    delegate.dispatch('rate-change', {
      detail: provider.media.playbackRate,
      trigger: event,
    });
  }

  function onError(event: Event) {
    const mediaError = provider.media.error;
    if (!mediaError) return;
    delegate.dispatch('error', {
      detail: {
        message: mediaError.message,
        code: mediaError.code as MediaErrorCode,
        mediaError: mediaError,
      },
      trigger: event,
    });
  }
}
