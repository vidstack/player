import * as React from 'react';

import { createScope, effect, peek, signal, tick } from 'maverick.js';
import { useSignal } from 'maverick.js/react';
import { deferredPromise, isFunction, listenEvent, type DeferredPromise } from 'maverick.js/std';
import {
  Internals,
  type MediaVolumeContextValue,
  type PlayableMediaTag,
  type SetMediaVolumeContextValue,
  type SetTimelineContextValue,
  type TimelineContextValue,
} from 'remotion';
import { TimeRange, type MediaContext, type MediaProviderAdapter, type Src } from 'vidstack';

import { RemotionLayoutEngine } from './layout-engine';
import { RemotionPlaybackEngine } from './playback-engine';
import { isRemotionSrc } from './type-check';
import type { RemotionSrc } from './types';
import { REMOTION_PROVIDER_ID, RemotionContextProvider } from './ui/context';
import { ErrorBoundary } from './ui/error-boundary';
import { validatePlaybackRate, validateRemotionResource } from './validate';

export class RemotionProvider implements MediaProviderAdapter {
  protected readonly $$PROVIDER_TYPE = 'REMOTION';

  readonly scope = createScope();

  protected _src = signal<RemotionSrc | null>(null);
  protected _setup = false;
  protected _loadStart = false;
  protected _played = 0;
  protected _playedRange = new TimeRange(0, 0);
  protected _audio: any = null;
  protected _waiting = signal(false);
  protected _waitingPromise: DeferredPromise<void, string> | null = null;
  protected _mediaTags = signal<PlayableMediaTag[]>([]);
  protected _mediaElements = signal<HTMLMediaElement[]>([]);
  protected _bufferingElements = new Set<HTMLMediaElement>();
  protected _timeline: TimelineContextValue | null = null;
  protected _frame = signal<Record<string, number>>({ [REMOTION_PROVIDER_ID]: 0 });

  protected _layoutEngine = new RemotionLayoutEngine();
  protected _playbackEngine: RemotionPlaybackEngine | null = null;

  protected _setTimeline: SetTimelineContextValue = {
    setFrame: this._setFrame.bind(this),
    setPlaying: this._setPlaying.bind(this),
  };

  protected _setMediaVolume: SetMediaVolumeContextValue = {
    setMediaMuted: this.setMuted.bind(this),
    setMediaVolume: this.setVolume.bind(this),
  };

  protected get _notify() {
    return this._ctx.delegate._notify;
  }

  get type() {
    return 'remotion';
  }

  get currentSrc() {
    return peek(this._src);
  }

  get frame() {
    return this._frame();
  }

  constructor(
    readonly container: HTMLElement,
    protected readonly _ctx: MediaContext,
  ) {
    this._layoutEngine.setContainer(container);
  }

  setup() {
    effect(this._watchWaiting.bind(this));
    effect(this._watchMediaTags.bind(this));
    effect(this._watchMediaElements.bind(this));
  }

  protected _watchMediaTags() {
    this._mediaTags();
    this._discoverMediaElements();
  }

  protected _discoverMediaElements() {
    const elements = [...this.container.querySelectorAll<HTMLMediaElement>('audio,video')];
    this._mediaElements.set(elements);
  }

  protected _watchMediaElements() {
    const elements = this._mediaElements();

    for (const tag of elements) {
      const onWait = this._onWaitFor.bind(this, tag),
        onStopWaiting = this._onStopWaitingFor.bind(this, tag);

      if (tag.currentSrc && tag.readyState < 4) {
        this._onWaitFor(tag);
        listenEvent(tag, 'canplay', onStopWaiting);
      }

      listenEvent(tag, 'waiting', onWait);
      listenEvent(tag, 'playing', onStopWaiting);
    }

    // User might have seeked to a new position, old media elements are removed.
    for (const el of this._bufferingElements) {
      if (!elements.includes(el)) this._onStopWaitingFor(el);
    }
  }

  protected _onFrameChange(frame: number) {
    const { inFrame, fps } = this._src()!,
      { seeking } = this._ctx.$state,
      time = Math.max(0, frame - inFrame!) / fps!;

    this._frame.set((record) => ({
      ...record,
      [REMOTION_PROVIDER_ID]: frame,
    }));

    this._notify('time-update', {
      currentTime: time,
      played: this._getPlayedRange(time),
    });

    if (seeking()) {
      tick();
      this._notify('seeked', time);
    }
  }

  protected _onFrameEnd() {
    this.pause();
    this._notify('end');
  }

  async play() {
    const { ended } = this._ctx.$state;

    if (peek(ended)) {
      this._setFrame({ [REMOTION_PROVIDER_ID]: 0 });
    }

    try {
      const mediaElements = peek(this._mediaElements);
      if (mediaElements.length) {
        await Promise.all(mediaElements.map((media) => media.play()));
      }

      this._notify('play');
      tick();

      if (this._waitingPromise) {
        this._notify('waiting');
        return this._waitingPromise.promise;
      } else {
        this._playbackEngine?.play();
        this._notify('playing');
      }
    } catch (error) {
      throw error;
    }
  }

  async pause() {
    const { paused } = this._ctx.$state;
    this._playbackEngine?.stop();
    this._notify('pause');
  }

  setMuted(value: React.SetStateAction<boolean>) {
    if (!this._ctx) return;

    const { muted, volume } = this._ctx.$state;

    if (isFunction(value)) {
      this.setMuted(value(muted()));
      return;
    }

    this._notify('volume-change', {
      volume: peek(volume),
      muted: value,
    });
  }

  setCurrentTime(time: number) {
    const { fps } = this._src()!,
      frame = time * fps!;

    this._notify('seeking', time);
    this._setFrame({ [REMOTION_PROVIDER_ID]: frame });
  }

  setVolume(value: React.SetStateAction<number>) {
    if (!this._ctx) return;

    const { volume, muted } = this._ctx.$state;

    if (isFunction(value)) {
      this.setVolume(value(volume()));
      return;
    }

    this._notify('volume-change', {
      volume: value,
      muted: peek(muted),
    });
  }

  setPlaybackRate(rate: React.SetStateAction<number>) {
    if (isFunction(rate)) {
      const { playbackRate } = this._ctx.$state;
      this.setPlaybackRate(rate(peek(playbackRate)));
      return;
    }

    if (__DEV__) validatePlaybackRate(rate);
    this._playbackEngine?.setPlaybackRate(rate);
    this._notify('rate-change', rate);
  }

  protected _getPlayedRange(time: number) {
    return this._played >= time
      ? this._playedRange
      : (this._playedRange = new TimeRange(0, (this._played = time)));
  }

  async loadSource(src: Src) {
    if (!isRemotionSrc(src)) return;

    const onUserError = src.onError,
      resolvedSrc: RemotionSrc = {
        compositionWidth: 1920,
        compositionHeight: 1080,
        fps: 30,
        initialFrame: 0,
        inFrame: 0,
        outFrame: src.durationInFrames,
        numberOfSharedAudioTags: 5,
        inputProps: {},
        ...src,
        onError: (error) => {
          if (__DEV__) {
            this._ctx.logger
              ?.errorGroup(`[vidstack] ${error.message}`)
              .labelledLog('Source', peek(this._src))
              .labelledLog('Error', error)
              .dispatch();
          }

          this.pause();
          this._notify('error', {
            message: error.message,
            code: 1,
          });

          onUserError?.(error);
        },
      };

    this._src.set(resolvedSrc);

    // Copy initialized props over to main src object.
    for (const prop of Object.keys(resolvedSrc)) {
      src[prop] = resolvedSrc[prop];
    }

    this.changeSrc(resolvedSrc);
  }

  destroy() {
    this.changeSrc(null);
  }

  changeSrc(src: RemotionSrc | null) {
    this._playbackEngine?.destroy();

    this._played = 0;
    this._playedRange = new TimeRange(0, 0);
    this._waiting.set(false);
    this._waitingPromise?.reject('src changed');
    this._waitingPromise = null;
    this._audio = null;
    this._timeline = null;
    this._playbackEngine = null;
    this._mediaTags.set([]);
    this._bufferingElements.clear();
    this._frame.set({ [REMOTION_PROVIDER_ID]: 0 });

    this._layoutEngine.setSrc(src);

    if (src) {
      this._timeline = this._createTimelineContextValue();
      this._playbackEngine = new RemotionPlaybackEngine(
        src,
        this._onFrameChange.bind(this),
        this._onFrameEnd.bind(this),
      );
    }
  }

  render = (): React.ReactNode => {
    const $src = useSignal(this._src);

    if (!$src) {
      throw Error(
        __DEV__
          ? '[vidstack] attempting to render remotion provider without src'
          : '[vidstack] no src',
      );
    }

    React.useEffect(() => {
      if (!isRemotionSrc($src)) return;
      validateRemotionResource($src);

      const rafId = requestAnimationFrame(() => {
        if (!this._setup) {
          this._notify('provider-setup', this);
          this._setup = true;
        }

        if (!this._loadStart) {
          this._notify('load-start');
          this._loadStart = true;
        }

        this._discoverMediaElements();
        tick();
        if (!this._waiting()) this._ready($src);
      });

      return () => {
        cancelAnimationFrame(rafId);
        this._loadStart = false;
      };
    }, [$src]);

    const Component = Internals.useLazyComponent({
      component: $src.src,
    }) as React.LazyExoticComponent<React.ComponentType<unknown>>;

    const { $state } = this._ctx,
      $volume = useSignal($state.volume),
      $isMuted = useSignal($state.muted);

    const mediaVolume = React.useMemo((): MediaVolumeContextValue => {
      const { muted, volume } = this._ctx.$state;
      return { mediaMuted: muted(), mediaVolume: volume() };
    }, [$isMuted, $volume]);

    return (
      <RemotionContextProvider
        src={$src}
        component={Component}
        timeline={this._timeline!}
        mediaVolume={mediaVolume}
        setMediaVolume={this._setMediaVolume}
      >
        <Internals.Timeline.SetTimelineContext.Provider value={this._setTimeline}>
          {React.createElement(this.renderVideo, { src: $src })}
        </Internals.Timeline.SetTimelineContext.Provider>
      </RemotionContextProvider>
    );
  };

  renderVideo = ({ src }: { src: RemotionSrc }): React.ReactNode => {
    const video = Internals.useVideo(),
      Video = video ? video.component : null,
      audioContext = React.useContext(Internals.SharedAudioContext);

    const { $state } = this._ctx;

    useSignal(this._frame);
    useSignal($state.playing);
    useSignal($state.playbackRate);

    React.useEffect(() => {
      this._audio = audioContext;
      return () => {
        this._audio = null;
      };
    }, [audioContext]);

    const LoadingContent = React.useMemo(() => src.renderLoading?.(), [src]);

    const Content = Video ? (
      <ErrorBoundary fallback={src.errorFallback} onError={src.onError!}>
        <Internals.ClipComposition>
          <Video {...video?.props} {...src.inputProps} />
        </Internals.ClipComposition>
      </ErrorBoundary>
    ) : null;

    return <React.Suspense fallback={LoadingContent}>{Content}</React.Suspense>;
  };

  protected _ready(src: RemotionSrc | null) {
    if (!src) return;

    const { outFrame, inFrame, fps } = src,
      duration = (outFrame! - inFrame!) / fps!;

    this._notify('loaded-metadata');
    this._notify('loaded-data');

    this._ctx.delegate._ready({
      duration,
      seekable: new TimeRange(0, duration),
      buffered: new TimeRange(0, duration),
    });

    if (src.initialFrame) {
      this._setFrame({
        [REMOTION_PROVIDER_ID]: src.initialFrame,
      });
    }
  }

  protected _onWaitFor(el: HTMLMediaElement) {
    this._bufferingElements.add(el);
    this._waiting.set(true);
    if (!this._waitingPromise) {
      this._waitingPromise = deferredPromise();
    }
  }

  protected _onStopWaitingFor(el: HTMLMediaElement) {
    this._bufferingElements.delete(el);

    // There's still elements we're waiting on.
    if (this._bufferingElements.size) return;

    this._waiting.set(false);
    this._waitingPromise?.resolve();
    this._waitingPromise = null;

    const { canPlay } = this._ctx.$state;
    if (!peek(canPlay)) {
      this._ready(peek(this._src));
    }
  }

  protected _watchWaiting() {
    this._waiting(); // subscribe

    const { paused } = this._ctx.$state;
    if (peek(paused)) return;

    if (this._waiting()) {
      this._playbackEngine?.stop();
      this._notify('waiting');
    } else {
      this._playbackEngine?.play();
      this._notify('playing');
    }
  }

  protected _setFrame(value: React.SetStateAction<Record<string, number>>) {
    if (isFunction(value)) {
      this._setFrame(value(this._frame()));
      return;
    }

    this._frame.set((record) => ({ ...record, ...value }));

    const nextFrame = value[REMOTION_PROVIDER_ID];
    if (this._playbackEngine && this._playbackEngine.frame !== nextFrame) {
      this._playbackEngine.frame = nextFrame;
    }
  }

  protected _setPlaying(value: React.SetStateAction<boolean>) {
    const { playing } = this._ctx.$state;

    if (isFunction(value)) {
      this._setPlaying(value(playing()));
      return;
    }

    if (value) {
      this.play();
    } else if (!value) {
      this.pause();
    }
  }

  protected _createTimelineContextValue(): TimelineContextValue {
    const { playing, playbackRate } = this._ctx.$state,
      frame = this._frame,
      mediaTags = this._mediaTags,
      setPlaybackRate = this.setPlaybackRate.bind(this);

    return {
      rootId: REMOTION_PROVIDER_ID,
      get frame() {
        return frame();
      },
      get playing() {
        return playing();
      },
      get playbackRate() {
        return playbackRate();
      },
      imperativePlaying: {
        get current() {
          return playing();
        },
      },
      setPlaybackRate,
      audioAndVideoTags: {
        get current() {
          return mediaTags();
        },
        set current(tags) {
          mediaTags.set(tags);
        },
      },
    };
  }
}
