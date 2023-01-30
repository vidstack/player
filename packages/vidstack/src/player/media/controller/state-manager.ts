import debounce from 'just-debounce-it';
import throttle from 'just-throttle';
import { effect } from 'maverick.js';
import { onAttach } from 'maverick.js/element';
import {
  appendTriggerEvent,
  createEvent,
  listenEvent,
  noop,
  useDisposalBin,
} from 'maverick.js/std';

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
  { $player, $provider, $store }: MediaContext,
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
    listenEvent(target, 'fullscreen-change', onFullscreenChange);
    listenEvent(target, 'fullscreen-error', onFullscreenError);
  });

  effect(() => {
    if ($provider()) return;
    resetTracking();
    softResetMediaStore($store);
    disposal.empty();
    requests._queue._reset();
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
    requests._$isReplay.set(false);
    requests._$isLooping.set(false);
    firingWaiting = false;
    lastWaitingEvent = undefined;
    trackedEvents.clear();
  }

  function onMediaTypeChange(event: ME.MediaChangeEvent) {
    appendTriggerEvent(event, trackedEvents.get('source-change'));
    $store.media = event.detail;
    $store.live = event.detail.includes('live');
  }

  function onCanLoad(event: ME.MediaCanLoadEvent) {
    $store.canLoad = true;
    trackedEvents.set('can-load', event);
    satisfyMediaRequest('load', event);
  }

  function onSourcesChange(event: ME.MediaSourcesChangeEvent) {
    $store.sources = event.detail;
  }

  function onSourceChange(event: ME.MediaSourceChangeEvent) {
    appendTriggerEvent(event, trackedEvents.get('sources-change'));

    $store.source = event.detail;
    $player()?.setAttribute('aria-busy', 'true');

    // Skip resets before first playback to ensure initial properties and track events are kept.
    if (skipInitialSrcChange) {
      skipInitialSrcChange = false;
      return;
    }

    resetTracking();
    softResetMediaStore($store);
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
    $store.error = event.detail;
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

    $store.canPlay = true;
    $store.duration = event.detail.duration;
    $player()?.setAttribute('aria-busy', 'false');
  }

  function onCanPlayThrough(event: ME.MediaCanPlayThroughEvent) {
    $store.canPlay = true;
    $store.duration = event.detail.duration;
    appendTriggerEvent(event, trackedEvents.get('can-play'));
  }

  function onDurationChange(event: ME.MediaDurationChangeEvent) {
    const duration = event.detail;
    $store.duration = !isNaN(duration) ? duration : 0;
  }

  function onProgress(event: ME.MediaProgressEvent) {
    const { buffered, seekable } = event.detail;
    $store.buffered = buffered;
    $store.seekable = seekable;
  }

  function onAutoplay(event: ME.MediaAutoplayEvent) {
    appendTriggerEvent(event, trackedEvents.get('play'));
    appendTriggerEvent(event, trackedEvents.get('can-play'));
    $store.autoplayError = undefined;
  }

  function onAutoplayFail(event: ME.MediaAutoplayFailEvent) {
    appendTriggerEvent(event, trackedEvents.get('play-fail'));
    appendTriggerEvent(event, trackedEvents.get('can-play'));
    $store.autoplayError = event.detail;
    resetTracking();
  }

  function onPlay(event: ME.MediaPlayEvent) {
    event.autoplay = $store.attemptingAutoplay;

    if (requests._$isLooping() || !$store.paused) {
      event.stopImmediatePropagation();
      return;
    }

    appendTriggerEvent(event, trackedEvents.get('waiting'));
    satisfyMediaRequest('play', event);

    $store.paused = false;
    $store.autoplayError = undefined;

    if ($store.ended || requests._$isReplay()) {
      requests._$isReplay.set(false);
      $store.ended = false;
      handleMediaEvent(createEvent($player, 'replay', { trigger: event }));
    }
  }

  function onPlayFail(event: ME.MediaPlayFailEvent) {
    appendTriggerEvent(event, trackedEvents.get('play'));
    satisfyMediaRequest('play', event);

    $store.paused = true;
    $store.playing = false;

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

    $store.paused = false;
    $store.playing = true;
    $store.seeking = false;
    $store.ended = false;

    if (requests._$isLooping()) {
      event.stopImmediatePropagation();
      requests._$isLooping.set(false);
      return;
    }

    onStarted(event);
  }

  function onStarted(event: Event) {
    if (!$store.started) {
      $store.started = true;
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

    $store.paused = true;
    $store.playing = false;
    $store.seeking = false;

    resetTracking();
  }

  function onTimeUpdate(event: ME.MediaTimeUpdateEvent) {
    const { currentTime, played } = event.detail;
    $store.currentTime = currentTime;
    $store.played = played;
    $store.waiting = false;
  }

  function onVolumeChange(event: ME.MediaVolumeChangeEvent) {
    $store.volume = event.detail.volume;
    $store.muted = event.detail.muted || event.detail.volume === 0;
    satisfyMediaRequest('volume', event);
  }

  function onSeeking(event: ME.MediaSeekingEvent) {
    $store.seeking = true;
    $store.currentTime = event.detail;
    satisfyMediaRequest('seeking', event);
  }

  function onSeeked(event: ME.MediaSeekedEvent) {
    if (requests._$isSeeking()) {
      $store.seeking = true;
      event.stopImmediatePropagation();
    } else if ($store.seeking) {
      appendTriggerEvent(event, trackedEvents.get('waiting'));
      appendTriggerEvent(event, trackedEvents.get('seeking'));
      if ($store.paused) stopWaiting();
      $store.seeking = false;
      if (event.detail !== $store.duration) $store.ended = false;
      $store.currentTime = event.detail;
      satisfyMediaRequest('seeked', event);
      onStarted(event);
    }
  }

  fireWaitingEvent = debounce(() => {
    if (!lastWaitingEvent) return;
    firingWaiting = true;
    $store.waiting = true;
    $store.playing = false;
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

    $store.paused = true;
    $store.playing = false;
    $store.seeking = false;
    $store.ended = true;

    resetTracking();
  }

  function stopWaiting() {
    fireWaitingEvent?.cancel();
    $store.waiting = false;
  }

  function onFullscreenChange(event: ME.MediaFullscreenChangeEvent) {
    $store.fullscreen = event.detail;
    satisfyMediaRequest('fullscreen', event);
  }

  function onFullscreenError(event: ME.MediaFullscreenErrorEvent) {
    satisfyMediaRequest('fullscreen', event);
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
