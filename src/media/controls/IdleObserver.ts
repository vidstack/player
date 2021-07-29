import { ReactiveElement } from 'lit';

import { DisposalBin, listen, vdsEvent } from '../../base/events';
import { keysOf } from '../../utils/object';
import { controlsContext } from './context';

/**
 * Tracks user activity and determines when they are idle/inactive. Elements can dispatch requests
 * to pause/resume tracking idle state.
 */
export class IdleObserver {
  constructor(
    protected readonly _host: ReactiveElement,
    protected readonly _idle = controlsContext.idle.provide(_host),
    protected readonly _disposal = new DisposalBin()
  ) {
    _host.addController({
      hostConnected: () => {
        const eventHandlers = {
          focus: this.pause,
          blur: this.resume,
          keydown: this._handleUserInteraction,
          click: this._handleUserInteraction,
          pointermove: this._handleUserInteraction,
          'vds-pause-idle-tracking': this._handlePauseIdleTracking,
          'vds-resume-idle-tracking': this._handleResumeIdleTracking
        };

        keysOf(eventHandlers).forEach((eventType) => {
          const handler = eventHandlers[eventType].bind(this);
          const dispose = listen(_host, eventType, handler);
          this._disposal.add(dispose);
        });
      },

      hostDisconnected: () => {
        this._disposal.empty();
      }
    });
  }

  /**
   * Prevent an `idle` state occurring.
   */
  protected _preventIdling = false;

  /**
   * The amount of time in `ms` to pass before considering the user to be idle.
   */
  timeout = 3000;

  /**
   * Whether there has been no user activity for the given `timeout` period or greater.
   */
  get isIdle(): boolean {
    return this._idle.value;
  }

  protected _handleUserInteraction(request?: Event) {
    this.start(request);
  }

  protected _timeoutId = -1;

  /**
   * Start tracking idle state. If `pause` is called this method will do nothing until `resume`
   * is called.
   *
   * @param request
   */
  start(request?: Event) {
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
   * @param request
   */
  resume(request?: Event) {
    this._preventIdling = false;
    this.start(request);
  }

  /**
   * Pause tracking idle state. Prevents further idle states to occur until `resume` is called.
   *
   * @param request
   */
  pause(request?: Event) {
    this._preventIdling = true;
    this.stop(request);
  }

  /**
   * Stop idling.
   *
   * @param request
   */
  stop(request?: Event) {
    window.clearTimeout(this._timeoutId);
    this._idle.value = false;
    this._handleIdleChange(request);
  }

  private _prevIdleValue = controlsContext.idle.initialValue;

  protected _handleIdleChange(request?: Event) {
    if (this._idle.value === this._prevIdleValue) return;

    this._host.dispatchEvent(
      vdsEvent('vds-idle-change', {
        originalEvent: request,
        detail: this.isIdle
      })
    );

    this._prevIdleValue = this._idle.value;
  }

  protected _handlePauseIdleTracking(request?: Event) {
    request?.stopPropagation();
    this.pause();
  }

  protected _handleResumeIdleTracking(request?: Event) {
    request?.stopPropagation();
    this.resume();
  }
}
