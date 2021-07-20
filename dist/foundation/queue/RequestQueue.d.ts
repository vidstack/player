/**
 * @template {string|symbol} RequestKey
 * @template {() => void | Promise <void>} RequestCallback
 */
export class RequestQueue<RequestKey extends string | symbol, RequestCallback extends () => void | Promise<void>> {
    /**
     * @protected
     * @type {Map<RequestKey, RequestCallback>}
     */
    protected requestQueue: Map<RequestKey, RequestCallback>;
    /**
     * @protected
     */
    protected pendingFlush: import("../../utils/promise.js").DeferredPromise<any, any>;
    /**
     * Whether callbacks should be called immediately or queued and flushed at a later time.
     */
    serveImmediately: boolean;
    /**
     * The number of callbacks that are currently in queue.
     *
     * @type {number}
     */
    get size(): number;
    /**
     * Returns a clone of the current request queue.
     *
     * @returns {Map<RequestKey, RequestCallback>}
     */
    cloneQueue(): Map<RequestKey, RequestCallback>;
    /**
     * Waits for the queue to be flushed.
     *
     * @returns {Promise<void>}
     */
    waitForFlush(): Promise<void>;
    /**
     * @param {RequestKey} key
     * @param {RequestCallback} callback
     * @returns {Promise<void>}
     */
    queue(key: RequestKey, callback: RequestCallback): Promise<void>;
    /**
     * @param {RequestKey} key
     * @returns {Promise<void>}
     */
    serve(key: RequestKey): Promise<void>;
    /**
     * @returns {Promise<void>}
     */
    flush(): Promise<void>;
    /**
     */
    reset(): void;
    /**
     */
    destroy(): void;
}
