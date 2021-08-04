import { ReactiveControllerHost } from 'lit';

import { DEV_MODE } from '../../env';
import { deferredPromise } from '../../utils/promise';
import { Logger } from '../logger';

/**
 * @template {string|symbol} RequestKey
 * @template {() => void | Promise <void>} RequestCallback
 */
export class RequestQueue<
  RequestKey extends string | symbol = string | symbol,
  RequestCallback extends () => void | Promise<void> = () => void | Promise<void>
> {
  protected _logger?: Logger;

  protected _requestQueue = new Map<RequestKey, RequestCallback>();

  protected _pendingFlush = deferredPromise();

  constructor(_host?: ReactiveControllerHost, _name?: string) {
    if (DEV_MODE && _host) {
      this._logger = new Logger(_host, { owner: this, name: `⌛ ${_name}` });
    }
  }

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

    if (DEV_MODE && !this.serveImmediately) {
      this._logger?.debug(`queued \`${key}\``);
    }

    if (!this.serveImmediately) return;
    this.serve(key);
  }

  async serve(key: RequestKey): Promise<void> {
    if (DEV_MODE) {
      this._logger?.debug(`serving \`${key}\``);
    }

    await this._requestQueue.get(key)?.();
    this._requestQueue.delete(key);
  }

  async flush(): Promise<void> {
    const requests = Array.from(this._requestQueue.keys());
    await Promise.all(requests.map((reqKey) => this.serve(reqKey)));
    this._flush();

    if (DEV_MODE) {
      this._logger?.info('flush');
    }
  }

  protected _flush() {
    this._requestQueue.clear();
    // Release anyone waiting.
    this._pendingFlush.resolve();
    this._pendingFlush = deferredPromise();
  }

  reset(): void {
    this._flush();

    if (DEV_MODE) {
      this._logger?.info('reset');
    }
  }

  destroy(): void {
    this.serveImmediately = false;
    this.reset();

    if (DEV_MODE) {
      this._logger?.info('destroy');
    }
  }
}
