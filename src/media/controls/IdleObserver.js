import {
  bindEventListeners,
  DisposalBin
} from '../../foundation/events/index.js';
import {
  HideControlsRequestEvent,
  ShowControlsRequestEvent
} from '../index.js';
import { controlsContext } from './context.js';
import { IdleChangeEvent } from './events.js';

/**
 * @typedef {import('lit').ReactiveElement} IdleObserverHost
 */

/**
 * Tracks user activity and determines when they are idle/inactive. This observer will also
 * dispatch show/hide controls request events for the `ControlsManager` to act accordingly.
 */
export class IdleObserver {
  /**
   * @protected
   * @readonly
   */
  disconnectDisposal = new DisposalBin();

  /**
   * @param {IdleObserverHost} host
   */
  constructor(host) {
    /**
     * @protected
     * @readonly
     * @type {IdleObserverHost}
     */
    this.host = host;

    /**
     * @protected
     * @readonly
     */
    this.idle = controlsContext.idle.provide(host);

    host.addController({
      hostConnected: this.handleHostConnected.bind(this),
      hostDisconnected: this.handleHostDisconnected.bind(this)
    });
  }

  /**
   * Prevent an `idle` state occurring.
   *
   * @protected
   * @type {boolean}
   */
  preventIdling = false;

  /**
   * The amount of time in `ms` to pass before considering the user to be idle.
   *
   * @type {number}
   */
  timeout = 3000;

  /**
   * Whether there has been no user activity for the given `timeout` period or greater.
   *
   * @type {boolean}
   */
  get isIdle() {
    return this.idle.value;
  }

  /**
   * @protected
   */
  handleHostConnected() {
    const events = {
      focus: this.pause,
      blur: this.resume,
      keydown: this.handleUserInteraction,
      click: this.handleUserInteraction,
      pointermove: this.handleUserInteraction
    };

    bindEventListeners(this.host, events, this.disconnectDisposal, {
      receiver: this
    });
  }

  /**
   * @protected
   */
  handleHostDisconnected() {
    this.disconnectDisposal.empty();
  }

  /**
   * @protected
   * @param {Event} [request]
   */
  handleUserInteraction(request) {
    this.start(request);
  }

  /**
   * @protected
   * @type {number}
   */
  timeoutId = -1;

  /**
   * Start tracking idle state. If `pause` is called this method will do nothing until `resume`
   * is called.
   *
   * @param {Event} [request]
   */
  start(request) {
    this.stop(request);
    if (this.preventIdling) return;
    this.timeoutId = window.setTimeout(() => {
      this.idle.value = true;
      this.handleIdleChange(request);
      this.host.dispatchEvent(
        new HideControlsRequestEvent({
          originalEvent: request
        })
      );
    }, this.timeout);
  }

  /**
   * Enables tracking idle state to resume.
   *
   * @param {Event} [request]
   */
  resume(request) {
    this.preventIdling = false;
    this.start(request);
  }

  /**
   * Pause tracking idle state. Prevents further idle states to occur until `resume` is called.
   *
   * @param {Event} [request]
   */
  pause(request) {
    this.preventIdling = true;
    this.stop(request);
  }

  /**
   * Stop idling.
   *
   * @param {Event} [request]
   */
  stop(request) {
    window.clearTimeout(this.timeoutId);
    this.idle.value = false;
    this.handleIdleChange(request);
    this.host.dispatchEvent(
      new ShowControlsRequestEvent({
        originalEvent: request
      })
    );
  }

  /**
   * @protected
   * @param {Event} [request]
   */
  handleIdleChange(request) {
    if (this.idle.value === this.isIdle) return;

    this.idle.value = this.isIdle;

    this.host.dispatchEvent(
      new IdleChangeEvent({
        originalEvent: request,
        detail: this.isIdle
      })
    );
  }
}
