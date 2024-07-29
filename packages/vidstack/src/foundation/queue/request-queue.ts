import { deferredPromise } from 'maverick.js/std';

export class RequestQueue {
  #serving = false;
  #pending = deferredPromise();
  #queue = new Map<string | symbol, () => void | Promise<void>>();

  /**
   * The number of callbacks that are currently in queue.
   */
  get size(): number {
    return this.#queue.size;
  }

  /**
   * Whether items in the queue are being served immediately, otherwise they're queued to
   * be processed later.
   */
  get isServing() {
    return this.#serving;
  }

  /**
   * Waits for the queue to be flushed (ie: start serving).
   */
  async waitForFlush() {
    if (this.#serving) return;
    await this.#pending.promise;
  }

  /**
   * Queue the given `callback` to be invoked at a later time by either calling the `serve()` or
   * `start()` methods. If the queue has started serving (i.e., `start()` was already called),
   * then the callback will be invoked immediately.
   *
   * @param key - Uniquely identifies this callback so duplicates are ignored.
   * @param callback - The function to call when this item in the queue is being served.
   */
  enqueue(key: string | symbol, callback: () => void) {
    if (this.#serving) {
      callback();
      return;
    }

    // Delete the key so we can set it last so iteration order is correct.
    this.#queue.delete(key);
    this.#queue.set(key, callback);
  }

  /**
   * Invokes the callback with the given `key` in the queue (if it exists).
   */
  serve(key: string | symbol) {
    this.#queue.get(key)?.();
    this.#queue.delete(key);
  }

  /**
   * Flush all queued items and start serving future requests immediately until `stop()` is called.
   */
  start() {
    this.#flush();
    this.#serving = true;
    if (this.#queue.size > 0) this.#flush();
  }

  /**
   * Stop serving requests, they'll be queued until you begin processing again by calling `start()`.
   */
  stop() {
    this.#serving = false;
  }

  /**
   * Stop serving requests, empty the request queue, and release any promises waiting for the
   * queue to flush.
   */
  reset() {
    this.stop();
    this.#queue.clear();
    this.#release();
  }

  #flush() {
    for (const key of this.#queue.keys()) this.serve(key);
    this.#release();
  }

  #release() {
    // Release anyone waiting.
    this.#pending.resolve();
    this.#pending = deferredPromise();
  }
}
