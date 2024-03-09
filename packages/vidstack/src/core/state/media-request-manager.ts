import { effect, peek, type ReadSignal } from 'maverick.js';
import { isUndefined } from 'maverick.js/std';

import {
  FullscreenController,
  type FullscreenAdapter,
} from '../../foundation/fullscreen/controller';
import { ScreenOrientationController } from '../../foundation/orientation/controller';
import { Queue } from '../../foundation/queue/queue';
import { RequestQueue } from '../../foundation/queue/request-queue';
import type { GoogleCastLoader } from '../../providers/google-cast/loader';
import type { MediaProviderAdapter } from '../../providers/types';
import { coerceToError } from '../../utils/error';
import { canGoogleCastSrc } from '../../utils/mime';
import { preconnect } from '../../utils/network';
import { IS_CHROME, IS_IOS } from '../../utils/support';
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
    effect(this._watchControlsDelayChange.bind(this));
    effect(this._watchAudioGainSupport.bind(this));
    effect(this._watchAirPlaySupport.bind(this));
    effect(this._watchGoogleCastSupport.bind(this));
    effect(this._watchFullscreenSupport.bind(this));
    effect(this._watchPiPSupport.bind(this));
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
    if (event.defaultPrevented) return;

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
      this._providerQueue._enqueue(event.type, () => {
        if (peek(this._$provider)) this[event.type](event);
      });
    }
  }

  async _play(trigger?: Event) {
    if (__SERVER__) return;

    const { canPlay, paused, autoPlaying } = this.$state;

    if (this._handleLoadPlayStrategy(trigger)) return;

    if (!peek(paused)) return;

    if (trigger) this._request._queue._enqueue('media-play-request', trigger);

    try {
      const provider = peek(this._$provider);
      throwIfNotReadyForPlayback(provider, peek(canPlay));
      return await provider!.play();
    } catch (error) {
      if (__DEV__) this._logError('play request failed', error, trigger);

      const errorEvent = this.createEvent('play-fail', {
        detail: coerceToError(error),
        trigger,
      });

      errorEvent.autoPlay = autoPlaying();

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

      this._providerQueue._enqueue('media-play-request', async () => {
        try {
          await this._play(event);
        } catch (error) {
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

    if (trigger) {
      this._request._queue._enqueue('media-pause-request', trigger);
    }

    try {
      const provider = peek(this._$provider);
      throwIfNotReadyForPlayback(provider, peek(canPlay));
      return await provider!.pause();
    } catch (error) {
      this._request._queue._delete('media-pause-request');

      if (__DEV__) {
        this._logError('pause request failed', error, trigger);
      }

      throw error;
    }
  }

  _seekToLiveEdge(trigger?: Event) {
    if (__SERVER__) return;

    const { canPlay, live, liveEdge, canSeek, liveSyncPosition, seekableEnd, userBehindLiveEdge } =
      this.$state;

    userBehindLiveEdge.set(false);

    if (peek(() => !live() || liveEdge() || !canSeek())) return;

    const provider = peek(this._$provider);
    throwIfNotReadyForPlayback(provider, peek(canPlay));

    if (trigger) this._request._queue._enqueue('media-seek-request', trigger);

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

    if (trigger) {
      this._request._queue._enqueue('media-enter-fullscreen-request', trigger);
    }

    return adapter!.enter();
  }

  async _exitFullscreen(target: RE.MediaFullscreenRequestTarget = 'prefer-media', trigger?: Event) {
    if (__SERVER__) return;

    const adapter = this._getFullscreenAdapter(target);

    throwIfFullscreenNotSupported(target, adapter);

    if (!adapter!.active) return;

    if (trigger) {
      this._request._queue._enqueue('media-exit-fullscreen-request', trigger);
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

    if (trigger) {
      this._request._queue._enqueue('media-enter-pip-request', trigger);
    }

    return await this._$provider()!.pictureInPicture!.enter();
  }

  async _exitPictureInPicture(trigger?: Event) {
    if (__SERVER__) return;

    this._throwIfPIPNotSupported();

    if (!this.$state.pictureInPicture()) return;

    if (trigger) {
      this._request._queue._enqueue('media-exit-pip-request', trigger);
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

  private _watchControlsDelayChange() {
    this._controls.defaultDelay = this.$props.controlsDelay();
  }

  private _watchAudioGainSupport() {
    const { canSetAudioGain } = this.$state,
      supported = !!this._$provider()?.audioGain?.supported;
    canSetAudioGain.set(supported);
  }

  private _watchAirPlaySupport() {
    const { canAirPlay } = this.$state,
      supported = !!this._$provider()?.airPlay?.supported;
    canAirPlay.set(supported);
  }

  private _watchGoogleCastSupport() {
    const { canGoogleCast, source } = this.$state,
      supported = IS_CHROME && !IS_IOS && canGoogleCastSrc(source());
    canGoogleCast.set(supported);
  }

  private _watchFullscreenSupport() {
    const { canFullscreen } = this.$state,
      supported = this._fullscreen.supported || !!this._$provider()?.fullscreen?.supported;
    canFullscreen.set(supported);
  }

  private _watchPiPSupport() {
    const { canPictureInPicture } = this.$state,
      supported = !!this._$provider()?.pictureInPicture?.supported;
    canPictureInPicture.set(supported);
  }

  async ['media-airplay-request'](event: RE.MediaAirPlayRequestEvent) {
    try {
      await this._requestAirPlay(event);
    } catch (error) {
      // no-op
    }
  }

  async _requestAirPlay(trigger?: Event) {
    try {
      const adapter = this._$provider()?.airPlay;

      if (!adapter?.supported) {
        throw Error(__DEV__ ? 'AirPlay adapter not available on provider.' : 'No AirPlay adapter.');
      }

      if (trigger) {
        this._request._queue._enqueue('media-airplay-request', trigger);
      }

      return await adapter.prompt();
    } catch (error) {
      this._request._queue._delete('media-airplay-request');

      if (__DEV__) {
        this._logError('airplay request failed', error, trigger);
      }

      throw error;
    }
  }

  async ['media-google-cast-request'](event: RE.MediaGoogleCastRequestEvent) {
    try {
      await this._requestGoogleCast(event);
    } catch (error) {
      // no-op
    }
  }

  protected _googleCastLoader?: GoogleCastLoader;
  async _requestGoogleCast(trigger?: Event) {
    try {
      const { canGoogleCast } = this.$state;

      if (!peek(canGoogleCast)) {
        throw new Error(
          __DEV__ ? 'Google Cast not available on this platform.' : 'Cast not available.',
        );
      }

      preconnect('https://www.gstatic.com');

      if (!this._googleCastLoader) {
        const $module = await import('../../providers/google-cast/loader');
        this._googleCastLoader = new $module.GoogleCastLoader();
      }

      await this._googleCastLoader.prompt(this._media);

      if (trigger) {
        this._request._queue._enqueue('media-google-cast-request', trigger);
      }

      const isConnecting = peek(this.$state.remotePlaybackState) !== 'disconnected';

      if (isConnecting) {
        this.$state.savedState.set({
          paused: peek(this.$state.paused),
          currentTime: peek(this.$state.currentTime),
        });
      }

      this.$state.remotePlaybackLoader.set(isConnecting ? this._googleCastLoader : null);
    } catch (error) {
      this._request._queue._delete('media-google-cast-request');

      if (__DEV__ && (error as Error).message !== '"cancel"') {
        this._logError('google cast request failed', error, trigger);
      }

      throw error;
    }
  }

  ['media-audio-track-change-request'](event: RE.MediaAudioTrackChangeRequestEvent) {
    const { logger, audioTracks } = this._media;

    if (audioTracks.readonly) {
      if (__DEV__) {
        logger
          ?.warnGroup(`[vidstack] attempted to change audio track but it is currently read-only`)
          .labelledLog('Request Event', event)
          .dispatch();
      }

      return;
    }

    const index = event.detail,
      track = audioTracks[index];

    if (track) {
      const key = event.type as 'media-audio-track-change-request';
      this._request._queue._enqueue(key, event);
      track.selected = true;
    } else if (__DEV__) {
      logger
        ?.warnGroup('[vidstack] failed audio track change request (invalid index)')
        .labelledLog('Audio Tracks', audioTracks.toArray())
        .labelledLog('Index', index)
        .labelledLog('Request Event', event)
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
      this._logError('fullscreen request failed', error, request);
    }

    this._stateMgr._handle(
      this.createEvent('fullscreen-error', {
        detail: coerceToError(error),
      }),
    );
  }

  async ['media-orientation-lock-request'](event: RE.MediaOrientationLockRequestEvent) {
    const key = event.type as 'media-orientation-lock-request';

    try {
      this._request._queue._enqueue(key, event);
      await this._orientation.lock(event.detail);
    } catch (error) {
      this._request._queue._delete(key);
      if (__DEV__) {
        this._logError('failed to lock screen orientation', error, event);
      }
    }
  }

  async ['media-orientation-unlock-request'](event: RE.MediaOrientationUnlockRequestEvent) {
    const key = event.type as 'media-orientation-unlock-request';

    try {
      this._request._queue._enqueue(key, event);
      await this._orientation.unlock();
    } catch (error) {
      this._request._queue._delete(key);
      if (__DEV__) {
        this._logError('failed to unlock screen orientation', error, event);
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
      this._logError('pip request failed', error, request);
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

    this._request._queue._enqueue('media-seek-request', event);

    try {
      this._seekToLiveEdge();
    } catch (error) {
      this._request._queue._delete('media-seek-request');
      if (__DEV__) {
        this._logError('seek to live edge fail', error, event);
      }
    }
  }

  async ['media-loop-request'](event: RE.MediaLoopRequestEvent) {
    try {
      this._request._looping = true;
      this._request._replaying = true;
      await this._play(event);
    } catch (error) {
      this._request._looping = false;
    }
  }

  ['media-user-loop-change-request'](event: RE.MediaUserLoopChangeRequestEvent) {
    this.$state.userPrefersLoop.set(event.detail);
  }

  async ['media-pause-request'](event: RE.MediaPauseRequestEvent) {
    if (this.$state.paused()) return;
    try {
      await this._pause(event);
    } catch (error) {
      // no-op
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

    this._request._queue._enqueue('media-rate-change-request', event);
    provider.setPlaybackRate(event.detail);
  }

  ['media-audio-gain-change-request'](event: RE.MediaAudioGainChangeRequestEvent) {
    const { audioGain, canSetAudioGain } = this.$state;
    if (audioGain() === event.detail || !canSetAudioGain()) return;

    const provider = this._$provider();
    if (!provider?.audioGain) return;

    this._request._queue._enqueue('media-audio-gain-change-request', event);
    provider.audioGain.setGain(event.detail);
  }

  ['media-quality-change-request'](event: RE.MediaQualityChangeRequestEvent) {
    const { qualities, storage, logger } = this._media;

    if (qualities.readonly) {
      if (__DEV__) {
        logger
          ?.warnGroup(`[vidstack] attempted to change video quality but it is currently read-only`)
          .labelledLog('Request Event', event)
          .dispatch();
      }

      return;
    }

    this._request._queue._enqueue('media-quality-change-request', event);

    const index = event.detail;

    if (index < 0) {
      qualities.autoSelect(event);
      if (event.isOriginTrusted) storage?.setVideoQuality?.(null);
    } else {
      const quality = qualities[index];
      if (quality) {
        quality.selected = true;
        if (event.isOriginTrusted) {
          storage?.setVideoQuality?.({
            id: quality.id,
            width: quality.width,
            height: quality.height,
            bitrate: quality.bitrate,
          });
        }
      } else if (__DEV__) {
        logger
          ?.warnGroup('[vidstack] failed quality change request (invalid index)')
          .labelledLog('Qualities', qualities.toArray())
          .labelledLog('Index', index)
          .labelledLog('Request Event', event)
          .dispatch();
      }
    }
  }

  ['media-pause-controls-request'](event: RE.MediaPauseControlsRequestEvent) {
    const key = event.type as 'media-pause-controls-request';
    this._request._queue._enqueue(key, event);
    this._controls.pause(event);
  }

  ['media-resume-controls-request'](event: RE.MediaResumeControlsRequestEvent) {
    const key = event.type as 'media-resume-controls-request';
    this._request._queue._enqueue(key, event);
    this._controls.resume(event);
  }

  ['media-seek-request'](event: RE.MediaSeekRequestEvent) {
    const { seekableStart, seekableEnd, ended, canSeek, live, userBehindLiveEdge, clipStartTime } =
      this.$state;

    if (ended()) this._request._replaying = true;

    const key = event.type as 'media-seek-request';

    this._request._seeking = false;
    this._request._queue._delete(key);

    const boundTime = Math.min(
      Math.max(seekableStart() + 0.1, event.detail + clipStartTime()),
      seekableEnd() - 0.1,
    );

    if (!Number.isFinite(boundTime) || !canSeek()) return;

    this._request._queue._enqueue(key, event);
    this._$provider()!.setCurrentTime(boundTime);

    if (live() && event.isOriginTrusted && Math.abs(seekableEnd() - boundTime) >= 2) {
      userBehindLiveEdge.set(true);
    }
  }

  ['media-seeking-request'](event: RE.MediaSeekingRequestEvent) {
    const key = event.type as 'media-seeking-request';
    this._request._queue._enqueue(key, event);
    this.$state.seeking.set(true);
    this._request._seeking = true;
  }

  ['media-start-loading'](event: RE.MediaStartLoadingRequestEvent) {
    if (this.$state.canLoad()) return;
    const key = event.type as 'media-start-loading';
    this._request._queue._enqueue(key, event);
    this._stateMgr._handle(this.createEvent('can-load'));
  }

  ['media-poster-start-loading'](event: RE.MediaPosterStartLoadingRequestEvent) {
    if (this.$state.canLoadPoster()) return;
    const key = event.type as 'media-poster-start-loading';
    this._request._queue._enqueue(key, event);
    this._stateMgr._handle(this.createEvent('can-load-poster'));
  }

  ['media-text-track-change-request'](event: RE.MediaTextTrackChangeRequestEvent) {
    const { index, mode } = event.detail,
      track = this._media.textTracks[index];
    if (track) {
      const key = event.type as 'media-text-track-change-request';
      this._request._queue._enqueue(key, event);
      track.setMode(mode, event);
    } else if (__DEV__) {
      this._media.logger
        ?.warnGroup('[vidstack] failed text track change request (invalid index)')
        .labelledLog('Text Tracks', this._media.textTracks.toArray())
        .labelledLog('Index', index)
        .labelledLog('Request Event', event)
        .dispatch();
    }
  }

  ['media-mute-request'](event: RE.MediaMuteRequestEvent) {
    if (this.$state.muted()) return;
    const key = event.type as 'media-mute-request';
    this._request._queue._enqueue(key, event);
    this._$provider()!.setMuted(true);
  }

  ['media-unmute-request'](event: RE.MediaUnmuteRequestEvent) {
    const { muted, volume } = this.$state;

    if (!muted()) return;

    const key = event.type as 'media-unmute-request';

    this._request._queue._enqueue(key, event);
    this._media.$provider()!.setMuted(false);

    if (volume() === 0) {
      this._request._queue._enqueue(key, event);
      this._$provider()!.setVolume(0.25);
    }
  }

  ['media-volume-change-request'](event: RE.MediaVolumeChangeRequestEvent) {
    const { muted, volume } = this.$state;

    const newVolume = event.detail;
    if (volume() === newVolume) return;

    const key = event.type as 'media-volume-change-request';

    this._request._queue._enqueue(key, event);
    this._$provider()!.setVolume(newVolume);

    if (newVolume > 0 && muted()) {
      this._request._queue._enqueue(key, event);
      this._$provider()!.setMuted(false);
    }
  }

  private _logError(title: string, error: unknown, request?: Event) {
    if (!__DEV__) return;
    this._media.logger
      ?.errorGroup(`[vidstack] ${title}`)
      .labelledLog('Error', error)
      .labelledLog('Media Context', { ...this._media })
      .labelledLog('Trigger Event', request)
      .dispatch();
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
  _queue = new Queue<MediaRequestQueueItems>();
}

export type MediaRequestQueueItems = {
  [P in keyof RE.MediaRequestEvents]: Event;
};

export type MediaRequestHandler = {
  [Type in keyof RE.MediaRequestEvents]: (event: RE.MediaRequestEvents[Type]) => unknown;
};
