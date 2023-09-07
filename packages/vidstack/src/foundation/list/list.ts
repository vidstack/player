import { DOMEvent, EventsTarget } from 'maverick.js/std';

import { ListSymbol } from './symbols';

export interface ListItem {}

export class List<Item extends ListItem, Events extends ListEvents>
  extends EventsTarget<Events>
  implements Iterable<Item>
{
  [index: number]: Item | undefined;

  protected _items: Item[] = [];

  /* @internal */
  protected [ListSymbol._readonly] = false;
  /* @internal */
  protected [ListSymbol._onReset]?(trigger?: Event): void;
  /* @internal */
  protected [ListSymbol._onRemove]?(item: Item, trigger?: Event): void;

  get length() {
    return this._items.length;
  }

  get readonly() {
    return this[ListSymbol._readonly];
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
  [ListSymbol._add](item: Item, trigger?: Event): void {
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
  [ListSymbol._remove](item: Item, trigger?: Event): void {
    const index = this._items.indexOf(item);
    if (index >= 0) {
      this[ListSymbol._onRemove]?.(item, trigger);
      this._items.splice(index, 1);
      this.dispatchEvent(new DOMEvent<any>('remove', { detail: item, trigger }));
    }
  }

  /* @internal */
  [ListSymbol._reset](trigger?: Event): void {
    for (const item of [...this._items]) this[ListSymbol._remove](item, trigger);
    this._items = [];
    this[ListSymbol._setReadonly](false, trigger);
    this[ListSymbol._onReset]?.();
  }

  /* @internal */
  [ListSymbol._setReadonly](readonly: boolean, trigger?: Event) {
    if (this[ListSymbol._readonly] === readonly) return;
    this[ListSymbol._readonly] = readonly;
    this.dispatchEvent(new DOMEvent<any>('readonly-change', { detail: readonly, trigger }));
  }
}

export interface ListEvents<Item extends ListItem = ListItem> {
  add: ListAddEvent<Item>;
  remove: ListRemoveEvent<Item>;
  'readonly-change': ListReadonlyChangeEvent;
}

/**
 * Fired when an item has been added to the list.
 *
 * @detail item
 */
export interface ListAddEvent<Item extends ListItem> extends DOMEvent<Item> {}

/**
 * Fired when an item has been removed from the list.
 *
 * @detail item
 */
export interface ListRemoveEvent<Item extends ListItem> extends DOMEvent<Item> {}

/**
 * Fired when the readonly state of the list has changed.
 *
 * @detail isReadonly
 */
export interface ListReadonlyChangeEvent extends DOMEvent<boolean> {}
