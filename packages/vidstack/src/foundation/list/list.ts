import { DOMEvent, EventsTarget } from 'maverick.js/std';

import { ListSymbol } from './symbols';

export interface ListItem {
  id: string;
}

export class List<Item extends ListItem, Events extends ListEvents>
  extends EventsTarget<Events>
  implements Iterable<Item>
{
  [index: number]: Item | undefined;

  protected items: Item[] = [];

  /** @internal */
  protected [ListSymbol.readonly] = false;
  /** @internal */
  protected [ListSymbol.onReset]?(trigger?: Event): void;
  /** @internal */
  protected [ListSymbol.onRemove]?(item: Item, trigger?: Event): void;

  get length() {
    return this.items.length;
  }

  get readonly() {
    return this[ListSymbol.readonly];
  }

  /**
   * Returns the index of the first occurrence of the given item, or -1 if it is not present.
   */
  indexOf(item: Item) {
    return this.items.indexOf(item);
  }

  /**
   * Returns an item matching the given `id`, or `null` if not present.
   */
  getById(id: string): Item | null {
    if (id === '') return null;
    return this.items.find((item) => item.id === id) ?? null;
  }

  /**
   * Transform list to an array.
   */
  toArray(): Item[] {
    return [...this.items];
  }

  [Symbol.iterator]() {
    return this.items.values();
  }

  /** @internal */
  [ListSymbol.add](item: Item, trigger?: Event): void {
    const index = this.items.length;

    if (!('' + index in this)) {
      Object.defineProperty(this, index, {
        get() {
          return this.items[index];
        },
      });
    }

    if (this.items.includes(item as Item)) return;

    this.items.push(item as Item);
    this.dispatchEvent(new DOMEvent<any>('add', { detail: item, trigger }));
  }

  /** @internal */
  [ListSymbol.remove](item: Item, trigger?: Event): void {
    const index = this.items.indexOf(item);
    if (index >= 0) {
      this[ListSymbol.onRemove]?.(item, trigger);
      this.items.splice(index, 1);
      this.dispatchEvent(new DOMEvent<any>('remove', { detail: item, trigger }));
    }
  }

  /** @internal */
  [ListSymbol.reset](trigger?: Event): void {
    for (const item of [...this.items]) this[ListSymbol.remove](item, trigger);
    this.items = [];
    this[ListSymbol.setReadonly](false, trigger);
    this[ListSymbol.onReset]?.();
  }

  /** @internal */
  [ListSymbol.setReadonly](readonly: boolean, trigger?: Event) {
    if (this[ListSymbol.readonly] === readonly) return;
    this[ListSymbol.readonly] = readonly;
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
