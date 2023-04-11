import { DOMEvent } from 'maverick.js/std';

import {
  LIST_ADD,
  LIST_ON_REMOVE,
  LIST_ON_RESET,
  LIST_READONLY,
  LIST_REMOVE,
  LIST_RESET,
  LIST_SET_READONLY,
} from './symbols';

export interface ListItem {}

export class List<Item extends ListItem> extends EventTarget implements Iterable<Item> {
  [index: number]: Item | undefined;

  protected _items: Item[] = [];

  /* @internal */
  protected [LIST_READONLY] = false;
  /* @internal */
  protected [LIST_ON_RESET]?(trigger?: Event): void;
  /* @internal */
  protected [LIST_ON_REMOVE]?(item: Item, trigger?: Event): void;

  get length() {
    return this._items.length;
  }

  get readonly() {
    return this[LIST_READONLY];
  }

  /**
   * Transform list to an array.
   */
  toArray(): Item[] {
    return [...this._items];
  }

  [Symbol.iterator]() {
    return this._items.values();
  }

  /* @internal */
  [LIST_ADD](item: Item, trigger?: Event): void {
    const index = this._items.length;
    if (!('' + index in this)) {
      Object.defineProperty(this, index, {
        get() {
          return this._items[index];
        },
      });
    }
    if (this._items.includes(item as Item)) return;
    this._items.push(item as Item);
    this.dispatchEvent(new DOMEvent<any>('add', { detail: item, trigger }));
  }

  /* @internal */
  [LIST_REMOVE](item: Item, trigger?: Event): void {
    const index = this._items.indexOf(item);
    if (index >= 0) {
      this[LIST_ON_REMOVE]?.(item, trigger);
      this._items.splice(index, 1);
      this.dispatchEvent(new DOMEvent<any>('remove', { detail: item, trigger }));
    }
  }

  /* @internal */
  [LIST_RESET](trigger?: Event): void {
    for (const item of [...this._items]) this[LIST_REMOVE](item, trigger);
    this._items = [];
    this[LIST_SET_READONLY](false, trigger);
    this[LIST_ON_RESET]?.();
  }

  /* @internal */
  [LIST_SET_READONLY](readonly: boolean, trigger?: Event) {
    if (this[LIST_READONLY] === readonly) return;
    this[LIST_READONLY] = readonly;
    this.dispatchEvent(new DOMEvent<any>('readonly-change', { detail: readonly, trigger }));
  }

  override addEventListener<Type extends keyof ListEvents<Item>>(
    type: Type,
    callback:
      | ((event: ListEvents<Item>[Type]) => void)
      | { handleEvent(event: ListEvents<Item>[Type]): void }
      | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    super.addEventListener(type as any, callback as any, options);
  }

  override removeEventListener<Type extends keyof ListEvents<Item>>(
    type: Type,
    callback:
      | ((event: ListEvents<Item>[Type]) => void)
      | { handleEvent(event: ListEvents<Item>[Type]): void }
      | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    super.removeEventListener(type as any, callback as any, options);
  }
}

export interface ListEvents<Item extends ListItem = ListItem> {
  add: ListAddEvent<Item>;
  remove: ListRemoveEvent<Item>;
  'readonly-change': ListReadonlyChangeEvent;
}

/**
 * Fired when an item has been added to the list.
 */
export interface ListAddEvent<Item extends ListItem> extends DOMEvent<Item> {}

/**
 * Fired when an item has been removed from the list.
 */
export interface ListRemoveEvent<Item extends ListItem> extends DOMEvent<Item> {}

/**
 * Fired when the readonly state of the list has changed.
 */
export interface ListReadonlyChangeEvent extends DOMEvent<boolean> {}
