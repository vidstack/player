import { effect, onDispose, peek } from 'maverick.js';
import { DOMEvent, EventsController, isNil, listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { MediaCanPlayDetail } from '../../core/api/media-events';
import type { MediaErrorCode } from '../../core/api/types';
import { PageVisibility } from '../../foundation/observers/page-visibility';
import { RAFLoop } from '../../foundation/observers/raf-loop';
import { isHLSSrc } from '../../utils/mime';
import { getNumberOfDecimalPlaces } from '../../utils/number';
import { IS_IOS, IS_SAFARI } from '../../utils/support';
import type { HTMLMediaProvider } from './provider';

export class HTMLMediaEvents {
  #provider: HTMLMediaProvider;
  #ctx: MediaContext;
  #waiting = false;
  #attachedLoadStart = false;
  #attachedCanPlay = false;
  #timeRAF = new RAFLoop(this.#onAnimationFrame.bind(this));
  #pageVisibility = new PageVisibility();
  #events: EventsController<HTMLMediaElement>;

  get #media() {
    return this.#provider.media;
  }

  constructor(provider: HTMLMediaProvider, ctx: MediaContext) {
    this.#provider = provider;
    this.#ctx = ctx;
    this.#events = new EventsController(provider.media);

    this.#attachInitialListeners();

    this.#pageVisibility.connect();
    effect(this.#attachTimeUpdate.bind(this));

    onDispose(this.#onDispose.bind(this));
  }

  #onDispose() {
    this.#attachedLoadStart = false;
    this.#attachedCanPlay = false;
    this.#timeRAF.stop();
    this.#events.abort();
    this.#devHandlers?.clear();
  }

  /**
   * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
   * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
   * resolve that by retrieving time updates in a request animation frame loop.
   */
  #lastSeenTime = 0;
  #seekedTo = -1;
  #onAnimationFrame() {
    const newTime = this.#media.currentTime;

    // Avoid stuttering on Safari (after a seek operation time may drift backwards for a few frames).
    const didStutter = IS_SAFARI && newTime - this.#seekedTo < 0.35;

    if (!didStutter && this.#lastSeenTime !== newTime) {
      this.#updateCurrentTime(newTime);
      this.#lastSeenTime = newTime;
    }
  }

  #attachInitialListeners() {
    if (__DEV__) {
      this.#ctx.logger?.info('attaching initial listeners');
    }

    this.#attachEventListener('loadstart', this.#onLoadStart);
    this.#attachEventListener('abort', this.#onAbort);
    this.#attachEventListener('emptied', this.#onEmptied);
    this.#attachEventListener('error', this.#onError);
    this.#attachEventListener('volumechange', this.#onVolumeChange);

    if (__DEV__) this.#ctx.logger?.debug('attached initial media event listeners');
  }

  #attachLoadStartListeners() {
    if (this.#attachedLoadStart) return;

    if (__DEV__) {
      this.#ctx.logger?.info('attaching load start listeners');
    }

    this.#attachEventListener('loadeddata', this.#onLoadedData);
    this.#attachEventListener('loadedmetadata', this.#onLoadedMetadata);
    this.#attachEventListener('canplay', this.#onCanPlay);
    this.#attachEventListener('canplaythrough', this.#onCanPlayThrough);
    this.#attachEventListener('durationchange', this.#onDurationChange);
    this.#attachEventListener('play', this.#onPlay);
    this.#attachEventListener('progress', this.#onProgress);
    this.#attachEventListener('stalled', this.#onStalled);
    this.#attachEventListener('suspend', this.#onSuspend);
    this.#attachEventListener('ratechange', this.#onRateChange);

    this.#attachedLoadStart = true;
  }

  #attachCanPlayListeners() {
    if (this.#attachedCanPlay) return;

    if (__DEV__) {
      this.#ctx.logger?.info('attaching can play listeners');
    }

    this.#attachEventListener('pause', this.#onPause);
    this.#attachEventListener('playing', this.#onPlaying);
    this.#attachEventListener('seeked', this.#onSeeked);
    this.#attachEventListener('seeking', this.#onSeeking);
    this.#attachEventListener('ended', this.#onEnded);
    this.#attachEventListener('waiting', this.#onWaiting);

    this.#attachedCanPlay = true;
  }

  #devHandlers = __DEV__ ? new Map<string, (event: Event) => void>() : undefined;
  #handleDevEvent = __DEV__ ? this.#onDevEvent.bind(this) : undefined;
  #attachEventListener(eventType: keyof HTMLElementEventMap, handler: (event: Event) => void) {
    if (__DEV__) this.#devHandlers!.set(eventType, handler);
    this.#events.add(eventType, __DEV__ ? this.#handleDevEvent! : handler.bind(this));
  }

  #onDevEvent(event: Event) {
    if (!__DEV__) return;

    this.#ctx.logger
      ?.debugGroup(`📺 provider fired \`${event.type}\``)
      .labelledLog('Provider', this.#provider)
      .labelledLog('Event', event)
      .labelledLog('Media Store', { ...this.#ctx.$state })
      .dispatch();

    this.#devHandlers!.get(event.type)?.call(this, event);
  }

  #updateCurrentTime(time: number, trigger?: Event) {
    // Avoid errors where `currentTime` can have higher precision.
    const newTime = Math.min(time, this.#ctx.$state.seekableEnd());
    this.#ctx.notify('time-change', newTime, trigger);
  }

  #onLoadStart(event: Event) {
    if (this.#media.networkState === 3) {
      this.#onAbort(event);
      return;
    }

    this.#attachLoadStartListeners();
    this.#ctx.notify('load-start', undefined, event);
  }

  #onAbort(event: Event) {
    this.#ctx.notify('abort', undefined, event);
  }

  #onEmptied() {
    this.#ctx.notify('emptied', undefined, event);
  }

  #onLoadedData(event: Event) {
    this.#ctx.notify('loaded-data', undefined, event);
  }

  #onLoadedMetadata(event: Event) {
    // Reset.
    this.#lastSeenTime = 0;
    this.#seekedTo = -1;

    this.#attachCanPlayListeners();

    this.#ctx.notify('loaded-metadata', undefined, event);

    // iOS Safari and Native HLS do not reliably fire `canplay` event.
    if (IS_IOS || (IS_SAFARI && isHLSSrc(this.#ctx.$state.source()))) {
      this.#ctx.delegate.ready(this.#getCanPlayDetail(), event);
    }
  }

  #getCanPlayDetail(): MediaCanPlayDetail {
    return {
      provider: peek(this.#ctx.$provider)!,
      duration: this.#media.duration,
      buffered: this.#media.buffered,
      seekable: this.#media.seekable,
    };
  }

  #onPlay(event: Event) {
    if (!this.#ctx.$state.canPlay) return;
    this.#ctx.notify('play', undefined, event);
  }

  #onPause(event: Event) {
    // Avoid seeking events triggering pause.
    if (this.#media.readyState === 1 && !this.#waiting) return;
    this.#waiting = false;
    this.#timeRAF.stop();
    this.#ctx.notify('pause', undefined, event);
  }

  #onCanPlay(event: Event) {
    this.#ctx.delegate.ready(this.#getCanPlayDetail(), event);
  }

  #onCanPlayThrough(event: Event) {
    if (this.#ctx.$state.started()) return;
    this.#ctx.notify('can-play-through', this.#getCanPlayDetail(), event);
  }

  #onPlaying(event: Event) {
    // This event can incorrectly fire on Safari.
    if (this.#media.paused) return;
    this.#waiting = false;
    this.#ctx.notify('playing', undefined, event);
    this.#timeRAF.start();
  }

  #onStalled(event: Event) {
    this.#ctx.notify('stalled', undefined, event);
    if (this.#media.readyState < 3) {
      this.#waiting = true;
      this.#ctx.notify('waiting', undefined, event);
    }
  }

  #onWaiting(event: Event) {
    if (this.#media.readyState < 3) {
      this.#waiting = true;
      this.#ctx.notify('waiting', undefined, event);
    }
  }

  #onEnded(event: Event) {
    this.#timeRAF.stop();
    this.#updateCurrentTime(this.#media.duration, event);
    this.#ctx.notify('end', undefined, event);
    if (this.#ctx.$state.loop()) {
      const hasCustomControls = isNil(this.#media.controls);
      // Forcefully hide controls to prevent flashing when looping. Calling `play()` at end
      // of media may show a flash of native controls on iOS, even if `controls` property is not set.
      if (hasCustomControls) this.#media.controls = false;
    }
  }

  #attachTimeUpdate() {
    const isPaused = this.#ctx.$state.paused(),
      isPageHidden = this.#pageVisibility.visibility === 'hidden',
      shouldListenToTimeUpdates = isPaused || isPageHidden;

    if (shouldListenToTimeUpdates) {
      listenEvent(this.#media, 'timeupdate', this.#onTimeUpdate.bind(this));
    }
  }

  #onTimeUpdate(event: Event) {
    this.#updateCurrentTime(this.#media.currentTime, event);
  }

  #onDurationChange(event: Event) {
    if (this.#ctx.$state.ended()) {
      this.#updateCurrentTime(this.#media.duration, event);
    }

    this.#ctx.notify('duration-change', this.#media.duration, event);
  }

  #onVolumeChange(event: Event) {
    const detail = {
      volume: this.#media.volume,
      muted: this.#media.muted,
    };

    this.#ctx.notify('volume-change', detail, event);
  }

  #onSeeked(event: Event) {
    this.#seekedTo = this.#media.currentTime;

    this.#updateCurrentTime(this.#media.currentTime, event);

    this.#ctx.notify('seeked', this.#media.currentTime, event);

    // HLS: If precision has increased by seeking to the end, we'll call `play()` to properly end.
    if (
      Math.trunc(this.#media.currentTime) === Math.trunc(this.#media.duration) &&
      getNumberOfDecimalPlaces(this.#media.duration) >
        getNumberOfDecimalPlaces(this.#media.currentTime)
    ) {
      this.#updateCurrentTime(this.#media.duration, event);

      if (!this.#media.ended) {
        this.#ctx.player.dispatch(
          new DOMEvent<void>('media-play-request', {
            trigger: event,
          }),
        );
      }
    }
  }

  #onSeeking(event: Event) {
    this.#ctx.notify('seeking', this.#media.currentTime, event);
  }

  #onProgress(event: Event) {
    const detail = {
      buffered: this.#media.buffered,
      seekable: this.#media.seekable,
    };

    this.#ctx.notify('progress', detail, event);
  }

  #onSuspend(event: Event) {
    this.#ctx.notify('suspend', undefined, event);
  }

  #onRateChange(event: Event) {
    this.#ctx.notify('rate-change', this.#media.playbackRate, event);
  }

  #onError(event: Event) {
    const error = this.#media.error;
    if (!error) return;

    const detail = {
      message: error.message,
      code: error.code as MediaErrorCode,
      mediaError: error,
    };

    this.#ctx.notify('error', detail, event);
  }
}
