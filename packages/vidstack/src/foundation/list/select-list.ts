import { DOMEvent } from 'maverick.js/std';

import { List, type ListEvents, type ListItem } from './list';
import { LIST_ADD, LIST_ON_REMOVE, LIST_ON_USER_SELECT, LIST_SELECT } from './symbols';

const SELECTED = Symbol(__DEV__ ? 'SELECTED' : 0);

export interface SelectListItem extends ListItem {
  selected: boolean;
}

export class SelectList<
  Item extends SelectListItem,
  Events extends SelectListEvents<Item>,
> extends List<Item, Events> {
  get selected() {
    return this._items.find((item) => item.selected) ?? null;
  }

  get selectedIndex() {
    return this._items.findIndex((item) => item.selected);
  }

  /* @internal */
  protected override [LIST_ON_REMOVE](item: Item, trigger?: Event): void {
    this[LIST_SELECT](item, false, trigger);
  }

  /* @internal */
  protected [LIST_ON_USER_SELECT]?(): void;

  /* @internal */
  override [LIST_ADD](item: Omit<Item, 'selected'>, trigger?: Event) {
    item[SELECTED] = false;
    Object.defineProperty(item, 'selected', {
      get() {
        return this[SELECTED]!;
      },
      set: (selected: boolean) => {
        if (this.readonly) return;
        this[LIST_ON_USER_SELECT]?.();
        this[LIST_SELECT](item as Item, selected);
      },
    });

    super[LIST_ADD](item as Item, trigger);
  }

  /* @internal */
  [LIST_SELECT](item: Item, selected: boolean, trigger?: Event) {
    if (selected === item[SELECTED]) return;

    const prev = this.selected;
    item[SELECTED] = selected;

    const changed = !selected ? prev === item : prev !== item;
    if (changed) {
      if (prev) prev[SELECTED] = false;
      this.dispatchEvent(
        new DOMEvent<SelectListChangeEventDetail<Item>>('change', {
          detail: { prev, current: this.selected! },
          trigger,
        }),
      );
    }
  }
}

export interface SelectListEvents<Item extends SelectListItem = SelectListItem>
  extends ListEvents<Item> {
  change: SelectListChangeEvent<Item>;
}

export interface SelectListChangeEvent<Item extends SelectListItem>
  extends DOMEvent<SelectListChangeEventDetail<Item>> {}

export interface SelectListChangeEventDetail<Item extends SelectListItem> {
  prev: Item | null;
  current: Item;
}
