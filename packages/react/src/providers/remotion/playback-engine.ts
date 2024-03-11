import { createDisposalBin, listenEvent } from 'maverick.js/std';

import type { RemotionSrc } from './types';

export class RemotionPlaybackEngine {
  protected _disposal = createDisposalBin();
  protected _frame = 0;
  protected _framesAdvanced = 0;
  protected _playbackRate = 1;
  protected _playing = false;
  protected _rafId = -1;
  protected _timerId = -1;
  protected _startedAt = 0;
  protected _isRunningInBackground = false;

  get frame() {
    return this._frame;
  }

  set frame(frame) {
    this._frame = frame;
    this._onFrameChange(frame);
  }

  constructor(
    protected _src: RemotionSrc,
    protected _onFrameChange: (frame: number) => void,
    protected _onEnd: () => void,
  ) {
    this._frame = _src.initialFrame ?? 0;
    this._disposal.add(
      listenEvent(document, 'visibilitychange' as any, this._onVisibilityChange.bind(this)),
    );
  }

  play() {
    this._framesAdvanced = 0;
    this._playing = true;
    this._startedAt = performance.now();
    this._tick();
  }

  stop() {
    this._playing = false;

    if (this._rafId >= 0) {
      cancelAnimationFrame(this._rafId);
      this._rafId = -1;
    }

    if (this._timerId >= 0) {
      clearTimeout(this._timerId);
      this._timerId = -1;
    }
  }

  setPlaybackRate(rate: number) {
    this._playbackRate = rate;
  }

  destroy() {
    this._disposal.empty();
    this.stop();
  }

  protected _update() {
    const { nextFrame, framesToAdvance, ended } = this._calculateNextFrame();
    this._framesAdvanced += framesToAdvance;

    if (nextFrame !== this._frame) {
      this._onFrameChange(nextFrame);
      this._frame = nextFrame;
    }

    if (ended) {
      this._frame = this._src.outFrame!;
      this.stop();
      this._onEnd();
    }
  }

  protected _tick = () => {
    this._update();
    if (this._playing) {
      this._queueNextFrame(this._tick);
    }
  };

  protected _queueNextFrame(callback: () => void) {
    if (this._isRunningInBackground) {
      this._timerId = window.setTimeout(callback, 1000 / this._src.fps!);
    } else {
      this._rafId = requestAnimationFrame(callback);
    }
  }

  protected _calculateNextFrame() {
    const round = this._playbackRate < 0 ? Math.ceil : Math.floor,
      time = performance.now() - this._startedAt,
      framesToAdvance =
        round((time * this._playbackRate) / (1000 / this._src.fps!)) - this._framesAdvanced,
      nextFrame = framesToAdvance + this._frame,
      isCurrentFrameOutOfBounds =
        this._frame > this._src.outFrame! || this._frame < this._src.inFrame!,
      isNextFrameOutOfBounds = nextFrame > this._src.outFrame! || nextFrame < this._src.inFrame!,
      ended = isNextFrameOutOfBounds && !isCurrentFrameOutOfBounds;

    if (this._playbackRate > 0 && !ended) {
      // Play forwards
      if (isNextFrameOutOfBounds) {
        return {
          nextFrame: this._src.inFrame!,
          framesToAdvance,
          ended,
        };
      }

      return { nextFrame, framesToAdvance, ended };
    }

    // Reverse playback
    if (isNextFrameOutOfBounds) {
      return {
        nextFrame: this._src.outFrame!,
        framesToAdvance,
        ended,
      };
    }

    return { nextFrame, framesToAdvance, ended };
  }

  protected _onVisibilityChange() {
    this._isRunningInBackground = document.visibilityState === 'hidden';
    if (this._playing) {
      this.stop();
      this.play();
    }
  }
}
