import { createScope, effect, peek, signal } from 'maverick.js';
import {
  deferredPromise,
  isArray,
  isString,
  listenEvent,
  type DeferredPromise,
} from 'maverick.js/std';

import { TextTrack, TimeRange, type MediaContext, type Src } from '../../core';
import { QualitySymbol } from '../../core/quality/symbols';
import { ListSymbol } from '../../foundation/list/symbols';
import { RAFLoop } from '../../foundation/observers/raf-loop';
import { coerceToError } from '../../utils/error';
import { preconnect } from '../../utils/network';
import { timedPromise } from '../../utils/promise';
import { EmbedProvider } from '../embed/EmbedProvider';
import type { VimeoCommandArg, VimeoCommandData } from './embed/command';
import {
  trackedVimeoEvents,
  type VimeoErrorPayload,
  type VimeoEvent,
  type VimeoEventPayload,
} from './embed/event';
import type { VimeoMessage } from './embed/message';
import type { VimeoChapter, VimeoQuality, VimeoVideoInfo } from './embed/misc';
import type { VimeoParams } from './embed/params';
import { getVimeoVideoInfo, resolveVimeoVideoId } from './utils';

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
  protected readonly $$PROVIDER_TYPE = 'VIMEO';

  readonly scope = createScope();

  protected _played = 0;
  protected _playedRange = new TimeRange(0, 0);
  protected _seekableRange = new TimeRange(0, 0);
  protected _playPromise: DeferredPromise<void, string> | null = null;
  protected _pausePromise: DeferredPromise<void, string> | null = null;
  protected _videoInfoPromise: DeferredPromise<VimeoVideoInfo, void> | null = null;
  protected _videoId = signal('');
  protected _pro = signal(false);
  protected _hash: string | null = null;
  protected _currentSrc: Src<string> | null = null;
  protected _currentCue: VTTCue | null = null;
  protected _timeRAF = new RAFLoop(this._onAnimationFrame.bind(this));
  private _chaptersTrack: TextTrack | null = null;

  protected get _notify() {
    return this._ctx.delegate._notify;
  }

  constructor(
    iframe: HTMLIFrameElement,
    protected _ctx: MediaContext,
  ) {
    super(iframe);
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
    return 'vimeo';
  }

  get currentSrc(): Src<string> | null {
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
    preconnect(this._getOrigin());
  }

  override setup() {
    super.setup();

    effect(this._watchVideoId.bind(this));
    effect(this._watchVideoInfo.bind(this));
    effect(this._watchPro.bind(this));

    // listenEvent(this._ctx.textTracks, 'mode-change', () => {
    //   const track = this._ctx.textTracks.selected;
    //   if (track && track.mode === 'showing' && isTrackCaptionKind(track)) {
    //     this._remote('enableTextTrack', {
    //       language: track.language,
    //       kind: track.kind,
    //     });
    //   } else {
    //     this._remote('disableTextTrack');
    //   }
    // });

    this._notify('provider-setup', this);
  }

  destroy() {
    this._reset();
    this._remote('destroy');
  }

  async play() {
    const { paused } = this._ctx.$state;

    if (!this._playPromise) {
      this._playPromise = timedPromise<void, string>(() => {
        this._playPromise = null;
        if (paused()) return 'Timed out.';
      });

      this._remote('play');
    }

    return this._playPromise.promise;
  }

  async pause() {
    const { paused } = this._ctx.$state;

    if (!this._pausePromise) {
      this._pausePromise = timedPromise<void, string>(() => {
        this._pausePromise = null;
        if (!paused()) return 'Timed out.';
      });

      this._remote('pause');
    }

    return this._pausePromise.promise;
  }

  setMuted(muted) {
    this._remote('setMuted', muted);
  }

  setCurrentTime(time) {
    this._remote('seekTo', time);
    this._notify('seeking', time);
  }

  setVolume(volume) {
    this._remote('setVolume', volume);
    // Always update muted after volume because setting volume resets muted state.
    this._remote('setMuted', peek(this._ctx.$state.muted));
  }

  setPlaybackRate(rate) {
    this._remote('setPlaybackRate', rate);
  }

  async loadSource(src: Src) {
    if (!isString(src.src)) {
      this._currentSrc = null;
      this._hash = null;
      this._videoId.set('');
      return;
    }

    const { videoId, hash } = resolveVimeoVideoId(src.src);
    this._videoId.set(videoId ?? '');
    this._hash = hash ?? null;

    this._currentSrc = src as Src<string>;
  }

  protected _watchVideoId() {
    this._reset();

    const videoId = this._videoId();

    if (!videoId) {
      this._src.set('');
      return;
    }

    this._src.set(`${this._getOrigin()}/video/${videoId}`);
    this._notify('load-start');
  }

  protected _watchVideoInfo() {
    const videoId = this._videoId();

    if (!videoId) return;

    const promise = deferredPromise<VimeoVideoInfo, void>(),
      abort = new AbortController();

    this._videoInfoPromise = promise;

    getVimeoVideoInfo(videoId, abort)
      .then((info) => {
        promise.resolve(info);
      })
      .catch((e) => {
        promise.reject();
        if (__DEV__) {
          this._ctx.logger
            ?.warnGroup(`Failed to fetch vimeo video info for id \`${videoId}\`.`)
            .labelledLog('Error', e)
            .dispatch();
        }
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
        if (id) this._remote('setQuality', id);
      });
    }
  }

  protected override _getOrigin(): string {
    return 'https://player.vimeo.com';
  }

  protected override _buildParams(): VimeoParams {
    const { $iosControls } = this._ctx,
      { keyDisabled } = this._ctx.$props,
      { controls, playsInline } = this._ctx.$state,
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
      playsinline: playsInline(),
      dnt: !this.cookies,
    };
  }

  protected _onAnimationFrame() {
    this._remote('getCurrentTime');
  }

  // Embed will sometimes dispatch 0 at end of playback.
  private _skipTimeUpdates = false;

  protected _onTimeUpdate(time: number, trigger: Event) {
    if (this._skipTimeUpdates && time === 0) return;

    const { realCurrentTime, realDuration, paused, bufferedEnd } = this._ctx.$state;

    if (realCurrentTime() === time) return;

    const prevTime = realCurrentTime(),
      detail = {
        currentTime: time,
        played: this._getPlayedRange(time),
      };

    this._notify('time-update', detail, trigger);

    // This is how we detect `seeking` early.
    if (Math.abs(prevTime - time) > 1.5) {
      this._notify('seeking', time, trigger);

      if (!paused() && bufferedEnd() < time) {
        this._notify('waiting', undefined, trigger);
      }
    }

    if (realDuration() - time < 0.01) {
      this._notify('end', undefined, trigger);
      this._skipTimeUpdates = true;
      setTimeout(() => {
        this._skipTimeUpdates = false;
      }, 500);
    }
  }

  protected _getPlayedRange(time: number) {
    return this._played >= time
      ? this._playedRange
      : (this._playedRange = new TimeRange(0, (this._played = time)));
  }

  protected _onSeeked(time: number, trigger: Event) {
    this._notify('seeked', time, trigger);
  }

  protected _onLoaded(trigger: Event) {
    const videoId = this._videoId();
    this._videoInfoPromise?.promise
      .then((info) => {
        if (!info) return;

        const { title, poster, duration, pro } = info;

        this._pro.set(pro);

        this._notify('title-change', title, trigger);
        this._notify('poster-change', poster, trigger);
        this._notify('duration-change', duration, trigger);

        this._onReady(duration, trigger);
      })
      .catch(() => {
        if (videoId !== this._videoId()) return;
        this._remote('getVideoTitle');
        this._remote('getDuration');
      });
  }

  private _onReady(duration: number, trigger: Event) {
    const { $iosControls } = this._ctx,
      { controls } = this._ctx.$state,
      showEmbedControls = controls() || $iosControls();

    this._seekableRange = new TimeRange(0, duration);

    const detail = {
      buffered: new TimeRange(0, 0),
      seekable: this._seekableRange,
      duration,
    };

    this._ctx.delegate._ready(detail, trigger);

    if (!showEmbedControls) {
      this._remote('_hideOverlay');
    }

    this._remote('getQualities');

    // We can't control visibility of vimeo captions whilst getting complete info on cues.
    // this._remote('getTextTracks');

    this._remote('getChapters');
  }

  protected _onMethod<T extends keyof VimeoCommandData>(
    method: T,
    data: VimeoCommandData[T],
    trigger: Event,
  ) {
    switch (method) {
      case 'getVideoTitle':
        const videoTitle = data as string;
        this._notify('title-change', videoTitle, trigger);
        break;
      case 'getDuration':
        const duration = data as number;
        if (!this._ctx.$state.canPlay()) {
          this._onReady(duration, trigger);
        } else {
          this._notify('duration-change', duration, trigger);
        }
        break;
      case 'getCurrentTime':
        // Why isn't this narrowing type?
        this._onTimeUpdate(data as number, trigger);
        break;
      case 'getBuffered':
        if (isArray(data) && data.length) {
          this._onLoadProgress(data[data.length - 1][1] as number, trigger);
        }
        break;
      case 'setMuted':
        this._onVolumeChange(peek(this._ctx.$state.volume), data as boolean, trigger);
        break;
      // case 'getTextTracks':
      //   this._onTextTracksChange(data as VimeoTextTrack[], trigger);
      //   break;
      case 'getChapters':
        this._onChaptersChange(data as VimeoChapter[]);
        break;
      case 'getQualities':
        this._onQualitiesChange(data as VimeoQuality[], trigger);
        break;
    }
  }

  protected _attachListeners() {
    for (const type of trackedVimeoEvents) {
      this._remote('addEventListener', type as VimeoEvent);
    }
  }

  protected _onPause(trigger: Event) {
    this._timeRAF._stop();
    this._notify('pause', undefined, trigger);
    this._pausePromise?.resolve();
    this._pausePromise = null;
  }

  protected _onPlay(trigger: Event) {
    this._timeRAF._start();
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

  protected _onVolumeChange(volume: number, muted: boolean, trigger: Event) {
    const detail = { volume, muted };
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

  protected _onChaptersChange(chapters: VimeoChapter[]) {
    this._removeChapters();

    if (!chapters.length) return;

    const track = new TextTrack({
        kind: 'chapters',
        default: true,
      }),
      { realDuration } = this._ctx.$state;

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i],
        nextChapter = chapters[i + 1];

      track.addCue(
        new window.VTTCue(
          chapter.startTime,
          nextChapter?.startTime ?? realDuration(),
          chapter.title,
        ),
      );
    }

    this._chaptersTrack = track;
    this._ctx.textTracks.add(track);
  }

  protected _removeChapters() {
    if (!this._chaptersTrack) return;
    this._ctx.textTracks.remove(this._chaptersTrack);
    this._chaptersTrack = null;
  }

  protected _onQualitiesChange(qualities: VimeoQuality[], trigger: Event) {
    this._ctx.qualities[QualitySymbol._enableAuto] = qualities.some((q) => q.id === 'auto')
      ? () => this._remote('setQuality', 'auto')
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
      newQuality = this._ctx.qualities.getById(id);

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
      case 'ready':
        this._attachListeners();
        break;
      case 'loaded':
        this._onLoaded(trigger);
        break;
      case 'play':
        this._onPlay(trigger);
        break;
      case 'playProgress':
        this._onPlayProgress(trigger);
        break;
      case 'pause':
        this._onPause(trigger);
        break;
      case 'loadProgress':
        this._onLoadProgress(payload.seconds, trigger);
        break;
      case 'waiting':
        this._onWaiting(trigger);
        break;
      case 'bufferstart':
        this._onBufferStart(trigger);
        break;
      case 'bufferend':
        this._onBufferEnd(trigger);
        break;
      case 'volumechange':
        this._onVolumeChange(payload.volume, peek(this._ctx.$state.muted), trigger);
        break;
      case 'durationchange':
        this._seekableRange = new TimeRange(0, payload.duration);
        this._notify('duration-change', payload.duration, trigger);
        break;
      case 'playbackratechange':
        this._notify('rate-change', payload.playbackRate, trigger);
        break;
      case 'qualitychange':
        this._onQualityChange(payload, trigger);
        break;
      case 'fullscreenchange':
        this._notify('fullscreen-change', payload.fullscreen, trigger);
        break;
      case 'enterpictureinpicture':
        this._notify('picture-in-picture-change', true, trigger);
        break;
      case 'leavepictureinpicture':
        this._notify('picture-in-picture-change', false, trigger);
        break;
      case 'ended':
        this._notify('end', undefined, trigger);
        break;
      case 'error':
        this._onError(payload, trigger);
        break;
      case 'seek':
      case 'seeked':
        this._onSeeked(payload.seconds, trigger);
        break;
      // case 'texttrackchange':
      //   this._onTextTrackChange(payload, trigger);
      //   break;
      // case 'cuechange':
      //   this._onCueChange(payload, trigger);
      //   break;
    }
  }

  protected _onError(error: VimeoErrorPayload, trigger: Event) {
    if (error.method === 'setPlaybackRate') {
      this._pro.set(false);
    }

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
    this._removeChapters();
  }
}
