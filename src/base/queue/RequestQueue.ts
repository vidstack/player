import { deferredPromise } from '../../utils/promise';

export class RequestQueue {
  protected readonly _requestQueue = new Map<
    string | symbol,
    () => void | Promise<void>
  >();

  protected _pendingFlush = deferredPromise();

  protected _isServing = false;

  /**
   * Whether items in the queue are being served immediately, otherwise they're queued to
   * be processed later.
   */
  get isServing() {
    return this._isServing;
  }

  /**
   * The number of callbacks that are currently in queue.
   */
  get size(): number {
    return this._requestQueue.size;
  }

  /**
   * Waits for the queue to be flushed (ie: start serving).
   */
  async waitForFlush() {
    if (this._isServing) return;
    await this._pendingFlush.promise;
  }

  async queue(key: string | symbol, callback: () => void | Promise<void>) {
    this._requestQueue.set(key, callback);
    if (this._isServing) this.serve(key);
  }

  async serve(key: string | symbol) {
    await this._requestQueue.get(key)?.();
    this._requestQueue.delete(key);
  }

  /**
   * Start serving requests.
   */
  async start() {
    await this._flush();
    this._isServing = true;
    if (this._requestQueue.size > 0) await this._flush();
  }

  protected async _flush() {
    const requests = Array.from(this._requestQueue.keys());
    await Promise.all(requests.map((reqKey) => this.serve(reqKey)));
    this._release();
  }

  protected _empty() {
    this._requestQueue.clear();
  }

  protected _release() {
    // Release anyone waiting.
    this._pendingFlush.resolve();
    this._pendingFlush = deferredPromise();
  }

  /**
   * Stop serving requests, they'll be queued until you begin processing again by calling
   * `start()`.
   */
  stop() {
    this._isServing = false;
  }

  destroy() {
    this.stop();
    this._empty();
    this._release();
  }
}
