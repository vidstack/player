import { createScope, effect, signal } from 'maverick.js';
import { isString, type DeferredPromise } from 'maverick.js/std';

import { TimeRange, type MediaContext, type Src } from '../../core';
import { preconnect } from '../../utils/network';
import { timedPromise } from '../../utils/promise';
import { EmbedProvider } from '../embed/EmbedProvider';
import type { MediaProviderAdapter } from '../types';
import type { TwitchCommandArg } from './embed/command';
import { TwitchCommand } from './embed/command';
import type { TwitchEvent, TwitchEventPayload, TwitchState } from './embed/event';
import type { TwitchCommandMessage, TwitchMessage } from './embed/message';
import type { TwitchParams } from './embed/params';
import { resolveTwitchSource, twitchQualityToVideoQuality } from './utils';

export class TwitchProvider
  extends EmbedProvider<TwitchMessage<TwitchEvent>>
  implements MediaProviderAdapter
{
  protected readonly $$PROVIDER_TYPE = 'TWITCH';

  readonly scope = createScope();

  protected _channel = signal<string | null>(null);
  protected _videoId = signal<string | null>(null);
  protected _state: TwitchState['playback'] = 'Idle';
  protected _seekingTimer = -1;
  protected _pausedSeeking = false;
  protected _played = 0;
  protected _playedRange = new TimeRange(0, 0);
  protected _currentSrc: Src<string> | null = null;
  protected _playPromise: DeferredPromise<void, string> | null = null;
  protected _pausePromise: DeferredPromise<void, string> | null = null;

  protected get _notify() {
    return this._ctx.delegate._notify;
  }

  constructor(
    iframe: HTMLIFrameElement,
    protected _ctx: MediaContext,
  ) {
    super(iframe);
  }

  get currentSrc(): Src<string> | null {
    return this._currentSrc;
  }

  get type() {
    return 'twitch';
  }

  get channel() {
    return this._channel();
  }

  get videoId() {
    return this._videoId();
  }

  preconnect() {
    preconnect(this._getOrigin());
  }

  override setup() {
    super.setup();
    this._watchSrc();
    effect(this._watchVideoId.bind(this));
    this._notify('provider-setup', this);
  }

  async play() {
    const { paused } = this._ctx.$state;

    if (!this._playPromise) {
      this._playPromise = timedPromise<void, string>(() => {
        this._playPromise = null;
        if (paused()) return 'Timed out.';
      });

      this._remote(TwitchCommand.play, null);
    }

    return this._playPromise.promise;
  }

  async pause() {
    const { paused } = this._ctx.$state;

    if (!this._pausePromise) {
      this._pausePromise = timedPromise<void, string>(() => {
        this._pausePromise = null;
        if (!paused()) 'Timed out.';
      });

      this._remote(TwitchCommand.pause, null);
    }

    return this._pausePromise.promise;
  }

  setMuted(muted: boolean) {
    this._remote(TwitchCommand.setMuted, muted);
  }

  setCurrentTime(time: number) {
    this._pausedSeeking = this._ctx.$state.paused();
    this._remote(TwitchCommand.seek, time);
    this._notify('seeking', time);
  }

  setVolume(volume: number) {
    this._remote(TwitchCommand.setVolume, volume);
  }

  async loadSource(src: Src) {
    if (!isString(src.src)) {
      this._currentSrc = null;
      this._videoId.set('');
      return;
    }

    const { channel, videoId } = resolveTwitchSource(src.src);
    this._channel.set(channel ?? null);
    this._videoId.set(videoId ?? null);

    this._currentSrc = src as Src<string>;
  }

  protected override _getOrigin() {
    return 'https://player.twitch.tv';
  }

  protected _watchVideoId() {
    this._reset();

    const videoId = this._videoId();
    const channel = this._channel();

    if (!videoId && !channel) {
      this._src.set('');
      return;
    }

    this._src.set(this._getOrigin());
    this._notify('load-start');
  }

  protected override _buildParams(): TwitchParams {
    const { muted } = this._ctx.$state,
      channel = this.channel,
      video = this.videoId;
    const params: TwitchParams = {
      autoplay: false,
      muted: muted(),
      // TODO: this is required, probably should find a better solution to configure it
      parent: [window.location.hostname],
    };
    if (channel) {
      params.channel = channel;
    } else if (video) {
      params.video = video;
    }
    return params;
  }

  protected _remote<T extends TwitchCommand>(command: T, arg: TwitchCommandArg[T]) {
    // EmbedProvider._postMessage uses JSON.stringify, but the Twitch embed requires a native JS object
    this._iframe.contentWindow?.postMessage(
      {
        eventName: command,
        params: arg,
        namespace: 'twitch-embed-player-proxy',
      } satisfies TwitchCommandMessage<T>,
      '*',
    );
  }

  protected override _onLoad(): void {}

  protected _onReady(trigger: Event) {
    this._notify('loaded-metadata');
    this._notify('loaded-data');

    // TODO: data-stream-type is properly set on the player, it still shows the live default layout though
    if (this.channel) {
      this._notify('stream-type-change', 'live');
    } else if (this.videoId) {
      this._notify('stream-type-change', 'on-demand');
    }

    this._ctx.delegate._ready(undefined, trigger);
  }

  protected _onPlaying(trigger: Event) {
    this._notify('playing', undefined, trigger);
  }

  protected _onPlay(trigger: Event) {
    this._notify('play', undefined, trigger);
    this._playPromise?.resolve();
    this._playPromise = null;
  }

  protected _onPause(trigger: Event) {
    this._pausePromise?.resolve();
    this._pausePromise = null;
    this._notify('pause', undefined, trigger);
  }

  protected _getPlayedRange(time: number) {
    return this._played >= time
      ? this._playedRange
      : (this._playedRange = new TimeRange(0, (this._played = time)));
  }

  protected _onSeeked(trigger: Event) {
    const { paused, realCurrentTime } = this._ctx.$state;

    window.clearTimeout(this._seekingTimer);

    this._seekingTimer = window.setTimeout(
      () => {
        this._notify('seeked', realCurrentTime(), trigger);
        this._seekingTimer = -1;
      },
      paused() ? 100 : 0,
    );

    this._pausedSeeking = false;
  }

  protected _onEnded(trigger: Event) {
    const { seeking } = this._ctx.$state;
    if (seeking()) this._onSeeked(trigger);
    this._notify('pause', undefined, trigger);
    this._notify('end', undefined, trigger);
  }

  protected _onStateUpdate(state: TwitchState, trigger: Event) {
    const { intrinsicDuration, volume, muted, quality, autoQuality, qualities, currentTime } =
      this._ctx.$state;

    if (intrinsicDuration() !== state.duration) {
      this._notify('duration-change', state.duration, trigger);
    }
    if (currentTime() !== state.currentTime) {
      const boundTime = state.playback === 'Ended' ? state.duration : state.currentTime;
      const detail = {
        currentTime: boundTime,
        played: this._getPlayedRange(boundTime),
      };

      this._notify('time-update', detail, trigger);
    }
    if (volume() !== state.volume || muted() !== state.muted) {
      this._notify('volume-change', { muted: state.muted, volume: state.volume }, trigger);
    }
    if (qualities().length === 0) {
      this._notify(
        'qualities-change',
        state.qualitiesAvailable.map((q) => twitchQualityToVideoQuality(q)),
        trigger,
      );
    }
    if (quality()?.id !== state.quality) {
      const activeQuality = state.qualitiesAvailable.find((q) => q.name === state.quality)!;
      this._notify('quality-change', twitchQualityToVideoQuality(activeQuality), trigger);
      if (activeQuality.isDefault) {
        autoQuality.set(true);
      }
    }
  }

  protected _onMethod<T extends keyof TwitchEventPayload>(
    event: T,
    params: TwitchEventPayload[T],
    trigger: Event,
  ) {
    switch (event) {
      case 'UPDATE_STATE':
        // TODO: fix this
        //@ts-expect-error
        this._onStateUpdate(params, trigger);
        break;
      case 'ended':
        this._onEnded(trigger);
        break;
      case 'pause':
        this._onPause(trigger);
        break;
      case 'play':
        this._onPlay(trigger);
        break;
      case 'playing':
        this._onPlaying(trigger);
        break;
      case 'ready':
        this._onReady(trigger);
        break;
      case 'seek':
        this._onSeeked(trigger);
        break;
      default:
        break;
    }
  }

  protected override _onMessage(
    { eventName, params }: TwitchMessage<TwitchEvent>,
    event: MessageEvent,
  ) {
    if (!eventName) return;
    this._onMethod(eventName, params, event);
  }

  protected _reset() {
    this._state = 'Idle';
    this._seekingTimer = -1;
    this._played = 0;
    this._playedRange = new TimeRange(0, 0);
    this._playPromise = null;
    this._pausePromise = null;
    this._pausedSeeking = false;
  }
}
