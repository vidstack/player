import { debounce, DisposalBin, listen, type ReadableStore, vdsEvent } from '@vidstack/foundation';
import { type ReactiveController, type ReactiveControllerHost } from 'lit';

export class UserIdleController implements ReactiveController {
  protected _idle = false;
  protected _idleTimeout?: any;
  protected _mediaPaused = false;
  protected _idlingPaused = false;
  protected _disposal = new DisposalBin();

  /**
   * The amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state.
   *
   * @default 2000
   */
  delay = 2000;

  /**
   * Whether media idle state tracking has been paused.
   */
  get paused() {
    return this._idlingPaused || this._mediaPaused;
  }

  set paused(paused) {
    this._idlingPaused = paused;
    this._handleIdleChange();
  }

  constructor(
    protected readonly _host: ReactiveControllerHost & EventTarget,
    protected readonly _mediaStore: { paused: ReadableStore<boolean> },
  ) {
    _host.addController(this);
  }

  hostConnected() {
    this._disposal.add(
      this._mediaStore.paused.subscribe(($paused) => {
        this._mediaPaused = $paused;
        this._handleIdleChange();
      }),
    );

    const startIdleTimerEvents = ['pointerdown', 'pointermove', 'focus', 'keydown'] as const;

    startIdleTimerEvents.forEach((eventType) => {
      const off = listen(
        this._host,
        eventType,
        debounce(this._handleIdleChange.bind(this), 250, true),
      );

      this._disposal.add(off);
    });
  }

  hostDisconnected() {
    this._disposal.empty();
    this._stopIdleTimer();
  }

  protected _handleIdleChange() {
    if (this.paused) {
      this._stopIdleTimer();
    } else {
      this._startIdleTimer();
    }
  }

  protected _startIdleTimer() {
    this._stopIdleTimer();
    this._idleTimeout = window.setTimeout(() => {
      this._dispatchIdleChange(!this.paused);
    }, this.delay);
  }

  protected _stopIdleTimer() {
    window.clearTimeout(this._idleTimeout);
    this._idleTimeout = undefined;
    this._dispatchIdleChange(false);
  }

  protected _dispatchIdleChange(isIdle: boolean) {
    if (this._idle !== isIdle) {
      this._host.dispatchEvent(vdsEvent('vds-user-idle-change', { detail: isIdle }));
      this._idle = isIdle;
    }
  }
}
