import { DOMEvent } from 'maverick.js/std';

import { List, type ListEvents, type ListItem } from './list';
import { ListSymbol } from './symbols';

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
  protected override [ListSymbol._onRemove](item: Item, trigger?: Event): void {
    this[ListSymbol._select](item, false, trigger);
  }

  /* @internal */
  protected [ListSymbol._onUserSelect]?(): void;

  /* @internal */
  override [ListSymbol._add](item: Omit<Item, 'selected'>, trigger?: Event) {
    item[SELECTED] = false;
    Object.defineProperty(item, 'selected', {
      get() {
        return this[SELECTED]!;
      },
      set: (selected: boolean) => {
        if (this.readonly) return;
        this[ListSymbol._onUserSelect]?.();
        this[ListSymbol._select](item as Item, selected);
      },
    });

    super[ListSymbol._add](item as Item, trigger);
  }

  /* @internal */
  [ListSymbol._select](item: Item | undefined, selected: boolean, trigger?: Event) {
    if (selected === item?.[SELECTED]) return;

    const prev = this.selected;
    if (item) item[SELECTED] = selected;

    const changed = !selected ? prev === item : prev !== item;
    if (changed) {
      if (prev) prev[SELECTED] = false;
      this.dispatchEvent(
        new DOMEvent<SelectListChangeEventDetail<Item>>('change', {
          detail: {
            prev,
            current: this.selected,
          },
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

/**
 * @detail change
 */
export interface SelectListChangeEvent<Item extends SelectListItem>
  extends DOMEvent<SelectListChangeEventDetail<Item>> {}

export interface SelectListChangeEventDetail<Item extends SelectListItem> {
  prev: Item | null;
  current: Item | null;
}
