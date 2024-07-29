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

  #player: cast.framework.RemotePlayer;
  #ctx: MediaContext;
  #tracks: GoogleCastTracksManager;

  #currentSrc: Src<string> | null = null;
  #state: RemotePlaybackState = 'disconnected';
  #currentTime = 0;
  #played = 0;
  #seekableRange = new TimeRange(0, 0);
  #timeRAF = new RAFLoop(this.#onAnimationFrame.bind(this));
  #playerEventHandlers!: Record<string, RemotePlayerEventCallback>;
  #reloadInfo: { src: Src; paused: boolean; time: number } | null = null;
  #isIdle = false;

  constructor(player: cast.framework.RemotePlayer, ctx: MediaContext) {
    this.#player = player;
    this.#ctx = ctx;
    this.#tracks = new GoogleCastTracksManager(player, ctx, this.#onNewLocalTracks.bind(this));
  }

  get type() {
    return 'google-cast';
  }

  get currentSrc() {
    return this.#currentSrc;
  }

  /**
   * The Google Cast remote player.
   *
   * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.RemotePlayer}
   */
  get player() {
    return this.#player;
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
    return hasActiveCastSession(this.#currentSrc);
  }

  setup() {
    this.#attachCastContextEventListeners();
    this.#attachCastPlayerEventListeners();

    this.#tracks.setup();

    this.#ctx.notify('provider-setup', this);
  }

  #attachCastContextEventListeners() {
    listenCastContextEvent(
      cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      this.#onCastStateChange.bind(this),
    );
  }

  #attachCastPlayerEventListeners() {
    const Event = cast.framework.RemotePlayerEventType,
      handlers = {
        [Event.IS_CONNECTED_CHANGED]: this.#onCastStateChange,
        [Event.IS_MEDIA_LOADED_CHANGED]: this.#onMediaLoadedChange,
        [Event.CAN_CONTROL_VOLUME_CHANGED]: this.#onCanControlVolumeChange,
        [Event.CAN_SEEK_CHANGED]: this.#onCanSeekChange,
        [Event.DURATION_CHANGED]: this.#onDurationChange,
        [Event.IS_MUTED_CHANGED]: this.#onVolumeChange,
        [Event.VOLUME_LEVEL_CHANGED]: this.#onVolumeChange,
        [Event.IS_PAUSED_CHANGED]: this.#onPausedChange,
        [Event.LIVE_SEEKABLE_RANGE_CHANGED]: this.#onProgress,
        [Event.PLAYER_STATE_CHANGED]: this.#onPlayerStateChange,
      };

    this.#playerEventHandlers = handlers;

    const handler = this.#onRemotePlayerEvent.bind(this);

    for (const type of keysOf(handlers)) {
      this.#player.controller!.addEventListener(type, handler);
    }

    onDispose(() => {
      for (const type of keysOf(handlers)) {
        this.#player.controller!.removeEventListener(type, handler);
      }
    });
  }

  async play() {
    if (!this.#player.isPaused && !this.#isIdle) return;

    if (this.#isIdle) {
      await this.#reload(false, 0);
      return;
    }

    this.#player.controller?.playOrPause();
  }

  async pause() {
    if (this.#player.isPaused) return;
    this.#player.controller?.playOrPause();
  }

  getMediaStatus(request: chrome.cast.media.GetStatusRequest) {
    return new Promise((resolve, reject) => {
      this.media?.getStatus(request, resolve, reject);
    });
  }

  setMuted(muted: boolean) {
    const hasChanged = (muted && !this.#player!.isMuted) || (!muted && this.#player!.isMuted);
    if (hasChanged) this.#player.controller?.muteOrUnmute();
  }

  setCurrentTime(time: number) {
    this.#player.currentTime = time;
    this.#ctx.notify('seeking', time);
    this.#player.controller?.seek();
  }

  setVolume(volume: number) {
    this.#player.volumeLevel = volume;
    this.#player.controller?.setVolumeLevel();
  }

  async loadSource(src: Src) {
    if (this.#reloadInfo?.src !== src) this.#reloadInfo = null;

    if (hasActiveCastSession(src)) {
      this.#resumeSession();
      this.#currentSrc = src as Src<string>;
      return;
    }

    this.#ctx.notify('load-start');

    const loadRequest = this.#buildLoadRequest(src as Src<string>),
      errorCode = await this.session!.loadMedia(loadRequest);

    if (errorCode) {
      this.#currentSrc = null;
      this.#ctx.notify('error', Error(getCastErrorMessage(errorCode)));
      return;
    }

    this.#currentSrc = src as Src<string>;
  }

  destroy() {
    this.#reset();
    this.#endSession();
  }

  #reset() {
    if (!this.#reloadInfo) {
      this.#played = 0;
      this.#seekableRange = new TimeRange(0, 0);
    }

    this.#timeRAF.stop();
    this.#currentTime = 0;
    this.#reloadInfo = null;
  }

  #resumeSession() {
    const resumeSessionEvent = new DOMEvent('resume-session', { detail: this.session! });
    this.#onMediaLoadedChange(resumeSessionEvent);

    const { muted, volume, savedState } = this.#ctx.$state,
      localState = savedState();

    // Set time to whatever is further ahead (local/remote).
    this.setCurrentTime(Math.max(this.#player.currentTime, localState?.currentTime ?? 0));

    this.setMuted(muted());
    this.setVolume(volume());

    if (localState?.paused === false) this.play();
  }

  #endSession() {
    this.cast.endCurrentSession(true);
    const { remotePlaybackLoader } = this.#ctx.$state;
    remotePlaybackLoader.set(null);
  }

  #disconnectFromReceiver() {
    const { savedState } = this.#ctx.$state;

    savedState.set({
      paused: this.#player.isPaused,
      currentTime: this.#player.currentTime,
    });

    this.#endSession();
  }

  #onAnimationFrame() {
    this.#onCurrentTimeChange();
  }

  #onRemotePlayerEvent(event: cast.framework.RemotePlayerChangedEvent) {
    this.#playerEventHandlers[event.type].call(this, event);
  }

  #onCastStateChange(
    data: cast.framework.CastStateEventData | cast.framework.RemotePlayerChangedEvent,
  ) {
    const castState = this.cast.getCastState(),
      state: RemotePlaybackState =
        castState === cast.framework.CastState.CONNECTED
          ? 'connected'
          : castState === cast.framework.CastState.CONNECTING
            ? 'connecting'
            : 'disconnected';

    if (this.#state === state) return;

    const detail = { type: 'google-cast', state } as const,
      trigger = this.#createEvent(data);

    this.#state = state;
    this.#ctx.notify('remote-playback-change', detail, trigger);

    if (state === 'disconnected') {
      this.#disconnectFromReceiver();
    }
  }

  #onMediaLoadedChange(event: Event | cast.framework.RemotePlayerChangedEvent) {
    const hasLoaded = !!this.#player.isMediaLoaded;
    if (!hasLoaded) return;

    const src = peek(this.#ctx.$state.source);

    // Media info not available yet due to some internal issue in cast framework.
    Promise.resolve().then(() => {
      // Check src to avoid race condition.
      if (src !== peek(this.#ctx.$state.source) || !this.#player.isMediaLoaded) return;

      this.#reset();

      const duration = this.#player.duration;
      this.#seekableRange = new TimeRange(0, duration);

      const detail = {
          provider: this,
          duration,
          buffered: new TimeRange(0, 0),
          seekable: this.#getSeekableRange(),
        },
        trigger = this.#createEvent(event);

      this.#ctx.notify('loaded-metadata', undefined, trigger);
      this.#ctx.notify('loaded-data', undefined, trigger);
      this.#ctx.notify('can-play', detail, trigger);

      this.#onCanControlVolumeChange();
      this.#onCanSeekChange(event);

      const { volume, muted } = this.#ctx.$state;
      this.setVolume(volume());
      this.setMuted(muted());

      this.#timeRAF.start();

      this.#tracks.syncRemoteTracks(trigger);
      this.#tracks.syncRemoteActiveIds(trigger);
    });
  }

  #onCanControlVolumeChange() {
    this.#ctx.$state.canSetVolume.set(this.#player.canControlVolume);
  }

  #onCanSeekChange(event: Event | cast.framework.RemotePlayerChangedEvent) {
    const trigger = this.#createEvent(event);
    this.#ctx.notify('stream-type-change', this.#getStreamType(), trigger);
  }

  #getStreamType(): MediaStreamType {
    const streamType = this.#player.mediaInfo?.streamType;
    return streamType === chrome.cast.media.StreamType.LIVE
      ? this.#player.canSeek
        ? 'live:dvr'
        : 'live'
      : 'on-demand';
  }

  #onCurrentTimeChange() {
    if (this.#reloadInfo) return;

    const currentTime = this.#player.currentTime;
    if (currentTime === this.#currentTime) return;

    this.#ctx.notify('time-change', currentTime);

    if (currentTime > this.#played) {
      this.#played = currentTime;
      this.#onProgress();
    }

    if (this.#ctx.$state.seeking()) {
      this.#ctx.notify('seeked', currentTime);
    }

    this.#currentTime = currentTime;
  }

  #onDurationChange(event: cast.framework.RemotePlayerChangedEvent) {
    // Duration will go to 0 on end as cast player state changes to idle.
    if (!this.#player.isMediaLoaded || this.#reloadInfo) return;

    const duration = this.#player.duration,
      trigger = this.#createEvent(event);

    this.#seekableRange = new TimeRange(0, duration);
    this.#ctx.notify('duration-change', duration, trigger);
  }

  #onVolumeChange(event: cast.framework.RemotePlayerChangedEvent) {
    if (!this.#player.isMediaLoaded) return;

    const detail = {
        muted: this.#player.isMuted,
        volume: this.#player.volumeLevel,
      },
      trigger = this.#createEvent(event);

    this.#ctx.notify('volume-change', detail, trigger);
  }

  #onPausedChange(event: cast.framework.RemotePlayerChangedEvent) {
    const trigger = this.#createEvent(event);
    if (this.#player.isPaused) {
      this.#ctx.notify('pause', undefined, trigger);
    } else {
      this.#ctx.notify('play', undefined, trigger);
    }
  }

  #onProgress(event?: cast.framework.RemotePlayerChangedEvent) {
    const detail = {
        seekable: this.#getSeekableRange(),
        buffered: new TimeRange(0, this.#played),
      },
      trigger = event ? this.#createEvent(event) : undefined;

    this.#ctx.notify('progress', detail, trigger);
  }

  #onPlayerStateChange(event: cast.framework.RemotePlayerChangedEvent) {
    const state = this.#player.playerState,
      PlayerState = chrome.cast.media.PlayerState;

    this.#isIdle = state === PlayerState.IDLE;

    // Handled in `onPausedChange`.
    if (state === PlayerState.PAUSED) return;

    const trigger = this.#createEvent(event);

    switch (state) {
      case PlayerState.PLAYING:
        this.#ctx.notify('playing', undefined, trigger);
        break;
      case PlayerState.BUFFERING:
        this.#ctx.notify('waiting', undefined, trigger);
        break;
      case PlayerState.IDLE:
        this.#timeRAF.stop();
        this.#ctx.notify('pause');
        this.#ctx.notify('end');
        break;
    }
  }

  #getSeekableRange() {
    return this.#player.liveSeekableRange
      ? new TimeRange(this.#player.liveSeekableRange.start, this.#player.liveSeekableRange.end)
      : this.#seekableRange;
  }

  #createEvent(detail: Event | { type: string }) {
    return detail instanceof Event ? detail : new DOMEvent<any>(detail.type, { detail });
  }

  #buildMediaInfo(src: Src<string>) {
    const { streamType, title, poster } = this.#ctx.$state;
    return new GoogleCastMediaInfoBuilder(src)
      .setMetadata(title(), poster())
      .setStreamType(streamType())
      .setTracks(this.#tracks.getLocalTextTracks())
      .build();
  }

  #buildLoadRequest(src: Src<string>) {
    const mediaInfo = this.#buildMediaInfo(src),
      request = new chrome.cast.media.LoadRequest(mediaInfo),
      savedState = this.#ctx.$state.savedState();

    request.autoplay = (this.#reloadInfo?.paused ?? savedState?.paused) === false;
    request.currentTime = this.#reloadInfo?.time ?? savedState?.currentTime ?? 0;

    return request;
  }

  async #reload(paused: boolean, time: number) {
    const src = peek(this.#ctx.$state.source);
    this.#reloadInfo = { src, paused, time };
    await this.loadSource(src);
  }

  #onNewLocalTracks() {
    this.#reload(this.#player.isPaused, this.#player.currentTime).catch((error) => {
      if (__DEV__) {
        this.#ctx.logger
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
