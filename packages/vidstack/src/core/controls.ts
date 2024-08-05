import { effect, signal } from 'maverick.js';
import { DOMEvent, EventsController, isKeyboardEvent } from 'maverick.js/std';

import { isTouchPinchEvent } from '../utils/dom';
import { MediaPlayerController } from './api/player-controller';

export class MediaControls extends MediaPlayerController {
  #idleTimer = -2;
  #pausedTracking = false;
  #hideOnMouseLeave = signal(false);
  #isMouseOutside = signal(false);
  #focusedItem: HTMLElement | null = null;
  #canIdle = signal(true);

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
    return this.#canIdle();
  }

  set canIdle(canIdle: boolean) {
    this.#canIdle.set(canIdle);
  }

  /**
   * Whether controls visibility should be toggled when the mouse enters and leaves the player
   * container.
   *
   * @defaultValue false
   */
  get hideOnMouseLeave() {
    const { hideControlsOnMouseLeave } = this.$props;
    return this.#hideOnMouseLeave() || hideControlsOnMouseLeave();
  }

  set hideOnMouseLeave(hide) {
    this.#hideOnMouseLeave.set(hide);
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
    this.#clearIdleTimer();
    if (!this.#pausedTracking) {
      this.#changeVisibility(true, delay, trigger);
    }
  }

  /**
   * Hide controls.
   */
  hide(delay = this.defaultDelay, trigger?: Event) {
    this.#clearIdleTimer();
    if (!this.#pausedTracking) {
      this.#changeVisibility(false, delay, trigger);
    }
  }

  /**
   * Whether all idle tracking on controls should be paused until resumed again.
   */
  pause(trigger?: Event) {
    this.#pausedTracking = true;
    this.#clearIdleTimer();
    this.#changeVisibility(true, 0, trigger);
  }

  resume(trigger?: Event) {
    this.#pausedTracking = false;
    if (this.$state.paused()) return;
    this.#changeVisibility(false, this.defaultDelay, trigger);
  }

  protected override onConnect() {
    effect(this.#init.bind(this));
  }

  #init() {
    const { viewType } = this.$state;

    if (!this.el || !this.#canIdle()) return;

    if (viewType() === 'audio') {
      this.show();
      return;
    }

    effect(this.#watchMouse.bind(this));
    effect(this.#watchPaused.bind(this));

    const onPlay = this.#onPlay.bind(this),
      onPause = this.#onPause.bind(this),
      onEnd = this.#onEnd.bind(this);

    new EventsController(this.el as unknown as MediaPlayerController)
      .add('can-play', (event) => this.show(0, event))
      .add('play', onPlay)
      .add('pause', onPause)
      .add('end', onEnd)
      .add('auto-play-fail', onPause);
  }

  #watchMouse() {
    if (!this.el) return;

    const { started, pointer, paused } = this.$state;
    if (!started() || pointer() !== 'fine') return;

    const events = new EventsController(this.el),
      shouldHideOnMouseLeave = this.hideOnMouseLeave;

    if (!shouldHideOnMouseLeave || !this.#isMouseOutside()) {
      effect(() => {
        if (!paused()) events.add('pointermove', this.#onStopIdle.bind(this));
      });
    }

    if (shouldHideOnMouseLeave) {
      events
        .add('mouseenter', this.#onMouseEnter.bind(this))
        .add('mouseleave', this.#onMouseLeave.bind(this));
    }
  }

  #watchPaused() {
    const { paused, started, autoPlayError } = this.$state;
    if (paused() || (autoPlayError() && !started())) return;

    const onStopIdle = this.#onStopIdle.bind(this);

    effect(() => {
      if (!this.el) return;

      const pointer = this.$state.pointer(),
        isTouch = pointer === 'coarse',
        events = new EventsController(this.el),
        eventTypes = [isTouch ? 'touchend' : 'pointerup', 'keydown'] as const;

      for (const eventType of eventTypes) {
        events.add(eventType, onStopIdle, { passive: false });
      }
    });
  }

  #onPlay(event: DOMEvent) {
    // Looping.
    if (event.triggers.hasType('ended')) return;
    this.show(0, event);
    this.hide(undefined, event);
  }

  #onPause(event: DOMEvent) {
    this.show(0, event);
  }

  #onEnd(event: DOMEvent) {
    const { loop } = this.$state;
    if (loop()) this.hide(0, event);
  }

  #onMouseEnter(event: Event) {
    this.#isMouseOutside.set(false);
    this.show(0, event);
    this.hide(undefined, event);
  }

  #onMouseLeave(event: Event) {
    this.#isMouseOutside.set(true);
    this.hide(0, event);
  }

  #clearIdleTimer() {
    window.clearTimeout(this.#idleTimer);
    this.#idleTimer = -1;
  }

  #onStopIdle(event: Event) {
    if (
      // @ts-expect-error
      event.MEDIA_GESTURE ||
      this.#pausedTracking ||
      isTouchPinchEvent(event)
    ) {
      return;
    }

    if (isKeyboardEvent(event)) {
      if (event.key === 'Escape') {
        this.el?.focus();
        this.#focusedItem = null;
      } else if (this.#focusedItem) {
        event.preventDefault();
        requestAnimationFrame(() => {
          this.#focusedItem?.focus();
          this.#focusedItem = null;
        });
      }
    }

    this.show(0, event);
    this.hide(this.defaultDelay, event);
  }

  #changeVisibility(visible: boolean, delay: number, trigger?: Event) {
    if (delay === 0) {
      this.#onChange(visible, trigger);
      return;
    }

    this.#idleTimer = window.setTimeout(() => {
      if (!this.scope) return;
      this.#onChange(visible && !this.#pausedTracking, trigger);
    }, delay);
  }

  #onChange(visible: boolean, trigger?: Event) {
    if (this.$state.controlsVisible() === visible) return;

    this.$state.controlsVisible.set(visible);

    if (!visible && document.activeElement && this.el?.contains(document.activeElement)) {
      this.#focusedItem = document.activeElement as HTMLElement;
      requestAnimationFrame(() => {
        this.el?.focus({ preventScroll: true });
      });
    }

    this.dispatch('controls-change', {
      detail: visible,
      trigger,
    });
  }
}
