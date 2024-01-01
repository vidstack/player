export class Queue<Items> {
  protected _queue = new Map<keyof Items, any>();

  /**
   * Queue the given `item` under the given `key` to be processed at a later time by calling
   * `serve(key)`.
   */
  _enqueue<T extends keyof Items>(key: T, item: Items[T]) {
    this._queue.set(key, item);
  }

  /**
   * Process item in queue for the given `key`.
   */
  _serve<T extends keyof Items>(key: T): Items[T] | undefined {
    const value = this._peek(key);
    this._queue.delete(key);
    return value;
  }

  /**
   * Peek at item in queue for the given `key`.
   */
  _peek<T extends keyof Items>(key: T): Items[T] | undefined {
    return this._queue.get(key);
  }

  /**
   * Removes queued item under the given `key`.
   */
  _delete(key: keyof Items) {
    this._queue.delete(key);
  }

  /**
   * Clear all items in the queue.
   */
  _clear() {
    this._queue.clear();
  }
}
