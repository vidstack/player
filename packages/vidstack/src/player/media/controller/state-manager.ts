import debounce from 'just-debounce-it';
import throttle from 'just-throttle';
import { effect } from 'maverick.js';
import { onAttach } from 'maverick.js/element';
import {
  appendTriggerEvent,
  createEvent,
  dispatchEvent,
  listenEvent,
  noop,
  useDisposalBin,
} from 'maverick.js/std';

import { LIST_RESET } from '../../../foundation/list/symbols';
import type { MediaContext } from '../context';
import type * as ME from '../events';
import { softResetMediaStore } from '../store';
import type { MediaRequestContext, MediaRequestQueueRecord } from './request-manager';

const trackedEventType = new Set<keyof ME.MediaEvents>([
  'autoplay',
  'autoplay-fail',
  'can-load',
  'sources-change',
  'source-change',
  'load-start',
  'abort',
  'error',
  'loaded-metadata',
  'loaded-data',
  'can-play',
  'play',
  'play-fail',
  'pause',
  'playing',
  'seeking',
  'seeked',
  'waiting',
]);

/**
 * This hook is responsible for listening to and normalizing media events, updating the media
 * state context, and satisfying media requests if a manager arg is provided.
 */
export function createMediaStateManager(
  { $player, $loader, $provider, $store: $media, qualities, audioTracks, logger }: MediaContext,
  requests: MediaRequestContext,
): MediaStateManager {
  if (__SERVER__) return { handle: noop };

  const disposal = useDisposalBin(),
    trackedEvents = new Map<string, ME.MediaEvent>();

  let skipInitialSrcChange = true,
    fireWaitingEvent: { (): void; cancel(): void },
    firingWaiting = false,
    lastWaitingEvent: Event | undefined;

  onAttach(() => {
    $player()?.setAttribute('aria-busy', 'true');
  });

  effect(() => {
    const target = $player();
    if (!target) return;
    addQualityListeners();
    addAudioTrackListeners();
    listenEvent(target, 'fullscreen-change', onFullscreenChange);
    listenEvent(target, 'fullscreen-error', onFullscreenError);
  });

  effect(() => {
    if ($provider()) return;
    qualities[LIST_RESET]();
    audioTracks[LIST_RESET]();
    resetTracking();
    softResetMediaStore($media);
    disposal.empty();
    requests._queue._reset();
    skipInitialSrcChange = true;
  });

  function addAudioTrackListeners() {
    listenEvent(audioTracks, 'add' as any, onAudioTracksChange);
    listenEvent(audioTracks, 'remove' as any, onAudioTracksChange);
    listenEvent(audioTracks, 'change' as any, onAudioTrackChange);
  }

  function addQualityListeners() {
    listenEvent(qualities, 'add' as any, onQualitiesChange);
    listenEvent(qualities, 'remove' as any, onQualitiesChange);
    listenEvent(qualities, 'change' as any, onQualityChange);
    listenEvent(qualities, 'auto-change' as any, onAutoQualityChange);
    listenEvent(qualities, 'readonly-change' as any, onCanSetQualityChange);
  }

  type EventHandlers = {
    [Type in keyof ME.MediaEvents]: (event: ME.MediaEvents[Type]) => void;
  };

  const eventHandlers: Partial<EventHandlers> = {
    'provider-loader-change': onProviderLoaderChange,
    'provider-change': onProviderChange,
    autoplay: onAutoplay,
    'autoplay-fail': onAutoplayFail,
    'can-load': onCanLoad,
    'can-play-through': onCanPlayThrough,
    'can-play': onCanPlay,
    'duration-change': onDurationChange,
    'load-start': onLoadStart,
    'loaded-data': onLoadedData,
    'loaded-metadata': onLoadedMetadata,
    'media-type-change': onMediaTypeChange,
    'stream-type-change': onStreamTypeChange,
    'play-fail': onPlayFail,
    'rate-change': onRateChange,
    'source-change': onSourceChange,
    'sources-change': onSourcesChange,
    'time-update': onTimeUpdate,
    'volume-change': onVolumeChange,
    'fullscreen-change': onFullscreenChange,
    'fullscreen-error': onFullscreenError,
    'picture-in-picture-change': onPictureInPictureChange,
    'picture-in-picture-error': onPictureInPictureError,
    abort: onAbort,
    ended: onEnded,
    error: onError,
    pause: onPause,
    play: onPlay,
    playing: onPlaying,
    progress: onProgress,
    seeked: onSeeked,
    seeking: throttle(onSeeking, 150, { leading: true }),
    waiting: onWaiting,
  };

  function resetTracking() {
    stopWaiting();
    requests._$isReplay.set(false);
    requests._$isLooping.set(false);
    firingWaiting = false;
    lastWaitingEvent = undefined;
    trackedEvents.clear();
  }

  function onProviderLoaderChange(event: ME.MediaProviderLoaderChangeEvent) {
    $loader.set(event.detail);
  }

  function onProviderChange(event: ME.MediaProviderChangeEvent) {
    $provider.set(event.detail);
  }

  function onMediaTypeChange(event: ME.MediaTypeChangeEvent) {
    appendTriggerEvent(event, trackedEvents.get('source-change'));
    const viewType = $media.viewType;
    $media.mediaType = event.detail;
    if (viewType !== $media.viewType) {
      setTimeout(
        () =>
          $player()?.dispatchEvent(
            createEvent($player, 'view-type-change', {
              detail: $media.viewType,
              trigger: event,
            }),
          ),
        0,
      );
    }
  }

  function onStreamTypeChange(event: ME.MediaStreamTypeChangeEvent) {
    appendTriggerEvent(event, trackedEvents.get('source-change'));
    $media.inferredStreamType = event.detail;
    (event as any).detail = $media.streamType;
  }

  function onCanLoad(event: ME.MediaCanLoadEvent) {
    $media.canLoad = true;
    trackedEvents.set('can-load', event);
    satisfyMediaRequest('load', event);
  }

  function onRateChange(event: ME.MediaRateChangeEvent) {
    $media.playbackRate = event.detail;
    satisfyMediaRequest('rate', event);
  }

  function onAudioTracksChange(event) {
    $media.audioTracks = audioTracks.toArray();
    dispatchEvent($player(), 'audio-tracks-change', {
      detail: $media.audioTracks,
      trigger: event,
    });
  }

  function onAudioTrackChange(event) {
    $media.audioTrack = audioTracks.selected;
    satisfyMediaRequest('audioTrack', event);
    dispatchEvent($player(), 'audio-track-change', {
      detail: $media.audioTrack,
      trigger: event,
    });
  }

  function onQualitiesChange(event) {
    $media.qualities = qualities.toArray();
    dispatchEvent($player(), 'qualities-change', {
      detail: $media.qualities,
      trigger: event,
    });
  }

  function onQualityChange(event) {
    $media.quality = qualities.selected;
    satisfyMediaRequest('quality', event);
    dispatchEvent($player(), 'quality-change', {
      detail: $media.quality,
      trigger: event,
    });
  }

  function onAutoQualityChange() {
    $media.autoQuality = qualities.auto;
  }

  function onCanSetQualityChange() {
    $media.canSetQuality = !qualities.readonly;
  }

  function onSourcesChange(event: ME.MediaSourcesChangeEvent) {
    $media.sources = event.detail;
  }

  function onSourceChange(event: ME.MediaSourceChangeEvent) {
    appendTriggerEvent(event, trackedEvents.get('sources-change'));

    $media.source = event.detail;
    $player()?.setAttribute('aria-busy', 'true');

    if (__DEV__) {
      logger?.infoGroup('📼 Media source change').labelledLog('Source', event.detail).dispatch();
    }

    // Skip resets before first playback to ensure initial properties and tracked events are kept.
    if (skipInitialSrcChange) {
      skipInitialSrcChange = false;
      return;
    }

    qualities[LIST_RESET](event);
    audioTracks[LIST_RESET](event);
    resetTracking();
    softResetMediaStore($media);
    trackedEvents.set(event.type, event);
  }

  function onAbort(event: ME.MediaAbortEvent) {
    appendTriggerEvent(event, trackedEvents.get('source-change'));
    appendTriggerEvent(event, trackedEvents.get('can-load'));
  }

  function onLoadStart(event: ME.MediaLoadStartEvent) {
    appendTriggerEvent(event, trackedEvents.get('source-change'));
  }

  function onError(event: ME.MediaErrorEvent) {
    $media.error = event.detail;
    appendTriggerEvent(event, trackedEvents.get('abort'));
  }

  function onLoadedMetadata(event: ME.MediaLoadedMetadataEvent) {
    appendTriggerEvent(event, trackedEvents.get('load-start'));
  }

  function onLoadedData(event: ME.MediaLoadedDataEvent) {
    appendTriggerEvent(event, trackedEvents.get('load-start'));
  }

  function onCanPlay(event: ME.MediaCanPlayEvent) {
    // Avoid infinite chain - `hls.js` will not fire `canplay` event.
    if (event.trigger?.type !== 'loadedmetadata') {
      appendTriggerEvent(event, trackedEvents.get('loaded-metadata'));
    }

    onCanPlayDetail(event.detail);
    $player()?.setAttribute('aria-busy', 'false');
  }

  function onCanPlayThrough(event: ME.MediaCanPlayThroughEvent) {
    onCanPlayDetail(event.detail);
    appendTriggerEvent(event, trackedEvents.get('can-play'));
  }

  function onCanPlayDetail({ buffered, seekable }: ME.MediaCanPlayDetail) {
    $media.seekable = seekable;
    $media.buffered = buffered;
    $media.duration = $media.seekableEnd;
    $media.canPlay = true;
  }

  function onDurationChange(event: ME.MediaDurationChangeEvent) {
    const duration = event.detail;
    if (!$media.live) $media.duration = !Number.isNaN(duration) ? duration : 0;
  }

  function onProgress(event: ME.MediaProgressEvent) {
    const { buffered, seekable } = event.detail;

    $media.buffered = buffered;
    $media.seekable = seekable;

    if ($media.live) {
      $media.duration = $media.seekableEnd;
      dispatchEvent($player(), 'duration-change', {
        detail: $media.seekableEnd,
        trigger: event,
      });
    }
  }

  function onAutoplay(event: ME.MediaAutoplayEvent) {
    appendTriggerEvent(event, trackedEvents.get('play'));
    appendTriggerEvent(event, trackedEvents.get('can-play'));
    $media.autoplayError = undefined;
  }

  function onAutoplayFail(event: ME.MediaAutoplayFailEvent) {
    appendTriggerEvent(event, trackedEvents.get('play-fail'));
    appendTriggerEvent(event, trackedEvents.get('can-play'));
    $media.autoplayError = event.detail;
    resetTracking();
  }

  function onPlay(event: ME.MediaPlayEvent) {
    event.autoplay = $media.attemptingAutoplay;

    if (requests._$isLooping() || !$media.paused) {
      event.stopImmediatePropagation();
      return;
    }

    appendTriggerEvent(event, trackedEvents.get('waiting'));
    satisfyMediaRequest('play', event);

    $media.paused = false;
    $media.autoplayError = undefined;

    if ($media.ended || requests._$isReplay()) {
      requests._$isReplay.set(false);
      $media.ended = false;
      handleMediaEvent(createEvent($player, 'replay', { trigger: event }));
    }
  }

  function onPlayFail(event: ME.MediaPlayFailEvent) {
    appendTriggerEvent(event, trackedEvents.get('play'));
    satisfyMediaRequest('play', event);

    $media.paused = true;
    $media.playing = false;

    resetTracking();
  }

  function onPlaying(event: ME.MediaPlayingEvent) {
    const playEvent = trackedEvents.get('play');

    if (playEvent) {
      appendTriggerEvent(event, trackedEvents.get('waiting'));
      appendTriggerEvent(event, playEvent);
    } else {
      appendTriggerEvent(event, trackedEvents.get('seeked'));
    }

    setTimeout(() => resetTracking(), 0);

    $media.paused = false;
    $media.playing = true;
    $media.seeking = false;
    $media.ended = false;

    if (requests._$isLooping()) {
      event.stopImmediatePropagation();
      requests._$isLooping.set(false);
      return;
    }

    onStarted(event);
  }

  function onStarted(event: Event) {
    if (!$media.started) {
      if ($media.live) {
        const end = $media.liveSyncPosition ?? $media.seekableEnd - 2;
        if (Number.isFinite(end)) $provider()!.currentTime = end;
      }

      $media.started = true;
      handleMediaEvent(createEvent($player, 'started', { trigger: event }));
    }
  }

  function onPause(event: ME.MediaPauseEvent) {
    if (requests._$isLooping()) {
      event.stopImmediatePropagation();
      return;
    }

    appendTriggerEvent(event, trackedEvents.get('seeked'));
    satisfyMediaRequest('pause', event);

    $media.paused = true;
    $media.playing = false;
    $media.seeking = false;

    resetTracking();
  }

  function onTimeUpdate(event: ME.MediaTimeUpdateEvent) {
    const { currentTime, played } = event.detail;
    $media.currentTime = currentTime;
    $media.played = played;
    $media.waiting = false;
  }

  function onVolumeChange(event: ME.MediaVolumeChangeEvent) {
    $media.volume = event.detail.volume;
    $media.muted = event.detail.muted || event.detail.volume === 0;
    satisfyMediaRequest('volume', event);
  }

  function onSeeking(event: ME.MediaSeekingEvent) {
    $media.seeking = true;
    $media.currentTime = event.detail;
    satisfyMediaRequest('seeking', event);
  }

  function onSeeked(event: ME.MediaSeekedEvent) {
    if (requests._$isSeeking()) {
      $media.seeking = true;
      event.stopImmediatePropagation();
    } else if ($media.seeking) {
      appendTriggerEvent(event, trackedEvents.get('waiting'));
      appendTriggerEvent(event, trackedEvents.get('seeking'));
      if ($media.paused) stopWaiting();
      $media.seeking = false;
      if (event.detail !== $media.duration) $media.ended = false;
      $media.currentTime = event.detail;
      satisfyMediaRequest('seeked', event);
      // Only start if user initiated.
      const origin = event.originEvent;
      if (origin && origin.isTrusted && !/seek/.test(origin.type)) {
        onStarted(event);
      }
    }
  }

  fireWaitingEvent = debounce(() => {
    if (!lastWaitingEvent) return;
    firingWaiting = true;
    $media.waiting = true;
    $media.playing = false;
    const event = createEvent($player, 'waiting', { trigger: lastWaitingEvent });
    trackedEvents.set('waiting', event);
    $player()?.dispatchEvent(event);
    lastWaitingEvent = undefined;
    firingWaiting = false;
  }, 300);

  function onWaiting(event: ME.MediaWaitingEvent) {
    if (firingWaiting || requests._$isSeeking()) return;
    event.stopImmediatePropagation();
    lastWaitingEvent = event;
    fireWaitingEvent();
  }

  function onEnded(event: ME.MediaEndedEvent) {
    if (requests._$isLooping()) {
      event.stopImmediatePropagation();
      return;
    }

    $media.paused = true;
    $media.playing = false;
    $media.seeking = false;
    $media.ended = true;

    resetTracking();
  }

  function stopWaiting() {
    fireWaitingEvent?.cancel();
    $media.waiting = false;
  }

  function onFullscreenChange(event: ME.MediaFullscreenChangeEvent) {
    $media.fullscreen = event.detail;
    satisfyMediaRequest('fullscreen', event);
  }

  function onFullscreenError(event: ME.MediaFullscreenErrorEvent) {
    satisfyMediaRequest('fullscreen', event);
  }

  function onPictureInPictureChange(event: ME.MediaPIPChangeEvent) {
    $media.pictureInPicture = event.detail;
    satisfyMediaRequest('pip', event);
  }

  function onPictureInPictureError(event: ME.MediaPIPErrorEvent) {
    satisfyMediaRequest('pip', event);
  }

  function satisfyMediaRequest<T extends keyof MediaRequestQueueRecord>(
    request: T,
    event: ME.MediaEvent,
  ) {
    requests._queue._serve(request, (requestEvent) => {
      event.request = requestEvent;
      appendTriggerEvent(event, requestEvent);
    });
  }

  function handleMediaEvent(event: Event) {
    eventHandlers[event.type]?.(event);

    if (trackedEventType.has(event.type as keyof ME.MediaEvents)) {
      trackedEvents.set(event.type, event as ME.MediaEvent);
    }

    $player()?.dispatchEvent(event);
  }

  return { handle: handleMediaEvent };
}

export interface MediaStateManager {
  handle(event: Event): void;
}
