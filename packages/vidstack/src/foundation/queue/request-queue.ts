import { deferredPromise } from 'maverick.js/std';

export class RequestQueue {
  protected _serving = false;
  protected _pending = deferredPromise();
  protected _queue = new Map<string | symbol, () => void | Promise<void>>();

  /**
   * The number of callbacks that are currently in queue.
   */
  get _size(): number {
    return this._queue.size;
  }

  /**
   * Whether items in the queue are being served immediately, otherwise they're queued to
   * be processed later.
   */
  get _isServing() {
    return this._serving;
  }

  /**
   * Waits for the queue to be flushed (ie: start serving).
   */
  async _waitForFlush() {
    if (this._serving) return;
    await this._pending.promise;
  }

  /**
   * Queue the given `callback` to be invoked at a later time by either calling the `serve()` or
   * `start()` methods. If the queue has started serving (i.e., `start()` was already called),
   * then the callback will be invoked immediately.
   *
   * @param key - Uniquely identifies this callback so duplicates are ignored.
   * @param callback - The function to call when this item in the queue is being served.
   */
  _enqueue(key: string | symbol, callback: () => void) {
    if (this._serving) {
      callback();
      return;
    }

    // Delete the key so we can set it last so iteration order is correct.
    this._queue.delete(key);
    this._queue.set(key, callback);
  }

  /**
   * Invokes the callback with the given `key` in the queue (if it exists).
   */
  _serve(key: string | symbol) {
    this._queue.get(key)?.();
    this._queue.delete(key);
  }

  /**
   * Flush all queued items and start serving future requests immediately until `stop()` is called.
   */
  _start() {
    this._flush();
    this._serving = true;
    if (this._queue.size > 0) this._flush();
  }

  /**
   * Stop serving requests, they'll be queued until you begin processing again by calling `start()`.
   */
  _stop() {
    this._serving = false;
  }

  /**
   * Stop serving requests, empty the request queue, and release any promises waiting for the
   * queue to flush.
   */
  _reset() {
    this._stop();
    this._queue.clear();
    this._release();
  }

  protected _flush() {
    for (const key of this._queue.keys()) this._serve(key);
    this._release();
  }

  protected _release() {
    // Release anyone waiting.
    this._pending.resolve();
    this._pending = deferredPromise();
  }
}
