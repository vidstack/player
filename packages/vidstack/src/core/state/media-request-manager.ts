import { effect, peek, type ReadSignal } from 'maverick.js';
import { DOMEvent, isUndefined } from 'maverick.js/std';

import {
  FullscreenController,
  type FullscreenAdapter,
} from '../../foundation/fullscreen/controller';
import { ScreenOrientationController } from '../../foundation/orientation/controller';
import { Queue } from '../../foundation/queue/queue';
import { RequestQueue } from '../../foundation/queue/request-queue';
import type { MediaProviderAdapter } from '../../providers/types';
import { coerceToError } from '../../utils/error';
import type { MediaContext } from '../api/media-context';
import type { MediaFullscreenChangeEvent } from '../api/media-events';
import * as RE from '../api/media-request-events';
import { MediaPlayerController } from '../api/player-controller';
import { MediaControls } from '../controls';
import type { MediaStateManager } from './media-state-manager';

/**
 * This class is responsible for listening to media request events and calling the appropriate
 * actions on the current media provider. Do note, actions are queued until a media provider
 * has connected.
 */
export class MediaRequestManager extends MediaPlayerController implements MediaRequestHandler {
  readonly _controls: MediaControls;
  readonly _fullscreen: FullscreenController;
  readonly _orientation: ScreenOrientationController;

  private readonly _$provider: ReadSignal<MediaProviderAdapter | null>;
  private readonly _providerQueue = new RequestQueue();

  constructor(
    private _stateMgr: MediaStateManager,
    private _request: MediaRequestContext,
    private _media: MediaContext,
  ) {
    super();
    this._$provider = _media.$provider;
    this._controls = new MediaControls();
    this._fullscreen = new FullscreenController();
    this._orientation = new ScreenOrientationController();
  }

  protected override onAttach(): void {
    this.listen('fullscreen-change', this._onFullscreenChange.bind(this));
  }

  protected override onConnect() {
    const names = Object.getOwnPropertyNames(Object.getPrototypeOf(this)),
      handle = this._handleRequest.bind(this);

    for (const name of names) {
      if (name.startsWith('media-')) {
        this.listen(name as keyof RE.MediaRequestEvents, handle);
      }
    }

    this._attachLoadPlayListener();
    effect(this._watchProvider.bind(this));
    effect(this._onControlsDelayChange.bind(this));
    effect(this._onFullscreenSupportChange.bind(this));
    effect(this._onPiPSupportChange.bind(this));
  }

  protected override onDestroy(): void {
    this._providerQueue._reset();
  }

  private _attachLoadPlayListener() {
    const { load } = this.$props,
      { canLoad } = this.$state;

    if (load() !== 'play' || canLoad()) return;

    const off = this.listen('media-play-request', (event) => {
      this._handleLoadPlayStrategy(event);
      off();
    });
  }

  private _watchProvider() {
    const provider = this._$provider(),
      canPlay = this.$state.canPlay();

    if (provider && canPlay) {
      this._providerQueue._start();
    }

    return () => {
      this._providerQueue._stop();
    };
  }

  private _handleRequest(event: Event) {
    event.stopPropagation();

    if (__DEV__) {
      this._media.logger
        ?.infoGroup(`📬 received \`${event.type}\``)
        .labelledLog('Request', event)
        .dispatch();
    }

    if (!this[event.type]) return;

    if (peek(this._$provider)) {
      this[event.type](event);
    } else {
      this._providerQueue._enqueue(event.type as any, () => {
        if (peek(this._$provider)) this[event.type](event);
      });
    }
  }

  async _play(trigger?: Event) {
    if (__SERVER__) return;

    const { canPlay, paused, autoplaying } = this.$state;

    if (this._handleLoadPlayStrategy(trigger)) return;

    if (!peek(paused) && !this._request._looping) return;

    if (trigger?.type === 'media-play-request') {
      this._request._queue._enqueue('play', trigger as RE.MediaPlayRequestEvent);
    }

    try {
      const provider = peek(this._$provider);
      throwIfNotReadyForPlayback(provider, peek(canPlay));
      return await provider!.play();
    } catch (error) {
      if (__DEV__) {
        this._media.logger
          ?.errorGroup('play request failed')
          .labelledLog('Trigger', trigger)
          .labelledLog('Error', error)
          .dispatch();
      }

      const errorEvent = this.createEvent('play-fail', {
        detail: coerceToError(error),
        trigger,
      });

      errorEvent.autoplay = autoplaying();

      this._stateMgr._handle(errorEvent);
      throw error;
    }
  }

  private _handleLoadPlayStrategy(trigger?: Event) {
    const { load } = this.$props,
      { canLoad } = this.$state;

    if (load() === 'play' && !canLoad()) {
      const event = this.createEvent('media-start-loading', { trigger });
      this.dispatchEvent(event);

      this._providerQueue._enqueue('play', async () => {
        try {
          await this._play(event);
        } catch (e) {
          // no-op
        }
      });

      return true;
    }

    return false;
  }

  async _pause(trigger?: Event) {
    if (__SERVER__) return;

    const { canPlay, paused } = this.$state;

    if (peek(paused)) return;

    if (trigger?.type === 'media-pause-request') {
      this._request._queue._enqueue('pause', trigger as RE.MediaPauseRequestEvent);
    }

    const provider = peek(this._$provider);
    throwIfNotReadyForPlayback(provider, peek(canPlay));

    return provider!.pause();
  }

  _seekToLiveEdge(trigger?: Event) {
    if (__SERVER__) return;

    const { canPlay, live, liveEdge, canSeek, liveSyncPosition, seekableEnd, userBehindLiveEdge } =
      this.$state;

    userBehindLiveEdge.set(false);

    if (peek(() => !live() || liveEdge() || !canSeek())) return;

    const provider = peek(this._$provider);
    throwIfNotReadyForPlayback(provider, peek(canPlay));

    const end = seekableEnd() - 2;
    provider!.setCurrentTime(Math.min(end, liveSyncPosition() ?? end));
  }

  private _wasPIPActive = false;
  async _enterFullscreen(
    target: RE.MediaFullscreenRequestTarget = 'prefer-media',
    trigger?: Event,
  ) {
    if (__SERVER__) return;

    const adapter = this._getFullscreenAdapter(target);

    throwIfFullscreenNotSupported(target, adapter);

    if (adapter!.active) return;

    if (peek(this.$state.pictureInPicture)) {
      this._wasPIPActive = true;
      await this._exitPictureInPicture(trigger);
    }

    if (trigger?.type === 'media-enter-fullscreen-request') {
      this._request._queue._enqueue('fullscreen', trigger as RE.MediaEnterFullscreenRequestEvent);
    }

    return adapter!.enter();
  }

  async _exitFullscreen(target: RE.MediaFullscreenRequestTarget = 'prefer-media', trigger?: Event) {
    if (__SERVER__) return;

    const adapter = this._getFullscreenAdapter(target);

    throwIfFullscreenNotSupported(target, adapter);

    if (!adapter!.active) return;

    if (trigger?.type === 'media-exit-fullscreen-request') {
      this._request._queue._enqueue('fullscreen', trigger as RE.MediaExitFullscreenRequestEvent);
    }

    try {
      const result = await adapter!.exit();

      if (this._wasPIPActive && peek(this.$state.canPictureInPicture)) {
        await this._enterPictureInPicture();
      }

      return result;
    } finally {
      this._wasPIPActive = false;
    }
  }

  private _getFullscreenAdapter(target: RE.MediaFullscreenRequestTarget) {
    const provider = peek(this._$provider);
    return (target === 'prefer-media' && this._fullscreen.supported) || target === 'media'
      ? this._fullscreen
      : provider?.fullscreen;
  }

  async _enterPictureInPicture(trigger?: Event) {
    if (__SERVER__) return;

    this._throwIfPIPNotSupported();

    if (this.$state.pictureInPicture()) return;

    if (trigger?.type === 'media-enter-pip-request') {
      this._request._queue._enqueue('pip', trigger as RE.MediaEnterPIPRequestEvent);
    }

    return await this._$provider()!.pictureInPicture!.enter();
  }

  async _exitPictureInPicture(trigger?: Event) {
    if (__SERVER__) return;

    this._throwIfPIPNotSupported();

    if (!this.$state.pictureInPicture()) return;

    if (trigger?.type === 'media-exit-pip-request') {
      this._request._queue._enqueue('pip', trigger as RE.MediaExitPIPRequestEvent);
    }

    return await this._$provider()!.pictureInPicture!.exit();
  }

  private _throwIfPIPNotSupported() {
    if (this.$state.canPictureInPicture()) return;
    throw Error(
      __DEV__
        ? `[vidstack] picture-in-picture is not currently available`
        : '[vidstack] no pip support',
    );
  }

  private _onControlsDelayChange() {
    this._controls.defaultDelay = this.$props.controlsDelay();
  }

  private _onFullscreenSupportChange() {
    const { canLoad, canFullscreen } = this.$state,
      supported = this._fullscreen.supported || this._$provider()?.fullscreen?.supported || false;

    if (canLoad() && peek(canFullscreen) === supported) return;

    canFullscreen.set(supported);
  }

  private _onPiPSupportChange() {
    const { canLoad, canPictureInPicture } = this.$state,
      supported = this._$provider()?.pictureInPicture?.supported || false;

    if (canLoad() && peek(canPictureInPicture) === supported) return;

    canPictureInPicture.set(supported);
  }

  ['media-audio-track-change-request'](event: RE.MediaAudioTrackChangeRequestEvent) {
    if (this._media.audioTracks.readonly) {
      if (__DEV__) {
        this._media.logger
          ?.warnGroup(`[vidstack] attempted to change audio track but it is currently read-only`)
          .labelledLog('Event', event)
          .dispatch();
      }

      return;
    }

    const index = event.detail,
      track = this._media.audioTracks[index];

    if (track) {
      this._request._queue._enqueue('audioTrack', event);
      track.selected = true;
    } else if (__DEV__) {
      this._media.logger
        ?.warnGroup('[vidstack] failed audio track change request (invalid index)')
        .labelledLog('Audio Tracks', this._media.audioTracks.toArray())
        .labelledLog('Index', index)
        .labelledLog('Event', event)
        .dispatch();
    }
  }

  async ['media-enter-fullscreen-request'](event: RE.MediaEnterFullscreenRequestEvent) {
    try {
      await this._enterFullscreen(event.detail, event);
    } catch (error) {
      this._onFullscreenError(error, event);
    }
  }

  async ['media-exit-fullscreen-request'](event: RE.MediaExitFullscreenRequestEvent) {
    try {
      await this._exitFullscreen(event.detail, event);
    } catch (error) {
      this._onFullscreenError(error, event);
    }
  }

  private async _onFullscreenChange(event: MediaFullscreenChangeEvent) {
    const lockType = peek(this.$props.fullscreenOrientation),
      isFullscreen = event.detail;

    if (isUndefined(lockType) || !this._orientation.supported) return;

    if (isFullscreen) {
      if (this._orientation.locked) return;
      this.dispatch('media-orientation-lock-request', {
        detail: lockType,
        trigger: event,
      });
    } else if (this._orientation.locked) {
      this.dispatch('media-orientation-unlock-request', {
        trigger: event,
      });
    }
  }

  private _onFullscreenError(error: unknown, request?: Event) {
    if (__DEV__) {
      this._media.logger
        ?.errorGroup('fullscreen request failed')
        .labelledLog('Request', request)
        .labelledLog('Error', error)
        .dispatch();
    }

    this._stateMgr._handle(
      this.createEvent('fullscreen-error', {
        detail: coerceToError(error),
      }),
    );
  }

  async ['media-orientation-lock-request'](event: RE.MediaOrientationLockRequestEvent) {
    try {
      this._request._queue._enqueue('orientation', event);
      await this._orientation.lock(event.detail);
    } catch (error) {
      this._request._queue._delete('orientation');
      if (__DEV__) {
        this._media.logger
          ?.errorGroup('failed to lock screen orientation')
          .labelledLog('Request Event', event)
          .labelledLog('Error', error)
          .dispatch();
      }
    }
  }

  async ['media-orientation-unlock-request'](event: RE.MediaOrientationUnlockRequestEvent) {
    try {
      this._request._queue._enqueue('orientation', event);
      await this._orientation.unlock();
    } catch (error) {
      this._request._queue._delete('orientation');
      if (__DEV__) {
        this._media.logger
          ?.errorGroup('failed to unlock screen orientation')
          .labelledLog('Request Event', event)
          .labelledLog('Error', error)
          .dispatch();
      }
    }
  }

  async ['media-enter-pip-request'](event: RE.MediaEnterPIPRequestEvent) {
    try {
      await this._enterPictureInPicture(event);
    } catch (error) {
      this._onPictureInPictureError(error, event);
    }
  }

  async ['media-exit-pip-request'](event: RE.MediaExitPIPRequestEvent) {
    try {
      await this._exitPictureInPicture(event);
    } catch (error) {
      this._onPictureInPictureError(error, event);
    }
  }

  private _onPictureInPictureError(error: unknown, request?: Event) {
    if (__DEV__) {
      this._media.logger
        ?.errorGroup('pip request failed')
        .labelledLog('Request', request)
        .labelledLog('Error', error)
        .dispatch();
    }

    this._stateMgr._handle(
      this.createEvent('picture-in-picture-error', {
        detail: coerceToError(error),
      }),
    );
  }

  ['media-live-edge-request'](event: RE.MediaLiveEdgeRequestEvent) {
    const { live, liveEdge, canSeek } = this.$state;
    if (!live() || liveEdge() || !canSeek()) return;
    this._request._queue._enqueue('seeked', event);
    try {
      this._seekToLiveEdge();
    } catch (error) {
      if (__DEV__) this._media.logger?.error('seek to live edge fail', error);
    }
  }

  async ['media-loop-request'](event: RE.MediaLoopRequestEvent) {
    try {
      this._request._looping = true;
      this._request._replaying = true;
      await this._play(event);
    } catch (e) {
      this._request._looping = false;
    }
  }

  async ['media-pause-request'](event: RE.MediaPauseRequestEvent) {
    if (this.$state.paused()) return;
    try {
      await this._pause(event);
    } catch (error) {
      if (__DEV__) {
        this._media.logger
          ?.errorGroup('pause request failed')
          .labelledLog('Request', event)
          .labelledLog('Error', error)
          .dispatch();
      }

      this._request._queue._delete('pause');
      if (__DEV__) this._media.logger?.error('pause-fail', error);
    }
  }

  async ['media-play-request'](event: RE.MediaPlayRequestEvent) {
    if (!this.$state.paused()) return;
    try {
      await this._play(event);
    } catch (e) {
      // no-op
    }
  }

  ['media-rate-change-request'](event: RE.MediaRateChangeRequestEvent) {
    const { playbackRate, canSetPlaybackRate } = this.$state;
    if (playbackRate() === event.detail || !canSetPlaybackRate()) return;

    const provider = this._$provider();
    if (!provider?.setPlaybackRate) return;

    this._request._queue._enqueue('rate', event);
    provider.setPlaybackRate(event.detail);
  }

  ['media-quality-change-request'](event: RE.MediaQualityChangeRequestEvent) {
    if (this._media.qualities.readonly) {
      if (__DEV__) {
        this._media.logger
          ?.warnGroup(`[vidstack] attempted to change video quality but it is currently read-only`)
          .labelledLog('Event', event)
          .dispatch();
      }

      return;
    }

    this._request._queue._enqueue('quality', event);

    const index = event.detail;
    if (index < 0) {
      this._media.qualities.autoSelect(event);
    } else {
      const quality = this._media.qualities[index];
      if (quality) {
        quality.selected = true;
      } else if (__DEV__) {
        this._media.logger
          ?.warnGroup('[vidstack] failed quality change request (invalid index)')
          .labelledLog('Qualities', this._media.qualities.toArray())
          .labelledLog('Index', index)
          .labelledLog('Event', event)
          .dispatch();
      }
    }
  }

  ['media-pause-controls-request'](event: RE.MediaPauseControlsRequestEvent) {
    this._request._queue._enqueue('controls', event);
    this._controls.pause(event);
  }

  ['media-resume-controls-request'](event: RE.MediaResumeControlsRequestEvent) {
    this._request._queue._enqueue('controls', event);
    this._controls.resume(event);
  }

  ['media-seek-request'](event: RE.MediaSeekRequestEvent) {
    const { seekableStart, seekableEnd, ended, canSeek, live, userBehindLiveEdge, clipStartTime } =
      this.$state;

    if (ended()) this._request._replaying = true;

    this._request._seeking = false;
    this._request._queue._delete('seeking');

    const boundTime = Math.min(
      Math.max(seekableStart() + 0.1, event.detail + clipStartTime()),
      seekableEnd() - 0.1,
    );

    if (!Number.isFinite(boundTime) || !canSeek()) return;

    this._request._queue._enqueue('seeked', event);
    this._$provider()!.setCurrentTime(boundTime);

    if (live() && event.isOriginTrusted && Math.abs(seekableEnd() - boundTime) >= 2) {
      userBehindLiveEdge.set(true);
    }
  }

  ['media-seeking-request'](event: RE.MediaSeekingRequestEvent) {
    this._request._queue._enqueue('seeking', event);
    this.$state.seeking.set(true);
    this._request._seeking = true;
  }

  ['media-start-loading'](event: RE.MediaStartLoadingRequestEvent) {
    if (this.$state.canLoad()) return;
    this._request._queue._enqueue('load', event);
    this._stateMgr._handle(this.createEvent('can-load'));
  }

  ['media-poster-start-loading'](event: RE.MediaPosterStartLoadingRequestEvent) {
    if (this.$state.canLoadPoster()) return;
    this._request._queue._enqueue('posterLoad', event);
    this._stateMgr._handle(this.createEvent('can-load-poster'));
  }

  ['media-text-track-change-request'](event: RE.MediaTextTrackChangeRequestEvent) {
    const { index, mode } = event.detail,
      track = this._media.textTracks[index];
    if (track) {
      this._request._queue._enqueue('textTrack', event);
      track.setMode(mode, event);
    } else if (__DEV__) {
      this._media.logger
        ?.warnGroup('[vidstack] failed text track change request (invalid index)')
        .labelledLog('Text Tracks', this._media.textTracks.toArray())
        .labelledLog('Index', index)
        .labelledLog('Event', event)
        .dispatch();
    }
  }

  ['media-mute-request'](event: RE.MediaMuteRequestEvent) {
    if (this.$state.muted()) return;
    this._request._queue._enqueue('volume', event);
    this._$provider()!.setMuted(true);
  }

  ['media-unmute-request'](event: RE.MediaUnmuteRequestEvent) {
    const { muted, volume } = this.$state;

    if (!muted()) return;

    this._request._queue._enqueue('volume', event);
    this._media.$provider()!.setMuted(false);

    if (volume() === 0) {
      this._request._queue._enqueue('volume', event);
      this._$provider()!.setVolume(0.25);
    }
  }

  ['media-volume-change-request'](event: RE.MediaVolumeChangeRequestEvent) {
    const { muted, volume } = this.$state;

    const newVolume = event.detail;
    if (volume() === newVolume) return;

    this._request._queue._enqueue('volume', event);
    this._$provider()!.setVolume(newVolume);

    if (newVolume > 0 && muted()) {
      this._request._queue._enqueue('volume', event);
      this._$provider()!.setMuted(false);
    }
  }
}

function throwIfNotReadyForPlayback(provider: MediaProviderAdapter | null, canPlay: boolean) {
  if (provider && canPlay) return;
  throw Error(
    __DEV__
      ? `[vidstack] media is not ready - wait for \`can-play\` event.`
      : '[vidstack] media not ready',
  );
}

function throwIfFullscreenNotSupported(
  target: RE.MediaFullscreenRequestTarget,
  fullscreen?: FullscreenAdapter,
) {
  if (fullscreen?.supported) return;
  throw Error(
    __DEV__
      ? `[vidstack] fullscreen is not currently available on target \`${target}\``
      : '[vidstack] no fullscreen support',
  );
}

export class MediaRequestContext {
  _seeking = false;
  _looping = false;
  _replaying = false;
  _queue = new Queue<MediaRequestQueueRecord>();
}

export interface MediaRequestQueueRecord {
  audioTrack: RE.MediaAudioTrackChangeRequestEvent;
  load: RE.MediaStartLoadingRequestEvent;
  posterLoad: RE.MediaPosterStartLoadingRequestEvent;
  play: RE.MediaPlayRequestEvent;
  pause: RE.MediaPauseRequestEvent;
  rate: RE.MediaRateChangeRequestEvent;
  volume: RE.MediaVolumeChangeRequestEvent | RE.MediaMuteRequestEvent | RE.MediaUnmuteRequestEvent;
  fullscreen: RE.MediaEnterFullscreenRequestEvent | RE.MediaExitFullscreenRequestEvent;
  orientation: RE.MediaOrientationLockRequestEvent | RE.MediaOrientationUnlockRequestEvent;
  seeked: RE.MediaSeekRequestEvent | RE.MediaLiveEdgeRequestEvent;
  seeking: RE.MediaSeekingRequestEvent;
  textTrack: RE.MediaTextTrackChangeRequestEvent;
  quality: RE.MediaQualityChangeRequestEvent;
  pip: RE.MediaEnterPIPRequestEvent | RE.MediaExitPIPRequestEvent;
  controls: RE.MediaResumeControlsRequestEvent | RE.MediaPauseControlsRequestEvent;
}

export type MediaRequestHandler = {
  [Type in keyof RE.MediaRequestEvents]: (event: RE.MediaRequestEvents[Type]) => unknown;
};
