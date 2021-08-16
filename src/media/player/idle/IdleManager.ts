import { ReactiveElement } from 'lit';

import { DisposalBin, listen, vdsEvent } from '../../../base/events';
import { Logger } from '../../../base/logger';
import { DEV_MODE } from '../../../global/env';
import { keysOf } from '../../../utils/object';
import { mediaContext } from '../../context';
import { MediaController } from '../../controller';

export type IdleManagerHost = ReactiveElement & {
  readonly controller: MediaController;
};

/**
 * Tracks user activity and determines when they are idle/inactive. Elements can dispatch requests
 * to pause/resume tracking idle state.
 */
export class IdleManager {
  protected readonly _disconnectDisposal: DisposalBin;

  protected readonly _logger!: Logger;

  constructor(protected readonly _host: IdleManagerHost) {
    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger = new Logger(_host, { owner: this });
    }
    /* c8 ignore stop */

    this._disconnectDisposal = new DisposalBin(
      _host,
      /* c8 ignore next */
      DEV_MODE && { name: 'disconnectDisposal', owner: this }
    );

    _host.addController({
      hostConnected: () => {
        const eventHandlers = {
          focus: this.pause,
          blur: this.resume,
          keydown: this._handleUserInteraction,
          click: this._handleUserInteraction,
          pointermove: this._handleUserInteraction,
          'vds-resume-idle-tracking-request': this._handleResumeIdleTracking,
          'vds-pause-idle-tracking-request': this._handlePauseIdleTracking
        };

        keysOf(eventHandlers).forEach((eventType) => {
          const handler = eventHandlers[eventType].bind(this);
          const dispose = listen(_host, eventType, handler);
          this._disconnectDisposal.add(dispose);
        });
      },

      hostDisconnected: () => {
        this._disconnectDisposal.empty();
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
    return this._host.controller.mediaCtx.idle;
  }

  protected _handleUserInteraction(request?: Event) {
    this.start(request);
  }

  protected _timeoutId = -1;

  protected _setIdleContext(isIdle: boolean) {
    this._host.controller.mediaCtx.idle = isIdle;
  }

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
      this._setIdleContext(true);
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
    this._setIdleContext(false);
    this._handleIdleChange(request);
  }

  private _prevIdleValue = mediaContext.idle.initialValue;

  protected _handleIdleChange(request?: Event) {
    if (this.isIdle === this._prevIdleValue) return;

    this._host.dispatchEvent(
      vdsEvent('vds-idle-change', {
        originalEvent: request,
        detail: this.isIdle
      })
    );

    this._prevIdleValue = this.isIdle;
  }

  protected _handleResumeIdleTracking(request?: Event) {
    request?.stopPropagation();

    /* c8 ignore start */
    if (DEV_MODE && request) {
      this._logger
        .debugGroup(`📬 received \`${request.type}\``)
        .appendWithLabel('Request', request)
        .end();
    }
    /* c8 ignore stop */

    this.resume();
  }

  protected _handlePauseIdleTracking(request?: Event) {
    request?.stopPropagation();

    /* c8 ignore start */
    if (DEV_MODE && request) {
      this._logger
        .debugGroup(`📬 received \`${request.type}\``)
        .appendWithLabel('Request', request)
        .end();
    }
    /* c8 ignore stop */

    this.pause();
  }
}
