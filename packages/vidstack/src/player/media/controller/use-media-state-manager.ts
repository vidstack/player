import debounce from 'just-debounce-it';
import throttle from 'just-throttle';
import { effect, useContext } from 'maverick.js';
import { onAttach } from 'maverick.js/element';
import {
  appendTriggerEvent,
  createEvent,
  dispatchEvent,
  listenEvent,
  useDisposalBin,
  useHost,
} from 'maverick.js/std';

import type {
  FullscreenChangeEvent,
  FullscreenErrorEvent,
} from '../../../foundation/fullscreen/events';
import { connectedHostElement } from '../../../utils/host';
import type { MediaState } from '../context';
import type * as ME from '../events';
import type { MediaProvider } from '../provider/types';
import { MediaProviderContext } from '../provider/use-media-provider';
import { softResetMediaState, useInternalMediaState } from '../store';
import type { MediaRequestQueueRecord, UseMediaRequestManager } from './use-media-request-manager';

export function useMediaStateManager(requestManager?: UseMediaRequestManager) {
  /** Queue actions to be invoked after the provider has connected to the media controller. */
  const host = useHost(),
    $connectedHost = connectedHostElement(host),
    $media = useInternalMediaState()!,
    $mediaProvider = useContext(MediaProviderContext),
    disposal = useDisposalBin(),
    requestQueue = requestManager?.requestQueue,
    trackedEvents = new Map<string, ME.VdsMediaEvent>();

  let provider: MediaProvider | null = null;
  effect(() => {
    provider = $mediaProvider();
  });

  onAttach((host) => {
    host.setAttribute('aria-busy', 'true');
  });

  let skipInitialSrcChange = true,
    attachedCanLoadEvents = false,
    attachedLoadStartEvents = false,
    attachedCanPlayEvents = false,
    firingWaiting = false,
    lastWaitingEvent: Event | undefined;

  effect(() => {
    if ($connectedHost() && provider) {
      listenEvent(provider, 'vds-can-load', trackEvent(onCanLoad));
      listenEvent(provider, 'vds-src-change', trackEvent(onSrcChange));
      listenEvent(provider, 'vds-current-src-change', trackEvent(onCurrentSrcChange));
    } else {
      stopWaiting();
      resetTracking();
      disposal.empty();
      requestQueue?.reset();
      skipInitialSrcChange = true;
      attachedCanLoadEvents = false;
      attachedLoadStartEvents = false;
      attachedCanPlayEvents = false;
      $media.viewType = 'unknown';
      softResetMediaState($media);
    }
  });

  function resetTracking() {
    requestManager?.$isReplay.set(false);
    requestManager?.$isLooping.set(false);
    firingWaiting = false;
    lastWaitingEvent = undefined;
    trackedEvents.clear();
  }

  // Keep track of dispatched media events so we can use them to build event chains.
  function trackEvent<T extends (event: ME.VdsMediaEvent<any>) => void>(callback: T): T {
    return ((event) => {
      trackedEvents.set(event.type, event);
      callback(event);
    }) as T;
  }

  function onCanLoad(event: ME.MediaCanLoadEvent) {
    if (provider && !attachedCanLoadEvents) {
      disposal.add(
        listenEvent(provider, 'vds-load-start', trackEvent(onLoadStart)),
        listenEvent(provider, 'vds-error', trackEvent(onError)),
      );

      attachedCanLoadEvents = true;
    }

    $media.canLoad = true;
    satisfyMediaRequest('load', event);
  }

  function onSrcChange(event: ME.MediaSrcChangeEvent) {
    $media.src = event.detail;
  }

  function onCurrentSrcChange(event: ME.MediaCurrentSrcChangeEvent) {
    $media.currentSrc = event.detail;

    // Skip resets before first playback to ensure initial properties set make it to the provider.
    if (skipInitialSrcChange) {
      skipInitialSrcChange = false;
      return;
    }

    resetTracking();
    softResetMediaState($media);
    host.el!.setAttribute('aria-busy', 'true');
  }

  function onLoadStart(event: ME.MediaLoadStartEvent) {
    if (provider && !attachedLoadStartEvents) {
      disposal.add(
        listenEvent(provider, 'vds-loaded-metadata', trackEvent(onLoadedMetadata)),
        listenEvent(provider, 'vds-loaded-data', trackEvent(onLoadedData)),
        listenEvent(provider, 'vds-can-play', trackEvent(onCanPlay)),
        listenEvent(provider, 'vds-can-play-through', onCanPlayThrough),
        listenEvent(provider, 'vds-duration-change', onDurationChange),
      );

      attachedLoadStartEvents = true;
    }

    updateMediaMetadata($media, event.detail);
    appendTriggerEvent(event, trackedEvents.get('vds-current-src-change'));
    appendTriggerEvent(event, trackedEvents.get('vds-can-load'));
  }

  function onError(event: ME.MediaErrorEvent) {
    $media.error = event.detail;
  }

  function onLoadedMetadata(event: ME.MediaLoadedMetadataEvent) {
    updateMediaMetadata($media, event.detail);
    appendTriggerEvent(event, trackedEvents.get('vds-load-start'));
  }

  function onLoadedData(event: ME.MediaLoadedDataEvent) {
    appendTriggerEvent(event, trackedEvents.get('vds-load-start'));
  }

  function onCanPlay(event: ME.MediaCanPlayEvent) {
    if (provider && !attachedCanPlayEvents) {
      disposal.add(
        listenEvent(provider, 'vds-autoplay', trackEvent(onAutoplay)),
        listenEvent(provider, 'vds-autoplay-fail', trackEvent(onAutoplayFail)),
        listenEvent(provider, 'vds-pause', trackEvent(onPause)),
        listenEvent(provider, 'vds-play', trackEvent(onPlay)),
        listenEvent(provider, 'vds-play-fail', trackEvent(onPlayFail)),
        listenEvent(provider, 'vds-playing', trackEvent(onPlaying)),
        listenEvent(provider, 'vds-progress', (e) => onProgress($media, e)),
        listenEvent(provider, 'vds-duration-change', onDurationChange),
        listenEvent(provider, 'vds-time-update', onTimeUpdate),
        listenEvent(provider, 'vds-volume-change', onVolumeChange),
        listenEvent(
          provider,
          'vds-seeking',
          throttle(trackEvent(onSeeking), 150, { leading: true }),
        ),
        listenEvent(provider, 'vds-seeked', trackEvent(onSeeked)),
        listenEvent(provider, 'vds-waiting', onWaiting),
        listenEvent(provider, 'vds-ended', onEnded),
        listenEvent(provider, 'vds-fullscreen-change', onFullscreenChange),
        listenEvent(provider, 'vds-fullscreen-error', onFullscreenError),
      );

      attachedCanPlayEvents = true;
    }

    // Avoid infinite chain - `hls.js` will not fire `canplay` event.
    if (event.triggerEvent?.type !== 'loadedmetadata') {
      appendTriggerEvent(event, trackedEvents.get('vds-loaded-metadata'));
    }

    $media.canPlay = true;
    $media.duration = event.detail.duration;
    host.el!.setAttribute('aria-busy', 'false');
  }

  function onCanPlayThrough(event: ME.MediaCanPlayThroughEvent) {
    $media.canPlay = true;
    $media.duration = event.detail.duration;
    appendTriggerEvent(event, trackedEvents.get('vds-can-play'));
  }

  function onDurationChange(event: ME.MediaDurationChangeEvent) {
    const duration = event.detail;
    $media.duration = !isNaN(duration) ? duration : 0;
  }

  function onAutoplay(event: ME.MediaAutoplayEvent) {
    appendTriggerEvent(event, trackedEvents.get('vds-play'));
    appendTriggerEvent(event, trackedEvents.get('vds-can-play'));
    $media.autoplayError = undefined;
  }

  function onAutoplayFail(event: ME.MediaAutoplayFailEvent) {
    appendTriggerEvent(event, trackedEvents.get('vds-play-fail'));
    appendTriggerEvent(event, trackedEvents.get('vds-can-play'));
    $media.autoplayError = event.detail;
    resetTracking();
  }

  function onPlay(event: ME.MediaPlayEvent) {
    if (requestManager?.$isLooping() || !$media.paused) {
      event.stopImmediatePropagation();
      return;
    }

    appendTriggerEvent(event, trackedEvents.get('vds-waiting'));
    satisfyMediaRequest('play', event);

    $media.paused = false;
    $media.autoplayError = undefined;

    if ($media.ended || requestManager?.$isReplay()) {
      requestManager?.$isReplay.set(false);
      $media.ended = false;
      dispatchEvent(provider, 'vds-replay', { triggerEvent: event });
    }
  }

  function onPlayFail(event: ME.MediaPlayFailEvent) {
    stopWaiting();

    appendTriggerEvent(event, trackedEvents.get('vds-play'));
    satisfyMediaRequest('play', event);

    $media.paused = true;
    $media.playing = false;

    resetTracking();
  }

  function onPlaying(event: ME.MediaPlayingEvent) {
    const playEvent = trackedEvents.get('vds-play');

    if (playEvent) {
      appendTriggerEvent(event, trackedEvents.get('vds-waiting'));
      appendTriggerEvent(event, playEvent);
    } else {
      appendTriggerEvent(event, trackedEvents.get('vds-seeked'));
    }

    stopWaiting();
    resetTracking();

    $media.paused = false;
    $media.playing = true;
    $media.seeking = false;
    $media.ended = false;

    if (requestManager?.$isLooping()) {
      event.stopImmediatePropagation();
      requestManager.$isLooping.set(false);
      return;
    }

    if (!$media.started) {
      $media.started = true;
      dispatchEvent(provider, 'vds-started', { triggerEvent: event });
    }
  }

  function onPause(event: ME.MediaPauseEvent) {
    if (requestManager?.$isLooping()) {
      event.stopImmediatePropagation();
      return;
    }

    appendTriggerEvent(event, trackedEvents.get('vds-seeked'));
    satisfyMediaRequest('pause', event);

    $media.paused = true;
    $media.playing = false;
    $media.seeking = false;

    stopWaiting();
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
      appendTriggerEvent(event, trackedEvents.get('vds-waiting'));
      appendTriggerEvent(event, trackedEvents.get('vds-seeking'));
      if ($media.paused) stopWaiting();
      $media.seeking = false;
      if (event.detail !== $media.duration) $media.ended = false;
      $media.currentTime = event.detail;
      satisfyMediaRequest('seeked', event);
    }
  }

  const fireWaitingEvent = debounce(() => {
    if (!lastWaitingEvent) return;

    firingWaiting = true;
    const event = createEvent('vds-waiting', {
      triggerEvent: lastWaitingEvent,
    });
    trackedEvents.set('vds-waiting', event);

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

    stopWaiting();
    resetTracking();
  }

  function stopWaiting() {
    fireWaitingEvent.cancel();
    $media.waiting = false;
  }

  function onFullscreenChange(event: FullscreenChangeEvent) {
    $media.fullscreen = event.detail;
    if (event.target !== host.el) return;

    // @ts-expect-error - not a media event.
    satisfyMediaRequest('fullscreen', event);

    // Forward event on media provider for any listeners.
    dispatchEvent(provider, 'vds-fullscreen-change', {
      detail: event.detail,
      triggerEvent: event,
    });
  }

  function onFullscreenError(event: FullscreenErrorEvent) {
    if (event.target !== host.el) return;

    // @ts-expect-error - not a media event.
    satisfyMediaRequest('fullscreen', event);

    // Forward event on media provider for any listeners.
    dispatchEvent(provider, 'vds-fullscreen-error', {
      detail: event.detail,
      triggerEvent: event,
    });
  }

  function satisfyMediaRequest<T extends keyof MediaRequestQueueRecord>(
    request: T,
    event: ME.VdsMediaEvent,
  ) {
    requestQueue?.serve(request, (requestEvent) => {
      event.requestEvent = requestEvent;
      appendTriggerEvent(event, requestEvent);
    });
  }
}

function onProgress(media: MediaState, event: ME.MediaProgressEvent) {
  const { buffered, seekable } = event.detail;
  const bufferedAmount = buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
  const seekableAmount = seekable.length === 0 ? 0 : seekable.end(seekable.length - 1);
  media.buffered = buffered;
  media.bufferedAmount = bufferedAmount;
  media.seekable = seekable;
  media.seekableAmount = seekableAmount;
}

function updateMediaMetadata(media: MediaState, metadata: ME.MediaMetadataEventDetail) {
  media.currentSrc = metadata.currentSrc;
  media.mediaType = metadata.mediaType;
  media.viewType = metadata.viewType;
}
