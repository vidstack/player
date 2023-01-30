export class Queue<QueueRecord> {
  protected _queue = new Map<keyof QueueRecord, Set<any>>();

  /**
   * Queue the given `item` under the given `key` to be processed at a later time by calling
   * `serve(key)`.
   */
  _enqueue<T extends keyof QueueRecord>(key: T, item: QueueRecord[T]) {
    if (!this._queue.has(key)) this._queue.set(key, new Set());
    this._queue.get(key)!.add(item);
  }

  /**
   * Process all items in queue for the given `key`.
   */
  _serve<T extends keyof QueueRecord>(key: T, callback: (item: QueueRecord[T]) => void) {
    const items = this._queue.get(key);
    if (items) for (const item of items) callback(item);
    this._queue.delete(key);
  }

  /**
   * Removes all queued items under the given `key`.
   */
  _delete(key: keyof QueueRecord) {
    this._queue.delete(key);
  }

  /**
   * The number of items currently queued under the given `key`.
   */
  _size(key: keyof QueueRecord) {
    return this._queue.get(key)?.size ?? 0;
  }

  /**
   * Clear all items in the queue.
   */
  _reset() {
    this._queue.clear();
  }
}
