import debounce from 'just-debounce-it';
import throttle from 'just-throttle';
import { effect, onDispose, peek, untrack, type StopEffect } from 'maverick.js';
import { DOMEvent, EventsController, listenEvent } from 'maverick.js/std';

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
import {
  getTimeRangesEnd,
  TimeRange,
  updateTimeIntervals,
  type TimeInterval,
} from '../time-ranges';
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
  readonly #request: MediaRequestContext;
  readonly #media: MediaContext;
  readonly #trackedEvents = new Map<string, ME.MediaEvent>();

  #clipEnded = false;

  #playedIntervals: TimeInterval[] = [];
  #playedInterval: TimeInterval = [-1, -1];

  #firingWaiting = false;
  #waitingTrigger: Event | undefined;

  constructor(request: MediaRequestContext, media: MediaContext) {
    super();
    this.#request = request;
    this.#media = media;
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('aria-busy', 'true');

    new EventsController(this as MediaPlayerController)
      .add('fullscreen-change', this['fullscreen-change'].bind(this))
      .add('fullscreen-error', this['fullscreen-error'].bind(this))
      .add('orientation-change', this['orientation-change'].bind(this));
  }

  protected override onConnect(el: HTMLElement) {
    effect(this.#watchCanSetVolume.bind(this));

    this.#addTextTrackListeners();
    this.#addQualityListeners();
    this.#addAudioTrackListeners();
    this.#resumePlaybackOnConnect();

    onDispose(this.#pausePlaybackOnDisconnect.bind(this));
  }

  protected override onDestroy(): void {
    const { audioTracks, qualities, textTracks } = this.#media;

    audioTracks[ListSymbol.reset]();
    qualities[ListSymbol.reset]();
    textTracks[ListSymbol.reset]();

    this.#stopWatchingQualityResize();
  }

  handle(event: Event) {
    if (!this.scope) return;

    const type = event.type as keyof ME.MediaEvents;

    untrack(() => this[event.type]?.(event));

    if (!__SERVER__) {
      if (TRACKED_EVENT.has(type)) this.#trackedEvents.set(type, event as ME.MediaEvent);
      this.dispatch(event);
    }
  }

  #isPlayingOnDisconnect = false;
  #resumePlaybackOnConnect() {
    if (!this.#isPlayingOnDisconnect) return;

    requestAnimationFrame(() => {
      if (!this.scope) return;
      this.#media.remote.play(new DOMEvent<void>('dom-connect'));
    });

    this.#isPlayingOnDisconnect = false;
  }

  #pausePlaybackOnDisconnect() {
    // It might already be set in `pause` handler.
    if (this.#isPlayingOnDisconnect) return;
    this.#isPlayingOnDisconnect = !this.$state.paused();
    this.#media.$provider()?.pause();
  }

  #resetTracking() {
    this.#stopWaiting();
    this.#clipEnded = false;
    this.#request.replaying = false;
    this.#request.looping = false;
    this.#firingWaiting = false;
    this.#waitingTrigger = undefined;
    this.#trackedEvents.clear();
  }

  #satisfyRequest<T extends keyof MediaRequestQueueItems>(request: T, event: DOMEvent) {
    const requestEvent = this.#request.queue.serve(request);
    if (!requestEvent) return;
    (event as ME.MediaEvent).request = requestEvent;
    event.triggers.add(requestEvent);
  }

  #addTextTrackListeners() {
    this.#onTextTracksChange();
    this.#onTextTrackModeChange();

    const textTracks = this.#media.textTracks;

    new EventsController(textTracks)
      .add('add', this.#onTextTracksChange.bind(this))
      .add('remove', this.#onTextTracksChange.bind(this))
      .add('mode-change', this.#onTextTrackModeChange.bind(this));
  }

  #addQualityListeners() {
    const qualities = this.#media.qualities;

    new EventsController(qualities)
      .add('add', this.#onQualitiesChange.bind(this))
      .add('remove', this.#onQualitiesChange.bind(this))
      .add('change', this.#onQualityChange.bind(this))
      .add('auto-change', this.#onAutoQualityChange.bind(this))
      .add('readonly-change', this.#onCanSetQualityChange.bind(this));
  }

  #addAudioTrackListeners() {
    const audioTracks = this.#media.audioTracks;

    new EventsController(audioTracks)
      .add('add', this.#onAudioTracksChange.bind(this))
      .add('remove', this.#onAudioTracksChange.bind(this))
      .add('change', this.#onAudioTrackChange.bind(this));
  }

  #onTextTracksChange(event?: TextTrackAddEvent | TextTrackRemoveEvent) {
    const { textTracks } = this.$state;
    textTracks.set(this.#media.textTracks.toArray());
    this.dispatch('text-tracks-change', {
      detail: textTracks(),
      trigger: event,
    });
  }

  #onTextTrackModeChange(event?: TextTrackListModeChangeEvent) {
    if (event) this.#satisfyRequest('media-text-track-change-request', event);

    const current = this.#media.textTracks.selected,
      { textTrack } = this.$state;

    if (textTrack() !== current) {
      textTrack.set(current);
      this.dispatch('text-track-change', {
        detail: current,
        trigger: event,
      });
    }
  }

  #onAudioTracksChange(event?: AudioTrackAddEvent | AudioTrackRemoveEvent) {
    const { audioTracks } = this.$state;
    audioTracks.set(this.#media.audioTracks.toArray());
    this.dispatch('audio-tracks-change', {
      detail: audioTracks(),
      trigger: event,
    });
  }

  #onAudioTrackChange(event?: AudioTrackChangeEvent) {
    const { audioTrack } = this.$state;

    audioTrack.set(this.#media.audioTracks.selected);
    if (event) this.#satisfyRequest('media-audio-track-change-request', event);

    this.dispatch('audio-track-change', {
      detail: audioTrack(),
      trigger: event,
    });
  }

  #onQualitiesChange(event?: VideoQualityAddEvent | VideoQualityRemoveEvent) {
    const { qualities } = this.$state;
    qualities.set(this.#media.qualities.toArray());
    this.dispatch('qualities-change', {
      detail: qualities(),
      trigger: event,
    });
  }

  #onQualityChange(event?: VideoQualityChangeEvent) {
    const { quality } = this.$state;

    quality.set(this.#media.qualities.selected);
    if (event) this.#satisfyRequest('media-quality-change-request', event);

    this.dispatch('quality-change', {
      detail: quality(),
      trigger: event,
    });
  }

  #onAutoQualityChange() {
    const { qualities } = this.#media,
      isAuto = qualities.auto;

    this.$state.autoQuality.set(isAuto);

    if (!isAuto) this.#stopWatchingQualityResize();
  }

  #stopQualityResizeEffect: StopEffect | null = null;
  #watchQualityResize() {
    this.#stopWatchingQualityResize();
    this.#stopQualityResizeEffect = effect(() => {
      const { qualities } = this.#media,
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
        qualities[ListSymbol.select](
          selectedQuality,
          true,
          new DOMEvent('resize', { detail: { width: w, height: h } }),
        );
      }
    });
  }

  #stopWatchingQualityResize() {
    this.#stopQualityResizeEffect?.();
    this.#stopQualityResizeEffect = null;
  }

  #onCanSetQualityChange() {
    this.$state.canSetQuality.set(!this.#media.qualities.readonly);
  }

  #watchCanSetVolume() {
    const { canSetVolume, isGoogleCastConnected } = this.$state;

    if (isGoogleCastConnected()) {
      // The provider will set this value accordingly.
      canSetVolume.set(false);
      return;
    }

    canChangeVolume().then(canSetVolume.set);
  }

  ['provider-change'](event: ME.MediaProviderChangeEvent) {
    const prevProvider = this.#media.$provider(),
      newProvider = event.detail;

    if (prevProvider?.type === newProvider?.type) return;

    prevProvider?.destroy?.();
    prevProvider?.scope?.dispose();
    this.#media.$provider.set(event.detail);

    if (prevProvider && event.detail === null) {
      this.#resetMediaState(event);
    }
  }

  ['provider-loader-change'](event: ME.MediaProviderLoaderChangeEvent) {
    if (__DEV__) {
      this.#media.logger
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
    this.#resetTracking();
  }

  ['can-load'](event: ME.MediaCanLoadEvent) {
    this.$state.canLoad.set(true);
    this.#trackedEvents.set('can-load', event);
    this.#media.textTracks[TextTrackSymbol.canLoad]();
    this.#satisfyRequest('media-start-loading', event);
  }

  ['can-load-poster'](event: ME.MediaCanLoadEvent) {
    this.$state.canLoadPoster.set(true);
    this.#trackedEvents.set('can-load-poster', event);
    this.#satisfyRequest('media-poster-start-loading', event);
  }

  ['media-type-change'](event: ME.MediaTypeChangeEvent) {
    const sourceChangeEvent = this.#trackedEvents.get('source-change');
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
    const sourceChangeEvent = this.#trackedEvents.get('source-change');
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);

    const { streamType, inferredStreamType } = this.$state;
    inferredStreamType.set(event.detail);
    (event as any).detail = streamType();
  }

  ['rate-change'](event: ME.MediaRateChangeEvent) {
    const { storage } = this.#media,
      { canPlay } = this.$state;

    this.$state.playbackRate.set(event.detail);
    this.#satisfyRequest('media-rate-change-request', event);

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
      this.#satisfyRequest(key, event);
    } else {
      const requestEvent = this.#request.queue.peek(key);
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

    this.#onSourceQualitiesChange(prevSources, newSources, event);
  }

  #onSourceQualitiesChange(prevSources: Src[], newSources: Src[], trigger?: Event) {
    let { qualities } = this.#media,
      added = false,
      removed = false;

    // Remove old qualities.
    for (const prevSrc of prevSources) {
      if (!isVideoQualitySrc(prevSrc)) continue;
      const exists = newSources.some((s) => s.src === prevSrc.src);
      if (!exists) {
        const quality = qualities.getBySrc(prevSrc.src);
        if (quality) {
          qualities[ListSymbol.remove](quality, trigger);
          removed = true;
        }
      }
    }

    // Do a complete reset if source qualities has changed.
    if (removed && !qualities.length) {
      this.$state.savedState.set(null);
      qualities[ListSymbol.reset](trigger);
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

      qualities[ListSymbol.add](quality, trigger);
      added = true;
    }

    if (added && !qualities[QualitySymbol.enableAuto]) {
      // Logic for this is inside `onAutoQualityChange` method.
      this.#watchQualityResize();
      qualities[QualitySymbol.enableAuto] = this.#watchQualityResize.bind(this);
      qualities[QualitySymbol.setAuto](true, trigger);
    }
  }

  ['source-change'](event: ME.MediaSourceChangeEvent) {
    event.isQualityChange = event.originEvent?.type === 'quality-change';

    const source = event.detail;

    this.#resetMediaState(event, event.isQualityChange);
    this.#trackedEvents.set(event.type, event);

    this.$state.source.set(source);
    this.el?.setAttribute('aria-busy', 'true');

    if (__DEV__) {
      this.#media.logger
        ?.infoGroup('📼 Media source change')
        .labelledLog('Source', source)
        .dispatch();
    }
  }

  #resetMediaState(event: Event, isSourceQualityChange = false) {
    const { audioTracks, qualities } = this.#media;

    if (!isSourceQualityChange) {
      this.#playedIntervals = [];
      this.#playedInterval = [-1, -1];

      audioTracks[ListSymbol.reset](event);
      qualities[ListSymbol.reset](event);

      softResetMediaState(this.$state, isSourceQualityChange);

      this.#resetTracking();

      return;
    }

    softResetMediaState(this.$state, isSourceQualityChange);
    this.#resetTracking();
  }

  ['abort'](event: ME.MediaAbortEvent) {
    const sourceChangeEvent = this.#trackedEvents.get('source-change');
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);

    const canLoadEvent = this.#trackedEvents.get('can-load');
    if (canLoadEvent && !event.triggers.hasType('can-load')) {
      event.triggers.add(canLoadEvent);
    }
  }

  ['load-start'](event: ME.MediaLoadStartEvent) {
    const sourceChangeEvent = this.#trackedEvents.get('source-change');
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);
  }

  ['error'](event: ME.MediaErrorEvent) {
    this.$state.error.set(event.detail);

    const abortEvent = this.#trackedEvents.get('abort');
    if (abortEvent) event.triggers.add(abortEvent);

    if (__DEV__) {
      this.#media.logger
        ?.errorGroup('Media Error')
        .labelledLog('Error', event.detail)
        .labelledLog('Event', event)
        .labelledLog('Context', this.#media)
        .dispatch();
    }
  }

  ['loaded-metadata'](event: ME.MediaLoadedMetadataEvent) {
    const loadStartEvent = this.#trackedEvents.get('load-start');
    if (loadStartEvent) event.triggers.add(loadStartEvent);
  }

  ['loaded-data'](event: ME.MediaLoadedDataEvent) {
    const loadStartEvent = this.#trackedEvents.get('load-start');
    if (loadStartEvent) event.triggers.add(loadStartEvent);
  }

  ['can-play'](event: ME.MediaCanPlayEvent) {
    const loadedMetadata = this.#trackedEvents.get('loaded-metadata');
    if (loadedMetadata) event.triggers.add(loadedMetadata);

    this.#onCanPlayDetail(event.detail);
    this.el?.setAttribute('aria-busy', 'false');
  }

  ['can-play-through'](event: ME.MediaCanPlayThroughEvent) {
    this.#onCanPlayDetail(event.detail);

    const canPlay = this.#trackedEvents.get('can-play');
    if (canPlay) event.triggers.add(canPlay);
  }

  #onCanPlayDetail(detail: ME.MediaCanPlayDetail) {
    const { seekable, buffered, intrinsicDuration, canPlay } = this.$state;

    canPlay.set(true);
    buffered.set(detail.buffered);
    seekable.set(detail.seekable);

    // Do not fetch `seekableEnd` from `$state` as it might be clipped.
    const seekableEnd = getTimeRangesEnd(detail.seekable) ?? Infinity;
    intrinsicDuration.set(seekableEnd);
  }

  ['duration-change'](event: ME.MediaDurationChangeEvent) {
    const { live, intrinsicDuration, providedDuration, clipEndTime, ended } = this.$state,
      time = event.detail;

    if (!live()) {
      const duration = !Number.isNaN(time) ? time : 0;
      intrinsicDuration.set(duration);
      if (ended()) this.#onEndPrecisionChange(event);
    }

    if (providedDuration() > 0 || clipEndTime() > 0) {
      event.stopImmediatePropagation();
    }
  }

  ['progress'](event: ME.MediaProgressEvent) {
    const { buffered, bufferedEnd, seekable, seekableEnd, live, intrinsicDuration } = this.$state,
      { buffered: newBuffered, seekable: newSeekable } = event.detail,
      newBufferedEnd = getTimeRangesEnd(newBuffered) ?? Infinity,
      hasBufferedLengthChanged = newBuffered.length !== buffered().length,
      hasBufferedEndChanged = newBufferedEnd > bufferedEnd(),
      newSeekableEnd = getTimeRangesEnd(newSeekable) ?? Infinity,
      hasSeekableLengthChanged = newSeekable.length !== seekable().length,
      hasSeekableEndChanged = newSeekableEnd > seekableEnd();

    if (hasBufferedLengthChanged || hasBufferedEndChanged) {
      buffered.set(newBuffered);
    }

    if (hasSeekableLengthChanged || hasSeekableEndChanged) {
      seekable.set(newSeekable);
    }

    if (live()) {
      intrinsicDuration.set(newSeekableEnd);
      this.dispatch('duration-change', {
        detail: newSeekableEnd,
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

    this.#resetPlaybackIfNeeded();

    if (!paused()) {
      event.stopImmediatePropagation();
      return;
    }

    event.autoPlay = autoPlaying();

    const waitingEvent = this.#trackedEvents.get('waiting');
    if (waitingEvent) event.triggers.add(waitingEvent);

    this.#satisfyRequest('media-play-request', event);
    this.#trackedEvents.set('play', event);

    paused.set(false);
    autoPlayError.set(null);

    if (event.autoPlay) {
      this.handle(
        this.createEvent('auto-play', {
          detail: { muted: muted() },
          trigger: event,
        }),
      );

      autoPlaying.set(false);
    }

    if (ended() || this.#request.replaying) {
      this.#request.replaying = false;
      ended.set(false);
      this.handle(this.createEvent('replay', { trigger: event }));
    }

    if (!playsInline() && viewType() === 'video' && pointer() === 'coarse') {
      this.#media.remote.enterFullscreen('prefer-media', event);
    }

    if (live() && !userBehindLiveEdge()) {
      this.#media.remote.seekToLiveEdge(event);
    }
  }

  #resetPlaybackIfNeeded(trigger?: Event) {
    const provider = peek(this.#media.$provider);
    if (!provider) return;

    const {
      ended,
      seekableStart,
      clipStartTime,
      clipEndTime,
      currentTime,
      realCurrentTime,
      duration,
    } = this.$state;

    const shouldReset =
      ended() ||
      realCurrentTime() < clipStartTime() ||
      (clipEndTime() > 0 && realCurrentTime() >= clipEndTime()) ||
      Math.abs(currentTime() - duration()) < 0.1;

    if (shouldReset) {
      this.dispatch('media-seek-request', {
        detail: seekableStart(),
        trigger,
      });
    }

    return shouldReset;
  }

  ['play-fail'](event: ME.MediaPlayFailEvent) {
    const { muted, autoPlaying } = this.$state;

    const playEvent = this.#trackedEvents.get('play');
    if (playEvent) event.triggers.add(playEvent);

    this.#satisfyRequest('media-play-request', event);

    const { paused, playing } = this.$state;
    paused.set(true);
    playing.set(false);

    this.#resetTracking();
    this.#trackedEvents.set('play-fail', event);

    if (event.autoPlay) {
      this.handle(
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
    const playEvent = this.#trackedEvents.get('play'),
      seekedEvent = this.#trackedEvents.get('seeked');

    if (playEvent) event.triggers.add(playEvent);
    else if (seekedEvent) event.triggers.add(seekedEvent);

    setTimeout(() => this.#resetTracking(), 0);

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

    if (this.#request.looping) {
      this.#request.looping = false;
      return;
    }

    if (live() && !started() && currentTime() === 0) {
      const end = liveSyncPosition() ?? seekableEnd() - 2;
      if (Number.isFinite(end)) this.#media.$provider()!.setCurrentTime(end);
    }

    this['started'](event);
  }

  ['started'](event: Event) {
    const { started } = this.$state;
    if (!started()) {
      started.set(true);
      this.handle(this.createEvent('started', { trigger: event }));
    }
  }

  ['pause'](event: ME.MediaPauseEvent) {
    if (!this.el?.isConnected) {
      this.#isPlayingOnDisconnect = true;
    }

    this.#satisfyRequest('media-pause-request', event);

    const seekedEvent = this.#trackedEvents.get('seeked');
    if (seekedEvent) event.triggers.add(seekedEvent);

    const { paused, playing } = this.$state;
    paused.set(true);
    playing.set(false);

    if (this.#clipEnded) {
      // Should fire after pause event.
      setTimeout(() => {
        this.handle(this.createEvent('end', { trigger: event }));
        this.#clipEnded = false;
      }, 0);
    }

    this.#resetTracking();
  }

  ['time-change'](event: ME.MediaTimeChangeEvent) {
    if (this.#request.looping) {
      event.stopImmediatePropagation();
      return;
    }

    let { waiting, played, clipEndTime, realCurrentTime, currentTime } = this.$state,
      newTime = event.detail,
      endTime = clipEndTime();

    realCurrentTime.set(newTime);
    this.#updatePlayed();
    waiting.set(false);

    for (const track of this.#media.textTracks) {
      track[TextTrackSymbol.updateActiveCues](newTime, event);
    }

    if (endTime > 0 && newTime >= endTime) {
      this.#clipEnded = true;
      this.dispatch('media-pause-request', { trigger: event });
    }

    this.#saveTime();

    this.dispatch('time-update', {
      detail: { currentTime: currentTime(), played: played() },
      trigger: event,
    });
  }

  #updatePlayed() {
    const { currentTime, played, paused } = this.$state;

    if (paused()) return;

    this.#playedInterval = updateTimeIntervals(
      this.#playedIntervals,
      this.#playedInterval,
      currentTime(),
    );

    played.set(new TimeRange(this.#playedIntervals));
  }

  // Called to update time again incase duration precision has changed.
  #onEndPrecisionChange(trigger?: Event) {
    const { clipStartTime, clipEndTime, duration } = this.$state,
      isClipped = clipStartTime() > 0 || clipEndTime() > 0;

    if (isClipped) return;

    this.handle(
      this.createEvent('time-change', {
        detail: duration(),
        trigger,
      }),
    );
  }

  #saveTime() {
    const { storage } = this.#media,
      { canPlay, realCurrentTime } = this.$state;
    if (canPlay()) {
      storage?.setTime?.(realCurrentTime());
    }
  }

  ['audio-gain-change'](event: ME.MediaAudioGainChangeEvent) {
    const { storage } = this.#media,
      { canPlay, audioGain } = this.$state;

    audioGain.set(event.detail);
    this.#satisfyRequest('media-audio-gain-change-request', event);

    if (canPlay()) storage?.setAudioGain?.(audioGain());
  }

  ['volume-change'](event: ME.MediaVolumeChangeEvent) {
    const { storage } = this.#media,
      { volume, muted, canPlay } = this.$state,
      detail = event.detail;

    volume.set(detail.volume);
    muted.set(detail.muted || detail.volume === 0);

    this.#satisfyRequest('media-volume-change-request', event);
    this.#satisfyRequest(detail.muted ? 'media-mute-request' : 'media-unmute-request', event);

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

      this.#satisfyRequest('media-seeking-request', event);

      if (paused()) {
        this.#waitingTrigger = event;
        this.#fireWaiting();
      }

      this.#playedInterval = [-1, -1];
    },
    150,
    { leading: true },
  );

  ['seeked'](event: ME.MediaSeekedEvent) {
    const { seeking, currentTime, realCurrentTime, paused, seekableEnd, ended } = this.$state;

    if (this.#request.seeking) {
      seeking.set(true);
      event.stopImmediatePropagation();
    } else if (seeking()) {
      const waitingEvent = this.#trackedEvents.get('waiting');
      if (waitingEvent) event.triggers.add(waitingEvent);

      const seekingEvent = this.#trackedEvents.get('seeking');
      if (seekingEvent && !event.triggers.has(seekingEvent)) {
        event.triggers.add(seekingEvent);
      }

      if (paused()) this.#stopWaiting();

      seeking.set(false);

      realCurrentTime.set(event.detail);
      this.#satisfyRequest('media-seek-request', event);

      // Only start if user initiated.
      const origin = event?.originEvent;
      if (origin?.isTrusted && !(origin instanceof MessageEvent) && !/seek/.test(origin.type)) {
        this['started'](event);
      }
    }

    if (Math.floor(currentTime()) !== Math.floor(seekableEnd())) {
      ended.set(false);
    } else {
      this.end(event);
    }
  }

  ['waiting'](event: ME.MediaWaitingEvent) {
    if (this.#firingWaiting || this.#request.seeking) return;
    event.stopImmediatePropagation();
    this.#waitingTrigger = event;
    this.#fireWaiting();
  }

  #fireWaiting = debounce(() => {
    if (!this.#waitingTrigger) return;

    this.#firingWaiting = true;

    const { waiting, playing } = this.$state;
    waiting.set(true);
    playing.set(false);

    const event = this.createEvent('waiting', { trigger: this.#waitingTrigger });
    this.#trackedEvents.set('waiting', event);
    this.dispatch(event);

    this.#waitingTrigger = undefined;
    this.#firingWaiting = false;
  }, 300);

  ['end'](event: Event) {
    const { loop, ended } = this.$state;

    if (!loop() && ended()) return;

    if (loop()) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.#resetPlaybackIfNeeded(event);
          this.dispatch('media-loop-request', { trigger: event });
        });
      }, 10);

      return;
    }

    // Fire after `end`
    setTimeout(() => this.#onEnded(event), 0);
  }

  #onEnded(event: Event) {
    const { storage } = this.#media,
      { paused, seeking, ended, duration } = this.$state;

    this.#onEndPrecisionChange(event);

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
    this.#resetTracking();
    storage?.setTime?.(duration(), true);

    this.dispatch('ended', {
      trigger: event,
    });
  }

  #stopWaiting() {
    this.#fireWaiting.cancel();
    this.$state.waiting.set(false);
  }

  ['fullscreen-change'](event: ME.MediaFullscreenChangeEvent) {
    const isFullscreen = event.detail;
    this.$state.fullscreen.set(isFullscreen);
    this.#satisfyRequest(
      isFullscreen ? 'media-enter-fullscreen-request' : 'media-exit-fullscreen-request',
      event,
    );
  }

  ['fullscreen-error'](event: ME.MediaFullscreenErrorEvent) {
    this.#satisfyRequest('media-enter-fullscreen-request', event);
    this.#satisfyRequest('media-exit-fullscreen-request', event);
  }

  ['orientation-change'](event: ME.MediaOrientationChangeEvent) {
    const isLocked = event.detail.lock;
    this.#satisfyRequest(
      isLocked ? 'media-orientation-lock-request' : 'media-orientation-unlock-request',
      event,
    );
  }

  ['picture-in-picture-change'](event: ME.MediaPIPChangeEvent) {
    const isPiP = event.detail;
    this.$state.pictureInPicture.set(isPiP);
    this.#satisfyRequest(isPiP ? 'media-enter-pip-request' : 'media-exit-pip-request', event);
  }

  ['picture-in-picture-error'](event: ME.MediaPIPErrorEvent) {
    this.#satisfyRequest('media-enter-pip-request', event);
    this.#satisfyRequest('media-exit-pip-request', event);
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
