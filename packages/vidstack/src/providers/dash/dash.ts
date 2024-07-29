import type DASH from 'dashjs';
import { effect, peek } from 'maverick.js';
import { camelToKebabCase, DOMEvent, isNumber, isString, listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { Src } from '../../core/api/src-types';
import { QualitySymbol } from '../../core/quality/symbols';
import { TextTrackSymbol } from '../../core/tracks/text/symbols';
import { TextTrack } from '../../core/tracks/text/text-track';
import { ListSymbol } from '../../foundation/list/symbols';
import { RAFLoop } from '../../foundation/observers/raf-loop';
import { getLangName } from '../../utils/language';
import { canPlayAudioType, canPlayVideoType, IS_CHROME } from '../../utils/support';
import type { DASHConstructor, DASHInstanceCallback } from './types';

export type DashGetMediaTracks = (type: DASH.MediaType, manifest: object) => DASH.MediaInfo[];

const toDOMEventType = (type: string) => `dash-${camelToKebabCase(type)}`;

export class DASHController {
  #video: HTMLVideoElement;
  #ctx: MediaContext;

  #instance: DASH.MediaPlayerClass | null = null;
  #callbacks = new Set<DASHInstanceCallback>();
  #stopLiveSync: (() => void) | null = null;

  config: Partial<DASH.MediaPlayerSettingClass> = {};

  get instance() {
    return this.#instance;
  }

  constructor(video: HTMLVideoElement, ctx: MediaContext) {
    this.#video = video;
    this.#ctx = ctx;
  }

  setup(ctor: DASHConstructor) {
    this.#instance = ctor().create();

    const dispatcher = this.#dispatchDASHEvent.bind(this);
    for (const event of Object.values(ctor.events)) this.#instance.on(event, dispatcher);

    this.#instance.on(ctor.events.ERROR, this.#onError.bind(this));
    for (const callback of this.#callbacks) callback(this.#instance);

    this.#ctx.player.dispatch('dash-instance' as any, {
      detail: this.#instance,
    });

    this.#instance.initialize(this.#video, undefined, false);

    this.#instance.updateSettings({
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
      ...this.config,
    });

    this.#instance.on(ctor.events.FRAGMENT_LOADING_STARTED, this.#onFragmentLoadStart.bind(this));
    this.#instance.on(
      ctor.events.FRAGMENT_LOADING_COMPLETED,
      this.#onFragmentLoadComplete.bind(this),
    );
    this.#instance.on(ctor.events.MANIFEST_LOADED, this.#onManifestLoaded.bind(this));
    this.#instance.on(ctor.events.QUALITY_CHANGE_RENDERED, this.#onQualityChange.bind(this));
    this.#instance.on(ctor.events.TEXT_TRACKS_ADDED, this.#onTextTracksAdded.bind(this));
    this.#instance.on(ctor.events.TRACK_CHANGE_RENDERED, this.#onTrackChange.bind(this));

    this.#ctx.qualities[QualitySymbol.enableAuto] = this.#enableAutoQuality.bind(this);

    listenEvent(this.#ctx.qualities, 'change', this.#onUserQualityChange.bind(this));
    listenEvent(this.#ctx.audioTracks, 'change', this.#onUserAudioChange.bind(this));

    this.#stopLiveSync = effect(this.#liveSync.bind(this));
  }

  #createDOMEvent(event: DASH.Event) {
    return new DOMEvent(toDOMEventType(event.type), { detail: event });
  }

  #liveSync() {
    if (!this.#ctx.$state.live()) return;
    const raf = new RAFLoop(this.#liveSyncPosition.bind(this));
    raf.start();
    return raf.stop.bind(raf);
  }

  #liveSyncPosition() {
    if (!this.#instance) return;
    const position = this.#instance.duration() - this.#instance.time();
    this.#ctx.$state.liveSyncPosition.set(!isNaN(position) ? position : Infinity);
  }

  #dispatchDASHEvent(event: DASH.Event) {
    this.#ctx.player?.dispatch(this.#createDOMEvent(event));
  }

  #currentTrack: TextTrack | null = null;
  #cueTracker: Record<string, number> = {};

  #onTextFragmentLoaded(event: DASH.FragmentLoadingCompletedEvent) {
    const native = this.#currentTrack?.[TextTrackSymbol.native],
      cues = (native?.track as globalThis.TextTrack).cues;

    if (!native || !cues) return;

    const id = this.#currentTrack!.id,
      startIndex = this.#cueTracker[id] ?? 0,
      trigger = this.#createDOMEvent(event);

    for (let i = startIndex; i < cues.length; i++) {
      const cue = cues[i] as VTTCue;
      if (!cue.positionAlign) cue.positionAlign = 'auto';
      this.#currentTrack!.addCue(cue, trigger);
    }

    this.#cueTracker[id] = cues.length;
  }

  #onTextTracksAdded(event: DASH.TextTracksAddedEvent) {
    if (!this.#instance) return;

    const data = event.tracks,
      nativeTextTracks = [...this.#video.textTracks].filter((track) => 'manualMode' in track),
      trigger = this.#createDOMEvent(event);

    for (let i = 0; i < nativeTextTracks.length; i++) {
      const textTrackInfo = data[i],
        nativeTextTrack = nativeTextTracks[i];

      const id = `dash-${textTrackInfo.kind}-${i}`,
        track = new TextTrack({
          id,
          label:
            textTrackInfo?.label ??
            textTrackInfo.labels.find((t) => t.text)?.text ??
            (textTrackInfo?.lang && getLangName(textTrackInfo.lang)) ??
            textTrackInfo?.lang ??
            undefined,
          language: textTrackInfo.lang ?? undefined,
          kind: textTrackInfo!.kind as TextTrackKind,
          default: textTrackInfo.defaultTrack,
        });

      track[TextTrackSymbol.native] = {
        managed: true,
        track: nativeTextTrack,
      };

      track[TextTrackSymbol.readyState] = 2;

      track[TextTrackSymbol.onModeChange] = () => {
        if (!this.#instance) return;
        if (track.mode === 'showing') {
          this.#instance.setTextTrack(i);
          this.#currentTrack = track;
        } else {
          this.#instance.setTextTrack(-1);
          this.#currentTrack = null;
        }
      };

      this.#ctx.textTracks.add(track, trigger);
    }
  }

  #onTrackChange(event: DASH.Event) {
    const { mediaType, newMediaInfo } = event as DASH.TrackChangeRenderedEvent;

    if (mediaType === 'audio') {
      const track = this.#ctx.audioTracks.getById(`dash-audio-${newMediaInfo.index}`);
      if (track) {
        const trigger = this.#createDOMEvent(event);
        this.#ctx.audioTracks[ListSymbol.select](track, true, trigger);
      }
    }
  }

  #onQualityChange(event: DASH.QualityChangeRenderedEvent) {
    if (event.mediaType !== 'video') return;

    const quality = this.#ctx.qualities[event.newQuality];

    if (quality) {
      const trigger = this.#createDOMEvent(event);
      this.#ctx.qualities[ListSymbol.select](quality, true, trigger);
    }
  }

  #onManifestLoaded(event: DASH.ManifestLoadedEvent) {
    if (this.#ctx.$state.canPlay() || !this.#instance) return;

    const { type, mediaPresentationDuration } = event.data as DASH.Mpd & DASH.AdaptationSet,
      trigger = this.#createDOMEvent(event);

    this.#ctx.notify('stream-type-change', type !== 'static' ? 'live' : 'on-demand', trigger);

    this.#ctx.notify('duration-change', mediaPresentationDuration, trigger);

    this.#ctx.qualities[QualitySymbol.setAuto](true, trigger);

    const media = this.#instance.getVideoElement();

    // getting videos from manifest whose type is supported
    const videoQualities = (this.#instance.getTracksForTypeFromManifest as DashGetMediaTracks)(
      'video',
      event.data,
    );

    const supportedVideoMimeType = [...new Set(videoQualities.map((e) => e.mimeType))].find(
      (type) => type && canPlayVideoType(media, type),
    );

    const videoQuality = videoQualities.filter(
      (track) => supportedVideoMimeType === track.mimeType,
    )[0];

    let audioTracks = (this.#instance.getTracksForTypeFromManifest as DashGetMediaTracks)(
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

      this.#ctx.qualities[ListSymbol.add](quality, trigger);
    });

    if (isNumber(videoQuality.index)) {
      const quality = this.#ctx.qualities[videoQuality.index];
      if (quality) this.#ctx.qualities[ListSymbol.select](quality, true, trigger);
    }

    audioTracks.forEach((audioTrack: DASH.MediaInfo, index) => {
      // Find the label object that matches the user's preferred languages
      const matchingLabel = audioTrack.labels.find((label) => {
        return navigator.languages.some((language) => {
          return label.lang && language.toLowerCase().startsWith(label.lang.toLowerCase());
        });
      });

      const label = matchingLabel || audioTrack.labels[0];

      const localTrack = {
        id: `dash-audio-${audioTrack?.index}`,
        label:
          label?.text ?? (audioTrack.lang && getLangName(audioTrack.lang)) ?? audioTrack.lang ?? '',
        language: audioTrack.lang ?? '',
        kind: 'main',
        mimeType: audioTrack.mimeType,
        codec: audioTrack.codec,
        index,
      };

      this.#ctx.audioTracks[ListSymbol.add](localTrack, trigger);
    });

    media.dispatchEvent(new DOMEvent<void>('canplay', { trigger }));
  }

  #onError(event: DASH.Event) {
    const { type: eventType, error: data } = event as DASH.MediaPlayerErrorEvent;

    if (__DEV__) {
      this.#ctx.logger
        ?.errorGroup(`[vidstack] DASH error \`${data.message}\``)
        .labelledLog('Media Element', this.#video)
        .labelledLog('DASH Instance', this.#instance)
        .labelledLog('Event Type', eventType)
        .labelledLog('Data', data)
        .labelledLog('Src', peek(this.#ctx.$state.source))
        .labelledLog('Media Store', { ...this.#ctx.$state })
        .dispatch();
    }

    switch (data.code) {
      case 27:
        this.#onNetworkError(data);
        break;
      default:
        this.#onFatalError(data);
        break;
    }
  }

  #onFragmentLoadStart() {
    if (this.#retryLoadingTimer >= 0) this.#clearRetryTimer();
  }

  #onFragmentLoadComplete(event: DASH.FragmentLoadingCompletedEvent) {
    const mediaType = (event as any).mediaType as 'audio' | 'video' | 'text';
    if (mediaType === 'text') {
      // It seems like text cues are synced on animation frames.
      requestAnimationFrame(this.#onTextFragmentLoaded.bind(this, event));
    }
  }

  #retryLoadingTimer = -1;
  #onNetworkError(error: DASH.DashJSError) {
    this.#clearRetryTimer();

    this.#instance?.play();

    this.#retryLoadingTimer = window.setTimeout(() => {
      this.#retryLoadingTimer = -1;
      this.#onFatalError(error);
    }, 5000);
  }

  #clearRetryTimer() {
    clearTimeout(this.#retryLoadingTimer);
    this.#retryLoadingTimer = -1;
  }

  #onFatalError(error: DASH.DashJSError) {
    this.#ctx.notify('error', {
      message: error.message ?? '',
      code: 1,
      error: error as any,
    });
  }

  #enableAutoQuality() {
    this.#switchAutoBitrate('video', true);
    // Force update so ABR engine can re-calc.
    const { qualities } = this.#ctx;
    this.#instance?.setQualityFor('video', qualities.selectedIndex, true);
  }

  #switchAutoBitrate(type: DASH.MediaType, auto: boolean) {
    this.#instance?.updateSettings({
      streaming: { abr: { autoSwitchBitrate: { [type]: auto } } },
    });
  }

  #onUserQualityChange() {
    const { qualities } = this.#ctx;

    if (!this.#instance || qualities.auto || !qualities.selected) return;

    this.#switchAutoBitrate('video', false);
    this.#instance.setQualityFor('video', qualities.selectedIndex, qualities.switch === 'current');

    /**
     * Chrome has some strange issue with detecting keyframes inserted before the current
     * playhead position. This can cause playback to freeze until a new keyframe. It seems
     * setting the current time forces chrome to seek back to the last keyframe and adjust
     * playback. Weird fix, but it works!
     */
    if (IS_CHROME) {
      this.#video.currentTime = this.#video.currentTime;
    }
  }

  #onUserAudioChange() {
    if (!this.#instance) return;

    const { audioTracks } = this.#ctx,
      selectedTrack = this.#instance
        .getTracksFor('audio')
        .find(
          (track) =>
            audioTracks.selected && audioTracks.selected.id === `dash-audio-${track.index}`,
        );

    if (selectedTrack) this.#instance.setCurrentTrack(selectedTrack);
  }

  #reset() {
    this.#clearRetryTimer();
    this.#currentTrack = null;
    this.#cueTracker = {};
  }

  onInstance(callback: DASHInstanceCallback) {
    this.#callbacks.add(callback);
    return () => this.#callbacks.delete(callback);
  }

  loadSource(src: Src) {
    this.#reset();
    if (!isString(src.src)) return;
    this.#instance?.attachSource(src.src);
  }

  destroy() {
    this.#reset();
    this.#instance?.destroy();
    this.#instance = null;
    this.#stopLiveSync?.();
    this.#stopLiveSync = null;
    if (__DEV__) this.#ctx?.logger?.info('🏗️ Destroyed DASH instance');
  }
}
