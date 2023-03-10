import { effect, peek, ReadSignal, signal, Signals } from 'maverick.js';
import { createEvent, isUndefined, keysOf, listenEvent, noop } from 'maverick.js/std';

import {
  createFullscreenAdapter,
  FullscreenAdapter,
} from '../../../foundation/fullscreen/fullscreen';
import {
  createScreenOrientationAdapter,
  ScreenOrientationAdapter,
} from '../../../foundation/orientation/screen-orientation';
import { Queue } from '../../../foundation/queue/queue';
import { coerceToError } from '../../../utils/error';
import type { MediaPlayerElement } from '../../element/types';
import type { MediaContext } from '../context';
import type { MediaProvider } from '../providers/types';
import type * as RE from '../request-events';
import { createMediaUser, MediaUser } from '../user';
import type { MediaStateManager } from './state-manager';
import type { MediaControllerProps } from './types';

/**
 * This hook is responsible for listening to media request events and calling the appropriate
 * actions on the current media provider. Do note that we queue actions until a media provider
 * has connected.
 */
export function createMediaRequestManager(
  { $player, $store: $media, $provider, logger, qualities, audioTracks }: MediaContext,
  handler: MediaStateManager,
  requests: MediaRequestContext,
  $props: Signals<MediaControllerProps>,
): MediaRequestManager {
  const user = createMediaUser($player, $media),
    orientation = createScreenOrientationAdapter($player),
    fullscreen = createFullscreenAdapter($player);

  if (__SERVER__) {
    return {
      _user: user,
      _orientation: orientation,
      _play: noop as () => Promise<void>,
      _pause: noop as () => Promise<void>,
      _seekToLiveEdge: noop,
      _enterFullscreen: noop as () => Promise<void>,
      _exitFullscreen: noop as () => Promise<void>,
      _enterPictureInPicture: noop as () => Promise<void>,
      _exitPictureInPicture: noop as () => Promise<void>,
    };
  }

  effect(() => {
    user.idle.delay = $props.$userIdleDelay();
  });

  // fullscreen support check.
  effect(() => {
    const supported = fullscreen.supported || $provider()?.fullscreen?.supported || false;
    if ($media.canLoad && peek(() => $media.canFullscreen) === supported) return;
    $media.canFullscreen = supported;
  });

  // picture-in-picture support check.
  effect(() => {
    const supported = $provider()?.pictureInPicture?.supported || false;
    if ($media.canLoad && peek(() => $media.canPictureInPicture) === supported) return;
    $media.canPictureInPicture = supported;
  });

  function logRequest(event: Event) {
    if (__DEV__) {
      logger?.infoGroup(`📬 received \`${event.type}\``).labelledLog('Request', event).dispatch();
    }
  }

  type EventHandlers = {
    [Type in keyof RE.MediaRequestEvents]: (event: RE.MediaRequestEvents[Type]) => void;
  };

  const eventHandlers: EventHandlers = {
    'media-audio-track-change-request': onAudioTrackChangeRequest,
    'media-enter-fullscreen-request': onEnterFullscreenRequest,
    'media-exit-fullscreen-request': onExitFullscreenRequest,
    'media-enter-pip-request': onEnterPictureInPictureRequest,
    'media-exit-pip-request': onExitPictureInPictureRequest,
    'media-hide-poster-request': onHidePosterRequest,
    'media-live-edge-request': onSeekToLiveEdgeRequest,
    'media-loop-request': onLoopRequest,
    'media-mute-request': onMuteRequest,
    'media-pause-request': onPauseRequest,
    'media-pause-user-idle-request': onPauseIdlingRequest,
    'media-play-request': onPlayRequest,
    'media-rate-change-request': onRateChangeRequest,
    'media-quality-change-request': onQualityChangeRequest,
    'media-resume-user-idle-request': onResumeIdlingRequest,
    'media-seek-request': onSeekRequest,
    'media-seeking-request': onSeekingRequest,
    'media-show-poster-request': onShowPosterRequest,
    'media-start-loading': onStartLoading,
    'media-unmute-request': onUnmuteRequest,
    'media-volume-change-request': onVolumeChangeRequest,
  };

  effect(() => {
    const target = $player();
    if (!target) return;
    for (const eventType of keysOf(eventHandlers)) {
      const handler = eventHandlers[eventType];
      listenEvent(target, eventType, (event) => {
        event.stopPropagation();
        if (__DEV__) logRequest(event as any);
        if (peek($provider)) handler(event as any);
      });
    }
  });

  function onStartLoading(event: RE.MediaStartLoadingRequestEvent) {
    if ($media.canLoad) return;
    requests._queue._enqueue('load', event);
    handler.handle(createEvent($player, 'can-load'));
  }

  function onMuteRequest(event: RE.MediaMuteRequestEvent) {
    if ($media.muted) return;
    requests._queue._enqueue('volume', event);
    $provider()!.muted = true;
  }

  function onUnmuteRequest(event: RE.MediaUnmuteRequestEvent) {
    if (!$media.muted) return;
    requests._queue._enqueue('volume', event);
    $provider()!.muted = false;
    if ($media.volume === 0) {
      requests._queue._enqueue('volume', event);
      $provider()!.volume = 0.25;
    }
  }

  function onRateChangeRequest(event: RE.MediaRateChangeRequestEvent) {
    if ($media.playbackRate === event.detail) return;
    requests._queue._enqueue('rate', event);
    $provider()!.playbackRate = event.detail;
  }

  function onAudioTrackChangeRequest(event: RE.MediaAudioTrackChangeRequestEvent) {
    if (audioTracks.readonly) {
      if (__DEV__) {
        logger
          ?.warnGroup(`[vidstack] attempted to change audio track but it is currently read-only`)
          .labelledLog('Event', event)
          .dispatch();
      }

      return;
    }

    const index = event.detail,
      track = audioTracks.at(index);

    if (track) {
      requests._queue._enqueue('audioTrack', event);
      track.selected = true;
    }
  }

  function onQualityChangeRequest(event: RE.MediaQualityChangeRequestEvent) {
    if (qualities.readonly) {
      if (__DEV__) {
        logger
          ?.warnGroup(`[vidstack] attempted to change video quality but it is currently read-only`)
          .labelledLog('Event', event)
          .dispatch();
      }

      return;
    }

    requests._queue._enqueue('quality', event);

    const index = event.detail;
    if (index < 0) {
      qualities.autoSelect(event);
    } else {
      const quality = qualities.at(index);
      if (quality) quality.selected = true;
    }
  }

  async function onPlayRequest(event: RE.MediaPlayRequestEvent) {
    if (!$media.paused) return;
    try {
      requests._queue._enqueue('play', event);
      await $provider()!.play();
    } catch (e) {
      const errorEvent = createEvent($player, 'play-fail', { detail: coerceToError(e) });
      handler.handle(errorEvent);
    }
  }

  async function onPauseRequest(event: RE.MediaPauseRequestEvent) {
    if ($media.paused) return;
    try {
      requests._queue._enqueue('pause', event);
      await $provider()!.pause();
    } catch (e) {
      requests._queue._delete('pause');
      if (__DEV__) logger?.error('pause-fail', e);
    }
  }

  function onSeekingRequest(event: RE.MediaSeekingRequestEvent) {
    requests._queue._enqueue('seeking', event);
    $media.seeking = true;
    requests._$isSeeking.set(true);
  }

  function onSeekRequest(event: RE.MediaSeekRequestEvent) {
    if ($media.ended) requests._$isReplay.set(true);

    requests._$isSeeking.set(false);
    requests._queue._delete('seeking');

    const boundTime = Math.min(
      Math.max($media.seekableStart + 0.1, event.detail),
      $media.seekableEnd - 0.1,
    );

    if (!Number.isFinite(boundTime) || !$media.canSeek) return;

    requests._queue._enqueue('seeked', event);
    $provider()!.currentTime = boundTime;

    if ($media.live && event.isOriginTrusted && Math.abs($media.seekableEnd - boundTime) >= 2) {
      $media.userBehindLiveEdge = true;
    }
  }

  function onSeekToLiveEdgeRequest(event: RE.MediaLiveEdgeRequestEvent) {
    if (!$media.live || $media.liveEdge || !$media.canSeek) return;
    requests._queue._enqueue('seeked', event);
    try {
      seekToLiveEdge();
    } catch (e) {
      if (__DEV__) logger?.error('seek to live edge fail', e);
    }
  }

  function onVolumeChangeRequest(event: RE.MediaVolumeChangeRequestEvent) {
    const volume = event.detail;
    if ($media.volume === volume) return;
    requests._queue._enqueue('volume', event);
    $provider()!.volume = volume;
    if (volume > 0 && $media.muted) {
      requests._queue._enqueue('volume', event);
      $provider()!.muted = false;
    }
  }

  async function onEnterFullscreenRequest(event: RE.MediaEnterFullscreenRequestEvent) {
    try {
      requests._queue._enqueue('fullscreen', event);
      await enterFullscreen(event.detail);
    } catch (error) {
      onFullscreenError(error);
    }
  }

  async function onExitFullscreenRequest(event: RE.MediaExitFullscreenRequestEvent) {
    try {
      requests._queue._enqueue('fullscreen', event);
      await exitFullscreen(event.detail);
    } catch (error) {
      onFullscreenError(error);
    }
  }

  function onFullscreenError(error: unknown) {
    handler.handle(createEvent($player, 'fullscreen-error', { detail: coerceToError(error) }));
  }

  async function onEnterPictureInPictureRequest(event: RE.MediaEnterPIPRequestEvent) {
    try {
      requests._queue._enqueue('pip', event);
      await enterPictureInPicture();
    } catch (error) {
      onPictureInPictureError(error);
    }
  }

  async function onExitPictureInPictureRequest(event: RE.MediaExitPIPRequestEvent) {
    try {
      requests._queue._enqueue('pip', event);
      await exitPictureInPicture();
    } catch (error) {
      onPictureInPictureError(error);
    }
  }

  function onPictureInPictureError(error: unknown) {
    handler.handle(
      createEvent($player, 'picture-in-picture-error', {
        detail: coerceToError(error),
      }),
    );
  }

  function onResumeIdlingRequest(event: RE.MediaResumeUserIdleRequestEvent) {
    requests._queue._enqueue('userIdle', event);
    user.idle.paused = false;
  }

  function onPauseIdlingRequest(event: RE.MediaPauseUserIdleRequestEvent) {
    requests._queue._enqueue('userIdle', event);
    user.idle.paused = true;
  }

  function onShowPosterRequest(event: RE.MediaShowPosterRequestEvent) {
    $media.canLoadPoster = true;
  }

  function onHidePosterRequest(event: RE.MediaHidePosterRequestEvent) {
    $media.canLoadPoster = false;
  }

  function onLoopRequest(event: RE.MediaLoopRequestEvent) {
    window.requestAnimationFrame(async () => {
      try {
        requests._$isLooping.set(true);
        requests._$isReplay.set(true);
        await play();
      } catch (e) {
        requests._$isLooping.set(false);
        requests._$isReplay.set(false);
      }
    });
  }

  function throwIfFullscreenNotSupported(
    target: RE.MediaFullscreenRequestTarget,
    fullscreen?: FullscreenAdapter,
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
      const provider = peek($provider);
      throwIfNotReadyForPlayback(provider, $player);
      if (peek(() => $media.ended)) provider!.currentTime = $media.seekableStart + 0.1;
      return provider!.play();
    } catch (error) {
      const errorEvent = createEvent($player, 'play-fail', { detail: coerceToError(error) });
      errorEvent.autoplay = $media.attemptingAutoplay;
      handler.handle(errorEvent);
      throw error;
    }
  }

  async function pause() {
    if ($media.paused) return;
    const provider = peek($provider);
    throwIfNotReadyForPlayback(provider, $player);
    return provider!.pause();
  }

  let wasPictureInPictureActive = false;
  async function enterFullscreen(target: RE.MediaFullscreenRequestTarget = 'prefer-media') {
    const provider = peek($provider),
      adapter =
        (target === 'prefer-media' && fullscreen.supported) || target === 'media'
          ? fullscreen
          : provider?.fullscreen;

    throwIfFullscreenNotSupported(target, adapter);
    if (adapter!.active) return;

    if ($media.pictureInPicture) {
      wasPictureInPictureActive = true;
      await exitPictureInPicture();
    }

    const lockType = peek($props.$fullscreenOrientation);
    if (orientation.supported && !isUndefined(lockType)) await orientation.lock(lockType);

    return adapter!.enter();
  }

  async function exitFullscreen(target: RE.MediaFullscreenRequestTarget = 'prefer-media') {
    const provider = peek($provider),
      adapter =
        (target === 'prefer-media' && fullscreen.supported) || target === 'media'
          ? fullscreen
          : provider?.fullscreen;

    throwIfFullscreenNotSupported(target, adapter);
    if (!adapter!.active) return;

    if (orientation.locked) await orientation.unlock();

    try {
      const result = await adapter!.exit();

      if (wasPictureInPictureActive && $media.canPictureInPicture) {
        await enterPictureInPicture();
      }

      return result;
    } finally {
      wasPictureInPictureActive = false;
    }
  }

  function throwIfPictureInPictureNotSupported() {
    if ($media.canPictureInPicture) return;
    throw Error(
      __DEV__
        ? `[vidstack] picture-in-picture is not currently available`
        : '[vidstack] no pip support',
    );
  }

  async function enterPictureInPicture() {
    throwIfPictureInPictureNotSupported();
    if ($media.pictureInPicture) return;
    return await $provider()!.pictureInPicture!.enter();
  }

  async function exitPictureInPicture() {
    throwIfPictureInPictureNotSupported();
    if (!$media.pictureInPicture) return;
    return await $provider()!.pictureInPicture!.exit();
  }

  function seekToLiveEdge() {
    $media.userBehindLiveEdge = false;
    if (peek(() => !$media.live || $media.liveEdge || !$media.canSeek)) return;
    const provider = peek($provider);
    throwIfNotReadyForPlayback(provider, $player);
    provider!.currentTime = $media.liveSyncPosition ?? $media.seekableEnd - 2;
  }

  return {
    _user: user,
    _orientation: orientation,
    _play: play,
    _pause: pause,
    _enterFullscreen: enterFullscreen,
    _exitFullscreen: exitFullscreen,
    _enterPictureInPicture: enterPictureInPicture,
    _exitPictureInPicture: exitPictureInPicture,
    _seekToLiveEdge: seekToLiveEdge,
  };
}

function throwIfNotReadyForPlayback(
  provider: MediaProvider | null,
  $player: ReadSignal<MediaPlayerElement | null>,
) {
  if (provider && peek(() => $player()?.state.canPlay)) return;
  throw Error(
    __DEV__
      ? `[vidstack] media is not ready - wait for \`can-play\` event.`
      : '[vidstack] media not ready',
  );
}

export class MediaRequestContext {
  _queue = new Queue<MediaRequestQueueRecord>();
  _$isSeeking = signal(false);
  _$isLooping = signal(false);
  _$isReplay = signal(false);
}

export interface MediaRequestQueueRecord {
  audioTrack: RE.MediaAudioTrackChangeRequestEvent;
  load: RE.MediaStartLoadingRequestEvent;
  play: RE.MediaPlayRequestEvent;
  pause: RE.MediaPauseRequestEvent;
  rate: RE.MediaRateChangeRequestEvent;
  volume: RE.MediaVolumeChangeRequestEvent | RE.MediaMuteRequestEvent | RE.MediaUnmuteRequestEvent;
  fullscreen: RE.MediaEnterFullscreenRequestEvent | RE.MediaExitFullscreenRequestEvent;
  seeked: RE.MediaSeekRequestEvent | RE.MediaLiveEdgeRequestEvent;
  seeking: RE.MediaSeekingRequestEvent;
  quality: RE.MediaQualityChangeRequestEvent;
  pip: RE.MediaEnterPIPRequestEvent | RE.MediaExitPIPRequestEvent;
  userIdle: RE.MediaResumeUserIdleRequestEvent | RE.MediaPauseUserIdleRequestEvent;
}

export interface MediaRequestManager {
  _user: MediaUser;
  _orientation: ScreenOrientationAdapter;
  _play(): Promise<void>;
  _pause(): Promise<void>;
  _seekToLiveEdge(): void;
  _enterFullscreen(target?: RE.MediaFullscreenRequestTarget): Promise<void>;
  _exitFullscreen(target?: RE.MediaFullscreenRequestTarget): Promise<void>;
  _enterPictureInPicture(): Promise<PictureInPictureWindow | void>;
  _exitPictureInPicture(): Promise<void>;
}
