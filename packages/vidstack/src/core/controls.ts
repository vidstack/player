import { effect, signal } from 'maverick.js';
import { isKeyboardEvent } from 'maverick.js/std';

import { isTouchPinchEvent } from '../utils/dom';
import { MediaPlayerController } from './api/player-controller';

export class MediaControls extends MediaPlayerController {
  private _idleTimer = -2;
  private _pausedTracking = false;
  private _hideOnMouseLeave = signal(false);
  private _isMouseOutside = signal(false);
  private _focusedItem: HTMLElement | null = null;
  private _canIdle = signal(true);

  /**
   * The default amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state (i.e., hide controls).
   *
   * @defaultValue 2000
   */
  defaultDelay = 2000;

  /**
   * Whether controls can hide after a delay in user interaction. If this is false, controls will
   * not hide and be user controlled.
   */
  get canIdle() {
    return this._canIdle();
  }

  set canIdle(canIdle: boolean) {
    this._canIdle.set(canIdle);
  }

  /**
   * Whether controls visibility should be toggled when the mouse enters and leaves the player
   * container.
   *
   * @defaultValue false
   */
  get hideOnMouseLeave() {
    const { hideControlsOnMouseLeave } = this.$props;
    return this._hideOnMouseLeave() || hideControlsOnMouseLeave();
  }

  set hideOnMouseLeave(hide) {
    this._hideOnMouseLeave.set(hide);
  }

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
    effect(this._init.bind(this));
  }

  private _init() {
    if (!this._canIdle()) return;

    effect(this._watchMouse.bind(this));
    effect(this._watchPaused.bind(this));

    const onPlay = this._onPlay.bind(this),
      onPause = this._onPause.bind(this);

    this.listen('can-play', (event) => this.show(0, event));
    this.listen('play', onPlay);

    this.listen('pause', onPause);
    this.listen('auto-play-fail', onPause);
  }

  private _watchMouse() {
    const { started, pointer, paused } = this.$state;
    if (!started() || pointer() !== 'fine') return;

    const shouldHideOnMouseLeave = this.hideOnMouseLeave;

    if (!shouldHideOnMouseLeave || !this._isMouseOutside()) {
      effect(() => {
        if (!paused()) this.listen('pointermove', this._onStopIdle.bind(this));
      });
    }

    if (shouldHideOnMouseLeave) {
      this.listen('mouseenter', this._onMouseEnter.bind(this));
      this.listen('mouseleave', this._onMouseLeave.bind(this));
    }
  }

  private _watchPaused() {
    const { paused, started, autoPlayError } = this.$state;
    if (paused() || (autoPlayError() && !started())) return;

    const onStopIdle = this._onStopIdle.bind(this);

    effect(() => {
      const pointer = this.$state.pointer(),
        isTouch = pointer === 'coarse',
        events = [isTouch ? 'touchend' : 'pointerup', 'keydown'] as const;

      for (const eventType of events) {
        this.listen(eventType, onStopIdle, { passive: false });
      }
    });
  }

  private _onPlay(event: Event) {
    this.show(0, event);
    this.hide(undefined, event);
  }

  private _onPause(event: Event) {
    this.show(0, event);
  }

  private _onMouseEnter(event: Event) {
    this._isMouseOutside.set(false);
    this.show(0, event);
    this.hide(undefined, event);
  }

  private _onMouseLeave(event: Event) {
    this._isMouseOutside.set(true);
    this.hide(0, event);
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
