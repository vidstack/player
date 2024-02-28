import { createContext, type ReadSignal, type WriteSignal } from 'maverick.js';

import type { Menu } from './menu';
import type { MenuButton } from './menu-button';
import type { MenuItems } from './menu-items';

export interface MenuContext {
  readonly _submenu: boolean;
  readonly _expanded: ReadSignal<boolean>;
  readonly _hint: WriteSignal<string>;
  readonly _button: ReadSignal<HTMLElement | null>;
  _attachMenuButton(button: MenuButton): void;
  _attachMenuItems(menuItems: MenuItems): void;
  _attachObserver(observer: MenuObserver): void;
  _disable(disable: boolean): void;
  _disableMenuButton(disable: boolean): void;
  _addSubmenu(menu: Menu): void;
}

export interface MenuObserver {
  _onOpen?(trigger?: Event): void;
  _onClose?(trigger?: Event): void;
}

export const menuContext = createContext<MenuContext>();
