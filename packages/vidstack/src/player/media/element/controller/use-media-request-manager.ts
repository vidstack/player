import { effect, peek, ReadSignal, Signals, WriteSignal } from 'maverick.js';
import { createEvent, isUndefined, keysOf, listenEvent } from 'maverick.js/std';

import { UseFullscreen, useFullscreen } from '../../../../foundation/fullscreen/use-fullscreen';
import { useLogger } from '../../../../foundation/logger/use-logger';
import {
  useScreenOrientation,
  UseScreenOrientation,
} from '../../../../foundation/orientation/use-screen-orientation';
import type { Queue } from '../../../../foundation/queue/queue';
import { coerceToError } from '../../../../utils/error';
import type * as RE from '../../request-events';
import type { MediaStore } from '../../store';
import { useMediaUser, UseMediaUser } from '../../user';
import type { MediaAdapter, MediaControllerElement, MediaControllerProps } from './types';
import type { MediaStateManager } from './use-media-state-manager';

/**
 * This hook is responsible for listening to media request events and calling the appropriate
 * actions on the current media provider. Do note that we queue actions until a media provider
 * has connected.
 */
export function useMediaRequestManager(
  $target: ReadSignal<MediaControllerElement | null>,
  $media: MediaStore,
  stateManager: MediaStateManager,
  $props: Signals<MediaControllerProps>,
  { requestQueue, $isLooping, $isReplay, $isSeekingRequest }: MediaRequestManagerInit,
): MediaRequestManager {
  const user = useMediaUser($target),
    logger = __DEV__ ? useLogger($target) : undefined,
    orientation = useScreenOrientation($target),
    fullscreen = useFullscreen($target);

  let adapter: MediaAdapter | null = null;
  effect(() => {
    adapter = stateManager.$mediaProvider()?.adapter || null;
  });

  effect(() => {
    user.idle.delay = $props.$userIdleDelay();
  });

  effect(() => {
    const supported =
      fullscreen.supported || stateManager.$mediaProvider()?.adapter.fullscreen?.supported || false;
    if ($media.canLoad && peek(() => $media.canFullscreen) === supported) return;
    $media.canFullscreen = supported;
  });

  function logRequest(event: Event) {
    if (__DEV__) {
      logger?.infoGroup(`📬 received \`${event.type}\``).labelledLog('Request', event).dispatch();
    }
  }

  const eventHandlers = {
    'media-start-loading': onStartLoading,
    'media-mute-request': onMuteRequest,
    'media-unmute-request': onUnmuteRequest,
    'media-play-request': onPlayRequest,
    'media-pause-request': onPauseRequest,
    'media-seeking-request': onSeekingRequest,
    'media-seek-request': onSeekRequest,
    'media-volume-change-request': onVolumeChangeRequest,
    'media-enter-fullscreen-request': onEnterFullscreenRequest,
    'media-exit-fullscreen-request': onExitFullscreenRequest,
    'media-resume-user-idle-request': onResumeIdlingRequest,
    'media-pause-user-idle-request': onPauseIdlingRequest,
    'media-show-poster-request': onShowPosterRequest,
    'media-hide-poster-request': onHidePosterRequest,
    'media-loop-request': onLoopRequest,
  };

  effect(() => {
    const target = $target();
    if (!target) return;
    for (const eventType of keysOf(eventHandlers)) {
      const handler = eventHandlers[eventType];
      listenEvent(target, eventType, (event) => {
        event.stopPropagation();
        if (__DEV__) logRequest(event);
        if (adapter) handler(event as any);
      });
    }
  });

  function onStartLoading(event: RE.StartLoadingRequestEvent) {
    if ($media.canLoad) return;
    requestQueue.queue('load', event);
    stateManager.handleMediaEvent(createEvent($target, 'can-load'));
  }

  function onMuteRequest(event: RE.MuteRequestEvent) {
    if ($media.muted) return;
    requestQueue.queue('volume', event);
    adapter!.muted = true;
  }

  function onUnmuteRequest(event: RE.UnmuteRequestEvent) {
    if (!$media.muted) return;
    requestQueue.queue('volume', event);
    adapter!.muted = false;
    if ($media.volume === 0) {
      requestQueue.queue('volume', event);
      adapter!.volume = 0.25;
    }
  }

  async function onPlayRequest(event: RE.PlayRequestEvent) {
    if (!$media.paused) return;
    try {
      requestQueue.queue('play', event);
      await adapter!.play();
    } catch (e) {
      const errorEvent = createEvent($target, 'play-fail', { detail: coerceToError(e) });
      stateManager.handleMediaEvent(errorEvent);
    }
  }

  async function onPauseRequest(event: RE.PauseRequestEvent) {
    if ($media.paused) return;
    try {
      requestQueue.queue('pause', event);
      await adapter!.pause();
    } catch (e) {
      requestQueue.delete('pause');
      if (__DEV__) logger?.error('pause-fail', e);
    }
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
    adapter!.currentTime = $media.duration - event.detail < 0.25 ? $media.duration : event.detail;
  }

  function onVolumeChangeRequest(event: RE.VolumeChangeRequestEvent) {
    const volume = event.detail;
    if ($media.volume === volume) return;
    requestQueue.queue('volume', event);
    adapter!.volume = volume;
    if (volume > 0 && $media.muted) {
      requestQueue.queue('volume', event);
      adapter!.muted = false;
    }
  }

  async function onEnterFullscreenRequest(event: RE.EnterFullscreenRequestEvent) {
    try {
      requestQueue.queue('fullscreen', event);
      await enterFullscreen(event.detail);
    } catch (e) {
      const errorEvent = createEvent($target, 'fullscreen-error', { detail: coerceToError(e) });
      stateManager.handleMediaEvent(errorEvent);
    }
  }

  async function onExitFullscreenRequest(event: RE.ExitFullscreenRequestEvent) {
    try {
      requestQueue.queue('fullscreen', event);
      await exitFullscreen(event.detail);
    } catch (e) {
      const errorEvent = createEvent($target, 'fullscreen-error', { detail: coerceToError(e) });
      stateManager.handleMediaEvent(errorEvent);
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
    $media.canLoadPoster = true;
  }

  function onHidePosterRequest(event: RE.HidePosterRequestEvent) {
    $media.canLoadPoster = false;
  }

  function onLoopRequest(event: RE.LoopRequestEvent) {
    window.requestAnimationFrame(async () => {
      try {
        $isLooping.set(true);
        $isReplay.set(true);
        await play();
      } catch (e) {
        $isLooping.set(false);
        $isReplay.set(false);
      }
    });
  }

  function throwIfFullscreenNotSupported(
    target: RE.MediaFullscreenRequestTarget,
    fullscreen?: UseFullscreen,
  ) {
    if (fullscreen?.supported) return;
    throw Error(
      __DEV__
        ? `[vidstack] fullscreen is not currently available on target \`${target}\``
        : '[vidstack] no fullscreen support',
    );
  }

  async function play() {
    if (!$media.paused) return;
    try {
      if (!adapter || !$target()?.state.canPlay) throwIfNotReadyForPlayback();
      if ($media.ended || $media.currentTime === 0) adapter!.currentTime = 0;
      return adapter!.play();
    } catch (error) {
      const errorEvent = createEvent($target, 'play-fail', { detail: coerceToError(error) });
      errorEvent.autoplay = $media.attemptingAutoplay;
      stateManager.handleMediaEvent(errorEvent);
      throw error;
    }
  }

  async function pause() {
    if ($media.paused) return;
    if (!adapter || !$target()?.state.canPlay) throwIfNotReadyForPlayback();
    return adapter!.pause();
  }

  async function enterFullscreen(target: RE.MediaFullscreenRequestTarget = 'prefer-media') {
    const fs =
      (target === 'prefer-media' && fullscreen.supported) || target === 'media'
        ? fullscreen
        : adapter?.fullscreen;

    throwIfFullscreenNotSupported(target, fs);
    if (fs!.active) return;

    // TODO: Check if PiP is active, if so make sure to exit.
    const lockType = peek($props.$fullscreenOrientation);
    if (orientation.supported && !isUndefined(lockType)) await orientation.lock(lockType);

    return fs!.requestFullscreen();
  }

  async function exitFullscreen(target: RE.MediaFullscreenRequestTarget = 'prefer-media') {
    const fs =
      (target === 'prefer-media' && fullscreen.supported) || target === 'media'
        ? fullscreen
        : adapter?.fullscreen;

    throwIfFullscreenNotSupported(target, fs);
    if (!fs!.active) return;

    if (orientation.locked) await orientation.unlock();
    // TODO: If PiP was active put it back _after_ exiting.

    return fs!.exitFullscreen();
  }

  return {
    user,
    orientation,
    play,
    pause,
    enterFullscreen,
    exitFullscreen,
  };
}

function throwIfNotReadyForPlayback() {
  throw Error(
    __DEV__
      ? `[vidstack] media is not ready - wait for \`can-play\` event.`
      : '[vidstack] media not ready',
  );
}

export interface MediaRequestQueue extends Queue<MediaRequestQueueRecord> {}

export interface MediaRequestQueueRecord {
  load: RE.StartLoadingRequestEvent;
  play: RE.PlayRequestEvent;
  pause: RE.PauseRequestEvent;
  volume: RE.VolumeChangeRequestEvent | RE.MuteRequestEvent | RE.UnmuteRequestEvent;
  fullscreen: RE.EnterFullscreenRequestEvent | RE.ExitFullscreenRequestEvent;
  seeked: RE.SeekRequestEvent;
  seeking: RE.SeekingRequestEvent;
  userIdle: RE.ResumeUserIdleRequestEvent | RE.PauseUserIdleRequestEvent;
}

export interface MediaRequestManagerInit {
  requestQueue: MediaRequestQueue;
  $isLooping: WriteSignal<boolean>;
  $isReplay: WriteSignal<boolean>;
  $isSeekingRequest: WriteSignal<boolean>;
}

export interface MediaRequestManager {
  user: UseMediaUser;
  orientation: UseScreenOrientation;
  play(): Promise<void>;
  pause(): Promise<void>;
  enterFullscreen(target?: RE.MediaFullscreenRequestTarget): Promise<void>;
  exitFullscreen(target?: RE.MediaFullscreenRequestTarget): Promise<void>;
}
