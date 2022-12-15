import { effect, ReadSignal, signal, useContext, WriteSignal } from 'maverick.js';
import { keysOf, listenEvent } from 'maverick.js/std';

import type { UseFullscreen } from '../../../foundation/fullscreen/use-fullscreen';
import { useLogger } from '../../../foundation/logger/use-logger';
import { Queue } from '../../../foundation/queue/queue';
import type { MediaProviderElement } from '../provider/types';
import { MediaProviderContext } from '../provider/use-media-provider';
import type * as RE from '../request-events';
import { CAN_LOAD_POSTER } from '../state';
import { useInternalMediaState } from '../store';
import type { UseMediaUser } from '../user';
import type { MediaControllerEventTarget } from './events';

export type MediaRequestQueue = Queue<MediaRequestQueueRecord>;

export type MediaRequestQueueRecord = {
  load: RE.StartLoadingRequestEvent;
  play: RE.PlayRequestEvent;
  pause: RE.PauseRequestEvent;
  volume: RE.VolumeChangeRequestEvent | RE.MuteRequestEvent | RE.UnmuteRequestEvent;
  fullscreen: RE.EnterFullscreenRequestEvent | RE.ExitFullscreenRequestEvent;
  seeked: RE.SeekRequestEvent;
  seeking: RE.SeekingRequestEvent;
  userIdle: RE.ResumeUserIdleRequestEvent | RE.PauseUserIdleRequestEvent;
};

/**
 * This hook is responsible for listening to media request events and calling the appropriate
 * actions on the current media provider. Do note that we queue actions until a media provider
 * has connected.
 */
export function useMediaRequestManager(
  $target: ReadSignal<MediaControllerEventTarget | null>,
  user: UseMediaUser,
  fullscreen: UseFullscreen,
): UseMediaRequestManager {
  const logger = __DEV__ ? useLogger($target) : undefined,
    $media = useInternalMediaState(),
    $isLooping = signal(false),
    $isReplay = signal(false),
    $isSeekingRequest = signal(false),
    $mediaProvider = useContext(MediaProviderContext),
    requestQueue: MediaRequestQueue = new Queue();

  let provider: MediaProviderElement | null = null;
  effect(() => {
    provider = $mediaProvider();
  });

  function logRequest(event: Event) {
    if (__DEV__) {
      logger?.infoGroup(`📬 received \`${event.type}\``).labelledLog('Request', event).dispatch();
    }
  }

  // TODO: can we delay any of these event listeners?
  const eventHandlers = {
    'vds-start-loading': onStartLoading,
    'vds-mute-request': onMuteRequest,
    'vds-unmute-request': onUnmuteRequest,
    'vds-play-request': onPlayRequest,
    'vds-pause-request': onPauseRequest,
    'vds-seeking-request': onSeekingRequest,
    'vds-seek-request': onSeekRequest,
    'vds-volume-change-request': onVolumeChangeRequest,
    'vds-enter-fullscreen-request': onEnterFullscreenRequest,
    'vds-exit-fullscreen-request': onExitFullscreenRequest,
    'vds-resume-user-idle-request': onResumeIdlingRequest,
    'vds-pause-user-idle-request': onPauseIdlingRequest,
    'vds-show-poster-request': onShowPosterRequest,
    'vds-hide-poster-request': onHidePosterRequest,
    'vds-loop-request': onLoopRequest,
  };

  effect(() => {
    const target = $target();
    if (!target) return;
    for (const eventType of keysOf(eventHandlers)) {
      const handler = eventHandlers[eventType];
      listenEvent(target, eventType, (event) => {
        event.stopPropagation();
        if (__DEV__) logRequest(event);
        if (provider) handler(event as any);
      });
    }
  });

  function onStartLoading(event: RE.StartLoadingRequestEvent) {
    if ($media.canLoad) return;
    requestQueue.queue('load', event);
    provider!.startLoadingMedia();
  }

  function onMuteRequest(event: RE.MuteRequestEvent) {
    if ($media.muted) return;
    requestQueue.queue('volume', event);
    provider!.muted = true;
  }

  function onUnmuteRequest(event: RE.UnmuteRequestEvent) {
    if (!$media.muted) return;
    requestQueue.queue('volume', event);
    provider!.muted = false;
    if ($media.volume === 0) {
      requestQueue.queue('volume', event);
      provider!.volume = 0.25;
    }
  }

  function onPlayRequest(event: RE.PlayRequestEvent) {
    if (!$media.paused) return;
    requestQueue.queue('play', event);
    provider!.play();
  }

  function onPauseRequest(event: RE.PauseRequestEvent) {
    if ($media.paused) return;
    requestQueue.queue('pause', event);
    provider!.pause();
  }

  function onSeekingRequest(event: RE.SeekingRequestEvent) {
    requestQueue.queue('seeking', event);
    $media.seeking = true;
    $isSeekingRequest.set(true);
  }

  function onSeekRequest(event: RE.SeekRequestEvent) {
    if ($media.ended) $isReplay.set(true);
    requestQueue.queue('seeked', event);
    $isSeekingRequest.set(false);
    // Span to end if close enough.
    provider!.currentTime = $media.duration - event.detail < 0.25 ? $media.duration : event.detail;
  }

  function onVolumeChangeRequest(event: RE.VolumeChangeRequestEvent) {
    const volume = event.detail;
    if ($media.volume === volume) return;
    requestQueue.queue('volume', event);
    provider!.volume = volume;
    if (volume > 0 && $media.muted) {
      requestQueue.queue('volume', event);
      provider!.muted = false;
    }
  }

  async function onEnterFullscreenRequest(event: RE.EnterFullscreenRequestEvent) {
    if ($media.fullscreen) return;
    const target = event.detail ?? 'media';
    if (target === 'media' && fullscreen.supported) {
      requestQueue.queue('fullscreen', event);
      await fullscreen.requestFullscreen();
    } else if (provider?.fullscreen.supported) {
      requestQueue.queue('fullscreen', event);
      await provider.enterFullscreen();
    }
  }

  async function onExitFullscreenRequest(event: RE.ExitFullscreenRequestEvent) {
    if (!$media.fullscreen) return;
    const target = event.detail ?? 'media';
    if (target === 'media' && fullscreen.supported) {
      requestQueue.queue('fullscreen', event);
      await fullscreen.exitFullscreen();
    } else if (provider?.fullscreen.supported) {
      requestQueue.queue('fullscreen', event);
      await provider.exitFullscreen();
    }
  }

  function onResumeIdlingRequest(event: RE.ResumeUserIdleRequestEvent) {
    requestQueue.queue('userIdle', event);
    user.idle.paused = false;
  }

  function onPauseIdlingRequest(event: RE.PauseUserIdleRequestEvent) {
    requestQueue.queue('userIdle', event);
    user.idle.paused = true;
  }

  function onShowPosterRequest(event: RE.ShowPosterRequestEvent) {
    $media[CAN_LOAD_POSTER] = true;
  }

  function onHidePosterRequest(event: RE.HidePosterRequestEvent) {
    $media[CAN_LOAD_POSTER] = false;
  }

  function onLoopRequest(event: RE.LoopRequestEvent) {
    window.requestAnimationFrame(async () => {
      try {
        $isLooping.set(true);
        $isReplay.set(true);
        await provider!.play();
      } catch (e) {
        $isLooping.set(false);
        $isReplay.set(false);
      }
    });
  }

  return {
    $isLooping,
    $isReplay,
    $isSeekingRequest,
    requestQueue,
  };
}

export interface UseMediaRequestManager {
  $isSeekingRequest: WriteSignal<boolean>;
  $isLooping: WriteSignal<boolean>;
  $isReplay: WriteSignal<boolean>;
  requestQueue: MediaRequestQueue;
}
