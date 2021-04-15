import { deferredPromise } from '../../utils/promise';

export class RequestQueue<
  RequestKey = string,
  RequestCallback extends () => void = () => void | Promise<void>
> {
  protected requestQueue = new Map<RequestKey, RequestCallback>();

  protected pendingFlush = deferredPromise();

  /**
   * Whether callbacks should be called immediately or queued and flushed at a later time.
   */
  serveImmediately = false;

  /**
   * The number of callbacks that are currently in queue.
   */
  get size(): number {
    return this.requestQueue.size;
  }

  /**
   * Returns a clone of the current request queue.
   */
  cloneQueue(): Map<RequestKey, RequestCallback> {
    return new Map(this.requestQueue);
  }

  /**
   * Waits for the queue to be flushed.
   */
  async waitForFlush(): Promise<void> {
    if (this.serveImmediately) return;
    await this.pendingFlush.promise;
  }

  async queue(key: RequestKey, callback: RequestCallback): Promise<void> {
    this.requestQueue.set(key, callback);
    if (!this.serveImmediately) return;
    this.serve(key);
  }

  async serve(key: RequestKey): Promise<void> {
    await this.requestQueue.get(key)?.();
    this.requestQueue.delete(key);
  }

  async flush(): Promise<void> {
    const requests = Array.from(this.requestQueue.keys());
    await Promise.all(requests.map(reqKey => this.serve(reqKey)));
    this.reset();
  }

  reset(): void {
    this.requestQueue.clear();
    // Release anyone waiting.
    this.pendingFlush.resolve();
    this.pendingFlush = deferredPromise();
  }

  destroy(): void {
    this.serveImmediately = false;
    this.reset();
  }
}
