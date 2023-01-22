import debounce from 'just-debounce-it';
import throttle from 'just-throttle';
import { effect, ReadSignal, useContext } from 'maverick.js';
import { onAttach } from 'maverick.js/element';
import { appendTriggerEvent, createEvent, listenEvent, useDisposalBin } from 'maverick.js/std';

import type * as ME from '../../events';
import type { MediaProviderElement } from '../../provider/types';
import { mediaProviderContext } from '../../provider/use-media-provider';
import { MediaStore, softResetMediaStore } from '../../store';
import type { MediaControllerElement } from './types';
import type { MediaRequestManagerInit, MediaRequestQueueRecord } from './use-media-request-manager';

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
export function useMediaStateManager(
  $target: ReadSignal<MediaControllerElement | null>,
  $media: MediaStore,
  { requestQueue, $isLooping, $isReplay, $isSeekingRequest }: MediaRequestManagerInit,
): MediaStateManager {
  const $mediaProvider = useContext(mediaProviderContext),
    disposal = useDisposalBin(),
    trackedEvents = new Map<string, ME.MediaEvent>();

  let skipInitialSrcChange = true,
    fireWaitingEvent: { (): void; cancel(): void },
    firingWaiting = false,
    lastWaitingEvent: Event | undefined;

  onAttach(() => {
    $target()?.setAttribute('aria-busy', 'true');
  });

  effect(() => {
    const target = $target();
    if (!target) return;
    listenEvent(target, 'fullscreen-change', onFullscreenChange);
    listenEvent(target, 'fullscreen-error', onFullscreenError);
  });

  effect(() => {
    if ($mediaProvider()) return;
    resetTracking();
    softResetMediaStore($media);
    disposal.empty();
    requestQueue.reset();
    skipInitialSrcChange = true;
  });

  const eventHandlers = {
    autoplay: onAutoplay,
    'autoplay-fail': onAutoplayFail,
    'can-load': onCanLoad,
    'can-play-through': onCanPlayThrough,
    'can-play': onCanPlay,
    'duration-change': onDurationChange,
    'load-start': onLoadStart,
    'loaded-data': onLoadedData,
    'loaded-metadata': onLoadedMetadata,
    'media-change': onMediaTypeChange,
    'play-fail': onPlayFail,
    'source-change': onSourceChange,
    'sources-change': onSourcesChange,
    'time-update': onTimeUpdate,
    'volume-change': onVolumeChange,
    'fullscreen-change': onFullscreenChange,
    'fullscreen-error': onFullscreenError,
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
    $isReplay.set(false);
    $isLooping.set(false);
    firingWaiting = false;
    lastWaitingEvent = undefined;
    trackedEvents.clear();
  }

  function onMediaTypeChange(event: ME.MediaChangeEvent) {
    appendTriggerEvent(event, trackedEvents.get('source-change'));
    $media.media = event.detail;
    $media.live = event.detail.includes('live');
  }

  function onCanLoad(event: ME.MediaCanLoadEvent) {
    $media.canLoad = true;
    trackedEvents.set('can-load', event);
    satisfyMediaRequest('load', event);
  }

  function onSourcesChange(event: ME.MediaSourcesChangeEvent) {
    $media.sources = event.detail;
  }

  function onSourceChange(event: ME.MediaSourceChangeEvent) {
    appendTriggerEvent(event, trackedEvents.get('sources-change'));

    $media.source = event.detail;
    $target()?.setAttribute('aria-busy', 'true');

    // Skip resets before first playback to ensure initial properties and track events are kept.
    if (skipInitialSrcChange) {
      skipInitialSrcChange = false;
      return;
    }

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

    $media.canPlay = true;
    $media.duration = event.detail.duration;
    $target()?.setAttribute('aria-busy', 'false');
  }

  function onCanPlayThrough(event: ME.MediaCanPlayThroughEvent) {
    $media.canPlay = true;
    $media.duration = event.detail.duration;
    appendTriggerEvent(event, trackedEvents.get('can-play'));
  }

  function onDurationChange(event: ME.MediaDurationChangeEvent) {
    const duration = event.detail;
    $media.duration = !isNaN(duration) ? duration : 0;
  }

  function onProgress(event: ME.MediaProgressEvent) {
    const { buffered, seekable } = event.detail;
    $media.buffered = buffered;
    $media.seekable = seekable;
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

    if ($isLooping() || !$media.paused) {
      event.stopImmediatePropagation();
      return;
    }

    appendTriggerEvent(event, trackedEvents.get('waiting'));
    satisfyMediaRequest('play', event);

    $media.paused = false;
    $media.autoplayError = undefined;

    if ($media.ended || $isReplay()) {
      $isReplay.set(false);
      $media.ended = false;
      handleMediaEvent(createEvent($target, 'replay', { trigger: event }));
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

    if ($isLooping()) {
      event.stopImmediatePropagation();
      $isLooping.set(false);
      return;
    }

    onStarted(event);
  }

  function onStarted(event: Event) {
    if (!$media.started) {
      $media.started = true;
      handleMediaEvent(createEvent($target, 'started', { trigger: event }));
    }
  }

  function onPause(event: ME.MediaPauseEvent) {
    if ($isLooping()) {
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
    if ($isSeekingRequest()) {
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
      onStarted(event);
    }
  }

  fireWaitingEvent = debounce(() => {
    if (!lastWaitingEvent) return;
    firingWaiting = true;
    $media.waiting = true;
    $media.playing = false;
    const event = createEvent($target, 'waiting', { trigger: lastWaitingEvent });
    trackedEvents.set('waiting', event);
    $target()?.dispatchEvent(event);
    lastWaitingEvent = undefined;
    firingWaiting = false;
  }, 300);

  function onWaiting(event: ME.MediaWaitingEvent) {
    if (firingWaiting || $isSeekingRequest()) return;
    event.stopImmediatePropagation();
    lastWaitingEvent = event;
    fireWaitingEvent();
  }

  function onEnded(event: ME.MediaEndedEvent) {
    if ($isLooping()) {
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

  function satisfyMediaRequest<T extends keyof MediaRequestQueueRecord>(
    request: T,
    event: ME.MediaEvent,
  ) {
    requestQueue.serve(request, (requestEvent) => {
      event.request = requestEvent;
      appendTriggerEvent(event, requestEvent);
    });
  }

  function handleMediaEvent(event: Event) {
    eventHandlers[event.type]?.(event);

    if (trackedEventType.has(event.type as keyof ME.MediaEvents)) {
      trackedEvents.set(event.type, event as ME.MediaEvent);
    }

    $target()?.dispatchEvent(event);
  }

  return {
    $mediaProvider,
    handleMediaEvent,
  };
}

export interface MediaStateManager {
  $mediaProvider: ReadSignal<MediaProviderElement | null>;
  handleMediaEvent(event: Event): void;
}
