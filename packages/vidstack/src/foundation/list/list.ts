import { DOMEvent } from 'maverick.js/std';

import {
  LIST_ADD,
  LIST_AUTO_SELECT,
  LIST_REMOVE,
  LIST_RESET,
  LIST_SET_AUTO,
  LIST_SET_READONLY,
  LIST_SET_SELECTED,
} from './symbols';

const ITEMS = Symbol(__DEV__ ? 'ITEMS' : 0);
const SELECTED = Symbol(__DEV__ ? 'SELECTED' : 0);
const AUTO = Symbol(__DEV__ ? 'AUTO' : 0);
const READONLY = Symbol(__DEV__ ? 'READONLY' : 0);

export interface ListItem {
  selected: boolean;
}

export class List<Item extends ListItem> extends EventTarget implements Iterable<Item> {
  private [ITEMS]: Item[] = [];

  get length() {
    return this[ITEMS].length;
  }

  get readonly() {
    return this[READONLY];
  }

  get auto() {
    return this[AUTO] || this.readonly;
  }

  get selected() {
    return this[ITEMS].find((item) => item.selected) ?? null;
  }

  get selectedIndex() {
    return this[ITEMS].findIndex((item) => item.selected);
  }

  /**
   * Return item at given `index`.
   */
  at(index: number): Item | null {
    return this[ITEMS][index] ?? null;
  }

  /**
   * Transform list to an array.
   */
  toArray(): Item[] {
    return [...this[ITEMS]];
  }

  /**
   * Requests automatic item selection (if supported). This will be a no-op if the list is
   * `readonly` as that already implies auto-selection.
   */
  requestAutoSelect(trigger?: Event): void {
    if (this.readonly || this[AUTO] || !this[LIST_AUTO_SELECT]) return;
    this[LIST_AUTO_SELECT]();
    this[LIST_SET_AUTO](true, trigger);
  }

  [Symbol.iterator]() {
    return this[ITEMS].values();
  }

  /** @internal */
  [AUTO] = false;

  /** @internal */
  [READONLY] = false;

  /** @internal */
  [LIST_AUTO_SELECT]?: () => void;

  /** @internal */
  [LIST_ADD](item: Omit<Item, 'selected'>, trigger?: Event): void {
    Object.defineProperty(item, 'selected', {
      get() {
        return this[SELECTED]!;
      },
      set: (selected: boolean) => {
        if (this.readonly) return;
        this[LIST_SET_AUTO](false, trigger);
        this[LIST_SET_SELECTED](item as Item, selected, trigger);
      },
    });

    this[ITEMS].push(item as Item);
    this.dispatchEvent(new DOMEvent<any>('add', { detail: item, trigger }));
  }

  /** @internal */
  [LIST_REMOVE](item: Item, trigger?: Event): void {
    const index = this[ITEMS].indexOf(item);
    if (index >= 0) {
      item.selected = false;
      this[ITEMS].splice(index, 1);
      this.dispatchEvent(new DOMEvent<any>('remove', { detail: item, trigger }));
    }
  }

  /** @internal */
  [LIST_RESET](trigger?: Event): void {
    for (const item of [...this[ITEMS]]) this[LIST_REMOVE](item, trigger);
    this[ITEMS] = [];
    this[LIST_SET_AUTO](false, trigger);
    this[LIST_SET_READONLY](false, trigger);
  }

  /** @internal */
  [LIST_SET_AUTO](auto: boolean, trigger?: Event) {
    if (this[AUTO] === auto) return;
    this[AUTO] = auto;
    this.dispatchEvent(new DOMEvent<any>('auto-change', { detail: auto, trigger }));
  }

  /** @internal */
  [LIST_SET_READONLY](readonly: boolean, trigger?: Event) {
    if (this[READONLY] === readonly) return;
    this[READONLY] = readonly;
    this.dispatchEvent(new DOMEvent<any>('readonly-change', { detail: readonly, trigger }));
  }

  /** @internal */
  [LIST_SET_SELECTED](item: Item, selected: boolean, trigger?: Event) {
    if (selected === item[SELECTED]) return;

    const prev = this.selected;
    item[SELECTED] = selected;

    const changed = !selected ? prev === item : prev !== item;
    if (changed) {
      if (prev) prev[SELECTED] = false;
      this.dispatchEvent(
        new DOMEvent<ListChangeEventDetail<Item>>('change', {
          detail: { prev, current: this.selected! },
          trigger,
        }),
      );
    }
  }

  override addEventListener<Type extends keyof ListEvents>(
    type: Type,
    callback:
      | ((event: ListEvents<Item>[Type]) => void)
      | { handleEvent(event: ListEvents<Item>[Type]): void }
      | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    super.addEventListener(type, callback as any, options);
  }

  override removeEventListener<Type extends keyof ListEvents>(
    type: Type,
    callback:
      | ((event: ListEvents<Item>[Type]) => void)
      | { handleEvent(event: ListEvents<Item>[Type]): void }
      | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    super.removeEventListener(type, callback as any, options);
  }
}

export interface ListEvents<Item extends ListItem = ListItem> {
  add: ListAddEvent<Item>;
  remove: ListRemoveEvent<Item>;
  change: ListChangeEvent<Item>;
  'auto-change': ListAutoChangeEvent;
  'readonly-change': ListReadonlyChangeEvent;
}

export interface ListAddEvent<Item extends ListItem> extends DOMEvent<Item> {}

export interface ListRemoveEvent<Item extends ListItem> extends DOMEvent<Item> {}

export interface ListChangeEvent<Item extends ListItem>
  extends DOMEvent<ListChangeEventDetail<Item>> {}

export interface ListChangeEventDetail<Item extends ListItem> {
  prev: Item | null;
  current: Item;
}

export interface ListAutoChangeEvent extends DOMEvent<boolean> {}

export interface ListReadonlyChangeEvent extends DOMEvent<boolean> {}
