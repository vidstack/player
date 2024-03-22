import type * as DASH from 'dashjs';
import { effect, peek } from 'maverick.js';
import { camelToKebabCase, DOMEvent, isString, listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { Src } from '../../core/api/src-types';
import { QualitySymbol } from '../../core/quality/symbols';
import { TextTrackSymbol } from '../../core/tracks/text/symbols';
import { TextTrack } from '../../core/tracks/text/text-track';
import { ListSymbol } from '../../foundation/list/symbols';
import { RAFLoop } from '../../foundation/observers/raf-loop';
import { canPlayAudioType, canPlayVideoType, IS_CHROME } from '../../utils/support';
import type { DashConstructor, DashInstanceCallback } from './types';

export type DashGetMediaTracks = (type: DASH.MediaType, manifest: object) => DASH.MediaInfo[];

const toDOMEventType = (type: string) => camelToKebabCase(type);

export class DASHController {
  private _instance: DASH.MediaPlayerClass | null = null;
  private _stopLiveSync: (() => void) | null = null;

  _config: Partial<DASH.MediaPlayerSettingClass> = {};
  _callbacks = new Set<DashInstanceCallback>();

  get instance() {
    return this._instance;
  }

  constructor(
    private _video: HTMLVideoElement,
    protected _ctx: MediaContext,
  ) {}

  setup(ctor: DashConstructor) {
    this._instance = ctor().create();

    const dispatcher = this._dispatchDASHEvent.bind(this);
    for (const event of Object.values(ctor.events)) this._instance.on(event, dispatcher);

    this._instance.on(ctor.events.ERROR, this._onError.bind(this));
    for (const callback of this._callbacks) callback(this._instance);

    this._ctx.player.dispatch('dash-instance' as any, {
      detail: this._instance,
    });

    this._instance.initialize(this._video, undefined, false);
    this._attachTTMLRenderingDiv();

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

    this._instance.on(ctor.events.FRAGMENT_LOADING_STARTED, this._onFragLoading.bind(this));
    this._instance.on(ctor.events.MANIFEST_LOADED, this._onManifestLoaded.bind(this));
    this._instance.on(ctor.events.QUALITY_CHANGE_RENDERED, this._onQualitySwitched.bind(this));
    this._instance.on(ctor.events.TEXT_TRACKS_ADDED, this._onTracksFound.bind(this));
    this._instance.on(ctor.events.TRACK_CHANGE_RENDERED, this._onAudioSwitch.bind(this));
    this._ctx.qualities[QualitySymbol._enableAuto] = this._enableAutoQuality.bind(this);

    listenEvent(this._ctx.qualities, 'change', this._onQualityChange.bind(this));
    listenEvent(this._ctx.audioTracks, 'change', this._onAudioChange.bind(this));

    this._stopLiveSync = effect(this._liveSync.bind(this));
  }

  private _attachTTMLRenderingDiv() {
    if (!this._instance) return;

    this._removeTTMLRenderingDiv();

    const div = document.createElement('div');
    div.id = 'ttml-rendering-div';

    const videoElement = this._instance.getVideoElement();
    if (videoElement.parentNode) {
      videoElement.parentNode.insertBefore(div, videoElement.nextSibling);
      this._instance.attachTTMLRenderingDiv(div);
    }
  }

  private _removeTTMLRenderingDiv() {
    const div = document.getElementById('ttml-rendering-div');
    if (div) div.remove();
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

  private _dispatchDASHEvent(event: any) {
    const eventType = event.type,
      detail = event;
    this._ctx.player?.dispatch(new DOMEvent(toDOMEventType(eventType), { detail }));
  }

  private _textManualRendering(enable: boolean) {
    if (!this._instance) return;
    // render text manually or let dashjs render it
    this._instance.updateSettings({
      streaming: {
        text: {
          dispatchForManualRendering: enable,
        },
      },
    });
  }

  private _onTracksFound(event: DASH.TextTracksAddedEvent) {
    if (!this._instance) return;

    const data = event.tracks;

    /*
     * dash.js inserts text tracks into the video element, so that it can render subtitles
     * natively. for now just going to link dashTrack cues with our own textTrack.
     */
    const dashTracks = [...this._instance.getVideoElement().textTracks].filter(
      (track) => 'manualMode' in track,
    );

    data.forEach((textTrack, i) => {
      const dashTrack = dashTracks[i] as DASH.TextTrackInfo & globalThis.TextTrack;

      const track = new TextTrack({
        id: `dash-text${textTrack.lang}${i}`,
        label: textTrack?.label ?? textTrack?.lang ?? undefined,
        language: textTrack.lang ?? undefined,
        kind: textTrack!.kind as TextTrackKind,
        default: (TextTrack as any)?.default ?? false,
      });

      (track as any)._cues = dashTrack.cues;
      track[TextTrackSymbol._readyState] = 2;

      track[TextTrackSymbol._onModeChange] = () => {
        if (!this._instance) return;
        if (track.mode === 'showing') {
          dashTrack.isTTML || (dashTrack as any).isFromCEA608
            ? this._textManualRendering(false)
            : this._textManualRendering(true);
          this._instance.setTextTrack(i);
        } else {
          this._instance.setTextTrack(-1);
        }
      };

      this._ctx.textTracks.add(track, new DOMEvent(event.type, { detail: track }));
    });
  }

  private _onAudioSwitch(event: DASH.Event) {
    const { mediaType, newMediaInfo } = event as DASH.TrackChangeRenderedEvent;

    if (mediaType !== 'audio') return;

    const track = this._ctx.audioTracks.getById(`dash-audio${newMediaInfo.index}`);

    if (track) {
      const trigger = new DOMEvent(event.type, { detail: event });
      this._ctx.audioTracks[ListSymbol._select](track, true, trigger);
    }
  }

  private _onQualitySwitched(event: DASH.QualityChangeRenderedEvent) {
    if (event.mediaType !== 'video') return;

    const quality = this._ctx.qualities[event.newQuality];

    if (quality) {
      const trigger = new DOMEvent(event.type, { detail: event });
      this._ctx.qualities[ListSymbol._select](quality, true, trigger);
    }
  }

  private _onManifestLoaded(event: DASH.ManifestLoadedEvent) {
    if (this._ctx.$state.canPlay() || !this._instance) return;

    const { type, mediaPresentationDuration } = event.data as DASH.Mpd & DASH.AdaptationSet,
      trigger = new DOMEvent(event.type, { detail: event.data });

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
        id: bitrate.id?.toString() ?? `dash-bitrate${index}`,
        width: bitrate.width ?? 0,
        height: bitrate.height ?? 0,
        bitrate: bitrate.bandwidth ?? 0,
        codec: videoQuality.codec,
        index,
      };

      this._ctx.qualities[ListSymbol._add](quality, trigger);
    });

    audioTracks.forEach((audioTrack: DASH.MediaInfo & { label?: string | null }, index) => {
      const localTrack = {
        id: `dash-audio${audioTrack?.index}`,
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
        .labelledLog('Media Element', this._instance?.getVideoElement())
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

  private _onFragLoading() {
    if (this._retryLoadingTimer >= 0) this._clearRetryTimer();
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
    // We can't recover here - better course of action?
    this._instance?.destroy();
    this._instance = null;
    this._ctx.delegate._notify('error', {
      message: error.message ?? '',
      code: 1,
      error: error as any,
    });
  }

  private _enableAutoQuality() {
    if (this._instance) this._switchAutoBitrate('video', true);
  }

  private _switchAutoBitrate(type: DASH.MediaType, auto: boolean) {
    if (!this._instance) return;

    this._instance.updateSettings({ streaming: { abr: { autoSwitchBitrate: { [type]: auto } } } });
  }

  private _onQualityChange() {
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
    if (IS_CHROME) this._video.currentTime = this._video.currentTime;
  }

  private _onAudioChange() {
    if (!this._instance) return;
    const { audioTracks } = this._ctx;
    const selectedTrack = this._instance
      .getTracksFor('audio')
      .find(
        (track) => audioTracks.selected && audioTracks.selected.id === `dash-audio${track.index}`,
      );
    selectedTrack && this._instance.setCurrentTrack(selectedTrack);
  }

  loadSource(src: Src) {
    if (!isString(src.src)) return;

    this._clearRetryTimer();
    this._instance?.attachSource(src.src);
  }

  destroy() {
    this._clearRetryTimer();
    this._instance?.destroy();
    this._instance = null;
    this._removeTTMLRenderingDiv();
    this._stopLiveSync?.();
    this._stopLiveSync = null;
    if (__DEV__) this._ctx?.logger?.info('🏗️ Destroyed DASH instance');
  }
}
