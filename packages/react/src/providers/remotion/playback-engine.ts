import { createDisposalBin, listenEvent } from 'maverick.js/std';

import type { RemotionSrc } from './types';

export class RemotionPlaybackEngine {
  #src: RemotionSrc;
  #onFrameChange: (frame: number) => void;
  #onEnd: () => void;
  #disposal = createDisposalBin();
  #frame = 0;
  #framesAdvanced = 0;
  #playbackRate = 1;
  #playing = false;
  #rafId = -1;
  #timerId = -1;
  #startedAt = 0;
  #isRunningInBackground = false;

  get frame() {
    return this.#frame;
  }

  set frame(frame) {
    this.#frame = frame;
    this.#onFrameChange(frame);
  }

  constructor(src: RemotionSrc, onFrameChange: (frame: number) => void, onEnd: () => void) {
    this.#src = src;
    this.#onFrameChange = onFrameChange;
    this.#onEnd = onEnd;
    this.#frame = src.initialFrame ?? 0;
    this.#disposal.add(
      listenEvent(document, 'visibilitychange' as any, this.#onVisibilityChange.bind(this)),
    );
  }

  play() {
    this.#framesAdvanced = 0;
    this.#playing = true;
    this.#startedAt = performance.now();
    this.#tick();
  }

  stop() {
    this.#playing = false;

    if (this.#rafId >= 0) {
      cancelAnimationFrame(this.#rafId);
      this.#rafId = -1;
    }

    if (this.#timerId >= 0) {
      clearTimeout(this.#timerId);
      this.#timerId = -1;
    }
  }

  setPlaybackRate(rate: number) {
    this.#playbackRate = rate;
  }

  destroy() {
    this.#disposal.empty();
    this.stop();
  }

  #update() {
    const { nextFrame, framesToAdvance, ended } = this.#calculateNextFrame();
    this.#framesAdvanced += framesToAdvance;

    if (nextFrame !== this.#frame) {
      this.#onFrameChange(nextFrame);
      this.#frame = nextFrame;
    }

    if (ended) {
      this.#frame = this.#src.outFrame!;
      this.stop();
      this.#onEnd();
    }
  }

  #tick = () => {
    this.#update();
    if (this.#playing) {
      this.#queueNextFrame(this.#tick);
    }
  };

  #queueNextFrame(callback: () => void) {
    if (this.#isRunningInBackground) {
      this.#timerId = window.setTimeout(callback, 1000 / this.#src.fps!);
    } else {
      this.#rafId = requestAnimationFrame(callback);
    }
  }

  #calculateNextFrame() {
    const round = this.#playbackRate < 0 ? Math.ceil : Math.floor,
      time = performance.now() - this.#startedAt,
      framesToAdvance =
        round((time * this.#playbackRate) / (1000 / this.#src.fps!)) - this.#framesAdvanced,
      nextFrame = framesToAdvance + this.#frame,
      isCurrentFrameOutOfBounds =
        this.#frame > this.#src.outFrame! || this.#frame < this.#src.inFrame!,
      isNextFrameOutOfBounds = nextFrame > this.#src.outFrame! || nextFrame < this.#src.inFrame!,
      ended = isNextFrameOutOfBounds && !isCurrentFrameOutOfBounds;

    if (this.#playbackRate > 0 && !ended) {
      // Play forwards
      if (isNextFrameOutOfBounds) {
        return {
          nextFrame: this.#src.inFrame!,
          framesToAdvance,
          ended,
        };
      }

      return { nextFrame, framesToAdvance, ended };
    }

    // Reverse playback
    if (isNextFrameOutOfBounds) {
      return {
        nextFrame: this.#src.outFrame!,
        framesToAdvance,
        ended,
      };
    }

    return { nextFrame, framesToAdvance, ended };
  }

  #onVisibilityChange() {
    this.#isRunningInBackground = document.visibilityState === 'hidden';
    if (this.#playing) {
      this.stop();
      this.play();
    }
  }
}
