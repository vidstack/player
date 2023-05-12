import debounce from 'just-debounce-it';
import throttle from 'just-throttle';
import { ComponentController, ComponentInstance } from 'maverick.js/element';
import { appendTriggerEvent, listenEvent } from 'maverick.js/std';

import { LIST_RESET } from '../../../foundation/list/symbols';
import type { MediaContext } from '../api/context';
import * as ME from '../api/events';
import { softResetMediaStore, type MediaStore } from '../api/store';
import type { PlayerAPI } from '../player';
import type {
  VideoQualityAddEvent,
  VideoQualityChangeEvent,
  VideoQualityRemoveEvent,
} from '../quality/video-quality';
import type {
  AudioTrackAddEvent,
  AudioTrackChangeEvent,
  AudioTrackRemoveEvent,
} from '../tracks/audio-tracks';
import { TEXT_TRACK_CAN_LOAD, TEXT_TRACK_UPDATE_ACTIVE_CUES } from '../tracks/text/symbols';
import type {
  TextTrackAddEvent,
  TextTrackListModeChangeEvent,
  TextTrackRemoveEvent,
} from '../tracks/text/text-tracks';
import type { MediaRequestContext, MediaRequestQueueRecord } from './media-request-manager';
import { TRACKED_EVENT } from './tracked-media-events';

/**
 * This class is responsible for listening to and normalizing media events, updating the media
 * state context, and satisfying media requests.
 */
export class MediaStateManager extends ComponentController<PlayerAPI> {
  private readonly _store: MediaStore;
  private readonly _trackedEvents = new Map<string, ME.MediaEvent>();

  private _skipInitialSrcChange = true;
  private _firingWaiting = false;
  private _waitingTrigger: Event | undefined;

  constructor(
    instance: ComponentInstance<PlayerAPI>,
    private _request: MediaRequestContext,
    private _media: MediaContext,
  ) {
    super(instance);
    this._store = _media.$store;
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('aria-busy', 'true');
  }

  protected override onConnect(el: HTMLElement) {
    this._addTextTrackListeners();
    this._addQualityListeners();
    this._addAudioTrackListeners();
    this.listen('fullscreen-change', this['fullscreen-change'].bind(this));
    this.listen('fullscreen-error', this['fullscreen-error'].bind(this));
  }

  _handle(event: Event) {
    const type = event.type as keyof ME.MediaEvents;
    this[event.type]?.(event);
    if (!__SERVER__) {
      if (TRACKED_EVENT.has(type)) this._trackedEvents.set(type, event as ME.MediaEvent);
      this.el?.dispatchEvent(event);
    }
  }

  private _resetTracking() {
    this._stopWaiting();
    this._request._replaying = false;
    this._request._looping = false;
    this._firingWaiting = false;
    this._waitingTrigger = undefined;
    this._trackedEvents.clear();
  }

  private _satisfyRequest<T extends keyof MediaRequestQueueRecord>(request: T, event: any) {
    this._request._queue._serve(request, (requestEvent) => {
      event.request = requestEvent;
      appendTriggerEvent(event, requestEvent);
    });
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
    const { textTracks } = this._store;
    textTracks.set(this._media.textTracks.toArray());
    this.dispatch('text-tracks-change', {
      detail: textTracks(),
      trigger: event,
    });
  }

  private _onTextTrackModeChange(event?: TextTrackListModeChangeEvent) {
    if (event) this._satisfyRequest('textTrack', event);

    const current = this._media.textTracks.selected,
      { textTrack } = this._store;

    if (textTrack() !== current) {
      textTrack.set(current);
      this.dispatch('text-track-change', {
        detail: current,
        trigger: event,
      });
    }
  }

  private _onAudioTracksChange(event?: AudioTrackAddEvent | AudioTrackRemoveEvent) {
    const { audioTracks } = this._store;
    audioTracks.set(this._media.audioTracks.toArray());
    this.dispatch('audio-tracks-change', {
      detail: audioTracks(),
      trigger: event,
    });
  }

  private _onAudioTrackChange(event?: AudioTrackChangeEvent) {
    const { audioTrack } = this._store;
    audioTrack.set(this._media.audioTracks.selected);
    this._satisfyRequest('audioTrack', event);
    this.dispatch('audio-track-change', {
      detail: audioTrack(),
      trigger: event,
    });
  }

  private _onQualitiesChange(event?: VideoQualityAddEvent | VideoQualityRemoveEvent) {
    const { qualities } = this._store;
    qualities.set(this._media.qualities.toArray());
    this.dispatch('qualities-change', {
      detail: qualities(),
      trigger: event,
    });
  }

  private _onQualityChange(event?: VideoQualityChangeEvent) {
    const { quality } = this._store;
    quality.set(this._media.qualities.selected);
    this._satisfyRequest('quality', event);
    this.dispatch('quality-change', {
      detail: quality(),
      trigger: event,
    });
  }

  private _onAutoQualityChange() {
    this._store.autoQuality.set(this._media.qualities.auto);
  }

  private _onCanSetQualityChange() {
    this._store.canSetQuality.set(!this._media.qualities.readonly);
  }

  ['provider-change'](event: ME.MediaProviderChangeEvent) {
    this._media.$provider.set(event.detail);
  }

  ['autoplay'](event: ME.MediaAutoplayEvent) {
    appendTriggerEvent(event, this._trackedEvents.get('play'));
    appendTriggerEvent(event, this._trackedEvents.get('can-play'));
    this._store.autoplayError.set(undefined);
  }

  ['autoplay-fail'](event: ME.MediaAutoplayFailEvent) {
    appendTriggerEvent(event, this._trackedEvents.get('play-fail'));
    appendTriggerEvent(event, this._trackedEvents.get('can-play'));
    this._store.autoplayError.set(event.detail);
    this._resetTracking();
  }

  ['can-load'](event: ME.MediaCanLoadEvent) {
    this._store.canLoad.set(true);
    this._trackedEvents.set('can-load', event);
    this._satisfyRequest('load', event);
    this._media.textTracks[TEXT_TRACK_CAN_LOAD]();
  }

  ['media-type-change'](event: ME.MediaTypeChangeEvent) {
    appendTriggerEvent(event, this._trackedEvents.get('source-change'));
    const viewType = this._store.viewType();
    this._store.mediaType.set(event.detail);
    if (viewType !== this._store.viewType()) {
      setTimeout(
        () =>
          this.dispatch('view-type-change', {
            detail: this._store.viewType(),
            trigger: event,
          }),
        0,
      );
    }
  }

  ['stream-type-change'](event: ME.MediaStreamTypeChangeEvent) {
    const { streamType, inferredStreamType } = this._store;
    appendTriggerEvent(event, this._trackedEvents.get('source-change'));
    inferredStreamType.set(event.detail);
    (event as any).detail = streamType();
  }

  ['rate-change'](event: ME.MediaRateChangeEvent) {
    this._store.playbackRate.set(event.detail);
    this._satisfyRequest('rate', event);
  }

  ['sources-change'](event: ME.MediaSourcesChangeEvent) {
    this._store.sources.set(event.detail);
  }

  ['source-change'](event: ME.MediaSourceChangeEvent) {
    appendTriggerEvent(event, this._trackedEvents.get('sources-change'));

    this._store.source.set(event.detail);
    this.el?.setAttribute('aria-busy', 'true');

    if (__DEV__) {
      this._media.logger
        ?.infoGroup('📼 Media source change')
        .labelledLog('Source', event.detail)
        .dispatch();
    }

    // Skip resets before first playback to ensure initial properties and tracked events are kept.
    if (this._skipInitialSrcChange) {
      this._skipInitialSrcChange = false;
      return;
    }

    this._media.audioTracks[LIST_RESET](event);
    this._media.qualities[LIST_RESET](event);
    this._resetTracking();
    softResetMediaStore(this._media.$store);
    this._trackedEvents.set(event.type, event);
  }

  ['abort'](event: ME.MediaAbortEvent) {
    appendTriggerEvent(event, this._trackedEvents.get('source-change'));
    appendTriggerEvent(event, this._trackedEvents.get('can-load'));
  }

  ['load-start'](event: ME.MediaLoadStartEvent) {
    appendTriggerEvent(event, this._trackedEvents.get('source-change'));
  }

  ['error'](event: ME.MediaErrorEvent) {
    this._store.error.set(event.detail);
    appendTriggerEvent(event, this._trackedEvents.get('abort'));
  }

  ['loaded-metadata'](event: ME.MediaLoadedMetadataEvent) {
    appendTriggerEvent(event, this._trackedEvents.get('load-start'));
  }

  ['loaded-data'](event: ME.MediaLoadedDataEvent) {
    appendTriggerEvent(event, this._trackedEvents.get('load-start'));
  }

  ['can-play'](event: ME.MediaCanPlayEvent) {
    // Avoid infinite chain - `hls.js` will not fire `canplay` event.
    if (event.trigger?.type !== 'loadedmetadata') {
      appendTriggerEvent(event, this._trackedEvents.get('loaded-metadata'));
    }

    this._onCanPlayDetail(event.detail);
    this.el?.setAttribute('aria-busy', 'false');
  }

  ['can-play-through'](event: ME.MediaCanPlayThroughEvent) {
    this._onCanPlayDetail(event.detail);
    appendTriggerEvent(event, this._trackedEvents.get('can-play'));
  }

  protected _onCanPlayDetail(detail: ME.MediaCanPlayDetail) {
    const { seekable, seekableEnd, buffered, duration, canPlay } = this._store;
    seekable.set(detail.seekable);
    buffered.set(detail.buffered);
    duration.set(seekableEnd);
    canPlay.set(true);
  }

  ['duration-change'](event: ME.MediaDurationChangeEvent) {
    const { live, duration } = this._store,
      time = event.detail;
    if (!live()) duration.set(!Number.isNaN(time) ? time : 0);
  }

  ['progress'](event: ME.MediaProgressEvent) {
    const { buffered, seekable, live, duration, seekableEnd } = this._store,
      detail = event.detail;

    buffered.set(detail.buffered);
    seekable.set(detail.seekable);

    if (live()) {
      duration.set(seekableEnd);
      this.dispatch('duration-change', {
        detail: seekableEnd(),
        trigger: event,
      });
    }
  }

  ['play'](event: ME.MediaPlayEvent) {
    const { paused, autoplayError, ended, autoplaying } = this._store;

    event.autoplay = autoplaying();

    if (this._request._looping || !paused()) {
      event.stopImmediatePropagation();
      return;
    }

    appendTriggerEvent(event, this._trackedEvents.get('waiting'));
    this._satisfyRequest('play', event);

    paused.set(false);
    autoplayError.set(undefined);

    if (ended() || this._request._replaying) {
      this._request._replaying = false;
      ended.set(false);
      this._handle(this.createEvent('replay', { trigger: event }));
    }
  }

  ['play-fail'](event: ME.MediaPlayFailEvent) {
    appendTriggerEvent(event, this._trackedEvents.get('play'));
    this._satisfyRequest('play', event);

    const { paused, playing } = this._store;
    paused.set(true);
    playing.set(false);

    this._resetTracking();
  }

  ['playing'](event: ME.MediaPlayingEvent) {
    const playEvent = this._trackedEvents.get('play');

    if (playEvent) {
      appendTriggerEvent(event, this._trackedEvents.get('waiting'));
      appendTriggerEvent(event, playEvent);
    } else {
      appendTriggerEvent(event, this._trackedEvents.get('seeked'));
    }

    setTimeout(() => this._resetTracking(), 0);

    const { paused, playing, seeking, ended } = this._store;
    paused.set(false);
    playing.set(true);
    seeking.set(false);
    ended.set(false);

    if (this._request._looping) {
      event.stopImmediatePropagation();
      this._request._looping = false;
      return;
    }

    this['started'](event);
  }

  ['started'](event: Event) {
    const { started, live, liveSyncPosition, seekableEnd } = this._store;

    if (!started()) {
      if (live()) {
        const end = liveSyncPosition() ?? seekableEnd() - 2;
        if (Number.isFinite(end)) this._media.$provider()!.currentTime = end;
      }

      started.set(true);
      this._handle(this.createEvent('started', { trigger: event }));
    }
  }

  ['pause'](event: ME.MediaPauseEvent) {
    if (this._request._looping) {
      event.stopImmediatePropagation();
      return;
    }

    appendTriggerEvent(event, this._trackedEvents.get('seeked'));
    this._satisfyRequest('pause', event);

    const { paused, playing, seeking } = this._store;
    paused.set(true);
    playing.set(false);
    seeking.set(false);

    this._resetTracking();
  }

  ['time-update'](event: ME.MediaTimeUpdateEvent) {
    const { currentTime, played, waiting } = this._store,
      detail = event.detail;

    currentTime.set(detail.currentTime);
    played.set(detail.played);
    waiting.set(false);

    for (const track of this._media.textTracks) {
      if (track.mode === 'disabled') continue;
      track[TEXT_TRACK_UPDATE_ACTIVE_CUES](detail.currentTime, event);
    }
  }

  ['volume-change'](event: ME.MediaVolumeChangeEvent) {
    const { volume, muted } = this._store,
      detail = event.detail;
    volume.set(detail.volume);
    muted.set(detail.muted || detail.volume === 0);
    this._satisfyRequest('volume', event);
  }

  ['seeking'] = throttle(
    (event: ME.MediaSeekingEvent) => {
      const { seeking, currentTime, paused } = this._store;
      seeking.set(true);
      currentTime.set(event.detail);
      this._satisfyRequest('seeking', event);
      if (paused()) {
        this._waitingTrigger = event;
        this._fireWaiting();
      }
    },
    150,
    { leading: true },
  );

  ['seeked'](event: ME.MediaSeekedEvent) {
    const { seeking, currentTime, paused, duration, ended } = this._store;
    if (this._request._seeking) {
      seeking.set(true);
      event.stopImmediatePropagation();
    } else if (seeking()) {
      const waitingEvent = this._trackedEvents.get('waiting');
      appendTriggerEvent(event, waitingEvent);

      if (waitingEvent?.trigger?.type !== 'seeking') {
        appendTriggerEvent(event, this._trackedEvents.get('seeking'));
      }

      if (paused()) this._stopWaiting();

      seeking.set(false);

      if (event.detail !== duration()) ended.set(false);

      currentTime.set(event.detail);
      this._satisfyRequest('seeked', event);

      // Only start if user initiated.
      const origin = event.originEvent;
      if (origin && origin.isTrusted && !/seek/.test(origin.type)) {
        this['started'](event);
      }
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

    const { waiting, playing } = this._store;
    waiting.set(true);
    playing.set(false);

    const event = this.createEvent('waiting', { trigger: this._waitingTrigger });
    this._trackedEvents.set('waiting', event);
    this.el!.dispatchEvent(event);

    this._waitingTrigger = undefined;
    this._firingWaiting = false;
  }, 300);

  ['ended'](event: ME.MediaEndedEvent) {
    if (this._request._looping) {
      event.stopImmediatePropagation();
      return;
    }

    const { paused, playing, seeking, ended } = this._store;
    paused.set(true);
    playing.set(false);
    seeking.set(false);
    ended.set(true);

    this._resetTracking();
  }

  private _stopWaiting() {
    this._fireWaiting.cancel();
    this._store.waiting.set(false);
  }

  ['fullscreen-change'](event: ME.MediaFullscreenChangeEvent) {
    this._store.fullscreen.set(event.detail);
    this._satisfyRequest('fullscreen', event);
  }

  ['fullscreen-error'](event: ME.MediaFullscreenErrorEvent) {
    this._satisfyRequest('fullscreen', event);
  }

  ['picture-in-picture-change'](event: ME.MediaPIPChangeEvent) {
    this._store.pictureInPicture.set(event.detail);
    this._satisfyRequest('pip', event);
  }

  ['picture-in-picture-error'](event: ME.MediaPIPErrorEvent) {
    this._satisfyRequest('pip', event);
  }
}
