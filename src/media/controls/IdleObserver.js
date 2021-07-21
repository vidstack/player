import { EventListenerController } from '../../foundation/events/index.js';
import { controlsContext } from './context.js';
import {
  IdleChangeEvent,
  PauseIdleTrackingRequestEvent,
  ResumeIdleTrackingRequestEvent
} from './events.js';

/**
 * @typedef {import('lit').ReactiveElement} IdleObserverHost
 */

/**
 * Tracks user activity and determines when they are idle/inactive. Elements can dispatch requests
 * to pause/resume tracking idle state.
 */
export class IdleObserver {
  /**
   * @param {IdleObserverHost} host
   */
  constructor(host) {
    /**
     * @protected
     * @readonly
     * @type {IdleObserverHost}
     */
    this._host = host;

    /**
     * @protected
     * @readonly
     */
    this._idle = controlsContext.idle.provide(host);

    /**
     * @protected
     * @readonly
     * @type {EventListenerController}
     */
    this[Symbol(EventListenerController.name)] = new EventListenerController(
      this._host,
      {
        focus: this.pause,
        blur: this.resume,
        keydown: this._handleUserInteraction,
        click: this._handleUserInteraction,
        pointermove: this._handleUserInteraction,
        [PauseIdleTrackingRequestEvent.TYPE]: this._handlePauseIdleTracking,
        [ResumeIdleTrackingRequestEvent.TYPE]: this._handleResumeIdleTracking
      },
      { receiver: this }
    );
  }

  /**
   * Prevent an `idle` state occurring.
   *
   * @protected
   * @type {boolean}
   */
  _preventIdling = false;

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
    return this._idle.value;
  }

  /**
   * @protected
   * @param {Event} [request]
   */
  _handleUserInteraction(request) {
    this.start(request);
  }

  /**
   * @protected
   * @type {number}
   */
  _timeoutId = -1;

  /**
   * Start tracking idle state. If `pause` is called this method will do nothing until `resume`
   * is called.
   *
   * @param {Event} [request]
   */
  start(request) {
    this.stop(request);
    if (this._preventIdling) return;
    this._timeoutId = window.setTimeout(() => {
      this._idle.value = true;
      this._handleIdleChange(request);
    }, this.timeout);
  }

  /**
   * Enables tracking idle state to resume.
   *
   * @param {Event} [request]
   */
  resume(request) {
    this._preventIdling = false;
    this.start(request);
  }

  /**
   * Pause tracking idle state. Prevents further idle states to occur until `resume` is called.
   *
   * @param {Event} [request]
   */
  pause(request) {
    this._preventIdling = true;
    this.stop(request);
  }

  /**
   * Stop idling.
   *
   * @param {Event} [request]
   */
  stop(request) {
    window.clearTimeout(this._timeoutId);
    this._idle.value = false;
    this._handleIdleChange(request);
  }

  /**
   * @private
   * @type {boolean}
   */
  _prevIdleValue = controlsContext.idle.initialValue;

  /**
   * @protected
   * @param {Event} [request]
   */
  _handleIdleChange(request) {
    if (this._idle.value === this._prevIdleValue) return;

    this._host.dispatchEvent(
      new IdleChangeEvent({
        originalEvent: request,
        detail: this.isIdle
      })
    );

    this._prevIdleValue = this._idle.value;
  }

  /**
   * @protected
   * @param {Event} request
   */
  _handlePauseIdleTracking(request) {
    request.stopPropagation();
    this.pause();
  }

  /**
   * @protected
   * @param {Event} request
   */
  _handleResumeIdleTracking(request) {
    request.stopPropagation();
    this.resume();
  }
}
