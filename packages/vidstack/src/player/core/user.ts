import { computed, effect, peek, signal } from 'maverick.js';
import { ComponentController } from 'maverick.js/element';
import { listenEvent } from 'maverick.js/std';

import type { PlayerAPI } from './player';

const STOP_IDLE_EVENTS = ['pointerup', 'pointermove', 'focus', 'keydown', 'playing'] as const;

export class MediaUserController extends ComponentController<PlayerAPI> {
  private _idleTimeout: any;
  private _delay = 2000;
  private _trigger: Event | undefined;
  private _idle = signal(false);
  private _userPaused = signal(false);
  private _paused = computed(() => this._userPaused() || this.$store.paused());

  /**
   * Whether the media user is currently idle.
   */
  get idling() {
    return this._idle();
  }

  /**
   * Whether idle state tracking has been paused.
   */
  get idlePaused() {
    return this._userPaused();
  }

  set idlePaused(paused) {
    this._userPaused.set(paused);
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

  protected override onConnect() {
    effect(this._watchPaused.bind(this));
    effect(this._watchIdle.bind(this));
  }

  protected override onDisconnect() {
    this._idle.set(false);
  }

  private _watchPaused() {
    if (this._paused()) return;
    for (const eventType of STOP_IDLE_EVENTS) {
      listenEvent(this.el!, eventType, this._stopIdling.bind(this));
    }
  }

  private _watchIdle() {
    window.clearTimeout(this._idleTimeout);
    const idle = this._idle() && !this._paused();

    this.$store.userIdle.set(idle);

    this.dispatch('user-idle-change', {
      detail: idle,
      trigger: this._trigger,
    });

    this._trigger = undefined;
  }

  private _stopIdling(event: Event) {
    if (this._idle()) this._trigger = event;
    this._idle.set(false);
    window.clearTimeout(this._idleTimeout);
    this._idleTimeout = window.setTimeout(() => this._idle.set(!peek(this._paused)), this._delay);
  }
}
