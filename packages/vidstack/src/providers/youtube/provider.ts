import { createScope, effect, signal } from 'maverick.js';
import {
  deferredPromise,
  isBoolean,
  isNumber,
  isObject,
  isString,
  type DeferredPromise,
} from 'maverick.js/std';

import { TimeRange, type MediaSrc } from '../../core';
import { ListSymbol } from '../../foundation/list/symbols';
import { preconnect } from '../../utils/network';
import { EmbedProvider } from '../embed/EmbedProvider';
import type { MediaProviderAdapter, MediaSetupContext } from '../types';
import { YouTubeCommand, type YouTubeCommandArg } from './embed/command';
import type { YouTubeMessage } from './embed/message';
import type { YouTubeParams } from './embed/params';
import { YouTubePlayerState } from './embed/state';

/**
 * This provider enables loading videos uploaded to YouTube (youtube.com) via embeds.
 *
 * @docs {@link https://www.vidstack.io/docs/player/providers/youtube}
 * @see {@link https://developers.google.com/youtube/iframe_api_reference}
 * @example
 * ```html
 * <media-player src="youtube/_cMxraX_5RE">
 *   <media-provider></media-provider>
 * </media-player>
 * ```
 */
export class YouTubeProvider
  extends EmbedProvider<YouTubeMessage>
  implements MediaProviderAdapter, Pick<YouTubeParams, 'color' | 'start' | 'end'>
{
  protected static _posterCache = new Map<string, string>();
  protected static _videoIdRE =
    /(?:youtu\.be|youtube|youtube\.com|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|)((?:\w|-){11})/;

  protected $$PROVIDER_TYPE = 'YOUTUBE';

  readonly scope = createScope();

  protected _ctx!: MediaSetupContext;
  protected _videoId = signal('');
  protected _state = -1;
  protected _paused = true;
  protected _muted = false;
  protected _seeking = false;
  protected _seekingTimer = -1;
  protected _volume = 1;
  protected _currentTime = 0;
  protected _played = 0;
  protected _playedRange = new TimeRange(0, 0);
  protected _playbackRate = 1;
  protected _playsinline = false;
  protected _currentSrc: MediaSrc | null = null;
  protected _playPromise: DeferredPromise<void, string> | null = null;
  protected _pausePromise: DeferredPromise<void, string> | null = null;

  protected get _notify() {
    return this._ctx.delegate._notify;
  }

  /**
   * Sets the player's interface language. The parameter value is an ISO 639-1 two-letter
   * language code or a fully specified locale. For example, fr and fr-ca are both valid values.
   * Other language input codes, such as IETF language tags (BCP 47) might also be handled properly.
   *
   * The interface language is used for tooltips in the player and also affects the default caption
   * track. Note that YouTube might select a different caption track language for a particular
   * user based on the user's individual language preferences and the availability of caption tracks.
   *
   * @defaultValue 'en'
   */
  language = 'en';
  color: 'white' | 'red' = 'red';

  /**
   * Whether cookies should be enabled on the embed. This is turned off by default to be
   * GDPR-compliant.
   *
   * @defaultValue `false`
   */
  cookies = false;

  get currentSrc() {
    return this._currentSrc;
  }

  get type() {
    return 'video';
  }

  get videoId() {
    return this._videoId();
  }

  get paused() {
    return this._paused;
  }

  get muted() {
    return this._muted;
  }

  set muted(muted) {
    if (muted) this._remote(YouTubeCommand.Mute);
    else this._remote(YouTubeCommand.Unmute);
  }

  get currentTime() {
    return this._currentTime;
  }

  set currentTime(time) {
    this._remote(YouTubeCommand.Seek, time);
  }

  get volume() {
    return this._volume;
  }

  set volume(volume) {
    this._remote(YouTubeCommand.SetVolume, volume * 100);
  }

  get playsinline() {
    return this._playsinline;
  }

  set playsinline(playsinline) {
    this._playsinline = playsinline;
  }

  get playbackRate() {
    return this._playbackRate;
  }

  set playbackRate(rate) {
    this._remote(YouTubeCommand.SetPlaybackRate, rate);
  }

  preconnect() {
    const connections = [
      this._getOrigin(),
      // Botguard script.
      'https://www.google.com',
      // Poster.
      'https://i.ytimg.com',
      // Ads.
      'https://googleads.g.doubleclick.net',
      'https://static.doubleclick.net',
    ];

    for (const url of connections) {
      preconnect(url, 'preconnect');
    }
  }

  override setup(ctx: MediaSetupContext) {
    this._ctx = ctx;
    super.setup(ctx);
    effect(this._watchVideoId.bind(this));
    effect(this._watchPoster.bind(this));
    this._notify('provider-setup', this);
  }

  async play() {
    if (!this._paused) return;

    if (!this._playPromise) {
      this._playPromise = deferredPromise();
      setTimeout(() => {
        if (!this._paused) return;
        this._playPromise?.reject('Timed Out.');
      }, 3000);
    }

    this._remote(YouTubeCommand.Play);
    return this._playPromise.promise;
  }

  async pause() {
    if (this._paused) return;

    if (!this._pausePromise) {
      this._pausePromise = deferredPromise();
      setTimeout(() => {
        if (this._paused) return;
        this._pausePromise?.reject('Timed out.');
      }, 3000);
    }

    this._remote(YouTubeCommand.Pause);
    return this._pausePromise.promise;
  }

  async loadSource(src: MediaSrc) {
    if (!isString(src.src)) return;

    const videoId = src.src.match(YouTubeProvider._videoIdRE)?.[1];
    this._videoId.set(videoId ?? '');

    this._currentSrc = src;
  }

  protected _getOrigin() {
    return !this.cookies ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
  }

  protected _watchVideoId() {
    this._reset();

    const videoId = this._videoId();

    if (!videoId) {
      this._src.set('');
      return;
    }

    this._src.set(`${this._getOrigin()}/embed/${this.videoId}`);
  }

  protected _watchPoster() {
    const videoId = this._videoId(),
      cache = YouTubeProvider._posterCache;

    if (!videoId) {
      this._notify('poster-change', '');
      return;
    }

    if (cache.has(videoId)) {
      const url = cache.get(videoId)!;
      this._notify('poster-change', url);
      return;
    }

    const abort = new AbortController();
    this._findPoster(videoId, abort);
    return () => abort.abort();
  }

  private async _findPoster(videoId: string, abort: AbortController) {
    try {
      const sizes = ['maxresdefault', 'sddefault', 'hqdefault'];
      for (const size of sizes) {
        for (const webp of [true, false]) {
          const url = this._resolvePosterURL(videoId, size, webp),
            response = await fetch(url, {
              mode: 'no-cors',
              signal: abort.signal,
            });
          if (response.status < 400) {
            YouTubeProvider._posterCache.set(videoId, url);
            this._notify('poster-change', url);
            return;
          }
        }
      }
    } catch (e) {
      // no-op
    }

    this._notify('poster-change', '');
  }

  protected _resolvePosterURL(videoId: string, size: string, webp: boolean) {
    const type = webp ? 'webp' : 'jpg';
    return `https://i.ytimg.com/${webp ? 'vi_webp' : 'vi'}/${videoId}/${size}.${type}`;
  }

  protected _buildParams(): YouTubeParams {
    const { keyDisabled } = this._ctx.$props,
      { $iosControls } = this._ctx,
      { controls, muted, playsinline } = this._ctx.$state,
      showControls = controls() || $iosControls();
    return {
      autoplay: 0,
      cc_lang_pref: this.language,
      cc_load_policy: showControls ? 1 : undefined,
      color: this.color,
      controls: showControls ? 1 : 0,
      disablekb: !showControls || keyDisabled() ? 1 : 0,
      enablejsapi: 1,
      fs: 1,
      hl: this.language,
      iv_load_policy: showControls ? 1 : 3,
      mute: muted() ? 1 : 0,
      playsinline: playsinline() ? 1 : 0,
    };
  }

  protected _remote<T extends keyof YouTubeCommandArg>(command: T, arg?: YouTubeCommandArg[T]) {
    this._postMessage({
      event: 'command',
      func: command,
      args: arg ? [arg] : undefined,
    });
  }

  protected _onLoad(): void {
    // Seems like we have to wait a random small delay or else YT player isn't ready.
    window.setTimeout(() => this._postMessage({ event: 'listening' }), 100);
  }

  protected _onReady(trigger: MessageEvent) {
    this._ctx.delegate._ready(undefined, trigger);
  }

  protected _onStateChange(state: YouTubePlayerState, trigger: MessageEvent) {
    const isPlaying = state === YouTubePlayerState.Playing,
      isBuffering = state === YouTubePlayerState.Buffering;

    if (isBuffering) this._notify('waiting', undefined, trigger);

    // Attempt to detect `play` events early.
    if (this._paused && (isBuffering || isPlaying)) {
      this._paused = false;
      this._playPromise?.resolve();
      this._playPromise = null;
      this._notify('play', undefined, trigger);
    }

    switch (state) {
      case YouTubePlayerState.Cued:
        this._onReady(trigger);
        break;
      case YouTubePlayerState.Playing:
        this._notify('playing', undefined, trigger);
        break;
      case YouTubePlayerState.Paused:
        this._paused = true;
        this._pausePromise?.resolve();
        this._pausePromise = null;
        this._notify('pause', undefined, trigger);
        break;
      case YouTubePlayerState.Ended:
        if (this._seeking) this._seeked(trigger);

        if (this._ctx.$state.loop()) {
          window.setTimeout(() => {
            this._remote(YouTubeCommand.Play);
          }, 200);
        } else {
          this._paused = true;
          this._notify('pause', undefined, trigger);
          this._notify('ended', undefined, trigger);
        }
        break;
    }

    this._state = state;
  }

  protected _onTimeChange(time: number, trigger: MessageEvent) {
    const { duration } = this._ctx.$state,
      currentTime = this._state === YouTubePlayerState.Ended ? duration() : time,
      detail = {
        currentTime,
        played:
          this._played >= currentTime
            ? this._playedRange
            : (this._playedRange = new TimeRange(0, this._played)),
      };

    this._notify('time-update', detail, trigger);

    // // This is the only way to detect `seeking`.
    if (Math.abs(currentTime - this._currentTime) > 1) {
      this._seeking = true;
      this._notify('seeking', currentTime, trigger);
    }

    this._currentTime = currentTime;
  }

  protected _onProgress(buffered: number, seekable: TimeRange, trigger: MessageEvent) {
    const detail = {
      buffered: new TimeRange(0, buffered),
      seekable,
    };

    this._notify('progress', detail, trigger);

    /**
     * This is the only way to detect `seeked`. Unfortunately while the player is `paused` `seeking`
     * and `seeked` will fire at the same time, there are no updates in-between -_-. We need an
     * artificial delay between the two events.
     */
    if (this._seeking && buffered > this._currentTime) {
      this._seeked(trigger);
    }
  }

  protected _seeked(trigger: Event) {
    this._seeking = false;
    window.clearTimeout(this._seekingTimer);
    this._seekingTimer = window.setTimeout(
      () => {
        this._notify('seeked', this._currentTime, trigger);
        this._seekingTimer = -1;
      },
      this._paused ? 100 : 0,
    );
  }

  protected _onMessage({ info }: YouTubeMessage, event: MessageEvent) {
    if (!info) return;

    const { title, duration, playbackRate } = this._ctx.$state;

    if (isObject(info.videoData) && info.videoData.title !== title()) {
      this._notify('title-change', info.videoData.title, event);
    }

    if (isNumber(info.duration) && info.duration !== duration()) {
      if (isNumber(info.videoLoadedFraction)) {
        const buffered = info.progressState?.loaded ?? info.videoLoadedFraction * info.duration,
          seekable = new TimeRange(0, info.duration);
        this._onProgress(buffered, seekable, event);
      }

      this._notify('duration-change', info.duration, event);
    }

    if (isNumber(info.playbackRate) && info.playbackRate !== playbackRate()) {
      this._playbackRate = info.playbackRate;
      this._notify('rate-change', info.playbackRate, event);
    }

    if (info.progressState) {
      const {
        current,
        seekableStart,
        seekableEnd,
        loaded,
        duration: _duration,
      } = info.progressState;
      this._onTimeChange(current, event);
      this._onProgress(loaded, new TimeRange(seekableStart, seekableEnd), event);
      if (_duration !== duration()) {
        this._notify('duration-change', _duration, event);
      }
    }

    if (isNumber(info.volume) && isBoolean(info.muted)) {
      const detail = {
        volume: info.volume / 100,
        muted: info.muted,
      };

      this._muted = info.muted;
      this._notify('volume-change', detail, event);
    }

    if (isNumber(info.playerState) && info.playerState !== this._state) {
      this._onStateChange(info.playerState, event);
    }
  }

  protected _reset() {
    this._state = -1;
    this._paused = true;
    this._seeking = false;
    this._seekingTimer = -1;
    this._played = 0;
    this._playedRange = new TimeRange(0, 0);
    this._currentTime = 0;
    this._playbackRate = 1;
    this._playPromise = null;
    this._pausePromise = null;
  }
}
