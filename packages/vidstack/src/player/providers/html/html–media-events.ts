import { effect, onDispose } from 'maverick.js';
import { DOMEvent, isNil, listenEvent, useDisposalBin } from 'maverick.js/std';

import { RAFLoop } from '../../../foundation/observers/raf-loop';
import { isHLSSrc } from '../../../utils/mime';
import { getNumberOfDecimalPlaces } from '../../../utils/number';
import { IS_SAFARI } from '../../../utils/support';
import type { MediaCanPlayDetail } from '../../core/api/events';
import type { MediaErrorCode } from '../../core/api/types';
import type { MediaSetupContext } from '../types';
import type { HTMLMediaProvider } from './provider';

export class HTMLMediaEvents {
  private _disposal = useDisposalBin();
  private _waiting = false;
  private _attachedLoadStart = false;
  private _attachedCanPlay = false;
  private _timeRAF = new RAFLoop(this._onRAF.bind(this));

  private get _media() {
    return this._provider.media;
  }

  private get _delegate() {
    return this._context.delegate;
  }

  constructor(private _provider: HTMLMediaProvider, private _context: MediaSetupContext) {
    this._attachInitialListeners();
    effect(this._attachTimeUpdate.bind(this));
    onDispose(this._onDispose.bind(this));
  }

  private _onDispose() {
    this._timeRAF._stop();
    this._disposal.empty();
  }

  /**
   * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
   * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
   * resolve that by retrieving time updates in a request animation frame loop.
   */
  private _onRAF() {
    const newTime = this._provider.currentTime;
    if (this._context.$store.currentTime() !== newTime) this._updateCurrentTime(newTime);
  }

  private _attachInitialListeners() {
    this._attachEventListener('loadstart', this._onLoadStart);
    this._attachEventListener('abort', this._onAbort);
    this._attachEventListener('emptied', this._onEmptied);
    this._attachEventListener('error', this._onError);
    if (__DEV__) this._context.logger?.debug('attached initial media event listeners');
  }

  private _attachLoadStartListeners() {
    if (this._attachedLoadStart) return;
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

    this._context.logger
      ?.debugGroup(`📺 fired \`${event.type}\``)
      .labelledLog('Event', event)
      .labelledLog('Media Store', { ...this._context.$store })
      .dispatch();

    this._handlers!.get(event.type)?.call(this, event);
  }

  private _updateCurrentTime(time: number, trigger?: Event) {
    this._delegate._dispatch('time-update', {
      // Avoid errors where `currentTime` can have higher precision.
      detail: {
        currentTime: Math.min(time, this._context.$store.seekableEnd()),
        played: this._media.played,
      },
      trigger,
    });
  }

  private _onLoadStart(event: Event) {
    if (this._media.networkState === 3) {
      this._onAbort(event);
      return;
    }

    this._attachLoadStartListeners();
    this._delegate._dispatch('load-start', { trigger: event });
  }

  private _onAbort(event: Event) {
    this._delegate._dispatch('abort', { trigger: event });
  }

  private _onEmptied() {
    this._delegate._dispatch('emptied', { trigger: event });
  }

  private _onLoadedData(event: Event) {
    this._delegate._dispatch('loaded-data', { trigger: event });
  }

  private _onLoadedMetadata(event: Event) {
    this._onStreamTypeChange();
    this._attachCanPlayListeners();

    // Sync volume state before metadata.
    this._delegate._dispatch('volume-change', {
      detail: {
        volume: this._media.volume,
        muted: this._media.muted,
      },
    });

    this._delegate._dispatch('loaded-metadata', { trigger: event });

    // Native HLS does not reliably fire `canplay` event.
    if (IS_SAFARI && isHLSSrc(this._context.$store.source())) {
      this._delegate._ready(this._getCanPlayDetail(), event);
    }
  }

  private _getCanPlayDetail(): MediaCanPlayDetail {
    return {
      duration: this._media.duration,
      buffered: this._media.buffered,
      seekable: this._media.seekable,
    };
  }

  private _onStreamTypeChange() {
    const isLive = !Number.isFinite(this._media.duration);
    this._delegate._dispatch('stream-type-change', {
      detail: isLive ? 'live' : 'on-demand',
    });
  }

  private _onPlay(event: Event) {
    if (!this._context.$store.canPlay) return;
    this._delegate._dispatch('play', { trigger: event });
  }

  private _onPause(event: Event) {
    // Avoid seeking events triggering pause.
    if (this._media.readyState === 1 && !this._waiting) return;
    this._waiting = false;
    this._timeRAF._stop();
    this._delegate._dispatch('pause', { trigger: event });
  }

  private _onCanPlay(event: Event) {
    this._delegate._ready(this._getCanPlayDetail(), event);
  }

  private _onCanPlayThrough(event: Event) {
    if (this._context.$store.started()) return;
    this._delegate._dispatch('can-play-through', {
      trigger: event,
      detail: this._getCanPlayDetail(),
    });
  }

  private _onPlaying(event: Event) {
    this._waiting = false;
    this._delegate._dispatch('playing', { trigger: event });
    this._timeRAF._start();
  }

  private _onStalled(event: Event) {
    this._delegate._dispatch('stalled', { trigger: event });
    if (this._media.readyState < 3) {
      this._waiting = true;
      this._delegate._dispatch('waiting', { trigger: event });
    }
  }

  private _onWaiting(event: Event) {
    if (this._media.readyState < 3) {
      this._waiting = true;
      this._delegate._dispatch('waiting', { trigger: event });
    }
  }

  private _onEnded(event: Event) {
    this._timeRAF._stop();
    this._updateCurrentTime(this._media.duration, event);
    this._delegate._dispatch('end', { trigger: event });
    if (this._context.$store.loop()) {
      this._onLoop();
    } else {
      this._delegate._dispatch('ended', { trigger: event });
    }
  }

  protected _attachTimeUpdate() {
    if (this._context.$store.paused()) {
      listenEvent(this._media, 'timeupdate', this._onTimeUpdate.bind(this));
    }
  }

  protected _onTimeUpdate(event: Event) {
    this._updateCurrentTime(this._media.currentTime, event);
  }

  private _onDurationChange(event: Event) {
    this._onStreamTypeChange();

    if (this._context.$store.ended()) {
      this._updateCurrentTime(this._media.duration, event);
    }

    this._delegate._dispatch('duration-change', {
      detail: this._media.duration,
      trigger: event,
    });
  }

  private _onVolumeChange(event: Event) {
    this._delegate._dispatch('volume-change', {
      detail: {
        volume: this._media.volume,
        muted: this._media.muted,
      },
      trigger: event,
    });
  }

  private _onSeeked(event: Event) {
    this._updateCurrentTime(this._media.currentTime, event);

    this._delegate._dispatch('seeked', {
      detail: this._media.currentTime,
      trigger: event,
    });

    // HLS: If precision has increased by seeking to the end, we'll call `play()` to properly end.
    if (
      Math.trunc(this._media.currentTime) === Math.trunc(this._media.duration) &&
      getNumberOfDecimalPlaces(this._media.duration) >
        getNumberOfDecimalPlaces(this._media.currentTime)
    ) {
      this._updateCurrentTime(this._media.duration, event);

      if (!this._media.ended) {
        this._context.player.dispatchEvent(
          new DOMEvent<void>('media-play-request', {
            trigger: event,
          }),
        );
      }
    }
  }

  private _onSeeking(event: Event) {
    this._delegate._dispatch('seeking', {
      detail: this._media.currentTime,
      trigger: event,
    });
  }

  private _onProgress(event: Event) {
    this._delegate._dispatch('progress', {
      detail: {
        buffered: this._media.buffered,
        seekable: this._media.seekable,
      },
      trigger: event,
    });
  }

  private _onLoop() {
    const hasCustomControls = isNil(this._media.controls);
    // Forcefully hide controls to prevent flashing when looping. Calling `play()` at end
    // of media may show a flash of native controls on iOS, even if `controls` property is not set.
    if (hasCustomControls) this._media.controls = false;
    this._context.player.dispatchEvent(new DOMEvent<void>('media-loop-request'));
  }

  private _onSuspend(event: Event) {
    this._delegate._dispatch('suspend', { trigger: event });
  }

  private _onRateChange(event: Event) {
    this._delegate._dispatch('rate-change', {
      detail: this._media.playbackRate,
      trigger: event,
    });
  }

  private _onError(event: Event) {
    const error = this._media.error;
    if (!error) return;
    this._delegate._dispatch('error', {
      detail: {
        message: error.message,
        code: error.code as MediaErrorCode,
        mediaError: error,
      },
      trigger: event,
    });
  }
}
