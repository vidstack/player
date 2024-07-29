export class Queue<Items> {
  #queue = new Map<keyof Items, any>();

  /**
   * Queue the given `item` under the given `key` to be processed at a later time by calling
   * `serve(key)`.
   */
  enqueue<T extends keyof Items>(key: T, item: Items[T]) {
    this.#queue.set(key, item);
  }

  /**
   * Process item in queue for the given `key`.
   */
  serve<T extends keyof Items>(key: T): Items[T] | undefined {
    const value = this.peek(key);
    this.#queue.delete(key);
    return value;
  }

  /**
   * Peek at item in queue for the given `key`.
   */
  peek<T extends keyof Items>(key: T): Items[T] | undefined {
    return this.#queue.get(key);
  }

  /**
   * Removes queued item under the given `key`.
   */
  delete(key: keyof Items) {
    this.#queue.delete(key);
  }

  /**
   * Clear all items in the queue.
   */
  clear() {
    this.#queue.clear();
  }
}
