import type * as DASH from 'dashjs';
import { effect, peek } from 'maverick.js';
import { camelToKebabCase, DOMEvent, isNumber, isString, listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { Src } from '../../core/api/src-types';
import { QualitySymbol } from '../../core/quality/symbols';
import { TextTrackSymbol } from '../../core/tracks/text/symbols';
import { TextTrack } from '../../core/tracks/text/text-track';
import { ListSymbol } from '../../foundation/list/symbols';
import { RAFLoop } from '../../foundation/observers/raf-loop';
import { canPlayAudioType, canPlayVideoType, IS_CHROME } from '../../utils/support';
import type { DASHConstructor, DASHInstanceCallback } from './types';

export type DashGetMediaTracks = (type: DASH.MediaType, manifest: object) => DASH.MediaInfo[];

const toDOMEventType = (type: string) => `dash-${camelToKebabCase(type)}`;

export class DASHController {
  private _instance: DASH.MediaPlayerClass | null = null;
  private _stopLiveSync: (() => void) | null = null;

  _config: Partial<DASH.MediaPlayerSettingClass> = {};
  _callbacks = new Set<DASHInstanceCallback>();

  get instance() {
    return this._instance;
  }

  constructor(
    private _video: HTMLVideoElement,
    protected _ctx: MediaContext,
  ) {}

  setup(ctor: DASHConstructor) {
    this._instance = ctor().create();

    const dispatcher = this._dispatchDASHEvent.bind(this);
    for (const event of Object.values(ctor.events)) this._instance.on(event, dispatcher);

    this._instance.on(ctor.events.ERROR, this._onError.bind(this));
    for (const callback of this._callbacks) callback(this._instance);

    this._ctx.player.dispatch('dash-instance' as any, {
      detail: this._instance,
    });

    this._instance.initialize(this._video, undefined, false);

    this._instance.updateSettings({
      streaming: {
        text: {
          // Disabling text rendering by dash.
          defaultEnabled: false,
          dispatchForManualRendering: true,
        },
        buffer: {
          /// Enables buffer replacement when switching bitrates for faster switching.
          fastSwitchEnabled: true,
        },
      },
      ...this._config,
    });

    this._instance.on(ctor.events.FRAGMENT_LOADING_STARTED, this._onFragmentLoadStart.bind(this));
    this._instance.on(
      ctor.events.FRAGMENT_LOADING_COMPLETED,
      this._onFragmentLoadComplete.bind(this),
    );
    this._instance.on(ctor.events.MANIFEST_LOADED, this._onManifestLoaded.bind(this));
    this._instance.on(ctor.events.QUALITY_CHANGE_RENDERED, this._onQualityChange.bind(this));
    this._instance.on(ctor.events.TEXT_TRACKS_ADDED, this._onTextTracksAdded.bind(this));
    this._instance.on(ctor.events.TRACK_CHANGE_RENDERED, this._onTrackChange.bind(this));

    this._ctx.qualities[QualitySymbol._enableAuto] = this._enableAutoQuality.bind(this);

    listenEvent(this._ctx.qualities, 'change', this._onUserQualityChange.bind(this));
    listenEvent(this._ctx.audioTracks, 'change', this._onUserAudioChange.bind(this));

    this._stopLiveSync = effect(this._liveSync.bind(this));
  }

  private _createDOMEvent(event: DASH.Event) {
    return new DOMEvent(toDOMEventType(event.type), { detail: event });
  }

  private _liveSync() {
    if (!this._ctx.$state.live()) return;
    const raf = new RAFLoop(this._liveSyncPosition.bind(this));
    raf._start();
    return raf._stop.bind(raf);
  }

  private _liveSyncPosition() {
    if (!this._instance) return;
    const position = this._instance.duration() - this._instance.time();
    this._ctx.$state.liveSyncPosition.set(!isNaN(position) ? position : Infinity);
  }

  private _dispatchDASHEvent(event: DASH.Event) {
    this._ctx.player?.dispatch(this._createDOMEvent(event));
  }

  private _currentTrack: TextTrack | null = null;
  private _cueTracker: Record<string, number> = {};

  private _onTextFragmentLoaded(event: DASH.FragmentLoadingCompletedEvent) {
    const native = this._currentTrack?.[TextTrackSymbol._native],
      cues = (native?.track as globalThis.TextTrack).cues;

    if (!native || !cues) return;

    const id = this._currentTrack!.id,
      startIndex = this._cueTracker[id] ?? 0,
      trigger = this._createDOMEvent(event);

    for (let i = startIndex; i < cues.length; i++) {
      const cue = cues[i] as VTTCue;
      if (!cue.positionAlign) cue.positionAlign = 'auto';
      this._currentTrack!.addCue(cue, trigger);
    }

    this._cueTracker[id] = cues.length;
  }

  private _onTextTracksAdded(event: DASH.TextTracksAddedEvent) {
    if (!this._instance) return;

    const data = event.tracks,
      nativeTextTracks = [...this._video.textTracks].filter((track) => 'manualMode' in track),
      trigger = this._createDOMEvent(event);

    for (let i = 0; i < nativeTextTracks.length; i++) {
      const textTrackInfo = data[i],
        nativeTextTrack = nativeTextTracks[i];

      const id = `dash-${textTrackInfo.kind}-${i}`,
        track = new TextTrack({
          id,
          label:
            textTrackInfo?.label ??
            textTrackInfo.labels.find((t) => t.text)?.text ??
            textTrackInfo?.lang ??
            undefined,
          language: textTrackInfo.lang ?? undefined,
          kind: textTrackInfo!.kind as TextTrackKind,
          default: textTrackInfo.defaultTrack,
        });

      track[TextTrackSymbol._native] = {
        managed: true,
        track: nativeTextTrack,
      };

      track[TextTrackSymbol._readyState] = 2;

      track[TextTrackSymbol._onModeChange] = () => {
        if (!this._instance) return;
        if (track.mode === 'showing') {
          this._instance.setTextTrack(i);
          this._currentTrack = track;
        } else {
          this._instance.setTextTrack(-1);
          this._currentTrack = null;
        }
      };

      this._ctx.textTracks.add(track, trigger);
    }
  }

  private _onTrackChange(event: DASH.Event) {
    const { mediaType, newMediaInfo } = event as DASH.TrackChangeRenderedEvent;

    if (mediaType === 'audio') {
      const track = this._ctx.audioTracks.getById(`dash-audio-${newMediaInfo.index}`);
      if (track) {
        const trigger = this._createDOMEvent(event);
        this._ctx.audioTracks[ListSymbol._select](track, true, trigger);
      }
    }
  }

  private _onQualityChange(event: DASH.QualityChangeRenderedEvent) {
    if (event.mediaType !== 'video') return;

    const quality = this._ctx.qualities[event.newQuality];

    if (quality) {
      const trigger = this._createDOMEvent(event);
      this._ctx.qualities[ListSymbol._select](quality, true, trigger);
    }
  }

  private _onManifestLoaded(event: DASH.ManifestLoadedEvent) {
    if (this._ctx.$state.canPlay() || !this._instance) return;

    const { type, mediaPresentationDuration } = event.data as DASH.Mpd & DASH.AdaptationSet,
      trigger = this._createDOMEvent(event);

    this._ctx.delegate._notify(
      'stream-type-change',
      type !== 'static' ? 'live' : 'on-demand',
      trigger,
    );

    this._ctx.delegate._notify('duration-change', mediaPresentationDuration, trigger);

    this._ctx.qualities[QualitySymbol._setAuto](true, trigger);

    const media = this._instance.getVideoElement();

    // getting videos from manifest whose type is supported
    const videoQualities = (this._instance.getTracksForTypeFromManifest as DashGetMediaTracks)(
      'video',
      event.data,
    );

    const supportedVideoMimeType = [...new Set(videoQualities.map((e) => e.mimeType))].find(
      (type) => type && canPlayVideoType(media, type),
    );

    const videoQuality = videoQualities.filter(
      (track) => supportedVideoMimeType === track.mimeType,
    )[0];

    let audioTracks = (this._instance.getTracksForTypeFromManifest as DashGetMediaTracks)(
      'audio',
      event.data,
    );

    const supportedAudioMimeType = [...new Set(audioTracks.map((e) => e.mimeType))].find(
      (type) => type && canPlayAudioType(media, type),
    );

    audioTracks = audioTracks.filter((track) => supportedAudioMimeType === track.mimeType);

    videoQuality.bitrateList.forEach((bitrate, index) => {
      const quality = {
        id: bitrate.id?.toString() ?? `dash-bitrate-${index}`,
        width: bitrate.width ?? 0,
        height: bitrate.height ?? 0,
        bitrate: bitrate.bandwidth ?? 0,
        codec: videoQuality.codec,
        index,
      };

      this._ctx.qualities[ListSymbol._add](quality, trigger);
    });

    if (isNumber(videoQuality.index)) {
      const quality = this._ctx.qualities[videoQuality.index];
      if (quality) this._ctx.qualities[ListSymbol._select](quality, true, trigger);
    }

    audioTracks.forEach((audioTrack: DASH.MediaInfo & { label?: string | null }, index) => {
      const localTrack = {
        id: `dash-audio-${audioTrack?.index}`,
        label: audioTrack.label ?? audioTrack.lang ?? '',
        language: audioTrack.lang ?? '',
        kind: 'main',
        mimeType: audioTrack.mimeType,
        codec: audioTrack.codec,
        index,
      };

      this._ctx.audioTracks[ListSymbol._add](localTrack, trigger);
    });

    media.dispatchEvent(new DOMEvent<void>('canplay', { trigger }));
  }

  private _onError(event: DASH.Event) {
    const { type: eventType, error: data } = event as DASH.MediaPlayerErrorEvent;

    if (__DEV__) {
      this._ctx.logger
        ?.errorGroup(`[vidstack] DASH error \`${data.message}\``)
        .labelledLog('Media Element', this._video)
        .labelledLog('HLS Instance', this._instance)
        .labelledLog('Event Type', eventType)
        .labelledLog('Data', data)
        .labelledLog('Src', peek(this._ctx.$state.source))
        .labelledLog('Media Store', { ...this._ctx.$state })
        .dispatch();
    }

    switch (data.code) {
      case 27:
        this._onNetworkError(data);
        break;
      default:
        this._onFatalError(data);
        break;
    }
  }

  private _onFragmentLoadStart() {
    if (this._retryLoadingTimer >= 0) this._clearRetryTimer();
  }

  private _onFragmentLoadComplete(event: DASH.FragmentLoadingCompletedEvent) {
    const mediaType = (event as any).mediaType as 'audio' | 'video' | 'text';
    if (mediaType === 'text') {
      // It seems like text cues are synced on animation frames.
      requestAnimationFrame(this._onTextFragmentLoaded.bind(this, event));
    }
  }

  private _retryLoadingTimer = -1;
  private _onNetworkError(error: DASH.DashJSError) {
    this._clearRetryTimer();

    this._instance?.play();

    this._retryLoadingTimer = window.setTimeout(() => {
      this._retryLoadingTimer = -1;
      this._onFatalError(error);
    }, 5000);
  }

  private _clearRetryTimer() {
    clearTimeout(this._retryLoadingTimer);
    this._retryLoadingTimer = -1;
  }

  private _onFatalError(error: DASH.DashJSError) {
    this._ctx.delegate._notify('error', {
      message: error.message ?? '',
      code: 1,
      error: error as any,
    });
  }

  private _enableAutoQuality() {
    this._switchAutoBitrate('video', true);
    // Force update so ABR engine can re-calc.
    const { qualities } = this._ctx;
    this._instance?.setQualityFor('video', qualities.selectedIndex, true);
  }

  private _switchAutoBitrate(type: DASH.MediaType, auto: boolean) {
    this._instance?.updateSettings({
      streaming: { abr: { autoSwitchBitrate: { [type]: auto } } },
    });
  }

  private _onUserQualityChange() {
    const { qualities } = this._ctx;

    if (!this._instance || qualities.auto || !qualities.selected) return;

    this._switchAutoBitrate('video', false);
    this._instance.setQualityFor('video', qualities.selectedIndex, qualities.switch === 'current');

    /**
     * Chrome has some strange issue with detecting keyframes inserted before the current
     * playhead position. This can cause playback to freeze until a new keyframe. It seems
     * setting the current time forces chrome to seek back to the last keyframe and adjust
     * playback. Weird fix, but it works!
     */
    if (IS_CHROME) {
      this._video.currentTime = this._video.currentTime;
    }
  }

  private _onUserAudioChange() {
    if (!this._instance) return;

    const { audioTracks } = this._ctx,
      selectedTrack = this._instance
        .getTracksFor('audio')
        .find(
          (track) =>
            audioTracks.selected && audioTracks.selected.id === `dash-audio-${track.index}`,
        );

    if (selectedTrack) this._instance.setCurrentTrack(selectedTrack);
  }

  private _reset() {
    this._clearRetryTimer();
    this._currentTrack = null;
    this._cueTracker = {};
  }

  loadSource(src: Src) {
    this._reset();
    if (!isString(src.src)) return;
    this._instance?.attachSource(src.src);
  }

  destroy() {
    this._reset();
    this._instance?.destroy();
    this._instance = null;
    this._stopLiveSync?.();
    this._stopLiveSync = null;
    if (__DEV__) this._ctx?.logger?.info('🏗️ Destroyed DASH instance');
  }
}
