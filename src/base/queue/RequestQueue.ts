import { deferredPromise } from '../../utils/promise';

/**
 * @template {string|symbol} RequestKey
 * @template {() => void | Promise <void>} RequestCallback
 */
export class RequestQueue<
  RequestKey extends string | symbol,
  RequestCallback extends () => void | Promise<void>
> {
  protected _requestQueue = new Map<RequestKey, RequestCallback>();

  protected _pendingFlush = deferredPromise();

  /**
   * Whether callbacks should be called immediately or queued and flushed at a later time.
   */
  serveImmediately = false;

  /**
   * The number of callbacks that are currently in queue.
   */
  get size(): number {
    return this._requestQueue.size;
  }

  /**
   * Returns a clone of the current request queue.
   */
  cloneQueue(): Map<RequestKey, RequestCallback> {
    return new Map(this._requestQueue);
  }

  /**
   * Waits for the queue to be flushed.
   */
  async waitForFlush(): Promise<void> {
    if (this.serveImmediately) return;
    await this._pendingFlush.promise;
  }

  async queue(key: RequestKey, callback: RequestCallback): Promise<void> {
    this._requestQueue.set(key, callback);
    if (!this.serveImmediately) return;
    this.serve(key);
  }

  async serve(key: RequestKey): Promise<void> {
    await this._requestQueue.get(key)?.();
    this._requestQueue.delete(key);
  }

  async flush(): Promise<void> {
    const requests = Array.from(this._requestQueue.keys());
    await Promise.all(requests.map((reqKey) => this.serve(reqKey)));
    this.reset();
  }

  reset(): void {
    this._requestQueue.clear();
    // Release anyone waiting.
    this._pendingFlush.resolve();
    this._pendingFlush = deferredPromise();
  }

  destroy(): void {
    this.serveImmediately = false;
    this.reset();
  }
}
