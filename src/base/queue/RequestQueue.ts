import { ReactiveControllerHost } from 'lit';

import { DEV_MODE } from '../../env';
import { deferredPromise } from '../../utils/promise';
import { Logger } from '../logger';

export interface RequestQueueOptions {
  /**
   * Provide a name for debugging purposes.
   */
  name?: string;
  /**
   * Provide the owner of this queue for debugging purposes.
   */
  owner?: any;
}

export class RequestQueue {
  protected readonly _logger?: Logger;

  protected readonly _requestQueue = new Map<
    string | symbol,
    () => void | Promise<void>
  >();

  protected _pendingFlush = deferredPromise();

  get name() {
    return this._options.name;
  }

  constructor(
    _host?: ReactiveControllerHost,
    protected readonly _options: RequestQueueOptions = {}
  ) {
    if (DEV_MODE && _host && _options.name) {
      const className = _options.owner ? ` [${this.constructor.name}]` : '';
      this._logger = new Logger(_host, {
        owner: _options.owner ?? this,
        name: `️⌛ ${this.name}${className}`
      });
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
  cloneQueue(): Map<string | symbol, () => void | Promise<void>> {
    return new Map(this._requestQueue);
  }

  /**
   * Waits for the queue to be flushed.
   */
  async waitForFlush(): Promise<void> {
    if (this.serveImmediately) return;
    await this._pendingFlush.promise;
  }

  async queue(
    key: string | symbol,
    callback: () => void | Promise<void>
  ): Promise<void> {
    this._requestQueue.set(key, callback);

    if (DEV_MODE && this.name && !this.serveImmediately) {
      this._logger?.debug(`queued \`${String(key)}\``);
    }

    if (!this.serveImmediately) return;
    this.serve(key);
  }

  async serve(key: string | symbol): Promise<void> {
    if (DEV_MODE && this.name) {
      this._logger?.debug(`serving \`${String(key)}\``);
    }

    await this._requestQueue.get(key)?.();
    this._requestQueue.delete(key);
  }

  async flush(): Promise<void> {
    const requests = Array.from(this._requestQueue.keys());
    await Promise.all(requests.map((reqKey) => this.serve(reqKey)));
    this._flush();

    if (DEV_MODE && this.name) {
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

    if (DEV_MODE && this.name) {
      this._logger?.info('reset');
    }
  }

  destroy(): void {
    this.serveImmediately = false;
    this.reset();

    if (DEV_MODE && this.name) {
      this._logger?.info('destroy');
    }
  }
}
