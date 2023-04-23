import { isNumber, isUndefined } from 'maverick.js/std';

export class RAFLoop {
  private _id: number | undefined;

  constructor(private _callback: () => void) {}

  _start() {
    // Time updates are already in progress.
    if (!isUndefined(this._id)) return;
    this._loop();
  }

  _stop() {
    if (isNumber(this._id)) window.cancelAnimationFrame(this._id);
    this._id = undefined;
  }

  private _loop() {
    this._id = window.requestAnimationFrame(() => {
      if (isUndefined(this._id)) return;
      this._callback();
      this._loop();
    });
  }
}
