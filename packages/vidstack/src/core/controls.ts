import { effect } from 'maverick.js';
import { isKeyboardEvent, isTouchEvent, listenEvent } from 'maverick.js/std';

import { isTouchPinchEvent } from '../utils/dom';
import { MediaPlayerController } from './api/player-controller';

export class MediaControls extends MediaPlayerController {
  private _idleTimer = -2;
  private _pausedTracking = false;
  private _focusedItem: HTMLElement | null = null;

  /**
   * The default amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state (i.e., hide controls).
   *
   * @defaultValue 2000
   */
  defaultDelay = 2000;

  /**
   * Whether media controls are currently visible.
   */
  get showing() {
    return this.$state.controlsVisible();
  }

  /**
   * Show controls.
   */
  show(delay = 0, trigger?: Event) {
    this._clearIdleTimer();
    if (!this._pausedTracking) {
      this._changeVisibility(true, delay, trigger);
    }
  }

  /**
   * Hide controls.
   */
  hide(delay = this.defaultDelay, trigger?: Event) {
    this._clearIdleTimer();
    if (!this._pausedTracking) {
      this._changeVisibility(false, delay, trigger);
    }
  }

  /**
   * Whether all idle tracking on controls should be paused until resumed again.
   */
  pause(trigger?: Event) {
    this._pausedTracking = true;
    this._clearIdleTimer();
    this._changeVisibility(true, 0, trigger);
  }

  resume(trigger?: Event) {
    this._pausedTracking = false;
    if (this.$state.paused()) return;
    this._changeVisibility(false, this.defaultDelay, trigger);
  }

  protected override onConnect() {
    effect(this._watchPaused.bind(this));

    const onPlay = this._onPlay.bind(this),
      onPause = this._onPause.bind(this);

    this.listen('can-play', (event) => this.show(0, event));
    this.listen('play', onPlay);

    this.listen('pause', onPause);
    this.listen('autoplay-fail', onPause);
  }

  private _watchPaused() {
    const { paused, started, autoplayError } = this.$state;
    if (paused() || (autoplayError() && !started())) return;

    const onStopIdle = this._onStopIdle.bind(this);

    effect(() => {
      const pointer = this.$state.pointer(),
        isTouch = pointer === 'coarse',
        events = [isTouch ? 'touchend' : 'pointerup', 'keydown'] as const;

      for (const eventType of events) {
        listenEvent(this.el!, eventType, onStopIdle, { passive: false });
      }

      if (!isTouch) {
        listenEvent(this.el!, 'pointermove', onStopIdle);
      }
    });
  }

  private _onPlay(event: Event) {
    this.show(0, event);
    this.hide(this.defaultDelay, event);
  }

  private _onPause(event: Event) {
    this.show(0, event);
  }

  private _clearIdleTimer() {
    window.clearTimeout(this._idleTimer);
    this._idleTimer = -1;
  }

  private _onStopIdle(event: Event) {
    if (
      // @ts-expect-error
      event.MEDIA_GESTURE ||
      this._pausedTracking ||
      isTouchPinchEvent(event)
    ) {
      return;
    }

    if (isKeyboardEvent(event)) {
      if (event.key === 'Escape') {
        this.el?.focus();
        this._focusedItem = null;
      } else if (this._focusedItem) {
        event.preventDefault();
        requestAnimationFrame(() => {
          this._focusedItem?.focus();
          this._focusedItem = null;
        });
      }
    }

    this.show(0, event);
    this.hide(this.defaultDelay, event);
  }

  private _changeVisibility(visible: boolean, delay: number, trigger?: Event) {
    if (delay === 0) {
      this._onChange(visible, trigger);
      return;
    }

    this._idleTimer = window.setTimeout(() => {
      if (!this.scope) return;
      this._onChange(visible && !this._pausedTracking, trigger);
    }, delay);
  }

  private _onChange(visible: boolean, trigger?: Event) {
    if (this.$state.controlsVisible() === visible) return;

    this.$state.controlsVisible.set(visible);

    if (!visible && document.activeElement && this.el?.contains(document.activeElement)) {
      this._focusedItem = document.activeElement as HTMLElement;
      requestAnimationFrame(() => this.el?.focus());
    }

    this.dispatch('controls-change', {
      detail: visible,
      trigger,
    });
  }
}
