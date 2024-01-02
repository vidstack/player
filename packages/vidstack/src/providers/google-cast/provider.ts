import { createScope, onDispose } from 'maverick.js';
import { DOMEvent, keysOf } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { MediaSrc, MediaStreamType } from '../../core/api/types';
import { TimeRange } from '../../core/time-ranges';
import { RAFLoop } from '../../foundation/observers/raf-loop';
import type { MediaProviderAdapter } from '../types';
import { GoogleCastMediaInfoBuilder } from './media-info';
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

  protected _currentSrc: MediaSrc<string> | null = null;
  protected _state: RemotePlaybackState = 'disconnected';

  protected _playerEventHandlers!: Record<
    string,
    (event: cast.framework.RemotePlayerChangedEvent) => void
  >;

  protected _currentTime = 0;
  protected _played = 0;
  protected _playedRange = new TimeRange(0, 0);
  protected _seekableRange = new TimeRange(0, 0);
  protected _timeRAF = new RAFLoop(this._onAnimationFrame.bind(this));

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
    if (!this._player.isPaused) return;
    this._player.controller?.playOrPause();
  }

  async pause() {
    if (this._player.isPaused) return;
    this._player.controller?.playOrPause();
  }

  editTracksInfo(request: chrome.cast.media.EditTracksInfoRequest) {
    return new Promise((resolve, reject) => {
      this.media?.editTracksInfo(request, resolve, reject);
    });
  }

  getMediaStatus(request: chrome.cast.media.GetStatusRequest) {
    return new Promise((resolve, reject) => {
      this.media?.getStatus(request, resolve, reject);
    });
  }

  setMuted(muted: boolean) {
    const hasChanged = (muted && !this._player!.isMuted) || (!muted && this._player!.isMuted);
    if (hasChanged) {
      this._player.controller?.muteOrUnmute();
    }
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

  async loadSource(src: MediaSrc) {
    if (hasActiveCastSession(src)) {
      this._resumeSession();
      this._currentSrc = src as MediaSrc<string>;
      return;
    }

    this._notify('load-start');

    const loadRequest = this._buildLoadRequest(src as MediaSrc<string>),
      errorCode = await this.session!.loadMedia(loadRequest);

    if (errorCode) {
      this._currentSrc = null;
      this._notify('error', Error(getCastErrorMessage(errorCode)));
      return;
    }

    this._currentSrc = src as MediaSrc<string>;
  }

  destroy() {
    this._reset();
    this._endSession();
  }

  protected _reset() {
    this._played = 0;
    this._playedRange = new TimeRange(0, 0);
    this._seekableRange = new TimeRange(0, 0);
    this._timeRAF._stop();
    this._currentTime = 0;
  }

  protected _resumeSession() {
    const resumeSessionEvent = new DOMEvent('resume-session', { detail: this.session! });
    this._onMediaLoadedChange(resumeSessionEvent);

    const localState = this._ctx.$state.remotePlaybackInfo();

    // Set time to whatever is further ahead (local/remote).
    this.setCurrentTime(
      Math.max(this._player.currentTime, localState?.savedState?.currentTime ?? 0),
    );

    this.setMuted(this._ctx.$state.muted());
    this.setVolume(this._ctx.$state.volume());

    if (localState?.savedState?.paused === false) this.play();
  }

  protected _endSession() {
    this.cast.endCurrentSession(true);
    this._ctx.$state.remotePlaybackLoader.set(null);
  }

  protected _disconnectFromReceiver() {
    this._ctx.$state.remotePlaybackInfo.set({
      savedState: {
        paused: this._player.isPaused,
        currentTime: this._player.currentTime,
      },
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
    this._reset();

    const hasLoaded = !!this._player.isMediaLoaded;
    if (!hasLoaded) return;

    const duration = this._player.duration;
    this._seekableRange = new TimeRange(0, duration);

    const detail = {
        provider: this,
        duration,
        buffered: this._playedRange,
        seekable: this._getSeekableRange(),
      },
      trigger = this._createEvent(event);

    this._notify('can-play', detail, trigger);
    this._onCanControlVolumeChange();
    this._onCanSeekChange(event);
    this._timeRAF._start();
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
    const duration = this._player.duration,
      trigger = this._createEvent(event);

    this._seekableRange = new TimeRange(0, duration);
    this._notify('duration-change', duration, trigger);
  }

  protected _onVolumeChange(event: cast.framework.RemotePlayerChangedEvent) {
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

    console.log(state);

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

  protected _buildMediaInfo(src: MediaSrc<string>) {
    const { streamType, title, poster } = this._ctx.$state,
      tracks = this._getRemoteTracks();

    return new GoogleCastMediaInfoBuilder(src as MediaSrc<string>)
      ._setMetadata(title(), poster())
      ._setStreamType(streamType())
      ._setTracks(tracks)
      .build();
  }

  protected _buildLoadRequest(src: MediaSrc<string>) {
    const mediaInfo = this._buildMediaInfo(src),
      request = new chrome.cast.media.LoadRequest(mediaInfo),
      info = this._ctx.$state.remotePlaybackInfo();

    request.autoplay = !info?.savedState?.paused;
    request.currentTime = info?.savedState?.currentTime ?? 0;
    request.activeTrackIds = this._getActiveRemoteTrackIds();

    return request;
  }

  protected _getRemoteTracks() {
    return this._ctx.textTracks.toArray().filter((track) => track.src && track.type === 'vtt');
  }

  protected _getActiveRemoteTrackIds(): number[] {
    const tracks = this._getRemoteTracks(),
      activeIds: number[] = [];

    for (let id = 0; id < tracks.length; id++) {
      if (tracks[id].mode === 'showing') activeIds.push(id);
    }

    return activeIds;
  }
}
