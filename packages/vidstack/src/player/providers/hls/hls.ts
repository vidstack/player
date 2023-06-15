import type * as HLS from 'hls.js';
import { effect, peek } from 'maverick.js';
import { camelToKebabCase, DOMEvent, listenEvent } from 'maverick.js/std';

import { LIST_ADD, LIST_SELECT } from '../../../foundation/list/symbols';
import { RAFLoop } from '../../../foundation/observers/raf-loop';
import { IS_CHROME } from '../../../utils/support';
import { ENABLE_AUTO_QUALITY, SET_AUTO_QUALITY } from '../../core/quality/symbols';
import { TEXT_TRACK_ON_MODE_CHANGE, TEXT_TRACK_READY_STATE } from '../../core/tracks/text/symbols';
import { TextTrack } from '../../core/tracks/text/text-track';
import type { MediaSetupContext } from '../types';
import type { HLSConstructor, HLSInstanceCallback } from './types';

const toDOMEventType = (type: string) => camelToKebabCase(type);

export class HLSController {
  private _context!: MediaSetupContext;
  private _instance: HLS.default | null = null;
  private _stopLiveSync: (() => void) | null = null;

  _config: Partial<HLS.HlsConfig> = {};
  _callbacks = new Set<HLSInstanceCallback>();

  get instance() {
    return this._instance;
  }

  constructor(private _video: HTMLVideoElement) {}

  setup(ctor: HLSConstructor, context: MediaSetupContext) {
    this._context = context;

    const isLive = peek(context.$store.streamType).includes('live'),
      isLiveLowLatency = peek(context.$store.streamType).includes('ll-');

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

    context.player.dispatchEvent(new DOMEvent('hls-instance', { detail: this._instance }));

    this._instance.attachMedia(this._video);
    this._instance.on(ctor.Events.AUDIO_TRACK_SWITCHED, this._onAudioSwitch.bind(this));
    this._instance.on(ctor.Events.LEVEL_SWITCHED, this._onLevelSwitched.bind(this));
    this._instance.on(ctor.Events.LEVEL_LOADED, this._onLevelLoaded.bind(this));
    this._instance.on(ctor.Events.NON_NATIVE_TEXT_TRACKS_FOUND, this._onTracksFound.bind(this));
    this._instance.on(ctor.Events.CUES_PARSED, this._onCuesParsed.bind(this));

    context.qualities[ENABLE_AUTO_QUALITY] = this._enableAutoQuality.bind(this);

    listenEvent(context.qualities, 'change', this._onQualityChange.bind(this));
    listenEvent(context.audioTracks, 'change', this._onAudioChange.bind(this));

    this._stopLiveSync = effect(this._liveSync.bind(this));
  }

  private _liveSync() {
    if (!this._context.$store.live()) return;
    const raf = new RAFLoop(this._liveSyncPosition.bind(this));
    raf._start();
    return raf._stop.bind(raf);
  }

  private _liveSyncPosition() {
    this._context.$store.liveSyncPosition.set(this._instance?.liveSyncPosition ?? Infinity);
  }

  private _dispatchHLSEvent(eventType: string, detail: any) {
    this._context.player.dispatchEvent(new DOMEvent(toDOMEventType(eventType), { detail }));
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
        });

      track[TEXT_TRACK_READY_STATE] = 2;
      track[TEXT_TRACK_ON_MODE_CHANGE] = () => {
        if (track.mode === 'showing') {
          this._instance!.subtitleTrack = i;
          currentTrack = i;
        } else if (currentTrack === i) {
          this._instance!.subtitleTrack = -1;
          currentTrack = -1;
        }
      };

      if (nonNativeTrack.default) track.setMode('showing', event);
      this._context.textTracks.add(track, event);
    }
  }

  private _onCuesParsed(eventType: string, data: HLS.CuesParsedData) {
    const track = this._context.textTracks.getById(`hls-${data.track}`);
    if (!track) return;
    const event = new DOMEvent<HLS.CuesParsedData>(eventType, { detail: data });
    for (const cue of data.cues) {
      cue.positionAlign = 'auto';
      track.addCue(cue, event);
    }
  }

  private _onAudioSwitch(eventType: string, data: HLS.AudioTrackSwitchedData) {
    const track = this._context.audioTracks[data.id];
    if (track) {
      this._context.audioTracks[LIST_SELECT](
        track,
        true,
        new DOMEvent(eventType, { detail: data }),
      );
    }
  }

  private _onLevelSwitched(eventType: string, data: HLS.LevelSwitchedData) {
    const quality = this._context.qualities[data.level];
    if (quality) {
      this._context.qualities[LIST_SELECT](
        quality,
        true,
        new DOMEvent(eventType, { detail: data }),
      );
    }
  }

  private _onLevelLoaded(eventType: string, data: HLS.LevelLoadedData): void {
    if (this._context.$store.canPlay()) return;

    const { type, live, totalduration: duration } = data.details;
    const event = new DOMEvent(eventType, { detail: data });

    this._context.delegate._dispatch('stream-type-change', {
      detail: live
        ? type === 'EVENT' && Number.isFinite(duration)
          ? 'live:dvr'
          : 'live'
        : 'on-demand',
      trigger: event,
    });

    this._context.delegate._dispatch('duration-change', { detail: duration, trigger: event });

    const media = this._instance!.media!;

    if (this._instance!.currentLevel === -1) {
      this._context.qualities[SET_AUTO_QUALITY](true, event);
    }

    for (const track of this._instance!.audioTracks) {
      this._context.audioTracks[LIST_ADD](
        {
          id: track.id + '',
          label: track.name,
          language: track.lang || '',
          kind: 'main',
        },
        event,
      );
    }

    for (const level of this._instance!.levels) {
      this._context.qualities[LIST_ADD](
        {
          width: level.width,
          height: level.height,
          codec: level.codecSet,
          bitrate: level.bitrate,
        },
        event,
      );
    }

    media.dispatchEvent(new DOMEvent<void>('canplay', { trigger: event }));
  }

  private _onError(eventType: string, data: HLS.ErrorData) {
    if (__DEV__) {
      this._context.logger
        ?.errorGroup(`HLS error \`${eventType}\``)
        .labelledLog('Media Element', this._instance?.media)
        .labelledLog('HLS Instance', this._instance)
        .labelledLog('Event Type', eventType)
        .labelledLog('Data', data)
        .labelledLog('Src', peek(this._context.$store.source))
        .labelledLog('Media Store', { ...this._context.$store })
        .dispatch();
    }

    if (data.fatal) {
      switch (data.type) {
        case 'networkError':
          this._instance?.startLoad();
          break;
        case 'mediaError':
          this._instance?.recoverMediaError();
          break;
        default:
          // We can't recover here - better course of action?
          this._instance?.destroy();
          this._instance = null;
          break;
      }
    }
  }

  private _enableAutoQuality() {
    if (this._instance) this._instance.currentLevel = -1;
  }

  private _onQualityChange() {
    const { qualities } = this._context;
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
    const { audioTracks } = this._context;
    if (this._instance && this._instance.audioTrack !== audioTracks.selectedIndex) {
      this._instance.audioTrack = audioTracks.selectedIndex;
    }
  }

  _destroy() {
    if (this._context) this._context.qualities[ENABLE_AUTO_QUALITY] = undefined;
    this._instance?.destroy();
    this._instance = null;
    this._stopLiveSync?.();
    this._stopLiveSync = null;
    if (__DEV__) this._context?.logger?.info('🏗️ Destroyed HLS instance');
  }
}
