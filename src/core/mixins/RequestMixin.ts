import { listen } from '@wcom/events';
import { UpdatingElement } from 'lit-element';

import { Constructor } from '../../shared/types';
import { deferredPromise } from '../../utils/promise';
import {
  ConnectEvent,
  DisconnectEvent,
  ErrorEvent,
  PlaybackReadyEvent,
} from '../player.events';
import { MediaProvider } from '../provider/MediaProvider';

export type RequestMixinBase = Constructor<UpdatingElement>;

export type RequestKey = string;

export type RequestAction = () => void | Promise<void>;

export type RequestQueue = Map<RequestKey, RequestAction>;

export type RequestCocktail<T extends RequestMixinBase> = T &
  Constructor<{
    /**
     * Returns a clone of the current request queue.
     */
    getRequestQueue(): RequestQueue;

    /**
     * Waits for the current request queue to be flushed.
     */
    waitForRequestQueueToFlush(): Promise<void>;

    /**
     * This method will attempt to make a request if the current provider is ready
     * for playback, otherwise it'll queue the request to be fulfilled when the
     * `ProviderPlaybackReadyEvent` is fired.
     *
     * @param requestKey - A unique key to identify the request.
     * @param action - The action to be performed when the request is fulfilled.
     */
    makeRequest(requestKey: RequestKey, action: RequestAction): void;
  }>;

/**
 * Mixes in the ability to make requests that are contingent on the provider being ready. If
 * the provider is not ready, requests are queued and flushed once the
 * `ProviderPlaybackReadyEvent` is fired.
 *
 * @param Base - the constructor to mix into.
 */
export function RequestMixin<T extends RequestMixinBase>(
  Base: T,
): RequestCocktail<T> {
  class RequestMixin extends Base {
    /**
     * Requests are queued if called before media is ready for playback. Once the media is
     * ready (`ProviderPlaybackReadyEvent`) the queue is flushed. Each request is associated with
     * a request key to avoid making duplicate requests of the same "type".
     */
    protected requestQueue: RequestQueue = new Map();

    protected requestProvider?: MediaProvider;

    protected pendingRequestQueueFlush = deferredPromise();

    getRequestQueue(): RequestQueue {
      return new Map(this.requestQueue);
    }

    async waitForRequestQueueToFlush(): Promise<void> {
      await this.pendingRequestQueueFlush.promise;
    }

    protected async safelyMakeRequest(requestKey: string): Promise<void> {
      try {
        await this.requestQueue.get(requestKey)?.();
      } catch (e) {
        this.dispatchEvent(new ErrorEvent({ detail: e }));
      }

      this.requestQueue.delete(requestKey);
      this.requestUpdate();
    }

    makeRequest(requestKey: RequestKey, request: RequestAction): void {
      this.requestQueue.set(requestKey, request);

      if (!this.requestProvider?.isPlaybackReady) return;

      this.safelyMakeRequest(requestKey);
      this.requestQueue.delete(requestKey);
    }

    protected async flushRequestQueue(): Promise<void> {
      const requests = Array.from(this.requestQueue.keys());
      await Promise.all(requests.map(reqKey => this.safelyMakeRequest(reqKey)));
      this.requestQueue.clear();
      this.pendingRequestQueueFlush.resolve();
    }

    @listen(ConnectEvent.TYPE)
    protected async handleRequestConnect(e: ConnectEvent): Promise<void> {
      this.requestProvider = e.detail;
    }

    @listen(PlaybackReadyEvent.TYPE)
    protected async handleFlushRequestQueue(): Promise<void> {
      await this.flushRequestQueue();
    }

    @listen(DisconnectEvent.TYPE)
    protected handleResetRequestQueue(): void {
      this.requestProvider = undefined;
      this.requestQueue.clear();
      // Release anyone waiting.
      this.pendingRequestQueueFlush.resolve();
      this.pendingRequestQueueFlush = deferredPromise();
    }
  }

  return RequestMixin;
}
