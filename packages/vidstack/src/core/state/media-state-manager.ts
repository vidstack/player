import debounce from 'just-debounce-it';
import throttle from 'just-throttle';
import { effect, onDispose, peek, untrack, type StopEffect } from 'maverick.js';
import { DOMEvent, listenEvent } from 'maverick.js/std';

import { ListSymbol } from '../../foundation/list/symbols';
import { canChangeVolume } from '../../utils/support';
import type { MediaContext } from '../api/media-context';
import * as ME from '../api/media-events';
import { MediaPlayerController } from '../api/player-controller';
import { softResetMediaState } from '../api/player-state';
import { isVideoQualitySrc, type Src } from '../api/src-types';
import { QualitySymbol } from '../quality/symbols';
import type {
  VideoQuality,
  VideoQualityAddEvent,
  VideoQualityChangeEvent,
  VideoQualityRemoveEvent,
} from '../quality/video-quality';
import { getTimeRangesEnd } from '../time-ranges';
import type {
  AudioTrackAddEvent,
  AudioTrackChangeEvent,
  AudioTrackRemoveEvent,
} from '../tracks/audio-tracks';
import { TextTrackSymbol } from '../tracks/text/symbols';
import type {
  TextTrackAddEvent,
  TextTrackListModeChangeEvent,
  TextTrackRemoveEvent,
} from '../tracks/text/text-tracks';
import type { MediaRequestContext, MediaRequestQueueItems } from './media-request-manager';
import { TRACKED_EVENT } from './tracked-media-events';

/**
 * This class is responsible for listening to and normalizing media events, updating the media
 * state context, and satisfying media requests.
 */
export class MediaStateManager extends MediaPlayerController {
  private readonly _trackedEvents = new Map<string, ME.MediaEvent>();

  private _clipEnded = false;
  private _firingWaiting = false;
  private _waitingTrigger: Event | undefined;

  constructor(
    private _request: MediaRequestContext,
    private _media: MediaContext,
  ) {
    super();
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('aria-busy', 'true');
    this.listen('fullscreen-change', this['fullscreen-change'].bind(this));
    this.listen('fullscreen-error', this['fullscreen-error'].bind(this));
    this.listen('orientation-change', this['orientation-change'].bind(this));
  }

  protected override onConnect(el: HTMLElement) {
    effect(this._watchCanSetVolume.bind(this));

    this._addTextTrackListeners();
    this._addQualityListeners();
    this._addAudioTrackListeners();
    this._resumePlaybackOnConnect();

    onDispose(this._pausePlaybackOnDisconnect.bind(this));
  }

  protected override onDestroy(): void {
    const { audioTracks, qualities, textTracks } = this._media;
    audioTracks[ListSymbol._reset]();
    qualities[ListSymbol._reset]();
    textTracks[ListSymbol._reset]();

    this._stopWatchingQualityResize();
  }

  _handle(event: Event) {
    if (!this.scope) return;
    const type = event.type as keyof ME.MediaEvents;
    untrack(() => this[event.type]?.(event));
    if (!__SERVER__) {
      if (TRACKED_EVENT.has(type)) this._trackedEvents.set(type, event as ME.MediaEvent);
      this.dispatch(event);
    }
  }

  private _isPlayingOnDisconnect = false;
  private _resumePlaybackOnConnect() {
    if (!this._isPlayingOnDisconnect) return;

    requestAnimationFrame(() => {
      if (!this.scope) return;
      this._media.remote.play(new DOMEvent<void>('dom-connect'));
    });

    this._isPlayingOnDisconnect = false;
  }

  private _pausePlaybackOnDisconnect() {
    // It might already be set in `pause` handler.
    if (this._isPlayingOnDisconnect) return;
    this._isPlayingOnDisconnect = !this.$state.paused();
    this._media.$provider()?.pause();
  }

  private _resetTracking() {
    this._stopWaiting();
    this._clipEnded = false;
    this._request._replaying = false;
    this._request._looping = false;
    this._firingWaiting = false;
    this._waitingTrigger = undefined;
    this._trackedEvents.clear();
  }

  private _satisfyRequest<T extends keyof MediaRequestQueueItems>(request: T, event: DOMEvent) {
    const requestEvent = this._request._queue._serve(request);
    if (!requestEvent) return;
    (event as ME.MediaEvent).request = requestEvent;
    event.triggers.add(requestEvent);
  }

  private _addTextTrackListeners() {
    this._onTextTracksChange();
    this._onTextTrackModeChange();
    const textTracks = this._media.textTracks;
    listenEvent(textTracks, 'add', this._onTextTracksChange.bind(this));
    listenEvent(textTracks, 'remove', this._onTextTracksChange.bind(this));
    listenEvent(textTracks, 'mode-change', this._onTextTrackModeChange.bind(this));
  }

  private _addQualityListeners() {
    const qualities = this._media.qualities;
    listenEvent(qualities, 'add', this._onQualitiesChange.bind(this));
    listenEvent(qualities, 'remove', this._onQualitiesChange.bind(this));
    listenEvent(qualities, 'change', this._onQualityChange.bind(this));
    listenEvent(qualities, 'auto-change', this._onAutoQualityChange.bind(this));
    listenEvent(qualities, 'readonly-change', this._onCanSetQualityChange.bind(this));
  }

  private _addAudioTrackListeners() {
    const audioTracks = this._media.audioTracks;
    listenEvent(audioTracks, 'add', this._onAudioTracksChange.bind(this));
    listenEvent(audioTracks, 'remove', this._onAudioTracksChange.bind(this));
    listenEvent(audioTracks, 'change', this._onAudioTrackChange.bind(this));
  }

  private _onTextTracksChange(event?: TextTrackAddEvent | TextTrackRemoveEvent) {
    const { textTracks } = this.$state;
    textTracks.set(this._media.textTracks.toArray());
    this.dispatch('text-tracks-change', {
      detail: textTracks(),
      trigger: event,
    });
  }

  private _onTextTrackModeChange(event?: TextTrackListModeChangeEvent) {
    if (event) this._satisfyRequest('media-text-track-change-request', event);

    const current = this._media.textTracks.selected,
      { textTrack } = this.$state;

    if (textTrack() !== current) {
      textTrack.set(current);
      this.dispatch('text-track-change', {
        detail: current,
        trigger: event,
      });
    }
  }

  private _onAudioTracksChange(event?: AudioTrackAddEvent | AudioTrackRemoveEvent) {
    const { audioTracks } = this.$state;
    audioTracks.set(this._media.audioTracks.toArray());
    this.dispatch('audio-tracks-change', {
      detail: audioTracks(),
      trigger: event,
    });
  }

  private _onAudioTrackChange(event?: AudioTrackChangeEvent) {
    const { audioTrack } = this.$state;

    audioTrack.set(this._media.audioTracks.selected);
    if (event) this._satisfyRequest('media-audio-track-change-request', event);

    this.dispatch('audio-track-change', {
      detail: audioTrack(),
      trigger: event,
    });
  }

  private _onQualitiesChange(event?: VideoQualityAddEvent | VideoQualityRemoveEvent) {
    const { qualities } = this.$state;
    qualities.set(this._media.qualities.toArray());
    this.dispatch('qualities-change', {
      detail: qualities(),
      trigger: event,
    });
  }

  private _onQualityChange(event?: VideoQualityChangeEvent) {
    const { quality } = this.$state;

    quality.set(this._media.qualities.selected);
    if (event) this._satisfyRequest('media-quality-change-request', event);

    this.dispatch('quality-change', {
      detail: quality(),
      trigger: event,
    });
  }

  private _onAutoQualityChange() {
    const { qualities } = this._media,
      isAuto = qualities.auto;

    this.$state.autoQuality.set(isAuto);

    if (!isAuto) this._stopWatchingQualityResize();
  }

  private _stopQualityResizeEffect: StopEffect | null = null;
  private _watchQualityResize() {
    this._stopWatchingQualityResize();
    this._stopQualityResizeEffect = effect(() => {
      const { qualities } = this._media,
        { mediaWidth, mediaHeight } = this.$state,
        w = mediaWidth(),
        h = mediaHeight();

      if (w === 0 || h === 0) return;

      let selectedQuality: VideoQuality | null = null,
        minScore = Infinity;

      for (const quality of qualities) {
        const score = Math.abs(quality.width - w) + Math.abs(quality.height - h);
        if (score < minScore) {
          minScore = score;
          selectedQuality = quality;
        }
      }

      if (selectedQuality) {
        qualities[ListSymbol._select](
          selectedQuality,
          true,
          new DOMEvent('resize', { detail: { width: w, height: h } }),
        );
      }
    });
  }

  private _stopWatchingQualityResize() {
    this._stopQualityResizeEffect?.();
    this._stopQualityResizeEffect = null;
  }

  private _onCanSetQualityChange() {
    this.$state.canSetQuality.set(!this._media.qualities.readonly);
  }

  protected _watchCanSetVolume() {
    const { canSetVolume, isGoogleCastConnected } = this.$state;

    if (isGoogleCastConnected()) {
      // The provider will set this value accordingly.
      canSetVolume.set(false);
      return;
    }

    canChangeVolume().then(canSetVolume.set);
  }

  ['provider-change'](event: ME.MediaProviderChangeEvent) {
    const prevProvider = this._media.$provider(),
      newProvider = event.detail;

    if (prevProvider?.type === newProvider?.type) return;

    prevProvider?.destroy?.();
    prevProvider?.scope?.dispose();
    this._media.$provider.set(event.detail);

    if (prevProvider && event.detail === null) {
      this._resetMediaState(event);
    }
  }

  ['provider-loader-change'](event: ME.MediaProviderLoaderChangeEvent) {
    if (__DEV__) {
      this._media.logger
        ?.infoGroup(`Loader change \`${event.detail?.constructor.name}\``)
        .labelledLog('Event', event)
        .dispatch();
    }
  }

  ['auto-play'](event: ME.MediaAutoPlayEvent) {
    this.$state.autoPlayError.set(null);
  }

  ['auto-play-fail'](event: ME.MediaAutoPlayFailEvent) {
    this.$state.autoPlayError.set(event.detail);
    this._resetTracking();
  }

  ['can-load'](event: ME.MediaCanLoadEvent) {
    this.$state.canLoad.set(true);
    this._trackedEvents.set('can-load', event);
    this._media.textTracks[TextTrackSymbol._canLoad]();
    this._satisfyRequest('media-start-loading', event);
  }

  ['can-load-poster'](event: ME.MediaCanLoadEvent) {
    this.$state.canLoadPoster.set(true);
    this._trackedEvents.set('can-load-poster', event);
    this._satisfyRequest('media-poster-start-loading', event);
  }

  ['media-type-change'](event: ME.MediaTypeChangeEvent) {
    const sourceChangeEvent = this._trackedEvents.get('source-change');
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);

    const viewType = this.$state.viewType();
    this.$state.mediaType.set(event.detail);

    const providedViewType = this.$state.providedViewType(),
      currentViewType = providedViewType === 'unknown' ? event.detail : providedViewType;

    if (viewType !== currentViewType) {
      if (__SERVER__) {
        this.$state.inferredViewType.set(currentViewType);
      } else {
        // Wait for player to resize.
        setTimeout(() => {
          requestAnimationFrame(() => {
            if (!this.scope) return;
            this.$state.inferredViewType.set(event.detail);
            this.dispatch('view-type-change', {
              detail: currentViewType,
              trigger: event,
            });
          });
        }, 0);
      }
    }
  }

  ['stream-type-change'](event: ME.MediaStreamTypeChangeEvent) {
    const sourceChangeEvent = this._trackedEvents.get('source-change');
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);

    const { streamType, inferredStreamType } = this.$state;
    inferredStreamType.set(event.detail);
    (event as any).detail = streamType();
  }

  ['rate-change'](event: ME.MediaRateChangeEvent) {
    const { storage } = this._media,
      { canPlay } = this.$state;

    this.$state.playbackRate.set(event.detail);
    this._satisfyRequest('media-rate-change-request', event);

    if (canPlay()) {
      storage?.setPlaybackRate?.(event.detail);
    }
  }

  ['remote-playback-change'](event: ME.MediaRemotePlaybackChangeEvent) {
    const { remotePlaybackState, remotePlaybackType } = this.$state,
      { type, state } = event.detail,
      isConnected = state === 'connected';

    remotePlaybackType.set(type);
    remotePlaybackState.set(state);

    const key: keyof MediaRequestQueueItems =
      type === 'airplay' ? 'media-airplay-request' : 'media-google-cast-request';

    if (isConnected) {
      this._satisfyRequest(key, event);
    } else {
      const requestEvent = this._request._queue._peek(key);
      if (requestEvent) {
        event.request = requestEvent;
        event.triggers.add(requestEvent);
      }
    }
  }

  ['sources-change'](event: ME.MediaSourcesChangeEvent) {
    const prevSources = this.$state.sources(),
      newSources = event.detail;

    this.$state.sources.set(newSources);

    this._onSourceQualitiesChange(prevSources, newSources, event);
  }

  private _onSourceQualitiesChange(prevSources: Src[], newSources: Src[], trigger?: Event) {
    let { qualities } = this._media,
      added = false,
      removed = false;

    // Remove old qualities.
    for (const prevSrc of prevSources) {
      if (!isVideoQualitySrc(prevSrc)) continue;
      const exists = newSources.some((s) => s.src === prevSrc.src);
      if (!exists) {
        const quality = qualities.getBySrc(prevSrc.src);
        if (quality) {
          qualities[ListSymbol._remove](quality, trigger);
          removed = true;
        }
      }
    }

    // Do a complete reset if source qualities has changed.
    if (removed && !qualities.length) {
      this.$state.savedState.set(null);
      qualities[ListSymbol._reset](trigger);
    }

    // Add new qualities.
    for (const src of newSources) {
      if (!isVideoQualitySrc(src) || qualities.getBySrc(src.src)) continue;

      const quality = {
        id: src.id ?? src.height + 'p',
        bitrate: null,
        codec: null,
        ...src,
        selected: false,
      };

      qualities[ListSymbol._add](quality, trigger);
      added = true;
    }

    if (added && !qualities[QualitySymbol._enableAuto]) {
      // Logic for this is inside `onAutoQualityChange` method.
      this._watchQualityResize();
      qualities[QualitySymbol._enableAuto] = this._watchQualityResize.bind(this);
      qualities[QualitySymbol._setAuto](true, trigger);
    }
  }

  ['source-change'](event: ME.MediaSourceChangeEvent) {
    event.isQualityChange = event.originEvent?.type === 'quality-change';

    const source = event.detail;

    this._resetMediaState(event, event.isQualityChange);
    this._trackedEvents.set(event.type, event);

    this.$state.source.set(source);
    this.el?.setAttribute('aria-busy', 'true');

    if (__DEV__) {
      this._media.logger
        ?.infoGroup('📼 Media source change')
        .labelledLog('Source', source)
        .dispatch();
    }
  }

  private _resetMediaState(event: Event, isSourceQualityChange = false) {
    const { audioTracks, qualities } = this._media;

    if (!isSourceQualityChange) {
      audioTracks[ListSymbol._reset](event);
      qualities[ListSymbol._reset](event);
      softResetMediaState(this.$state, isSourceQualityChange);
      this._resetTracking();
      return;
    }

    softResetMediaState(this.$state, isSourceQualityChange);
    this._resetTracking();
  }

  ['abort'](event: ME.MediaAbortEvent) {
    const sourceChangeEvent = this._trackedEvents.get('source-change');
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);

    const canLoadEvent = this._trackedEvents.get('can-load');
    if (canLoadEvent && !event.triggers.hasType('can-load')) {
      event.triggers.add(canLoadEvent);
    }
  }

  ['load-start'](event: ME.MediaLoadStartEvent) {
    const sourceChangeEvent = this._trackedEvents.get('source-change');
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);
  }

  ['error'](event: ME.MediaErrorEvent) {
    this.$state.error.set(event.detail);

    const abortEvent = this._trackedEvents.get('abort');
    if (abortEvent) event.triggers.add(abortEvent);

    if (__DEV__) {
      this._media.logger
        ?.errorGroup('Media Error')
        .labelledLog('Error', event.detail)
        .labelledLog('Event', event)
        .labelledLog('Context', this._media)
        .dispatch();
    }
  }

  ['loaded-metadata'](event: ME.MediaLoadedMetadataEvent) {
    const loadStartEvent = this._trackedEvents.get('load-start');
    if (loadStartEvent) event.triggers.add(loadStartEvent);
  }

  ['loaded-data'](event: ME.MediaLoadedDataEvent) {
    const loadStartEvent = this._trackedEvents.get('load-start');
    if (loadStartEvent) event.triggers.add(loadStartEvent);
  }

  ['can-play'](event: ME.MediaCanPlayEvent) {
    const loadedMetadata = this._trackedEvents.get('loaded-metadata');
    if (loadedMetadata) event.triggers.add(loadedMetadata);

    this._onCanPlayDetail(event.detail);
    this.el?.setAttribute('aria-busy', 'false');
  }

  ['can-play-through'](event: ME.MediaCanPlayThroughEvent) {
    this._onCanPlayDetail(event.detail);

    const canPlay = this._trackedEvents.get('can-play');
    if (canPlay) event.triggers.add(canPlay);
  }

  protected _onCanPlayDetail(detail: ME.MediaCanPlayDetail) {
    const { seekable, buffered, intrinsicDuration, canPlay } = this.$state;

    canPlay.set(true);
    buffered.set(detail.buffered);
    seekable.set(detail.seekable);

    // Do not fetch `seekableEnd` from `$state` as it might be clipped.
    const seekableEnd = getTimeRangesEnd(detail.seekable) ?? Infinity;
    intrinsicDuration.set(seekableEnd);
  }

  ['duration-change'](event: ME.MediaDurationChangeEvent) {
    const { live, intrinsicDuration } = this.$state,
      time = event.detail;
    if (!live()) intrinsicDuration.set(!Number.isNaN(time) ? time : 0);
  }

  ['progress'](event: ME.MediaProgressEvent) {
    const { buffered, seekable, live, intrinsicDuration } = this.$state,
      detail = event.detail;

    buffered.set(detail.buffered);
    seekable.set(detail.seekable);

    if (live()) {
      // Do not fetch `seekableEnd` from `$state` as it might be clipped.
      const seekableEnd = getTimeRangesEnd(detail.seekable) ?? Infinity;
      intrinsicDuration.set(seekableEnd);
      this.dispatch('duration-change', {
        detail: seekableEnd,
        trigger: event,
      });
    }
  }

  ['play'](event: ME.MediaPlayEvent) {
    const {
      paused,
      autoPlayError,
      ended,
      autoPlaying,
      playsInline,
      pointer,
      muted,
      viewType,
      live,
      userBehindLiveEdge,
    } = this.$state;

    this._resetPlaybackIfNeeded();

    if (!paused()) {
      event.stopImmediatePropagation();
      return;
    }

    event.autoPlay = autoPlaying();

    const waitingEvent = this._trackedEvents.get('waiting');
    if (waitingEvent) event.triggers.add(waitingEvent);

    this._satisfyRequest('media-play-request', event);
    this._trackedEvents.set('play', event);

    paused.set(false);
    autoPlayError.set(null);

    if (event.autoPlay) {
      this._handle(
        this.createEvent('auto-play', {
          detail: { muted: muted() },
          trigger: event,
        }),
      );

      autoPlaying.set(false);
    }

    if (ended() || this._request._replaying) {
      this._request._replaying = false;
      ended.set(false);
      this._handle(this.createEvent('replay', { trigger: event }));
    }

    if (!playsInline() && viewType() === 'video' && pointer() === 'coarse') {
      this._media.remote.enterFullscreen('prefer-media', event);
    }

    if (live() && !userBehindLiveEdge()) {
      this._media.remote.seekToLiveEdge(event);
    }
  }

  private _resetPlaybackIfNeeded(trigger?: Event) {
    const provider = peek(this._media.$provider);
    if (!provider) return;

    const { ended, seekableStart, clipStartTime, clipEndTime, realCurrentTime, duration } =
      this.$state;

    const shouldReset =
      realCurrentTime() < clipStartTime() ||
      (clipEndTime() > 0 && realCurrentTime() >= clipEndTime()) ||
      Math.abs(realCurrentTime() - duration()) < 0.1 ||
      ended();

    if (shouldReset) {
      this.dispatch('media-seek-request', {
        detail: (clipStartTime() > 0 ? 0 : seekableStart()) + 0.1,
        trigger,
      });
    }

    return shouldReset;
  }

  ['play-fail'](event: ME.MediaPlayFailEvent) {
    const { muted, autoPlaying } = this.$state;

    const playEvent = this._trackedEvents.get('play');
    if (playEvent) event.triggers.add(playEvent);

    this._satisfyRequest('media-play-request', event);

    const { paused, playing } = this.$state;
    paused.set(true);
    playing.set(false);

    this._resetTracking();
    this._trackedEvents.set('play-fail', event);

    if (event.autoPlay) {
      this._handle(
        this.createEvent('auto-play-fail', {
          detail: {
            muted: muted(),
            error: event.detail,
          },
          trigger: event,
        }),
      );

      autoPlaying.set(false);
    }
  }

  ['playing'](event: ME.MediaPlayingEvent) {
    const playEvent = this._trackedEvents.get('play'),
      seekedEvent = this._trackedEvents.get('seeked');

    if (playEvent) event.triggers.add(playEvent);
    else if (seekedEvent) event.triggers.add(seekedEvent);

    setTimeout(() => this._resetTracking(), 0);

    const {
      paused,
      playing,
      live,
      liveSyncPosition,
      seekableEnd,
      started,
      currentTime,
      seeking,
      ended,
    } = this.$state;

    paused.set(false);
    playing.set(true);
    seeking.set(false);
    ended.set(false);

    if (this._request._looping) {
      this._request._looping = false;
      return;
    }

    if (live() && !started() && currentTime() === 0) {
      const end = liveSyncPosition() ?? seekableEnd() - 2;
      if (Number.isFinite(end)) this._media.$provider()!.setCurrentTime(end);
    }

    this['started'](event);
  }

  ['started'](event: Event) {
    const { started } = this.$state;
    if (!started()) {
      started.set(true);
      this._handle(this.createEvent('started', { trigger: event }));
    }
  }

  ['pause'](event: ME.MediaPauseEvent) {
    if (!this.el?.isConnected) {
      this._isPlayingOnDisconnect = true;
    }

    this._satisfyRequest('media-pause-request', event);

    const seekedEvent = this._trackedEvents.get('seeked');
    if (seekedEvent) event.triggers.add(seekedEvent);

    const { paused, playing } = this.$state;
    paused.set(true);
    playing.set(false);

    if (this._clipEnded) {
      // Should fire after pause event.
      setTimeout(() => {
        this._handle(this.createEvent('end', { trigger: event }));
        this._clipEnded = false;
      }, 0);
    }

    this._resetTracking();
  }

  ['time-update'](event: ME.MediaTimeUpdateEvent) {
    if (this._request._looping) {
      event.stopImmediatePropagation();
      return;
    }

    const { realCurrentTime, played, waiting, clipEndTime } = this.$state,
      endTime = clipEndTime(),
      detail = event.detail;

    realCurrentTime.set(detail.currentTime);
    played.set(detail.played);
    waiting.set(false);

    for (const track of this._media.textTracks) {
      track[TextTrackSymbol._updateActiveCues](detail.currentTime, event);
    }

    if (endTime > 0 && detail.currentTime >= endTime) {
      this._clipEnded = true;
      this.dispatch('media-pause-request', { trigger: event });
    }

    this._saveTime();
  }

  private _saveTime() {
    const { storage } = this._media,
      { canPlay, realCurrentTime } = this.$state;

    if (canPlay()) {
      storage?.setTime?.(realCurrentTime());
    }
  }

  ['audio-gain-change'](event: ME.MediaAudioGainChangeEvent) {
    const { storage } = this._media,
      { canPlay, audioGain } = this.$state;

    audioGain.set(event.detail);
    this._satisfyRequest('media-audio-gain-change-request', event);

    if (canPlay()) storage?.setAudioGain?.(audioGain());
  }

  ['volume-change'](event: ME.MediaVolumeChangeEvent) {
    const { storage } = this._media,
      { volume, muted, canPlay } = this.$state,
      detail = event.detail;

    volume.set(detail.volume);
    muted.set(detail.muted || detail.volume === 0);

    this._satisfyRequest('media-volume-change-request', event);
    this._satisfyRequest(detail.muted ? 'media-mute-request' : 'media-unmute-request', event);

    if (canPlay()) {
      storage?.setVolume?.(volume());
      storage?.setMuted?.(muted());
    }
  }

  ['seeking'] = throttle(
    (event: ME.MediaSeekingEvent) => {
      const { seeking, realCurrentTime, paused } = this.$state;
      seeking.set(true);
      realCurrentTime.set(event.detail);
      this._satisfyRequest('media-seeking-request', event);
      if (paused()) {
        this._waitingTrigger = event;
        this._fireWaiting();
      }
    },
    150,
    { leading: true },
  );

  ['seeked'](event: ME.MediaSeekedEvent) {
    const { seeking, currentTime, realCurrentTime, paused, duration, ended } = this.$state;

    if (this._request._seeking) {
      seeking.set(true);
      event.stopImmediatePropagation();
    } else if (seeking()) {
      const waitingEvent = this._trackedEvents.get('waiting');
      if (waitingEvent) event.triggers.add(waitingEvent);

      const seekingEvent = this._trackedEvents.get('seeking');
      if (seekingEvent && !event.triggers.has(seekingEvent)) {
        event.triggers.add(seekingEvent);
      }

      if (paused()) this._stopWaiting();

      seeking.set(false);

      if (event.detail !== duration()) ended.set(false);

      realCurrentTime.set(event.detail);
      this._satisfyRequest('media-seek-request', event);

      // Only start if user initiated.
      const origin = event?.originEvent;
      if (origin?.isTrusted && !/seek/.test(origin.type)) {
        this['started'](event);
      }
    }

    if (Math.abs(duration() - currentTime()) >= 0.1) {
      ended.set(false);
    }
  }

  ['waiting'](event: ME.MediaWaitingEvent) {
    if (this._firingWaiting || this._request._seeking) return;
    event.stopImmediatePropagation();
    this._waitingTrigger = event;
    this._fireWaiting();
  }

  private _fireWaiting = debounce(() => {
    if (!this._waitingTrigger) return;

    this._firingWaiting = true;

    const { waiting, playing } = this.$state;
    waiting.set(true);
    playing.set(false);

    const event = this.createEvent('waiting', { trigger: this._waitingTrigger });
    this._trackedEvents.set('waiting', event);
    this.dispatch(event);

    this._waitingTrigger = undefined;
    this._firingWaiting = false;
  }, 300);

  ['end'](event: Event) {
    const { loop } = this.$state;

    if (loop()) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.dispatch('media-loop-request', { trigger: event });
        });
      }, 10);

      return;
    }

    this._onEnded(event);
  }

  private _onEnded(event: Event) {
    const { paused, seeking, ended, duration } = this.$state;

    if (!paused()) {
      this.dispatch('pause', { trigger: event });
    }

    if (seeking()) {
      this.dispatch('seeked', {
        detail: duration(),
        trigger: event,
      });
    }

    ended.set(true);
    this._resetTracking();

    this.dispatch('ended', {
      trigger: event,
    });
  }

  private _stopWaiting() {
    this._fireWaiting.cancel();
    this.$state.waiting.set(false);
  }

  ['fullscreen-change'](event: ME.MediaFullscreenChangeEvent) {
    const isFullscreen = event.detail;
    this.$state.fullscreen.set(isFullscreen);
    this._satisfyRequest(
      isFullscreen ? 'media-enter-fullscreen-request' : 'media-exit-fullscreen-request',
      event,
    );
  }

  ['fullscreen-error'](event: ME.MediaFullscreenErrorEvent) {
    this._satisfyRequest('media-enter-fullscreen-request', event);
    this._satisfyRequest('media-exit-fullscreen-request', event);
  }

  ['orientation-change'](event: ME.MediaOrientationChangeEvent) {
    const isLocked = event.detail.lock;
    this._satisfyRequest(
      isLocked ? 'media-orientation-lock-request' : 'media-orientation-unlock-request',
      event,
    );
  }

  ['picture-in-picture-change'](event: ME.MediaPIPChangeEvent) {
    const isPiP = event.detail;
    this.$state.pictureInPicture.set(isPiP);
    this._satisfyRequest(isPiP ? 'media-enter-pip-request' : 'media-exit-pip-request', event);
  }

  ['picture-in-picture-error'](event: ME.MediaPIPErrorEvent) {
    this._satisfyRequest('media-enter-pip-request', event);
    this._satisfyRequest('media-exit-pip-request', event);
  }

  ['title-change'](event: ME.MediaPosterChangeEvent) {
    if (!event.trigger) return;
    // Fired in media-state-sync by effect.
    event.stopImmediatePropagation();
    this.$state.inferredTitle.set(event.detail);
  }

  ['poster-change'](event: ME.MediaPosterChangeEvent) {
    if (!event.trigger) return;
    // Fired in media-state-sync by effect.
    event.stopImmediatePropagation();
    this.$state.inferredPoster.set(event.detail);
  }
}
