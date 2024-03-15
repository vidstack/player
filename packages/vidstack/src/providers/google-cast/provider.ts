import { createScope, onDispose, peek } from 'maverick.js';
import { DOMEvent, keysOf } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { Src } from '../../core/api/src-types';
import type { MediaStreamType } from '../../core/api/types';
import { TimeRange } from '../../core/time-ranges';
import { RAFLoop } from '../../foundation/observers/raf-loop';
import type { MediaProviderAdapter } from '../types';
import { GoogleCastMediaInfoBuilder } from './media-info';
import { GoogleCastTracksManager } from './tracks';
import {
  getCastContext,
  getCastErrorMessage,
  getCastSession,
  getCastSessionMedia,
  hasActiveCastSession,
  listenCastContextEvent,
} from './utils';

/**
 * The Google Cast provider adds support for casting/streaming videos to Cast Receiver.
 *
 * @see {@link https://developers.google.com/cast/docs/overview}
 * @docs {@link https://www.vidstack.io/docs/player/providers/google-cast}
 */
export class GoogleCastProvider implements MediaProviderAdapter {
  protected $$PROVIDER_TYPE = 'GOOGLE_CAST';

  readonly scope = createScope();

  protected _currentSrc: Src<string> | null = null;
  protected _state: RemotePlaybackState = 'disconnected';
  protected _currentTime = 0;
  protected _played = 0;
  protected _playedRange = new TimeRange(0, 0);
  protected _seekableRange = new TimeRange(0, 0);
  protected _timeRAF = new RAFLoop(this._onAnimationFrame.bind(this));
  protected _playerEventHandlers!: Record<string, RemotePlayerEventCallback>;
  protected _reloadInfo: { src: Src; paused: boolean; time: number } | null = null;
  protected _isIdle = false;

  protected _tracks = new GoogleCastTracksManager(
    this._player,
    this._ctx,
    this._onNewLocalTracks.bind(this),
  );

  protected get _notify() {
    return this._ctx.delegate._notify;
  }

  constructor(
    protected _player: cast.framework.RemotePlayer,
    protected _ctx: MediaContext,
  ) {}

  get type() {
    return 'google-cast';
  }

  get currentSrc() {
    return this._currentSrc;
  }

  /**
   * The Google Cast remote player.
   *
   * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.RemotePlayer}
   */
  get player() {
    return this._player;
  }

  /**
   * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastContext}
   */
  get cast() {
    return getCastContext();
  }

  /**
   * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastSession}
   */
  get session() {
    return getCastSession();
  }

  /**
   * @see {@link https://developers.google.com/cast/docs/reference/web_sender/chrome.cast.media.Media}
   */
  get media() {
    return getCastSessionMedia();
  }

  /**
   * Whether the current Google Cast session belongs to this provider.
   */
  get hasActiveSession() {
    return hasActiveCastSession(this._currentSrc);
  }

  setup() {
    this._attachCastContextEventListeners();
    this._attachCastPlayerEventListeners();

    this._tracks._setup();

    this._notify('provider-setup', this);
  }

  protected _attachCastContextEventListeners() {
    listenCastContextEvent(
      cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      this._onCastStateChange.bind(this),
    );
  }

  protected _attachCastPlayerEventListeners() {
    const Event = cast.framework.RemotePlayerEventType,
      handlers = {
        [Event.IS_CONNECTED_CHANGED]: this._onCastStateChange,
        [Event.IS_MEDIA_LOADED_CHANGED]: this._onMediaLoadedChange,
        [Event.CAN_CONTROL_VOLUME_CHANGED]: this._onCanControlVolumeChange,
        [Event.CAN_SEEK_CHANGED]: this._onCanSeekChange,
        [Event.DURATION_CHANGED]: this._onDurationChange,
        [Event.IS_MUTED_CHANGED]: this._onVolumeChange,
        [Event.VOLUME_LEVEL_CHANGED]: this._onVolumeChange,
        [Event.IS_PAUSED_CHANGED]: this._onPausedChange,
        [Event.LIVE_SEEKABLE_RANGE_CHANGED]: this._onProgress,
        [Event.PLAYER_STATE_CHANGED]: this._onPlayerStateChange,
      };

    this._playerEventHandlers = handlers;

    const handler = this._onRemotePlayerEvent.bind(this);

    for (const type of keysOf(handlers)) {
      this._player.controller!.addEventListener(type, handler);
    }

    onDispose(() => {
      for (const type of keysOf(handlers)) {
        this._player.controller!.removeEventListener(type, handler);
      }
    });
  }

  async play() {
    if (!this._player.isPaused && !this._isIdle) return;

    if (this._isIdle) {
      await this._reload(false, 0);
      return;
    }

    this._player.controller?.playOrPause();
  }

  async pause() {
    if (this._player.isPaused) return;
    this._player.controller?.playOrPause();
  }

  getMediaStatus(request: chrome.cast.media.GetStatusRequest) {
    return new Promise((resolve, reject) => {
      this.media?.getStatus(request, resolve, reject);
    });
  }

  setMuted(muted: boolean) {
    const hasChanged = (muted && !this._player!.isMuted) || (!muted && this._player!.isMuted);
    if (hasChanged) this._player.controller?.muteOrUnmute();
  }

  setCurrentTime(time: number) {
    this._player.currentTime = time;
    this._notify('seeking', time);
    this._player.controller?.seek();
  }

  setVolume(volume: number) {
    this._player.volumeLevel = volume;
    this._player.controller?.setVolumeLevel();
  }

  async loadSource(src: Src) {
    if (this._reloadInfo?.src !== src) this._reloadInfo = null;

    if (hasActiveCastSession(src)) {
      this._resumeSession();
      this._currentSrc = src as Src<string>;
      return;
    }

    this._notify('load-start');

    const loadRequest = this._buildLoadRequest(src as Src<string>),
      errorCode = await this.session!.loadMedia(loadRequest);

    if (errorCode) {
      this._currentSrc = null;
      this._notify('error', Error(getCastErrorMessage(errorCode)));
      return;
    }

    this._currentSrc = src as Src<string>;
  }

  destroy() {
    this._reset();
    this._endSession();
  }

  protected _reset() {
    if (!this._reloadInfo) {
      this._played = 0;
      this._playedRange = new TimeRange(0, 0);
      this._seekableRange = new TimeRange(0, 0);
    }

    this._timeRAF._stop();
    this._currentTime = 0;
    this._reloadInfo = null;
  }

  protected _resumeSession() {
    const resumeSessionEvent = new DOMEvent('resume-session', { detail: this.session! });
    this._onMediaLoadedChange(resumeSessionEvent);

    const { muted, volume, savedState } = this._ctx.$state,
      localState = savedState();

    // Set time to whatever is further ahead (local/remote).
    this.setCurrentTime(Math.max(this._player.currentTime, localState?.currentTime ?? 0));

    this.setMuted(muted());
    this.setVolume(volume());

    if (localState?.paused === false) this.play();
  }

  protected _endSession() {
    this.cast.endCurrentSession(true);
    const { remotePlaybackLoader } = this._ctx.$state;
    remotePlaybackLoader.set(null);
  }

  protected _disconnectFromReceiver() {
    const { savedState } = this._ctx.$state;

    savedState.set({
      paused: this._player.isPaused,
      currentTime: this._player.currentTime,
    });

    this._endSession();
  }

  protected _onAnimationFrame() {
    this._onCurrentTimeChange();
  }

  protected _onRemotePlayerEvent(event: cast.framework.RemotePlayerChangedEvent) {
    this._playerEventHandlers[event.type].call(this, event);
  }

  protected _onCastStateChange(
    data: cast.framework.CastStateEventData | cast.framework.RemotePlayerChangedEvent,
  ) {
    const castState = this.cast.getCastState(),
      state: RemotePlaybackState =
        castState === cast.framework.CastState.CONNECTED
          ? 'connected'
          : castState === cast.framework.CastState.CONNECTING
            ? 'connecting'
            : 'disconnected';

    if (this._state === state) return;

    const detail = { type: 'google-cast', state } as const,
      trigger = this._createEvent(data);

    this._state = state;
    this._notify('remote-playback-change', detail, trigger);

    if (state === 'disconnected') {
      this._disconnectFromReceiver();
    }
  }

  protected _onMediaLoadedChange(event: Event | cast.framework.RemotePlayerChangedEvent) {
    const hasLoaded = !!this._player.isMediaLoaded;
    if (!hasLoaded) return;

    const src = peek(this._ctx.$state.source);

    // Media info not available yet due to some internal issue in cast framework.
    Promise.resolve().then(() => {
      // Check src to avoid race condition.
      if (src !== peek(this._ctx.$state.source) || !this._player.isMediaLoaded) return;

      this._reset();

      const duration = this._player.duration;
      this._seekableRange = new TimeRange(0, duration);

      const detail = {
          provider: this,
          duration,
          buffered: this._playedRange,
          seekable: this._getSeekableRange(),
        },
        trigger = this._createEvent(event);

      this._notify('loaded-metadata', undefined, trigger);
      this._notify('loaded-data', undefined, trigger);
      this._notify('can-play', detail, trigger);

      this._onCanControlVolumeChange();
      this._onCanSeekChange(event);

      const { volume, muted } = this._ctx.$state;
      this.setVolume(volume());
      this.setMuted(muted());

      this._timeRAF._start();

      this._tracks._syncRemoteTracks(trigger);
      this._tracks._syncRemoteActiveIds(trigger);
    });
  }

  protected _onCanControlVolumeChange() {
    this._ctx.$state.canSetVolume.set(this._player.canControlVolume);
  }

  protected _onCanSeekChange(event: Event | cast.framework.RemotePlayerChangedEvent) {
    const trigger = this._createEvent(event);
    this._notify('stream-type-change', this._getStreamType(), trigger);
  }

  protected _getStreamType(): MediaStreamType {
    const streamType = this._player.mediaInfo?.streamType;
    return streamType === chrome.cast.media.StreamType.LIVE
      ? this._player.canSeek
        ? 'live:dvr'
        : 'live'
      : 'on-demand';
  }

  protected _onCurrentTimeChange() {
    if (this._reloadInfo) return;

    const currentTime = this._player.currentTime;
    if (currentTime === this._currentTime) return;

    const prevPlayed = this._played,
      played = this._getPlayedRange(currentTime),
      detail = { currentTime, played };

    this._notify('time-update', detail);
    if (currentTime > prevPlayed) this._onProgress();

    if (this._ctx.$state.seeking()) {
      this._notify('seeked', currentTime);
    }

    this._currentTime = currentTime;
  }

  protected _getPlayedRange(time: number) {
    return this._played >= time
      ? this._playedRange
      : (this._playedRange = new TimeRange(0, (this._played = time)));
  }

  protected _onDurationChange(event: cast.framework.RemotePlayerChangedEvent) {
    // Duration will go to 0 on end as cast player state changes to idle.
    if (!this._player.isMediaLoaded || this._reloadInfo) return;

    const duration = this._player.duration,
      trigger = this._createEvent(event);

    this._seekableRange = new TimeRange(0, duration);
    this._notify('duration-change', duration, trigger);
  }

  protected _onVolumeChange(event: cast.framework.RemotePlayerChangedEvent) {
    if (!this._player.isMediaLoaded) return;

    const detail = {
        muted: this._player.isMuted,
        volume: this._player.volumeLevel,
      },
      trigger = this._createEvent(event);

    this._notify('volume-change', detail, trigger);
  }

  protected _onPausedChange(event: cast.framework.RemotePlayerChangedEvent) {
    const trigger = this._createEvent(event);
    if (this._player.isPaused) {
      this._notify('pause', undefined, trigger);
    } else {
      this._notify('play', undefined, trigger);
    }
  }

  protected _onProgress(event?: cast.framework.RemotePlayerChangedEvent) {
    const detail = {
        seekable: this._getSeekableRange(),
        buffered: this._playedRange,
      },
      trigger = event ? this._createEvent(event) : undefined;

    this._notify('progress', detail, trigger);
  }

  protected _onPlayerStateChange(event: cast.framework.RemotePlayerChangedEvent) {
    const state = this._player.playerState,
      PlayerState = chrome.cast.media.PlayerState;

    this._isIdle = state === PlayerState.IDLE;

    // Handled in `onPausedChange`.
    if (state === PlayerState.PAUSED) return;

    const trigger = this._createEvent(event);

    switch (state) {
      case PlayerState.PLAYING:
        this._notify('playing', undefined, trigger);
        break;
      case PlayerState.BUFFERING:
        this._notify('waiting', undefined, trigger);
        break;
      case PlayerState.IDLE:
        this._timeRAF._stop();
        this._notify('pause');
        this._notify('end');
        break;
    }
  }

  protected _getSeekableRange() {
    return this._player.liveSeekableRange
      ? new TimeRange(this._player.liveSeekableRange.start, this._player.liveSeekableRange.end)
      : this._seekableRange;
  }

  protected _createEvent(detail: Event | { type: string }) {
    return detail instanceof Event ? detail : new DOMEvent<any>(detail.type, { detail });
  }

  protected _buildMediaInfo(src: Src<string>) {
    const { streamType, title, poster } = this._ctx.$state;
    return new GoogleCastMediaInfoBuilder(src)
      ._setMetadata(title(), poster())
      ._setStreamType(streamType())
      ._setTracks(this._tracks._getLocalTextTracks())
      .build();
  }

  protected _buildLoadRequest(src: Src<string>) {
    const mediaInfo = this._buildMediaInfo(src),
      request = new chrome.cast.media.LoadRequest(mediaInfo),
      savedState = this._ctx.$state.savedState();

    request.autoplay = (this._reloadInfo?.paused ?? savedState?.paused) === false;
    request.currentTime = this._reloadInfo?.time ?? savedState?.currentTime ?? 0;

    return request;
  }

  protected async _reload(paused: boolean, time: number) {
    const src = peek(this._ctx.$state.source);
    this._reloadInfo = { src, paused, time };
    await this.loadSource(src);
  }

  protected _onNewLocalTracks() {
    this._reload(this._player.isPaused, this._player.currentTime).catch((error) => {
      if (__DEV__) {
        this._ctx.logger
          ?.errorGroup('[vidstack] cast failed to load new local tracks')
          .labelledLog('Error', error)
          .dispatch();
      }
    });
  }
}

interface RemotePlayerEventCallback {
  (event: cast.framework.RemotePlayerChangedEvent): void;
}
