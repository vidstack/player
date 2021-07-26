import { deferredPromise } from '@utils/promise.js';

/**
 * @template {string|symbol} RequestKey
 * @template {() => void | Promise <void>} RequestCallback
 */
export class RequestQueue {
  /**
   * @protected
   * @type {Map<RequestKey, RequestCallback>}
   */
  _requestQueue = new Map();

  /**
   * @protected
   */
  _pendingFlush = deferredPromise();

  /**
   * Whether callbacks should be called immediately or queued and flushed at a later time.
   */
  serveImmediately = false;

  /**
   * The number of callbacks that are currently in queue.
   *
   * @type {number}
   */
  get size() {
    return this._requestQueue.size;
  }

  /**
   * Returns a clone of the current request queue.
   *
   * @returns {Map<RequestKey, RequestCallback>}
   */
  cloneQueue() {
    return new Map(this._requestQueue);
  }

  /**
   * Waits for the queue to be flushed.
   *
   * @returns {Promise<void>}
   */
  async waitForFlush() {
    if (this.serveImmediately) return;
    await this._pendingFlush.promise;
  }

  /**
   * @param {RequestKey} key
   * @param {RequestCallback} callback
   * @returns {Promise<void>}
   */
  async queue(key, callback) {
    this._requestQueue.set(key, callback);
    if (!this.serveImmediately) return;
    this.serve(key);
  }

  /**
   * @param {RequestKey} key
   * @returns {Promise<void>}
   */
  async serve(key) {
    await this._requestQueue.get(key)?.();
    this._requestQueue.delete(key);
  }

  /**
   * @returns {Promise<void>}
   */
  async flush() {
    const requests = Array.from(this._requestQueue.keys());
    await Promise.all(requests.map((reqKey) => this.serve(reqKey)));
    this.reset();
  }

  /**
   * @returns {void}
   */
  reset() {
    this._requestQueue.clear();
    // Release anyone waiting.
    this._pendingFlush.resolve();
    this._pendingFlush = deferredPromise();
  }

  /**
   * @returns {void}
   */
  destroy() {
    this.serveImmediately = false;
    this.reset();
  }
}
