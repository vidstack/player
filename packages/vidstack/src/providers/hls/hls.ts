import type * as HLS from 'hls.js';
import { effect, peek } from 'maverick.js';
import { camelToKebabCase, DOMEvent, isString, listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { Src } from '../../core/api/src-types';
import { QualitySymbol } from '../../core/quality/symbols';
import { TextTrackSymbol } from '../../core/tracks/text/symbols';
import { TextTrack } from '../../core/tracks/text/text-track';
import { ListSymbol } from '../../foundation/list/symbols';
import { RAFLoop } from '../../foundation/observers/raf-loop';
import { IS_CHROME } from '../../utils/support';
import type { HLSConstructor, HLSInstanceCallback } from './types';

const toDOMEventType = (type: string) => camelToKebabCase(type);

export class HLSController {
  private _instance: HLS.default | null = null;
  private _stopLiveSync: (() => void) | null = null;

  _config: Partial<HLS.HlsConfig> = {};
  _callbacks = new Set<HLSInstanceCallback>();

  get instance() {
    return this._instance;
  }

  constructor(
    private _video: HTMLVideoElement,
    protected _ctx: MediaContext,
  ) {}

  setup(ctor: HLSConstructor) {
    const { streamType } = this._ctx.$state;

    const isLive = peek(streamType).includes('live'),
      isLiveLowLatency = peek(streamType).includes('ll-');

    this._instance = new ctor({
      lowLatencyMode: isLiveLowLatency,
      backBufferLength: isLiveLowLatency ? 4 : isLive ? 8 : undefined,
      renderTextTracksNatively: false,
      ...this._config,
    });

    const dispatcher = this._dispatchHLSEvent.bind(this);
    for (const event of Object.values(ctor.Events)) this._instance.on(event, dispatcher);

    this._instance.on(ctor.Events.ERROR, this._onError.bind(this));
    for (const callback of this._callbacks) callback(this._instance);

    this._ctx.player.dispatch('hls-instance', {
      detail: this._instance,
    });

    this._instance.attachMedia(this._video);
    this._instance.on(ctor.Events.FRAG_LOADING, this._onFragLoading.bind(this));
    this._instance.on(ctor.Events.AUDIO_TRACK_SWITCHED, this._onAudioSwitch.bind(this));
    this._instance.on(ctor.Events.LEVEL_SWITCHED, this._onLevelSwitched.bind(this));
    this._instance.on(ctor.Events.LEVEL_LOADED, this._onLevelLoaded.bind(this));
    this._instance.on(ctor.Events.NON_NATIVE_TEXT_TRACKS_FOUND, this._onTracksFound.bind(this));
    this._instance.on(ctor.Events.CUES_PARSED, this._onCuesParsed.bind(this));

    this._ctx.qualities[QualitySymbol._enableAuto] = this._enableAutoQuality.bind(this);

    listenEvent(this._ctx.qualities, 'change', this._onQualityChange.bind(this));
    listenEvent(this._ctx.audioTracks, 'change', this._onAudioChange.bind(this));

    this._stopLiveSync = effect(this._liveSync.bind(this));
  }

  private _liveSync() {
    if (!this._ctx.$state.live()) return;
    const raf = new RAFLoop(this._liveSyncPosition.bind(this));
    raf._start();
    return raf._stop.bind(raf);
  }

  private _liveSyncPosition() {
    this._ctx.$state.liveSyncPosition.set(this._instance?.liveSyncPosition ?? Infinity);
  }

  private _dispatchHLSEvent(eventType: string, detail: any) {
    this._ctx.player?.dispatch(new DOMEvent(toDOMEventType(eventType), { detail }));
  }

  private _onTracksFound(eventType: string, data: HLS.NonNativeTextTracksData) {
    const event = new DOMEvent<HLS.NonNativeTextTracksData>(eventType, { detail: data });

    let currentTrack = -1;
    for (let i = 0; i < data.tracks.length; i++) {
      const nonNativeTrack = data.tracks[i],
        init = nonNativeTrack.subtitleTrack ?? nonNativeTrack.closedCaptions,
        track = new TextTrack({
          id: `hls-${nonNativeTrack!.kind}${i}`,
          src: init?.url,
          label: nonNativeTrack!.label,
          language: init?.lang,
          kind: nonNativeTrack!.kind as TextTrackKind,
          default: nonNativeTrack.default,
        });

      track[TextTrackSymbol._readyState] = 2;
      track[TextTrackSymbol._onModeChange] = () => {
        if (track.mode === 'showing') {
          this._instance!.subtitleTrack = i;
          currentTrack = i;
        } else if (currentTrack === i) {
          this._instance!.subtitleTrack = -1;
          currentTrack = -1;
        }
      };

      this._ctx.textTracks.add(track, event);
    }
  }

  private _onCuesParsed(eventType: string, data: HLS.CuesParsedData) {
    const track = this._ctx.textTracks.getById(`hls-${data.track}`);
    if (!track) return;
    const event = new DOMEvent<HLS.CuesParsedData>(eventType, { detail: data });
    for (const cue of data.cues) {
      cue.positionAlign = 'auto';
      track.addCue(cue, event);
    }
  }

  private _onAudioSwitch(eventType: string, data: HLS.AudioTrackSwitchedData) {
    const track = this._ctx.audioTracks[data.id];
    if (track) {
      const trigger = new DOMEvent(eventType, { detail: data });
      this._ctx.audioTracks[ListSymbol._select](track, true, trigger);
    }
  }

  private _onLevelSwitched(eventType: string, data: HLS.LevelSwitchedData) {
    const quality = this._ctx.qualities[data.level];
    if (quality) {
      const trigger = new DOMEvent(eventType, { detail: data });
      this._ctx.qualities[ListSymbol._select](quality, true, trigger);
    }
  }

  private _onLevelLoaded(eventType: string, data: HLS.LevelLoadedData): void {
    if (this._ctx.$state.canPlay()) return;

    const { type, live, totalduration: duration, targetduration } = data.details,
      trigger = new DOMEvent(eventType, { detail: data });

    this._ctx.delegate._notify(
      'stream-type-change',
      live
        ? type === 'EVENT' && Number.isFinite(duration) && targetduration >= 10
          ? 'live:dvr'
          : 'live'
        : 'on-demand',
      trigger,
    );

    this._ctx.delegate._notify('duration-change', duration, trigger);

    const media = this._instance!.media!;

    if (this._instance!.currentLevel === -1) {
      this._ctx.qualities[QualitySymbol._setAuto](true, trigger);
    }

    for (const remoteTrack of this._instance!.audioTracks) {
      const localTrack = {
        id: remoteTrack.id.toString(),
        label: remoteTrack.name,
        language: remoteTrack.lang || '',
        kind: 'main',
      };

      this._ctx.audioTracks[ListSymbol._add](localTrack, trigger);
    }

    for (const level of this._instance!.levels) {
      const videoQuality = {
        id: level.id?.toString() ?? level.height + 'p',
        width: level.width,
        height: level.height,
        codec: level.codecSet,
        bitrate: level.bitrate,
      };

      this._ctx.qualities[ListSymbol._add](videoQuality, trigger);
    }

    media.dispatchEvent(new DOMEvent<void>('canplay', { trigger }));
  }

  private _onError(eventType: string, data: HLS.ErrorData) {
    if (__DEV__) {
      this._ctx.logger
        ?.errorGroup(`[vidstack] HLS error \`${eventType}\``)
        .labelledLog('Media Element', this._instance?.media)
        .labelledLog('HLS Instance', this._instance)
        .labelledLog('Event Type', eventType)
        .labelledLog('Data', data)
        .labelledLog('Src', peek(this._ctx.$state.source))
        .labelledLog('Media Store', { ...this._ctx.$state })
        .dispatch();
    }

    if (data.fatal) {
      switch (data.type) {
        case 'networkError':
          this._onNetworkError(data.error);
          break;
        case 'mediaError':
          this._instance?.recoverMediaError();
          break;
        default:
          this._onFatalError(data.error);
          break;
      }
    }
  }

  private _onFragLoading() {
    if (this._retryLoadingTimer >= 0) this._clearRetryTimer();
  }

  private _retryLoadingTimer = -1;
  private _onNetworkError(error: Error) {
    this._clearRetryTimer();

    this._instance?.startLoad();

    this._retryLoadingTimer = window.setTimeout(() => {
      this._retryLoadingTimer = -1;
      this._onFatalError(error);
    }, 5000);
  }

  private _clearRetryTimer() {
    clearTimeout(this._retryLoadingTimer);
    this._retryLoadingTimer = -1;
  }

  private _onFatalError(error: Error) {
    // We can't recover here - better course of action?
    this._instance?.destroy();
    this._instance = null;
    this._ctx.delegate._notify('error', {
      message: error.message,
      code: 1,
      error: error,
    });
  }

  private _enableAutoQuality() {
    if (this._instance) this._instance.currentLevel = -1;
  }

  private _onQualityChange() {
    const { qualities } = this._ctx;
    if (!this._instance || qualities.auto) return;
    this._instance[qualities.switch + 'Level'] = qualities.selectedIndex;
    /**
     * Chrome has some strange issue with detecting keyframes inserted before the current
     * playhead position. This can cause playback to freeze until a new keyframe. It seems
     * setting the current time forces chrome to seek back to the last keyframe and adjust
     * playback. Weird fix, but it works!
     */
    if (IS_CHROME) this._video.currentTime = this._video.currentTime;
  }

  private _onAudioChange() {
    const { audioTracks } = this._ctx;
    if (this._instance && this._instance.audioTrack !== audioTracks.selectedIndex) {
      this._instance.audioTrack = audioTracks.selectedIndex;
    }
  }

  _loadSource(src: Src) {
    if (!isString(src.src)) return;
    this._clearRetryTimer();
    this._instance?.loadSource(src.src);
  }

  _destroy() {
    this._clearRetryTimer();
    this._instance?.destroy();
    this._instance = null;
    this._stopLiveSync?.();
    this._stopLiveSync = null;
    if (__DEV__) this._ctx?.logger?.info('🏗️ Destroyed HLS instance');
  }
}
