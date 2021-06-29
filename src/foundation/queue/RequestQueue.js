import { deferredPromise } from '../../utils/promise.js';

/**
 * @template {string} RequestKey
 * @template {() => void | Promise <void>} RequestCallback
 */
export class RequestQueue {
  /**
   * @protected
   * @type {Map<RequestKey, RequestCallback>}
   */
  requestQueue = new Map();

  /**
   * @protected
   */
  pendingFlush = deferredPromise();

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
    return this.requestQueue.size;
  }

  /**
   * Returns a clone of the current request queue.
   *
   * @returns {Map<RequestKey, RequestCallback>}
   */
  cloneQueue() {
    return new Map(this.requestQueue);
  }

  /**
   * Waits for the queue to be flushed.
   *
   * @returns {Promise<void>}
   */
  async waitForFlush() {
    if (this.serveImmediately) return;
    await this.pendingFlush.promise;
  }

  /**
   * @param {RequestKey} key
   * @param {RequestCallback} callback
   * @returns {Promise<void>}
   */
  async queue(key, callback) {
    this.requestQueue.set(key, callback);
    if (!this.serveImmediately) return;
    this.serve(key);
  }

  /**
   * @param {RequestKey} key
   * @returns {Promise<void>}
   */
  async serve(key) {
    await this.requestQueue.get(key)?.();
    this.requestQueue.delete(key);
  }

  /**
   * @returns {Promise<void>}
   */
  async flush() {
    const requests = Array.from(this.requestQueue.keys());
    await Promise.all(requests.map((reqKey) => this.serve(reqKey)));
    this.reset();
  }

  /**
   * @returns {void}
   */
  reset() {
    this.requestQueue.clear();
    // Release anyone waiting.
    this.pendingFlush.resolve();
    this.pendingFlush = deferredPromise();
  }

  /**
   * @returns {void}
   */
  destroy() {
    this.serveImmediately = false;
    this.reset();
  }
}
