import { createScope, effect, peek, signal } from 'maverick.js';
import { deferredPromise, isString, listenEvent, type DeferredPromise } from 'maverick.js/std';

import { TimeRange, type MediaSrc } from '../../core';
import { QualitySymbol } from '../../core/quality/symbols';
import { ListSymbol } from '../../foundation/list/symbols';
import { RAFLoop } from '../../foundation/observers/raf-loop';
import { preconnect } from '../../utils/network';
import { timedPromise } from '../../utils/promise';
import { EmbedProvider } from '../embed/EmbedProvider';
import type { MediaSetupContext } from '../types';
import { VimeoCommand, type VimeoCommandArg, type VimeoCommandData } from './embed/command';
import {
  VimeoEvent,
  vimeoEvents,
  type VimeoErrorPayload,
  type VimeoEventPayload,
} from './embed/event';
import type { VimeoMessage } from './embed/message';
import type { VimeoOEmbedData, VimeoQuality, VimeoVideoInfo } from './embed/misc';
import type { VimeoParams } from './embed/params';

/**
 * This provider enables loading videos uploaded to Vimeo (https://vimeo.com) via embeds.
 *
 * @docs {@link https://www.vidstack.io/docs/player/providers/vimeo}
 * @see {@link https://developer.vimeo.com/player/sdk}
 * @example
 * ```html
 * <media-player src="vimeo/640499893">
 *   <media-provider></media-provider>
 * </media-player>
 * ```
 * @example
 * ```html
 * <media-player src="vimeo/640499893?hash={hash}">
 *   <media-provider></media-provider>
 * </media-player>
 * ```
 */
export class VimeoProvider
  extends EmbedProvider<VimeoMessage>
  implements Pick<VimeoParams, 'title' | 'byline' | 'portrait' | 'color'>
{
  protected static _videoIdRE =
    /(?:https:\/\/)?(?:player\.)?vimeo(?:\.com)?\/(?:video\/)?(\d+)(?:\?hash=(.*))?/;
  protected static _infoCache = new Map<string, VimeoVideoInfo>();

  readonly scope = createScope();

  protected _ctx!: MediaSetupContext;
  protected _played = 0;
  protected _playedRange = new TimeRange(0, 0);
  protected _seekableRange = new TimeRange(0, 0);
  protected _playPromise: DeferredPromise<void, string> | null = null;
  protected _pausePromise: DeferredPromise<void, string> | null = null;
  protected _videoInfoPromise: DeferredPromise<VimeoVideoInfo, void> | null = null;
  protected _videoId = signal('');
  protected _pro = signal(false);
  protected _hash: string | null = null;
  protected _currentSrc: MediaSrc | null = null;
  protected _currentCue: VTTCue | null = null;
  protected _timeRAF = new RAFLoop(this._onAnimationFrame.bind(this));
  protected readonly $$PROVIDER_TYPE = 'VIMEO';

  protected get _notify() {
    return this._ctx.delegate._notify;
  }

  /**
   * Whether tracking session data should be enabled on the embed, including cookies and analytics.
   * This is turned off by default to be GDPR-compliant.
   *
   * @defaultValue `false`
   */
  cookies = false;
  title = true;
  byline = true;
  portrait = true;
  color = '00ADEF';

  get type() {
    return 'video';
  }

  get currentSrc() {
    return this._currentSrc;
  }

  get videoId() {
    return this._videoId();
  }

  get hash() {
    return this._hash;
  }

  get isPro() {
    return this._pro();
  }

  preconnect() {
    const connections = [
      this._getOrigin(),
      'https://i.vimeocdn.com',
      'https://f.vimeocdn.com',
      'https://fresnel.vimeocdn.com',
    ];

    for (const url of connections) {
      preconnect(url, 'preconnect');
    }
  }

  override setup(ctx: MediaSetupContext) {
    this._ctx = ctx;
    super.setup(ctx);

    effect(this._watchVideoId.bind(this));
    effect(this._watchVideoInfo.bind(this));
    effect(this._watchPro.bind(this));

    // listenEvent(this._ctx.textTracks, 'mode-change', () => {
    //   const track = this._ctx.textTracks.selected;
    //   if (track && track.mode === 'showing' && isTrackCaptionKind(track)) {
    //     this._remote(VimeoCommand.EnableTextTrack, {
    //       language: track.language,
    //       kind: track.kind,
    //     });
    //   } else {
    //     this._remote(VimeoCommand.DisableTextTrack);
    //   }
    // });

    this._notify('provider-setup', this);
  }

  destroy() {
    this._reset();
    this._remote(VimeoCommand.Destroy);
  }

  async play() {
    const { paused } = this._ctx.$state;
    if (!peek(paused)) return;

    if (!this._playPromise) {
      this._playPromise = timedPromise<void, string>(() => {
        this._playPromise = null;
        if (paused()) return 'Timed out.';
      });

      this._remote(VimeoCommand.Play);
    }

    return this._playPromise.promise;
  }

  async pause() {
    const { paused } = this._ctx.$state;
    if (peek(paused)) return;

    if (!this._pausePromise) {
      this._pausePromise = timedPromise<void, string>(() => {
        this._pausePromise = null;
        if (!paused()) return 'Timed out.';
      });

      this._remote(VimeoCommand.Pause);
    }

    return this._pausePromise.promise;
  }

  setMuted(muted) {
    this._remote(VimeoCommand.SetMuted, muted);
  }

  setCurrentTime(time) {
    this._remote(VimeoCommand.SeekTo, time);
  }

  setVolume(volume) {
    this._remote(VimeoCommand.SetVolume, volume);
  }

  setPlaybackRate(rate) {
    this._remote(VimeoCommand.SetPlaybackRate, rate);
  }

  async loadSource(src: MediaSrc) {
    if (!isString(src.src)) {
      this._currentSrc = null;
      this._hash = null;
      this._videoId.set('');
      return;
    }

    const matches = src.src.match(VimeoProvider._videoIdRE),
      videoId = matches?.[1],
      hash = matches?.[2];

    this._videoId.set(videoId ?? '');
    this._hash = hash ?? null;

    this._currentSrc = src;
  }

  protected _watchVideoId() {
    this._reset();

    const videoId = this._videoId();

    if (!videoId) {
      this._src.set('');
      return;
    }

    this._src.set(`${this._getOrigin()}/video/${videoId}`);
  }

  protected _watchVideoInfo() {
    const src = this._src(),
      videoId = this._videoId(),
      cache = VimeoProvider._infoCache,
      info = cache.get(videoId);

    if (!videoId) return;

    const promise = deferredPromise<VimeoVideoInfo, void>();
    this._videoInfoPromise = promise;

    if (info) {
      promise.resolve(info);
      return;
    }

    const oembedSrc = `https://vimeo.com/api/oembed.json?url=${src}`,
      abort = new AbortController();

    window
      .fetch(oembedSrc, {
        mode: 'cors',
        signal: abort.signal,
      })
      .then((response) => response.json())
      .then((data: VimeoOEmbedData) => {
        const thumnailRegex = /vimeocdn.com\/video\/(.*)?_/,
          thumbnailId = data?.thumbnail_url?.match(thumnailRegex)?.[1],
          poster = thumbnailId ? `https://i.vimeocdn.com/video/${thumbnailId}_1920x1080.webp` : '',
          info = {
            title: data?.title ?? '',
            duration: data?.duration ?? 0,
            poster,
            pro: data.account_type !== 'basic',
          };

        cache.set(videoId, info);
        promise.resolve(info);
      })
      .catch((e) => {
        promise.reject();
        this._notify('error', {
          message: `Failed to fetch vimeo video info from \`${oembedSrc}\`.`,
          code: 1,
        });
      });

    return () => {
      promise.reject();
      abort.abort();
    };
  }

  protected _watchPro() {
    const isPro = this._pro(),
      { $state, qualities } = this._ctx;

    $state.canSetPlaybackRate.set(isPro);
    qualities[ListSymbol._setReadonly](!isPro);

    if (isPro) {
      return listenEvent(qualities, 'change', () => {
        if (qualities.auto) return;
        const id = qualities.selected?.id;
        if (id) this._remote(VimeoCommand.SetQuality, id);
      });
    }
  }

  protected override _getOrigin(): string {
    return 'https://player.vimeo.com';
  }

  protected override _buildParams(): VimeoParams {
    const { $iosControls } = this._ctx,
      { keyDisabled } = this._ctx.$props,
      { controls, muted, playsinline } = this._ctx.$state,
      showControls = controls() || $iosControls();
    return {
      title: this.title,
      byline: this.byline,
      color: this.color,
      portrait: this.portrait,
      controls: showControls,
      h: this.hash,
      keyboard: showControls && !keyDisabled(),
      transparent: true,
      muted: muted(),
      playsinline: playsinline(),
      dnt: !this.cookies,
    };
  }

  protected _onAnimationFrame() {
    this._remote(VimeoCommand.GetCurrentTime);
  }

  protected _onTimeUpdate(time: number, trigger: Event) {
    const { currentTime, paused, bufferedEnd } = this._ctx.$state;
    if (currentTime() === time) return;

    const prevTime = currentTime(),
      detail = {
        currentTime: time,
        played:
          this._played >= time
            ? this._playedRange
            : (this._playedRange = new TimeRange(0, this._played)),
      };

    this._notify('time-update', detail, trigger);

    // This is how we detect `seeking` early.
    if (Math.abs(prevTime - time) > 1.5) {
      this._notify('seeking', time, trigger);
      if (!paused() && bufferedEnd() < time) {
        this._notify('waiting', undefined, trigger);
      }
    }
  }

  protected _onSeeked(time: number, trigger: Event) {
    this._notify('seeked', time, trigger);
  }

  protected _onReady(trigger: Event) {
    const videoId = this._videoId();

    this._videoInfoPromise?.promise
      .then((info) => {
        if (!info) return;

        const { title, poster, duration, pro } = info;

        this._timeRAF._start();
        this._pro.set(pro);
        this._seekableRange = new TimeRange(0, duration);
        this._notify('poster-change', poster, trigger);
        this._notify('title-change', title, trigger);
        this._notify('duration-change', duration, trigger);

        const detail = {
          buffered: new TimeRange(0, 0),
          seekable: this._seekableRange,
          duration,
        };

        this._ctx.delegate._ready(detail, trigger);

        const { $iosControls } = this._ctx,
          { controls } = this._ctx.$state,
          showControls = controls() || $iosControls();

        if (!showControls) {
          this._remote(VimeoCommand.HideOverlay);
        }

        this._remote(VimeoCommand.GetQualities);

        // We can't control visibility of vimeo captions whilst getting complete info on cues.
        // this._remote(VimeoCommand.GetTextTracks);

        // TODO: need a test video to implement.
        // this._remote(VimeoCommand.GetChapters);
      })
      .catch((e) => {
        if (videoId !== this._videoId()) return;
        this._notify('error', {
          message: `Failed to fetch oembed data: ${e}`,
          code: 2,
        });
      });
  }

  protected _onMethod<T extends VimeoCommand>(
    method: T,
    data: VimeoCommandData[T],
    trigger: Event,
  ) {
    switch (method) {
      case VimeoCommand.GetCurrentTime:
        // Why isn't this narrowing type?
        this._onTimeUpdate(data as number, trigger);
        break;
      // case VimeoCommand.GetTextTracks:
      //   this._onTextTracksChange(data as VimeoTextTrack[], trigger);
      //   break;
      case VimeoCommand.GetChapters:
        break;
      case VimeoCommand.GetQualities:
        this._onQualitiesChange(data as VimeoQuality[], trigger);
        break;
    }
  }

  protected _attachListeners() {
    for (const type of vimeoEvents) {
      this._remote(VimeoCommand.AddEventListener, type as VimeoEvent);
    }
  }

  protected _onPause(trigger: Event) {
    this._notify('pause', undefined, trigger);
    this._pausePromise?.resolve();
    this._pausePromise = null;
  }

  protected _onPlay(trigger: Event) {
    this._notify('play', undefined, trigger);
    this._playPromise?.resolve();
    this._playPromise = null;
  }

  protected _onPlayProgress(trigger: Event) {
    const { paused } = this._ctx.$state;
    if (!paused()) {
      this._notify('playing', undefined, trigger);
    }
  }

  protected _onLoadProgress(buffered: number, trigger: Event) {
    const detail = {
      buffered: new TimeRange(0, buffered),
      seekable: this._seekableRange,
    };

    this._notify('progress', detail, trigger);
  }

  protected _onBufferStart(trigger: Event) {
    this._notify('waiting', undefined, trigger);
  }

  protected _onBufferEnd(trigger: Event) {
    const { paused } = this._ctx.$state;
    if (!paused()) this._notify('playing', undefined, trigger);
  }

  protected _onWaiting(trigger: Event) {
    // Attempt to detect `play` events early.
    const { paused } = this._ctx.$state;
    if (paused()) {
      this._notify('play', undefined, trigger);
    }

    this._notify('waiting', undefined, trigger);
  }

  protected _onVolumeChange(volume: number, trigger: Event) {
    const detail = {
      volume,
      muted: volume === 0,
    };

    this._notify('volume-change', detail, trigger);
  }

  // protected _onTextTrackChange(track: VimeoTextTrack, trigger: Event) {
  //   const textTrack = this._ctx.textTracks.toArray().find((t) => t.language === track.language);
  //   if (textTrack) textTrack.mode = track.mode;
  // }

  // protected _onTextTracksChange(tracks: VimeoTextTrack[], trigger: Event) {
  //   for (const init of tracks) {
  //     const textTrack = new TextTrack({
  //       ...init,
  //       label: init.label.replace('auto-generated', 'auto'),
  //     });

  //     textTrack[TextTrackSymbol._readyState] = 2;

  //     this._ctx.textTracks.add(textTrack, trigger);
  //     textTrack.setMode(init.mode, trigger);
  //   }
  // }

  // protected _onCueChange(cue: VimeoTextCue, trigger: Event) {
  //   const { textTracks, $state } = this._ctx,
  //     { currentTime } = $state,
  //     track = textTracks.selected;

  //   if (this._currentCue) track?.removeCue(this._currentCue, trigger);

  //   this._currentCue = new window.VTTCue(currentTime(), Number.MAX_SAFE_INTEGER, cue.text);
  //   track?.addCue(this._currentCue, trigger);
  // }

  protected _onQualitiesChange(qualities: VimeoQuality[], trigger: Event) {
    this._ctx.qualities[QualitySymbol._enableAuto] = qualities.some((q) => q.id === 'auto')
      ? () => {
          this._remote(VimeoCommand.SetQuality, 'auto');
        }
      : undefined;

    for (const quality of qualities) {
      if (quality.id === 'auto') continue;

      const height = +quality.id.slice(0, -1);
      if (isNaN(height)) continue;

      this._ctx.qualities[ListSymbol._add](
        {
          id: quality.id,
          width: height * (16 / 9),
          height,
          codec: 'avc1,h.264',
          bitrate: -1,
        },
        trigger,
      );
    }

    this._onQualityChange(
      qualities.find((q) => q.active),
      trigger,
    );
  }

  protected _onQualityChange({ id }: { id?: string } | undefined = {}, trigger: Event) {
    if (!id) return;

    const isAuto = id === 'auto',
      newQuality = this._ctx.qualities.toArray().find((q) => q.id === id);

    if (isAuto) {
      this._ctx.qualities[QualitySymbol._setAuto](isAuto, trigger);
      this._ctx.qualities[ListSymbol._select](undefined, true, trigger);
    } else {
      this._ctx.qualities[ListSymbol._select](newQuality, true, trigger);
    }
  }

  private _onEvent<T extends keyof VimeoEventPayload>(
    event: T,
    payload: VimeoEventPayload[T],
    trigger: Event,
  ) {
    switch (event) {
      case VimeoEvent.Ready:
        this._attachListeners();
        break;
      case VimeoEvent.Loaded:
        this._onReady(trigger);
        break;
      case VimeoEvent.Play:
        this._onPlay(trigger);
        break;
      case VimeoEvent.PlayProgress:
        this._onPlayProgress(trigger);
        break;
      case VimeoEvent.Pause:
        this._onPause(trigger);
        break;
      case VimeoEvent.LoadProgress:
        this._onLoadProgress(payload.seconds, trigger);
        break;
      case VimeoEvent.Waiting:
        this._onWaiting(trigger);
        break;
      case VimeoEvent.BufferStart:
        this._onBufferStart(trigger);
        break;
      case VimeoEvent.BufferEnd:
        this._onBufferEnd(trigger);
        break;
      case VimeoEvent.VolumeChange:
        this._onVolumeChange(payload.volume, trigger);
        break;
      case VimeoEvent.DurationChange:
        this._seekableRange = new TimeRange(0, payload.duration);
        this._notify('duration-change', payload.duration, trigger);
        break;
      case VimeoEvent.PlaybackRateChange:
        this._notify('rate-change', payload.playbackRate, trigger);
        break;
      case VimeoEvent.QualityChange:
        this._onQualityChange(payload, trigger);
        break;
      case VimeoEvent.FullscreenChange:
        this._notify('fullscreen-change', payload.fullscreen, trigger);
        break;
      case VimeoEvent.EnterPictureInPicture:
        this._notify('picture-in-picture-change', true, trigger);
        break;
      case VimeoEvent.LeavePictureInPicture:
        this._notify('picture-in-picture-change', false, trigger);
        break;
      case VimeoEvent.Ended:
        this._notify('end', undefined, trigger);
        break;
      case VimeoEvent.Error:
        this._onError(payload, trigger);
        break;
      case VimeoEvent.Seeked:
        this._onSeeked(payload.seconds, trigger);
        break;
      // case VimeoEvent.TextTrackChange:
      //   this._onTextTrackChange(payload, trigger);
      //   break;
      // case VimeoEvent.CueChange:
      //   this._onCueChange(payload, trigger);
      //   break;
    }
  }

  protected _onError(error: VimeoErrorPayload, trigger: Event) {
    if (error.method === 'play') {
      this._playPromise?.reject(error.message);
      return;
    }

    if (__DEV__) {
      this._ctx.logger
        ?.errorGroup(`[vimeo]: ${error.message}`)
        .labelledLog('Error', error)
        .labelledLog('Provider', this)
        .labelledLog('Event', trigger)
        .dispatch();
    }
  }

  protected override _onMessage(message: VimeoMessage, event: MessageEvent): void {
    if (message.event) {
      this._onEvent(message.event, message.data, event);
    } else if (message.method) {
      this._onMethod(message.method!, message.value, event);
    }
  }

  protected override _onLoad(): void {
    // no-op
  }

  protected _remote<T extends keyof VimeoCommandArg>(command: T, arg?: VimeoCommandArg[T]) {
    return this._postMessage({
      method: command,
      value: arg,
    });
  }

  protected _reset() {
    this._timeRAF._stop();
    this._played = 0;
    this._playedRange = new TimeRange(0, 0);
    this._seekableRange = new TimeRange(0, 0);
    this._playPromise = null;
    this._pausePromise = null;
    this._videoInfoPromise = null;
    this._currentCue = null;
    this._pro.set(false);
  }
}
