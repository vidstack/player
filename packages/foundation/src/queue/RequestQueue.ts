import { deferredPromise } from '../utils/promise';

export class RequestQueue {
  protected readonly _requestQueue = new Map<string | symbol, () => void | Promise<void>>();

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

  /**
   * Queue the given `callback` to be invoked at a later time by either calling the `serve()` or
   * `start()` methods. If the queue has started serving (i.e., `start()` was already called),
   * then the callback will be invoked immediately.
   *
   * @param key - Uniquely identifies this callback so duplicates are ignored.
   * @param callback - The function to call when this item in the queue is being served.
   */
  async queue(key: string | symbol, callback: () => void | Promise<void>) {
    if (this._isServing) {
      await callback();
      return;
    }

    this._requestQueue.set(key, callback);
  }

  /**
   * Invokes the callback with the given `key` in the queue (if it exists).
   */
  async serve(key: string | symbol) {
    await this._requestQueue.get(key)?.();
    this._requestQueue.delete(key);
  }

  /**
   * Flush all queued items and start serving future requests immediately until `stop()` is called.
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

  /**
   * Stop serving requests, empty the request queue, and release any promises waiting for the
   * queue to flush.
   */
  destroy() {
    this.stop();
    this._empty();
    this._release();
  }
}
