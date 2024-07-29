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

  #src = signal<RemotionSrc | null>(null);
  #setup = false;
  #loadStart = false;
  #audio: any = null;
  #waiting = signal(false);
  #waitingPromise: DeferredPromise<void, string> | null = null;
  #mediaTags = signal<PlayableMediaTag[]>([]);
  #mediaElements = signal<HTMLMediaElement[]>([]);
  #bufferingElements = new Set<HTMLMediaElement>();
  #timeline: TimelineContextValue | null = null;
  #frame = signal<Record<string, number>>({ [REMOTION_PROVIDER_ID]: 0 });

  #layoutEngine = new RemotionLayoutEngine();
  #playbackEngine: RemotionPlaybackEngine | null = null;

  readonly #container: HTMLElement;
  readonly #ctx: MediaContext;

  #setTimeline: SetTimelineContextValue;

  #setMediaVolume: SetMediaVolumeContextValue = {
    setMediaMuted: this.setMuted.bind(this),
    setMediaVolume: this.setVolume.bind(this),
  };

  get type() {
    return 'remotion';
  }

  get currentSrc() {
    return peek(this.#src);
  }

  get frame() {
    return this.#frame();
  }

  constructor(container: HTMLElement, ctx: MediaContext) {
    this.#container = container;
    this.#ctx = ctx;
    this.#setTimeline = {
      setFrame: this.#setFrame.bind(this),
      setPlaying: this.#setPlaying.bind(this),
    };
    this.#layoutEngine.setContainer(container);
  }

  setup() {
    effect(this.#watchWaiting.bind(this));
    effect(this.#watchMediaTags.bind(this));
    effect(this.#watchMediaElements.bind(this));
  }

  #watchMediaTags() {
    this.#mediaTags();
    this.#discoverMediaElements();
  }

  #discoverMediaElements() {
    const elements = [...this.#container.querySelectorAll<HTMLMediaElement>('audio,video')];
    this.#mediaElements.set(elements);
  }

  #watchMediaElements() {
    const elements = this.#mediaElements();

    for (const tag of elements) {
      const onWait = this.#onWaitFor.bind(this, tag),
        onStopWaiting = this.#onStopWaitingFor.bind(this, tag);

      if (tag.currentSrc && tag.readyState < 4) {
        this.#onWaitFor(tag);
        listenEvent(tag, 'canplay', onStopWaiting);
      }

      listenEvent(tag, 'waiting', onWait);
      listenEvent(tag, 'playing', onStopWaiting);
    }

    // User might have seeked to a new position, old media elements are removed.
    for (const el of this.#bufferingElements) {
      if (!elements.includes(el)) this.#onStopWaitingFor(el);
    }
  }

  #onFrameChange(frame: number) {
    const { inFrame, fps } = this.#src()!,
      { seeking } = this.#ctx.$state,
      time = Math.max(0, frame - inFrame!) / fps!;

    this.#frame.set((record) => ({
      ...record,
      [REMOTION_PROVIDER_ID]: frame,
    }));

    this.#ctx.notify('time-change', time);

    if (seeking()) {
      tick();
      this.#ctx.notify('seeked', time);
    }
  }

  #onFrameEnd() {
    this.pause();
    this.#ctx.notify('end');
  }

  async play() {
    const { ended } = this.#ctx.$state;

    if (peek(ended)) {
      this.#setFrame({ [REMOTION_PROVIDER_ID]: 0 });
    }

    try {
      const mediaElements = peek(this.#mediaElements);
      if (mediaElements.length) {
        await Promise.all(mediaElements.map((media) => media.play()));
      }

      this.#ctx.notify('play');
      tick();

      if (this.#waitingPromise) {
        this.#ctx.notify('waiting');
        return this.#waitingPromise.promise;
      } else {
        this.#playbackEngine?.play();
        this.#ctx.notify('playing');
      }
    } catch (error) {
      throw error;
    }
  }

  async pause() {
    const { paused } = this.#ctx.$state;
    this.#playbackEngine?.stop();
    this.#ctx.notify('pause');
  }

  setMuted(value: React.SetStateAction<boolean>) {
    if (!this.#ctx) return;

    const { muted, volume } = this.#ctx.$state;

    if (isFunction(value)) {
      this.setMuted(value(muted()));
      return;
    }

    this.#ctx.notify('volume-change', {
      volume: peek(volume),
      muted: value,
    });
  }

  setCurrentTime(time: number) {
    const { fps } = this.#src()!,
      frame = time * fps!;

    this.#ctx.notify('seeking', time);
    this.#setFrame({ [REMOTION_PROVIDER_ID]: frame });
  }

  setVolume(value: React.SetStateAction<number>) {
    if (!this.#ctx) return;

    const { volume, muted } = this.#ctx.$state;

    if (isFunction(value)) {
      this.setVolume(value(volume()));
      return;
    }

    this.#ctx.notify('volume-change', {
      volume: value,
      muted: peek(muted),
    });
  }

  setPlaybackRate(rate: React.SetStateAction<number>) {
    if (isFunction(rate)) {
      const { playbackRate } = this.#ctx.$state;
      this.setPlaybackRate(rate(peek(playbackRate)));
      return;
    }

    if (__DEV__) validatePlaybackRate(rate);
    this.#playbackEngine?.setPlaybackRate(rate);
    this.#ctx.notify('rate-change', rate);
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
            this.#ctx.logger
              ?.errorGroup(`[vidstack] ${error.message}`)
              .labelledLog('Source', peek(this.#src))
              .labelledLog('Error', error)
              .dispatch();
          }

          this.pause();
          this.#ctx.notify('error', {
            message: error.message,
            code: 1,
          });

          onUserError?.(error);
        },
      };

    this.#src.set(resolvedSrc);

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
    this.#playbackEngine?.destroy();

    this.#waiting.set(false);
    this.#waitingPromise?.reject('src changed');
    this.#waitingPromise = null;
    this.#audio = null;
    this.#timeline = null;
    this.#playbackEngine = null;
    this.#mediaTags.set([]);
    this.#bufferingElements.clear();
    this.#frame.set({ [REMOTION_PROVIDER_ID]: 0 });

    this.#layoutEngine.setSrc(src);

    if (src) {
      this.#timeline = this.#createTimelineContextValue();
      this.#playbackEngine = new RemotionPlaybackEngine(
        src,
        this.#onFrameChange.bind(this),
        this.#onFrameEnd.bind(this),
      );
    }
  }

  render = (): React.ReactNode => {
    const $src = useSignal(this.#src);

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
        if (!this.#setup) {
          this.#ctx.notify('provider-setup', this);
          this.#setup = true;
        }

        if (!this.#loadStart) {
          this.#ctx.notify('load-start');
          this.#loadStart = true;
        }

        this.#discoverMediaElements();
        tick();
        if (!this.#waiting()) this.#ready($src);
      });

      return () => {
        cancelAnimationFrame(rafId);
        this.#loadStart = false;
      };
    }, [$src]);

    const Component = Internals.useLazyComponent({
      component: $src.src,
    }) as React.LazyExoticComponent<React.ComponentType<unknown>>;

    const { $state } = this.#ctx,
      $volume = useSignal($state.volume),
      $isMuted = useSignal($state.muted);

    const mediaVolume = React.useMemo((): MediaVolumeContextValue => {
      const { muted, volume } = this.#ctx.$state;
      return { mediaMuted: muted(), mediaVolume: volume() };
    }, [$isMuted, $volume]);

    return (
      <RemotionContextProvider
        src={$src}
        component={Component}
        timeline={this.#timeline!}
        mediaVolume={mediaVolume}
        setMediaVolume={this.#setMediaVolume}
      >
        <Internals.Timeline.SetTimelineContext.Provider value={this.#setTimeline}>
          {React.createElement(this.renderVideo, { src: $src })}
        </Internals.Timeline.SetTimelineContext.Provider>
      </RemotionContextProvider>
    );
  };

  renderVideo = ({ src }: { src: RemotionSrc }): React.ReactNode => {
    const video = Internals.useVideo(),
      Video = video ? video.component : null,
      audioContext = React.useContext(Internals.SharedAudioContext);

    const { $state } = this.#ctx;

    useSignal(this.#frame);
    useSignal($state.playing);
    useSignal($state.playbackRate);

    React.useEffect(() => {
      this.#audio = audioContext;
      return () => {
        this.#audio = null;
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

  #ready(src: RemotionSrc | null) {
    if (!src) return;

    const { outFrame, inFrame, fps } = src,
      duration = (outFrame! - inFrame!) / fps!;

    this.#ctx.notify('loaded-metadata');
    this.#ctx.notify('loaded-data');

    this.#ctx.delegate.ready({
      duration,
      seekable: new TimeRange(0, duration),
      buffered: new TimeRange(0, duration),
    });

    if (src.initialFrame) {
      this.#setFrame({
        [REMOTION_PROVIDER_ID]: src.initialFrame,
      });
    }
  }

  #onWaitFor(el: HTMLMediaElement) {
    this.#bufferingElements.add(el);
    this.#waiting.set(true);
    if (!this.#waitingPromise) {
      this.#waitingPromise = deferredPromise();
    }
  }

  #onStopWaitingFor(el: HTMLMediaElement) {
    this.#bufferingElements.delete(el);

    // There's still elements we're waiting on.
    if (this.#bufferingElements.size) return;

    this.#waiting.set(false);
    this.#waitingPromise?.resolve();
    this.#waitingPromise = null;

    const { canPlay } = this.#ctx.$state;
    if (!peek(canPlay)) {
      this.#ready(peek(this.#src));
    }
  }

  #watchWaiting() {
    this.#waiting(); // subscribe

    const { paused } = this.#ctx.$state;
    if (peek(paused)) return;

    if (this.#waiting()) {
      this.#playbackEngine?.stop();
      this.#ctx.notify('waiting');
    } else {
      this.#playbackEngine?.play();
      this.#ctx.notify('playing');
    }
  }

  #setFrame(value: React.SetStateAction<Record<string, number>>) {
    if (isFunction(value)) {
      this.#setFrame(value(this.#frame()));
      return;
    }

    this.#frame.set((record) => ({ ...record, ...value }));

    const nextFrame = value[REMOTION_PROVIDER_ID];
    if (this.#playbackEngine && this.#playbackEngine.frame !== nextFrame) {
      this.#playbackEngine.frame = nextFrame;
    }
  }

  #setPlaying(value: React.SetStateAction<boolean>) {
    const { playing } = this.#ctx.$state;

    if (isFunction(value)) {
      this.#setPlaying(value(playing()));
      return;
    }

    if (value) {
      this.play();
    } else if (!value) {
      this.pause();
    }
  }

  #createTimelineContextValue(): TimelineContextValue {
    const { playing, playbackRate } = this.#ctx.$state,
      frame = this.#frame,
      mediaTags = this.#mediaTags,
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
