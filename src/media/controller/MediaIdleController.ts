import debounce from 'just-debounce-it';
import type { ReactiveController, ReactiveControllerHost } from 'lit';

import { DisposalBin, listen, vdsEvent } from '../../base/events';
import type { ReadableStore } from '../../base/stores';

export class MediaIdleController implements ReactiveController {
  protected _idle = false;
  protected _idleTimeout?: any;
  protected _mediaPaused = false;
  protected _disposal = new DisposalBin();

  /**
   * The amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state.
   *
   * @default 2500
   */
  delay = 2500;

  constructor(
    protected readonly _host: ReactiveControllerHost & EventTarget,
    protected readonly _mediaStore: { paused: ReadableStore<boolean> }
  ) {
    _host.addController(this);
  }

  hostConnected() {
    this._disposal.add(
      this._mediaStore.paused.subscribe(($paused) => {
        this._mediaPaused = $paused;
        this._handleIdleChange();
      })
    );

    const startIdleTimerEvents = [
      'pointerdown',
      'pointermove',
      'focus',
      'keydown'
    ] as const;

    startIdleTimerEvents.forEach((eventType) => {
      const off = listen(
        this._host,
        eventType,
        debounce(this._handleIdleChange.bind(this), 250, true)
      );

      this._disposal.add(off);
    });
  }

  hostDisconnected() {
    this._disposal.empty();
    this._stopIdleTimer();
  }

  protected _handleIdleChange() {
    if (this._mediaPaused) {
      this._stopIdleTimer();
    } else {
      this._startIdleTimer();
    }
  }

  protected _startIdleTimer() {
    this._stopIdleTimer();
    this._idleTimeout = window.setTimeout(() => {
      this._dispatchIdleChange(!this._mediaPaused);
    }, this.delay);
  }

  protected _stopIdleTimer() {
    window.clearTimeout(this._idleTimeout);
    this._idleTimeout = undefined;
    this._dispatchIdleChange(false);
  }

  protected _dispatchIdleChange(isIdle: boolean) {
    if (this._idle !== isIdle) {
      this._host.dispatchEvent(vdsEvent('vds-idle-change', { detail: isIdle }));
      this._idle = isIdle;
    }
  }
}
