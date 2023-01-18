import debounce from 'just-debounce-it';
import throttle from 'just-throttle';
import { computed, effect, ReadSignal, useContext } from 'maverick.js';
import { onAttach } from 'maverick.js/element';
import {
  appendTriggerEvent,
  dispatchEvent,
  DOMEvent,
  listenEvent,
  useDisposalBin,
} from 'maverick.js/std';

import type {
  FullscreenChangeEvent,
  FullscreenErrorEvent,
  FullscreenEventTarget,
} from '../../../foundation/fullscreen/events';
import type * as ME from '../events';
import type { MediaProviderElement } from '../provider/types';
import { MediaProviderContext } from '../provider/use-media-provider';
import { MediaStore, softResetMediaStore, useInternalMediaStore } from '../store';
import type { MediaRequestQueueRecord, UseMediaRequestManager } from './use-media-request-manager';

/**
 * This hook is responsible for listening to and normalizing media events, updating the media
 * state context, and satisfying media requests if a manager arg is provided.
 */
export function useMediaStateManager(
  $target: ReadSignal<FullscreenEventTarget | null>,
  requestManager?: UseMediaRequestManager,
) {
  const $media = useInternalMediaStore()!,
    $mediaProvider = useContext(MediaProviderContext),
    disposal = useDisposalBin(),
    requestQueue = requestManager?.requestQueue,
    trackedEvents = new Map<string, ME.MediaEvent>();

  let provider: MediaProviderElement | null = null,
    skipInitialSrcChange = true,
    attachedCanLoadListeners = false,
    attachedLoadStartListeners = false,
    attachedCanPlayListeners = false,
    fireWaitingEvent: { (): void; cancel(): void },
    firingWaiting = false,
    connected = false,
    lastWaitingEvent: Event | undefined,
    $connectedMediaProvider = computed(() => ($target() ? $mediaProvider() : null));

  onAttach(() => {
    $target()?.setAttribute('aria-busy', 'true');
  });

  effect(() => {
    const target = $target();
    // target may be media controller which can also fullscreen.
    if (target && target !== provider) {
      listenEvent(target, 'fullscreen-change', onFullscreenChange);
      listenEvent(target, 'fullscreen-error', onFullscreenError);
    }
  });

  effect(() => {
    provider = $connectedMediaProvider();

    if (provider) {
      listenEvent(provider, 'view-type-change', onViewTypeChange);
      listenEvent(provider, 'can-load', trackEvent(onCanLoad));
      listenEvent(provider, 'sources-change', trackEvent(onSourcesChange));
      listenEvent(provider, 'source-change', trackEvent(onSourceChange));
      connected = true;
    } else if (connected) {
      resetTracking();
      softResetMediaStore($media);
      disposal.empty();
      requestQueue?.reset();
      skipInitialSrcChange = true;
      attachedCanLoadListeners = false;
      attachedLoadStartListeners = false;
      attachedCanPlayListeners = false;
      $media.viewType = 'unknown';
      connected = false;
    }
  });

  function resetTracking() {
    stopWaiting();
    requestManager?.$isReplay.set(false);
    requestManager?.$isLooping.set(false);
    firingWaiting = false;
    lastWaitingEvent = undefined;
    trackedEvents.clear();
  }

  // Keep track of dispatched media events so we can use them to build event chains.
  function trackEvent<T extends (event: ME.MediaEvent<any>) => void>(callback: T): T {
    return ((event) => {
      trackedEvents.set(event.type, event);
      callback(event);
    }) as T;
  }

  function attachCanLoadEventListeners() {
    if (attachedCanLoadListeners) return;
    disposal.add(
      listenEvent(provider!, 'media-type-change', onMediaTypeChange),
      listenEvent(provider!, 'load-start', trackEvent(onLoadStart)),
      listenEvent(provider!, 'abort', trackEvent(onAbort)),
      listenEvent(provider!, 'error', trackEvent(onError)),
    );
    attachedCanLoadListeners = true;
  }

  function onMediaTypeChange(event: ME.MediaTypeChangeEvent) {
    appendTriggerEvent(event, trackedEvents.get('source-change'));
    $media.mediaType = event.detail;
    $media.live = event.detail.includes('live');
  }

  function onViewTypeChange(event: ME.MediaViewTypeChangeEvent) {
    $media.viewType = event.detail;
  }

  function onCanLoad(event: ME.MediaCanLoadEvent) {
    $media.canLoad = true;
    attachCanLoadEventListeners();
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

  function attachLoadStartEventListeners() {
    if (attachedLoadStartListeners) return;
    disposal.add(
      listenEvent(provider!, 'loaded-metadata', trackEvent(onLoadedMetadata)),
      listenEvent(provider!, 'loaded-data', trackEvent(onLoadedData)),
      listenEvent(provider!, 'can-play', trackEvent(onCanPlay)),
      listenEvent(provider!, 'can-play-through', onCanPlayThrough),
      listenEvent(provider!, 'duration-change', onDurationChange),
      listenEvent(provider!, 'progress', (e) => onProgress($media, e)),
    );
    attachedLoadStartListeners = true;
  }

  function onAbort(event: ME.MediaAbortEvent) {
    appendTriggerEvent(event, trackedEvents.get('source-change'));
    appendTriggerEvent(event, trackedEvents.get('can-load'));
  }

  function onLoadStart(event: ME.MediaLoadStartEvent) {
    attachLoadStartEventListeners();
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

  function attachCanPlayListeners() {
    if (attachedCanPlayListeners) return;
    disposal.add(
      listenEvent(provider!, 'autoplay', trackEvent(onAutoplay)),
      listenEvent(provider!, 'autoplay-fail', trackEvent(onAutoplayFail)),
      listenEvent(provider!, 'pause', trackEvent(onPause)),
      listenEvent(provider!, 'play', trackEvent(onPlay)),
      listenEvent(provider!, 'play-fail', trackEvent(onPlayFail)),
      listenEvent(provider!, 'playing', trackEvent(onPlaying)),
      listenEvent(provider!, 'duration-change', onDurationChange),
      listenEvent(provider!, 'time-update', onTimeUpdate),
      listenEvent(provider!, 'volume-change', onVolumeChange),
      listenEvent(provider!, 'seeking', throttle(trackEvent(onSeeking), 150, { leading: true })),
      listenEvent(provider!, 'seeked', trackEvent(onSeeked)),
      listenEvent(provider!, 'waiting', onWaiting),
      listenEvent(provider!, 'ended', onEnded),
    );
    attachedCanPlayListeners = true;
  }

  function onCanPlay(event: ME.MediaCanPlayEvent) {
    attachCanPlayListeners();

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
    if (requestManager?.$isLooping() || !$media.paused) {
      event.stopImmediatePropagation();
      return;
    }

    appendTriggerEvent(event, trackedEvents.get('waiting'));
    satisfyMediaRequest('play', event);

    $media.paused = false;
    $media.autoplayError = undefined;

    if ($media.ended || requestManager?.$isReplay()) {
      requestManager?.$isReplay.set(false);
      $media.ended = false;
      dispatchEvent(provider, 'replay', { trigger: event });
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

    if (requestManager?.$isLooping()) {
      event.stopImmediatePropagation();
      requestManager.$isLooping.set(false);
      return;
    }

    onStarted(event);
  }

  function onStarted(event: Event) {
    if (!$media.started) {
      $media.started = true;
      dispatchEvent(provider, 'started', { trigger: event });
    }
  }

  function onPause(event: ME.MediaPauseEvent) {
    if (requestManager?.$isLooping()) {
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
    if (requestManager?.$isSeekingRequest()) {
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

    const event = new DOMEvent('waiting', {
      trigger: lastWaitingEvent,
    }) as ME.MediaWaitingEvent;

    trackedEvents.set('waiting', event);

    $media.waiting = true;
    $media.playing = false;

    provider?.dispatchEvent(event);
    lastWaitingEvent = undefined;
    firingWaiting = false;
  }, 300);

  function onWaiting(event: ME.MediaWaitingEvent) {
    if (firingWaiting || requestManager?.$isSeekingRequest()) return;
    event.stopImmediatePropagation();
    lastWaitingEvent = event;
    fireWaitingEvent();
  }

  function onEnded(event: ME.MediaEndedEvent) {
    if (requestManager?.$isLooping()) {
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

  function onFullscreenChange(event: FullscreenChangeEvent) {
    $media.fullscreen = event.detail;

    // @ts-expect-error - not a media event.
    satisfyMediaRequest('fullscreen', event);

    // Forward event on media provider for any listeners.
    if (event.target !== provider) {
      dispatchEvent(provider, 'fullscreen-change', {
        detail: event.detail,
        trigger: event,
      });
    }
  }

  function onFullscreenError(event: FullscreenErrorEvent) {
    // @ts-expect-error - not a media event.
    satisfyMediaRequest('fullscreen', event);

    // Forward event on media provider for any listeners.
    if (event.target !== provider) {
      dispatchEvent(provider, 'fullscreen-error', {
        detail: event.detail,
        trigger: event,
      });
    }
  }

  function satisfyMediaRequest<T extends keyof MediaRequestQueueRecord>(
    request: T,
    event: ME.MediaEvent,
  ) {
    requestQueue?.serve(request, (requestEvent) => {
      event.request = requestEvent;
      appendTriggerEvent(event, requestEvent);
    });
  }

  return { $mediaProvider };
}

function onProgress($media: MediaStore, event: ME.MediaProgressEvent) {
  const { buffered, seekable } = event.detail;
  $media.buffered = buffered;
  $media.seekable = seekable;
}
