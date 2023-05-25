import { effect } from 'maverick.js';
import { ComponentController } from 'maverick.js/element';
import { listenEvent } from 'maverick.js/std';

import type { PlayerAPI } from './player';

export class MediaUserController extends ComponentController<PlayerAPI> {
  private _idleTimer = -2;
  private _delay = 2000;
  private _pausedTracking = false;

  /**
   * Whether the media user is currently idle.
   */
  get idling() {
    return this.$store.userIdle();
  }

  /**
   * The amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state.
   *
   * @defaultValue 2000
   */
  get idleDelay() {
    return this._delay;
  }

  set idleDelay(newDelay) {
    this._delay = newDelay;
  }

  /**
   * Change the user idle state.
   */
  idle(idle: boolean, delay = this._delay, trigger?: Event) {
    this._clearIdleTimer();
    if (!this._pausedTracking) this._requestIdleChange(idle, delay, trigger);
  }

  /**
   * Whether all idle tracking should be paused until resumed again.
   */
  pauseIdleTracking(paused: boolean, trigger?: Event) {
    this._pausedTracking = paused;
    if (paused) {
      this._clearIdleTimer();
      this._requestIdleChange(false, 0, trigger);
    }
  }

  protected override onConnect() {
    effect(this._watchPaused.bind(this));
    listenEvent(this.el!, 'play', this._onMediaPlay.bind(this));
    listenEvent(this.el!, 'pause', this._onMediaPause.bind(this));
  }

  private _watchPaused() {
    if (this.$store.paused()) return;

    const onStopIdle = this._onStopIdle.bind(this);

    for (const eventType of ['pointerup', 'keydown'] as const) {
      listenEvent(this.el!, eventType, onStopIdle);
    }

    effect(() => {
      if (!this.$store.touchPointer()) listenEvent(this.el!, 'pointermove', onStopIdle);
    });
  }

  private _onMediaPlay(event: Event) {
    this.idle(true, this._delay, event);
  }

  private _onMediaPause(event) {
    this.idle(false, 0, event);
  }

  private _clearIdleTimer() {
    window.clearTimeout(this._idleTimer);
    this._idleTimer = -1;
  }

  private _onStopIdle(event: Event) {
    // @ts-expect-error
    if (event.MEDIA_GESTURE) return;
    this.idle(false, 0, event);
    this.idle(true, this._delay, event);
  }

  private _requestIdleChange(idle: boolean, delay: number, trigger?: Event) {
    if (delay === 0) {
      this._onIdleChange(idle, trigger);
      return;
    }

    this._idleTimer = window.setTimeout(() => {
      this._onIdleChange(idle && !this._pausedTracking, trigger);
    }, delay);
  }

  private _onIdleChange(idle: boolean, trigger?: Event) {
    if (this.$store.userIdle() === idle) return;
    this.$store.userIdle.set(idle);
    this.dispatch('user-idle-change', {
      detail: idle,
      trigger,
    });
  }
}
