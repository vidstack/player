import { effect, peek, type ReadSignal } from 'maverick.js';
import { ComponentController, ComponentInstance } from 'maverick.js/element';
import { isUndefined } from 'maverick.js/std';

import {
  FullscreenController,
  type FullscreenAdapter,
} from '../../../foundation/fullscreen/controller';
import { ScreenOrientationController } from '../../../foundation/orientation/controller';
import { Queue } from '../../../foundation/queue/queue';
import { coerceToError } from '../../../utils/error';
import type { MediaContext } from '../api/context';
import type { MediaFullscreenChangeEvent } from '../api/events';
import * as RE from '../api/request-events';
import type { MediaStore } from '../api/store';
import type { PlayerAPI } from '../player';
import type { MediaProvider } from '../providers/types';
import { MediaUserController } from '../user';
import type { MediaStateManager } from './media-state-manager';

export class MediaRequestContext {
  _seeking = false;
  _looping = false;
  _replaying = false;
  _queue = new Queue<MediaRequestQueueRecord>();
}

export interface MediaRequestQueueRecord {
  audioTrack: RE.MediaAudioTrackChangeRequestEvent;
  load: RE.MediaStartLoadingRequestEvent;
  play: RE.MediaPlayRequestEvent;
  pause: RE.MediaPauseRequestEvent;
  rate: RE.MediaRateChangeRequestEvent;
  volume: RE.MediaVolumeChangeRequestEvent | RE.MediaMuteRequestEvent | RE.MediaUnmuteRequestEvent;
  fullscreen: RE.MediaEnterFullscreenRequestEvent | RE.MediaExitFullscreenRequestEvent;
  seeked: RE.MediaSeekRequestEvent | RE.MediaLiveEdgeRequestEvent;
  seeking: RE.MediaSeekingRequestEvent;
  textTrack: RE.MediaTextTrackChangeRequestEvent;
  quality: RE.MediaQualityChangeRequestEvent;
  pip: RE.MediaEnterPIPRequestEvent | RE.MediaExitPIPRequestEvent;
  userIdle: RE.MediaResumeUserIdleRequestEvent | RE.MediaPauseUserIdleRequestEvent;
}

export type MediaRequestHandler = {
  [Type in keyof RE.MediaRequestEvents]: (event: RE.MediaRequestEvents[Type]) => unknown;
};

/**
 * This class is responsible for listening to media request events and calling the appropriate
 * actions on the current media provider. Do note, actions are queued until a media provider
 * has connected.
 */
export class MediaRequestManager
  extends ComponentController<PlayerAPI>
  implements MediaRequestHandler
{
  readonly _user: MediaUserController;
  readonly _fullscreen: FullscreenController;
  readonly _orientation: ScreenOrientationController;

  private readonly _store: MediaStore;
  private readonly _provider: ReadSignal<MediaProvider | null>;

  constructor(
    instance: ComponentInstance<PlayerAPI>,
    private _stateMgr: MediaStateManager,
    private _request: MediaRequestContext,
    private _media: MediaContext,
  ) {
    super(instance);

    this._store = _media.$store;
    this._provider = _media.$provider;

    this._user = new MediaUserController(instance);
    this._fullscreen = new FullscreenController(instance);
    this._orientation = new ScreenOrientationController(instance);
  }

  protected override onConnect() {
    effect(this._onIdleDelayChange.bind(this));
    effect(this._onFullscreenSupportChange.bind(this));
    effect(this._onPiPSupportChange.bind(this));

    const names = Object.getOwnPropertyNames(Object.getPrototypeOf(this)),
      handle = this._handleRequest.bind(this);

    for (const name of names) {
      if (name.startsWith('media-')) {
        this.listen(name as keyof RE.MediaRequestEvents, handle);
      }
    }

    this.listen('fullscreen-change', this._onFullscreenChange.bind(this));
  }

  private _handleRequest(event: Event) {
    event.stopPropagation();

    if (__DEV__) {
      this._media.logger
        ?.infoGroup(`📬 received \`${event.type}\``)
        .labelledLog('Request', event)
        .dispatch();
    }

    if (peek(this._provider)) this[event.type]?.(event);
  }

  async _play() {
    if (__SERVER__) return;

    const { canPlay, paused, ended, autoplaying, seekableStart } = this._store;

    if (!peek(paused)) return;

    try {
      const provider = peek(this._provider);
      throwIfNotReadyForPlayback(provider, peek(canPlay));

      if (peek(ended)) {
        provider!.currentTime = seekableStart() + 0.1;
      }

      return provider!.play();
    } catch (error) {
      const errorEvent = this.createEvent('play-fail', { detail: coerceToError(error) });
      errorEvent.autoplay = autoplaying();
      this._stateMgr._handle(errorEvent);
      throw error;
    }
  }

  async _pause() {
    if (__SERVER__) return;

    const { canPlay, paused } = this._store;

    if (peek(paused)) return;

    const provider = peek(this._provider);
    throwIfNotReadyForPlayback(provider, peek(canPlay));

    return provider!.pause();
  }

  _seekToLiveEdge() {
    if (__SERVER__) return;

    const { canPlay, live, liveEdge, canSeek, liveSyncPosition, seekableEnd, userBehindLiveEdge } =
      this._store;

    userBehindLiveEdge.set(false);

    if (peek(() => !live() || liveEdge() || !canSeek())) return;

    const provider = peek(this._provider);
    throwIfNotReadyForPlayback(provider, peek(canPlay));

    provider!.currentTime = liveSyncPosition() ?? seekableEnd() - 2;
  }

  private _wasPIPActive = false;
  async _enterFullscreen(target: RE.MediaFullscreenRequestTarget = 'prefer-media') {
    if (__SERVER__) return;
    const provider = peek(this._provider);

    const adapter =
      (target === 'prefer-media' && this._fullscreen.supported) || target === 'media'
        ? this._fullscreen
        : provider?.fullscreen;

    throwIfFullscreenNotSupported(target, adapter);

    if (adapter!.active) return;

    if (peek(this._store.pictureInPicture)) {
      this._wasPIPActive = true;
      await this._exitPictureInPicture();
    }

    return adapter!.enter();
  }

  async _exitFullscreen(target: RE.MediaFullscreenRequestTarget = 'prefer-media') {
    if (__SERVER__) return;
    const provider = peek(this._provider);

    const adapter =
      (target === 'prefer-media' && this._fullscreen.supported) || target === 'media'
        ? this._fullscreen
        : provider?.fullscreen;

    throwIfFullscreenNotSupported(target, adapter);

    if (!adapter!.active) return;

    if (this._orientation.locked) await this._orientation.unlock();

    try {
      const result = await adapter!.exit();

      if (this._wasPIPActive && peek(this._store.canPictureInPicture)) {
        await this._enterPictureInPicture();
      }

      return result;
    } finally {
      this._wasPIPActive = false;
    }
  }

  async _enterPictureInPicture() {
    if (__SERVER__) return;
    this._throwIfPIPNotSupported();
    if (this._store.pictureInPicture()) return;
    return await this._provider()!.pictureInPicture!.enter();
  }

  async _exitPictureInPicture() {
    if (__SERVER__) return;
    this._throwIfPIPNotSupported();
    if (!this._store.pictureInPicture()) return;
    return await this._provider()!.pictureInPicture!.exit();
  }

  private _throwIfPIPNotSupported() {
    if (this._store.canPictureInPicture()) return;
    throw Error(
      __DEV__
        ? `[vidstack] picture-in-picture is not currently available`
        : '[vidstack] no pip support',
    );
  }

  private _onIdleDelayChange() {
    this._user.idleDelay = this.$props.userIdleDelay();
  }

  private _onFullscreenSupportChange() {
    const { canLoad, canFullscreen } = this._store,
      supported = this._fullscreen.supported || this._provider()?.fullscreen?.supported || false;

    if (canLoad() && peek(canFullscreen) === supported) return;

    canFullscreen.set(supported);
  }

  private _onPiPSupportChange() {
    const { canLoad, canPictureInPicture } = this._store,
      supported = this._provider()?.pictureInPicture?.supported || false;

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
      this._request._queue._enqueue('fullscreen', event);
      await this._enterFullscreen(event.detail);
    } catch (error) {
      this._onFullscreenError(error);
    }
  }

  async ['media-exit-fullscreen-request'](event: RE.MediaExitFullscreenRequestEvent) {
    try {
      this._request._queue._enqueue('fullscreen', event);
      await this._exitFullscreen(event.detail);
    } catch (error) {
      this._onFullscreenError(error);
    }
  }

  private async _onFullscreenChange(event: MediaFullscreenChangeEvent) {
    if (!event.detail) return;
    try {
      const lockType = peek(this.$props.fullscreenOrientation);
      if (this._orientation.supported && !isUndefined(lockType)) {
        await this._orientation.lock(lockType);
      }
    } catch (e) {}
  }

  private _onFullscreenError(error: unknown) {
    this._stateMgr._handle(
      this.createEvent('fullscreen-error', {
        detail: coerceToError(error),
      }),
    );
  }

  async ['media-enter-pip-request'](event: RE.MediaEnterPIPRequestEvent) {
    try {
      this._request._queue._enqueue('pip', event);
      await this._enterPictureInPicture();
    } catch (error) {
      this._onPictureInPictureError(error);
    }
  }

  async ['media-exit-pip-request'](event: RE.MediaExitPIPRequestEvent) {
    try {
      this._request._queue._enqueue('pip', event);
      await this._exitPictureInPicture();
    } catch (error) {
      this._onPictureInPictureError(error);
    }
  }

  private _onPictureInPictureError(error: unknown) {
    this._stateMgr._handle(
      this.createEvent('picture-in-picture-error', {
        detail: coerceToError(error),
      }),
    );
  }

  ['media-live-edge-request'](event: RE.MediaLiveEdgeRequestEvent) {
    const { live, liveEdge, canSeek } = this._store;
    if (!live() || liveEdge() || !canSeek()) return;
    this._request._queue._enqueue('seeked', event);
    try {
      this._seekToLiveEdge();
    } catch (e) {
      if (__DEV__) this._media.logger?.error('seek to live edge fail', e);
    }
  }

  ['media-loop-request']() {
    window.requestAnimationFrame(async () => {
      try {
        this._request._looping = true;
        this._request._replaying = true;
        await this._play();
      } catch (e) {
        this._request._looping = false;
        this._request._replaying = false;
      }
    });
  }

  async ['media-pause-request'](event: RE.MediaPauseRequestEvent) {
    if (this._store.paused()) return;
    try {
      this._request._queue._enqueue('pause', event);
      await this._provider()!.pause();
    } catch (e) {
      this._request._queue._delete('pause');
      if (__DEV__) this._media.logger?.error('pause-fail', e);
    }
  }

  async ['media-play-request'](event: RE.MediaPlayRequestEvent) {
    if (!this._store.paused()) return;
    try {
      this._request._queue._enqueue('play', event);
      await this._provider()!.play();
    } catch (e) {
      const errorEvent = this.createEvent('play-fail', { detail: coerceToError(e) });
      this._stateMgr._handle(errorEvent);
    }
  }

  ['media-rate-change-request'](event: RE.MediaRateChangeRequestEvent) {
    if (this._store.playbackRate() === event.detail) return;
    this._request._queue._enqueue('rate', event);
    this._provider()!.playbackRate = event.detail;
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

  ['media-resume-user-idle-request'](event: RE.MediaResumeUserIdleRequestEvent) {
    this._request._queue._enqueue('userIdle', event);
    this._user.pauseIdleTracking(false, event);
  }

  ['media-pause-user-idle-request'](event: RE.MediaPauseUserIdleRequestEvent) {
    this._request._queue._enqueue('userIdle', event);
    this._user.pauseIdleTracking(true, event);
  }

  ['media-seek-request'](event: RE.MediaSeekRequestEvent) {
    const { seekableStart, seekableEnd, ended, canSeek, live, userBehindLiveEdge } = this._store;

    if (ended()) this._request._replaying = true;

    this._request._seeking = false;
    this._request._queue._delete('seeking');

    const boundTime = Math.min(Math.max(seekableStart() + 0.1, event.detail), seekableEnd() - 0.1);

    if (!Number.isFinite(boundTime) || !canSeek()) return;

    this._request._queue._enqueue('seeked', event);
    this._provider()!.currentTime = boundTime;

    if (live() && event.isOriginTrusted && Math.abs(seekableEnd() - boundTime) >= 2) {
      userBehindLiveEdge.set(true);
    }
  }

  ['media-seeking-request'](event: RE.MediaSeekingRequestEvent) {
    this._request._queue._enqueue('seeking', event);
    this._store.seeking.set(true);
    this._request._seeking = true;
  }

  ['media-start-loading'](event: RE.MediaStartLoadingRequestEvent) {
    if (this._store.canLoad()) return;
    this._request._queue._enqueue('load', event);
    this._stateMgr._handle(this.createEvent('can-load'));
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
    if (this._store.muted()) return;
    this._request._queue._enqueue('volume', event);
    this._provider()!.muted = true;
  }

  ['media-unmute-request'](event: RE.MediaUnmuteRequestEvent) {
    const { muted, volume } = this._store;

    if (!muted()) return;

    this._request._queue._enqueue('volume', event);
    this._media.$provider()!.muted = false;

    if (volume() === 0) {
      this._request._queue._enqueue('volume', event);
      this._provider()!.volume = 0.25;
    }
  }

  ['media-volume-change-request'](event: RE.MediaVolumeChangeRequestEvent) {
    const { muted, volume } = this._store;

    const newVolume = event.detail;
    if (volume() === newVolume) return;

    this._request._queue._enqueue('volume', event);
    this._provider()!.volume = newVolume;

    if (newVolume > 0 && muted()) {
      this._request._queue._enqueue('volume', event);
      this._provider()!.muted = false;
    }
  }
}

function throwIfNotReadyForPlayback(provider: MediaProvider | null, canPlay: boolean) {
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
