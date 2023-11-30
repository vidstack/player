import { effect, onDispose, peek } from 'maverick.js';
import { DOMEvent, isNil, listenEvent, useDisposalBin } from 'maverick.js/std';

import type { MediaCanPlayDetail } from '../../core/api/media-events';
import type { MediaErrorCode } from '../../core/api/types';
import { RAFLoop } from '../../foundation/observers/raf-loop';
import { isHLSSrc } from '../../utils/mime';
import { getNumberOfDecimalPlaces } from '../../utils/number';
import { IS_SAFARI } from '../../utils/support';
import type { MediaSetupContext } from '../types';
import type { HTMLMediaProvider } from './provider';

export class HTMLMediaEvents {
  private _disposal = useDisposalBin();
  private _waiting = false;
  private _attachedLoadStart = false;
  private _attachedCanPlay = false;
  private _timeRAF = new RAFLoop(this._onAnimationFrame.bind(this));

  private get _media() {
    return this._provider.media;
  }

  private get _notify() {
    return this._ctx.delegate._notify;
  }

  constructor(
    private _provider: HTMLMediaProvider,
    private _ctx: MediaSetupContext,
  ) {
    this._attachInitialListeners();
    effect(this._attachTimeUpdate.bind(this));
    onDispose(this._onDispose.bind(this));
  }

  private _onDispose() {
    this._attachedLoadStart = false;
    this._attachedCanPlay = false;
    this._timeRAF._stop();
    this._disposal.empty();
  }

  /**
   * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
   * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
   * resolve that by retrieving time updates in a request animation frame loop.
   */
  private _onAnimationFrame() {
    const newTime = this._media.currentTime;
    if (this._ctx.$state.currentTime() !== newTime) this._updateCurrentTime(newTime);
  }

  private _attachInitialListeners() {
    if (__DEV__) {
      this._ctx.logger?.info('attaching initial listeners');
    }

    this._attachEventListener('loadstart', this._onLoadStart);
    this._attachEventListener('abort', this._onAbort);
    this._attachEventListener('emptied', this._onEmptied);
    this._attachEventListener('error', this._onError);
    if (__DEV__) this._ctx.logger?.debug('attached initial media event listeners');
  }

  private _attachLoadStartListeners() {
    if (this._attachedLoadStart) return;

    if (__DEV__) {
      this._ctx.logger?.info('attaching load start listeners');
    }

    this._disposal.add(
      this._attachEventListener('loadeddata', this._onLoadedData),
      this._attachEventListener('loadedmetadata', this._onLoadedMetadata),
      this._attachEventListener('canplay', this._onCanPlay),
      this._attachEventListener('canplaythrough', this._onCanPlayThrough),
      this._attachEventListener('durationchange', this._onDurationChange),
      this._attachEventListener('play', this._onPlay),
      this._attachEventListener('progress', this._onProgress),
      this._attachEventListener('stalled', this._onStalled),
      this._attachEventListener('suspend', this._onSuspend),
    );

    this._attachedLoadStart = true;
  }

  private _attachCanPlayListeners() {
    if (this._attachedCanPlay) return;

    if (__DEV__) {
      this._ctx.logger?.info('attaching can play listeners');
    }

    this._disposal.add(
      this._attachEventListener('pause', this._onPause),
      this._attachEventListener('playing', this._onPlaying),
      this._attachEventListener('ratechange', this._onRateChange),
      this._attachEventListener('seeked', this._onSeeked),
      this._attachEventListener('seeking', this._onSeeking),
      this._attachEventListener('ended', this._onEnded),
      this._attachEventListener('volumechange', this._onVolumeChange),
      this._attachEventListener('waiting', this._onWaiting),
    );
    this._attachedCanPlay = true;
  }

  private _handlers = __DEV__ ? new Map<string, (event: Event) => void>() : undefined;
  private _handleDevEvent = __DEV__ ? this._onDevEvent.bind(this) : undefined;
  private _attachEventListener(
    eventType: keyof HTMLElementEventMap,
    handler: (event: Event) => void,
  ) {
    if (__DEV__) this._handlers!.set(eventType, handler);
    return listenEvent(
      this._media,
      eventType,
      __DEV__ ? this._handleDevEvent! : handler.bind(this),
    );
  }

  private _onDevEvent(event: Event) {
    if (!__DEV__) return;

    this._ctx.logger
      ?.debugGroup(`📺 provider fired \`${event.type}\``)
      .labelledLog('Provider', this._provider)
      .labelledLog('Event', event)
      .labelledLog('Media Store', { ...this._ctx.$state })
      .dispatch();

    this._handlers!.get(event.type)?.call(this, event);
  }

  private _updateCurrentTime(time: number, trigger?: Event) {
    const detail = {
      // Avoid errors where `currentTime` can have higher precision.
      currentTime: Math.min(time, this._ctx.$state.seekableEnd()),
      played: this._media.played,
    };

    this._notify('time-update', detail, trigger);
  }

  private _onLoadStart(event: Event) {
    if (this._media.networkState === 3) {
      this._onAbort(event);
      return;
    }

    this._attachLoadStartListeners();
    this._notify('load-start', undefined, event);
  }

  private _onAbort(event: Event) {
    this._notify('abort', undefined, event);
  }

  private _onEmptied() {
    this._notify('emptied', undefined, event);
  }

  private _onLoadedData(event: Event) {
    this._notify('loaded-data', undefined, event);
  }

  private _onLoadedMetadata(event: Event) {
    this._attachCanPlayListeners();

    // Sync volume state before metadata.
    this._notify(
      'volume-change',
      {
        volume: this._media.volume,
        muted: this._media.muted,
      },
      event,
    );

    this._notify('loaded-metadata', undefined, event);

    // Native HLS does not reliably fire `canplay` event.
    if (IS_SAFARI && isHLSSrc(this._ctx.$state.source())) {
      this._ctx.delegate._ready(this._getCanPlayDetail(), event);
    }
  }

  private _getCanPlayDetail(): MediaCanPlayDetail {
    return {
      provider: peek(this._ctx.$provider)!,
      duration: this._media.duration,
      buffered: this._media.buffered,
      seekable: this._media.seekable,
    };
  }

  private _onPlay(event: Event) {
    if (!this._ctx.$state.canPlay) return;
    this._notify('play', undefined, event);
  }

  private _onPause(event: Event) {
    // Avoid seeking events triggering pause.
    if (this._media.readyState === 1 && !this._waiting) return;
    this._waiting = false;
    this._timeRAF._stop();
    this._notify('pause', undefined, event);
  }

  private _onCanPlay(event: Event) {
    this._ctx.delegate._ready(this._getCanPlayDetail(), event);
  }

  private _onCanPlayThrough(event: Event) {
    if (this._ctx.$state.started()) return;
    this._notify('can-play-through', this._getCanPlayDetail(), event);
  }

  private _onPlaying(event: Event) {
    this._waiting = false;
    this._notify('playing', undefined, event);
    this._timeRAF._start();
  }

  private _onStalled(event: Event) {
    this._notify('stalled', undefined, event);
    if (this._media.readyState < 3) {
      this._waiting = true;
      this._notify('waiting', undefined, event);
    }
  }

  private _onWaiting(event: Event) {
    if (this._media.readyState < 3) {
      this._waiting = true;
      this._notify('waiting', undefined, event);
    }
  }

  private _onEnded(event: Event) {
    this._timeRAF._stop();
    this._updateCurrentTime(this._media.duration, event);
    this._notify('end', undefined, event);
    if (this._ctx.$state.loop()) {
      const hasCustomControls = isNil(this._media.controls);
      // Forcefully hide controls to prevent flashing when looping. Calling `play()` at end
      // of media may show a flash of native controls on iOS, even if `controls` property is not set.
      if (hasCustomControls) this._media.controls = false;
    }
  }

  protected _attachTimeUpdate() {
    if (this._ctx.$state.paused()) {
      listenEvent(this._media, 'timeupdate', this._onTimeUpdate.bind(this));
    }
  }

  protected _onTimeUpdate(event: Event) {
    this._updateCurrentTime(this._media.currentTime, event);
  }

  private _onDurationChange(event: Event) {
    if (this._ctx.$state.ended()) {
      this._updateCurrentTime(this._media.duration, event);
    }

    this._notify('duration-change', this._media.duration, event);
  }

  private _onVolumeChange(event: Event) {
    const detail = {
      volume: this._media.volume,
      muted: this._media.muted,
    };

    this._notify('volume-change', detail, event);
  }

  private _onSeeked(event: Event) {
    this._updateCurrentTime(this._media.currentTime, event);

    this._notify('seeked', this._media.currentTime, event);

    // HLS: If precision has increased by seeking to the end, we'll call `play()` to properly end.
    if (
      Math.trunc(this._media.currentTime) === Math.trunc(this._media.duration) &&
      getNumberOfDecimalPlaces(this._media.duration) >
        getNumberOfDecimalPlaces(this._media.currentTime)
    ) {
      this._updateCurrentTime(this._media.duration, event);

      if (!this._media.ended) {
        this._ctx.player.dispatch(
          new DOMEvent<void>('media-play-request', {
            trigger: event,
          }),
        );
      }
    }
  }

  private _onSeeking(event: Event) {
    this._notify('seeking', this._media.currentTime, event);
  }

  private _onProgress(event: Event) {
    const detail = {
      buffered: this._media.buffered,
      seekable: this._media.seekable,
    };

    this._notify('progress', detail, event);
  }

  private _onSuspend(event: Event) {
    this._notify('suspend', undefined, event);
  }

  private _onRateChange(event: Event) {
    this._notify('rate-change', this._media.playbackRate, event);
  }

  private _onError(event: Event) {
    const error = this._media.error;
    if (!error) return;

    const detail = {
      message: error.message,
      code: error.code as MediaErrorCode,
      mediaError: error,
    };

    this._notify('error', detail, event);
  }
}
