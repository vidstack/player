/**
 * A disposal bin used to add cleanup callbacks that can be called when required.
 */
export class DisposalBin {
  // @ts-expect-error
  protected _disposal: (() => void)[] = this._disposal ?? [];

  add(...callbacks: (() => void)[]) {
    if (callbacks) {
      callbacks.forEach((cb) => {
        this._disposal.push(cb);
      });
    }
  }

  /**
   * Dispose callbacks.
   */
  empty() {
    this._disposal.forEach((fn) => fn());
    this._disposal = [];
  }
}
