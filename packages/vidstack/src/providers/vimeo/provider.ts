import { createScope, effect, peek, signal } from 'maverick.js';
import {
  deferredPromise,
  isArray,
  isString,
  listenEvent,
  type DeferredPromise,
} from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { Src } from '../../core/api/src-types';
import { QualitySymbol } from '../../core/quality/symbols';
import { TimeRange } from '../../core/time-ranges';
import { TextTrack } from '../../core/tracks/text/text-track';
import { ListSymbol } from '../../foundation/list/symbols';
import { RAFLoop } from '../../foundation/observers/raf-loop';
import { preconnect } from '../../utils/network';
import { EmbedProvider } from '../embed/EmbedProvider';
import type { MediaFullscreenAdapter } from '../types';
import type { VimeoCommand, VimeoCommandArg, VimeoCommandData } from './embed/command';
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

  fullscreen?: MediaFullscreenAdapter;

  readonly #ctx: MediaContext;

  #videoId = signal('');
  #pro = signal(false);
  #hash: string | null = null;
  #currentSrc: Src<string> | null = null;

  #fullscreenActive = false;

  #seekableRange = new TimeRange(0, 0);
  #timeRAF = new RAFLoop(this.#onAnimationFrame.bind(this));

  #currentCue: VTTCue | null = null;
  #chaptersTrack: TextTrack | null = null;

  #promises = new Map<string, DeferredPromise<any, string>[]>();
  #videoInfoPromise: DeferredPromise<VimeoVideoInfo, void> | null = null;

  constructor(iframe: HTMLIFrameElement, ctx: MediaContext) {
    super(iframe);

    this.#ctx = ctx;

    const self = this;
    this.fullscreen = {
      get active() {
        return self.#fullscreenActive;
      },
      supported: true,
      enter: () => this.#remote('requestFullscreen'),
      exit: () => this.#remote('exitFullscreen'),
    };
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
    return this.#currentSrc;
  }

  get videoId() {
    return this.#videoId();
  }

  get hash() {
    return this.#hash;
  }

  get isPro() {
    return this.#pro();
  }

  preconnect() {
    preconnect(this.getOrigin());
  }

  override setup() {
    super.setup();

    effect(this.#watchVideoId.bind(this));
    effect(this.#watchVideoInfo.bind(this));
    effect(this.#watchPro.bind(this));

    // listenEvent(this.#ctx.textTracks, 'mode-change', () => {
    //   const track = this.#ctx.textTracks.selected;
    //   if (track && track.mode === 'showing' && isTrackCaptionKind(track)) {
    //     this.#remote('enableTextTrack', {
    //       language: track.language,
    //       kind: track.kind,
    //     });
    //   } else {
    //     this.#remote('disableTextTrack');
    //   }
    // });

    this.#ctx.notify('provider-setup', this);
  }

  destroy() {
    this.#reset();

    this.fullscreen = undefined;

    // Release all pending promises.
    const message = 'provider destroyed';
    for (const promises of this.#promises.values()) {
      for (const { reject } of promises) reject(message);
    }

    this.#promises.clear();

    this.#remote('destroy');
  }

  async play() {
    return this.#remote('play');
  }

  async pause() {
    return this.#remote('pause');
  }

  setMuted(muted) {
    this.#remote('setMuted', muted);
  }

  setCurrentTime(time) {
    this.#remote('seekTo', time);
    this.#ctx.notify('seeking', time);
  }

  setVolume(volume) {
    this.#remote('setVolume', volume);
    // Always update muted after volume because setting volume resets muted state.
    this.#remote('setMuted', peek(this.#ctx.$state.muted));
  }

  setPlaybackRate(rate) {
    this.#remote('setPlaybackRate', rate);
  }

  async loadSource(src: Src) {
    if (!isString(src.src)) {
      this.#currentSrc = null;
      this.#hash = null;
      this.#videoId.set('');
      return;
    }

    const { videoId, hash } = resolveVimeoVideoId(src.src);
    this.#videoId.set(videoId ?? '');
    this.#hash = hash ?? null;

    this.#currentSrc = src as Src<string>;
  }

  #watchVideoId() {
    this.#reset();

    const videoId = this.#videoId();

    if (!videoId) {
      this.src.set('');
      return;
    }

    this.src.set(`${this.getOrigin()}/video/${videoId}`);
    this.#ctx.notify('load-start');
  }

  #watchVideoInfo() {
    const videoId = this.#videoId();

    if (!videoId) return;

    const promise = deferredPromise<VimeoVideoInfo, void>(),
      abort = new AbortController();

    this.#videoInfoPromise = promise;

    getVimeoVideoInfo(videoId, abort, this.#hash)
      .then((info) => {
        promise.resolve(info);
      })
      .catch((e) => {
        promise.reject();
        if (__DEV__) {
          this.#ctx.logger
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

  #watchPro() {
    const isPro = this.#pro(),
      { $state, qualities } = this.#ctx;

    $state.canSetPlaybackRate.set(isPro);
    qualities[ListSymbol.setReadonly](!isPro);

    if (isPro) {
      return listenEvent(qualities, 'change', () => {
        if (qualities.auto) return;
        const id = qualities.selected?.id;
        if (id) this.#remote('setQuality', id);
      });
    }
  }

  protected override getOrigin(): string {
    return 'https://player.vimeo.com';
  }

  protected override buildParams(): VimeoParams {
    const { keyDisabled } = this.#ctx.$props,
      { playsInline, nativeControls } = this.#ctx.$state,
      showControls = nativeControls();
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

  #onAnimationFrame() {
    this.#remote('getCurrentTime');
  }

  // Embed will sometimes dispatch 0 at end of playback.
  #preventTimeUpdates = false;

  #onTimeUpdate(time: number, trigger: Event) {
    if (this.#preventTimeUpdates && time === 0) return;

    const { realCurrentTime, realDuration, paused, bufferedEnd } = this.#ctx.$state;

    if (realCurrentTime() === time) return;

    const prevTime = realCurrentTime();

    this.#ctx.notify('time-change', time, trigger);

    // This is how we detect `seeking` early.
    if (Math.abs(prevTime - time) > 1.5) {
      this.#ctx.notify('seeking', time, trigger);

      if (!paused() && bufferedEnd() < time) {
        this.#ctx.notify('waiting', undefined, trigger);
      }
    }

    if (realDuration() - time < 0.01) {
      this.#ctx.notify('end', undefined, trigger);
      this.#preventTimeUpdates = true;
      setTimeout(() => {
        this.#preventTimeUpdates = false;
      }, 500);
    }
  }

  #onSeeked(time: number, trigger: Event) {
    this.#ctx.notify('seeked', time, trigger);
  }

  #onLoaded(trigger: Event) {
    const videoId = this.#videoId();
    this.#videoInfoPromise?.promise
      .then((info) => {
        if (!info) return;

        const { title, poster, duration, pro } = info;

        this.#pro.set(pro);

        this.#ctx.notify('title-change', title, trigger);
        this.#ctx.notify('poster-change', poster, trigger);
        this.#ctx.notify('duration-change', duration, trigger);

        this.#onReady(duration, trigger);
      })
      .catch(() => {
        if (videoId !== this.#videoId()) return;
        this.#remote('getVideoTitle');
        this.#remote('getDuration');
      });
  }

  #onReady(duration: number, trigger: Event) {
    const { nativeControls } = this.#ctx.$state,
      showEmbedControls = nativeControls();

    this.#seekableRange = new TimeRange(0, duration);

    const detail = {
      buffered: new TimeRange(0, 0),
      seekable: this.#seekableRange,
      duration,
    };

    this.#ctx.delegate.ready(detail, trigger);

    if (!showEmbedControls) {
      this.#remote('_hideOverlay');
    }

    this.#remote('getQualities');

    // We can't control visibility of vimeo captions whilst getting complete info on cues.
    // this.#remote('getTextTracks');

    this.#remote('getChapters');
  }

  #onMethod<T extends keyof VimeoCommandData>(
    method: T,
    data: VimeoCommandData[T],
    trigger: Event,
  ) {
    switch (method) {
      case 'getVideoTitle':
        const videoTitle = data as string;
        this.#ctx.notify('title-change', videoTitle, trigger);
        break;
      case 'getDuration':
        const duration = data as number;
        if (!this.#ctx.$state.canPlay()) {
          this.#onReady(duration, trigger);
        } else {
          this.#ctx.notify('duration-change', duration, trigger);
        }
        break;
      case 'getCurrentTime':
        // Why isn't this narrowing type?
        this.#onTimeUpdate(data as number, trigger);
        break;
      case 'getBuffered':
        if (isArray(data) && data.length) {
          this.#onLoadProgress(data[data.length - 1][1] as number, trigger);
        }
        break;
      case 'setMuted':
        this.#onVolumeChange(peek(this.#ctx.$state.volume), data as boolean, trigger);
        break;
      // case 'getTextTracks':
      //   this.#onTextTracksChange(data as VimeoTextTrack[], trigger);
      //   break;
      case 'getChapters':
        this.#onChaptersChange(data as VimeoChapter[]);
        break;
      case 'getQualities':
        this.#onQualitiesChange(data as VimeoQuality[], trigger);
        break;
    }

    this.#getPromise(method)?.resolve();
  }

  #attachListeners() {
    for (const type of trackedVimeoEvents) {
      this.#remote('addEventListener', type as VimeoEvent);
    }
  }

  #onPause(trigger: Event) {
    this.#timeRAF.stop();
    this.#ctx.notify('pause', undefined, trigger);
  }

  #onPlay(trigger: Event) {
    this.#timeRAF.start();
    this.#ctx.notify('play', undefined, trigger);
  }

  #onPlayProgress(trigger: Event) {
    const { paused } = this.#ctx.$state;
    if (!paused() && !this.#preventTimeUpdates) {
      this.#ctx.notify('playing', undefined, trigger);
    }
  }

  #onLoadProgress(buffered: number, trigger: Event) {
    const detail = {
      buffered: new TimeRange(0, buffered),
      seekable: this.#seekableRange,
    };

    this.#ctx.notify('progress', detail, trigger);
  }

  #onBufferStart(trigger: Event) {
    this.#ctx.notify('waiting', undefined, trigger);
  }

  #onBufferEnd(trigger: Event) {
    const { paused } = this.#ctx.$state;
    if (!paused()) this.#ctx.notify('playing', undefined, trigger);
  }

  #onWaiting(trigger: Event) {
    // Attempt to detect `play` events early.
    const { paused } = this.#ctx.$state;
    if (paused()) {
      this.#ctx.notify('play', undefined, trigger);
    }

    this.#ctx.notify('waiting', undefined, trigger);
  }

  #onVolumeChange(volume: number, muted: boolean, trigger: Event) {
    const detail = { volume, muted };
    this.#ctx.notify('volume-change', detail, trigger);
  }

  // #onTextTrackChange(track: VimeoTextTrack, trigger: Event) {
  //   const textTrack = this.#ctx.textTracks.toArray().find((t) => t.language === track.language);
  //   if (textTrack) textTrack.mode = track.mode;
  // }

  // #onTextTracksChange(tracks: VimeoTextTrack[], trigger: Event) {
  //   for (const init of tracks) {
  //     const textTrack = new TextTrack({
  //       ...init,
  //       label: init.label.replace('auto-generated', 'auto'),
  //     });

  //     textTrack[TextTrackSymbol.readyState] = 2;

  //     this.#ctx.textTracks.add(textTrack, trigger);
  //     textTrack.setMode(init.mode, trigger);
  //   }
  // }

  // #onCueChange(cue: VimeoTextCue, trigger: Event) {
  //   const { textTracks, $state } = this.#ctx,
  //     { currentTime } = $state,
  //     track = textTracks.selected;

  //   if (this.#currentCue) track?.removeCue(this.#currentCue, trigger);

  //   this.#currentCue = new window.VTTCue(currentTime(), Number.MAX_SAFE_INTEGER, cue.text);
  //   track?.addCue(this.#currentCue, trigger);
  // }

  #onChaptersChange(chapters: VimeoChapter[]) {
    this.#removeChapters();

    if (!chapters.length) return;

    const track = new TextTrack({
        kind: 'chapters',
        default: true,
      }),
      { realDuration } = this.#ctx.$state;

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

    this.#chaptersTrack = track;
    this.#ctx.textTracks.add(track);
  }

  #removeChapters() {
    if (!this.#chaptersTrack) return;
    this.#ctx.textTracks.remove(this.#chaptersTrack);
    this.#chaptersTrack = null;
  }

  #onQualitiesChange(qualities: VimeoQuality[], trigger: Event) {
    this.#ctx.qualities[QualitySymbol.enableAuto] = qualities.some((q) => q.id === 'auto')
      ? () => this.#remote('setQuality', 'auto')
      : undefined;

    for (const quality of qualities) {
      if (quality.id === 'auto') continue;

      const height = +quality.id.slice(0, -1);
      if (isNaN(height)) continue;

      this.#ctx.qualities[ListSymbol.add](
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

    this.#onQualityChange(
      qualities.find((q) => q.active),
      trigger,
    );
  }

  #onQualityChange({ id }: { id?: string } | undefined = {}, trigger: Event) {
    if (!id) return;

    const isAuto = id === 'auto',
      newQuality = this.#ctx.qualities.getById(id);

    if (isAuto) {
      this.#ctx.qualities[QualitySymbol.setAuto](isAuto, trigger);
      this.#ctx.qualities[ListSymbol.select](undefined, true, trigger);
    } else {
      this.#ctx.qualities[ListSymbol.select](newQuality ?? undefined, true, trigger);
    }
  }

  #onEvent<T extends keyof VimeoEventPayload>(
    event: T,
    payload: VimeoEventPayload[T],
    trigger: Event,
  ) {
    switch (event) {
      case 'ready':
        this.#attachListeners();
        break;
      case 'loaded':
        this.#onLoaded(trigger);
        break;
      case 'play':
        this.#onPlay(trigger);
        break;
      case 'playProgress':
        this.#onPlayProgress(trigger);
        break;
      case 'pause':
        this.#onPause(trigger);
        break;
      case 'loadProgress':
        this.#onLoadProgress(payload.seconds, trigger);
        break;
      case 'waiting':
        this.#onWaiting(trigger);
        break;
      case 'bufferstart':
        this.#onBufferStart(trigger);
        break;
      case 'bufferend':
        this.#onBufferEnd(trigger);
        break;
      case 'volumechange':
        this.#onVolumeChange(payload.volume, peek(this.#ctx.$state.muted), trigger);
        break;
      case 'durationchange':
        this.#seekableRange = new TimeRange(0, payload.duration);
        this.#ctx.notify('duration-change', payload.duration, trigger);
        break;
      case 'playbackratechange':
        this.#ctx.notify('rate-change', payload.playbackRate, trigger);
        break;
      case 'qualitychange':
        this.#onQualityChange(payload, trigger);
        break;
      case 'fullscreenchange':
        this.#fullscreenActive = payload.fullscreen;
        this.#ctx.notify('fullscreen-change', payload.fullscreen, trigger);
        break;
      case 'enterpictureinpicture':
        this.#ctx.notify('picture-in-picture-change', true, trigger);
        break;
      case 'leavepictureinpicture':
        this.#ctx.notify('picture-in-picture-change', false, trigger);
        break;
      case 'ended':
        this.#ctx.notify('end', undefined, trigger);
        break;
      case 'error':
        this.#onError(payload, trigger);
        break;
      case 'seek':
      case 'seeked':
        this.#onSeeked(payload.seconds, trigger);
        break;
      // case 'texttrackchange':
      //   this.#onTextTrackChange(payload, trigger);
      //   break;
      // case 'cuechange':
      //   this.#onCueChange(payload, trigger);
      //   break;
    }
  }

  #onError(error: VimeoErrorPayload, trigger: Event) {
    const { message, method } = error;

    if (method === 'setPlaybackRate') {
      this.#pro.set(false);
    }

    if (method) {
      this.#getPromise(method as VimeoCommand)?.reject(message);
    }

    if (__DEV__) {
      this.#ctx.logger
        ?.errorGroup(`[vimeo]: ${message}`)
        .labelledLog('Error', error)
        .labelledLog('Provider', this)
        .labelledLog('Event', trigger)
        .dispatch();
    }
  }

  protected override onMessage(message: VimeoMessage, event: MessageEvent): void {
    if (message.event) {
      this.#onEvent(message.event, message.data, event);
    } else if (message.method) {
      this.#onMethod(message.method!, message.value, event);
    }
  }

  protected override onLoad(): void {
    // no-op
  }

  async #remote<T extends keyof VimeoCommandArg>(command: T, arg?: VimeoCommandArg[T]) {
    let promise = deferredPromise<void, string>(),
      promises = this.#promises.get(command);

    if (!promises) this.#promises.set(command, (promises = []));

    promises.push(promise);

    this.postMessage({
      method: command,
      value: arg,
    });

    return promise.promise;
  }

  #reset() {
    this.#timeRAF.stop();
    this.#seekableRange = new TimeRange(0, 0);
    this.#videoInfoPromise = null;
    this.#currentCue = null;
    this.#pro.set(false);
    this.#removeChapters();
  }

  #getPromise(command: VimeoCommand) {
    return this.#promises.get(command)?.shift();
  }
}
