import { createContext, type ReadSignal, type WriteSignal } from 'maverick.js';

import type { Menu } from './menu';
import type { MenuButton } from './menu-button';
import type { MenuItems } from './menu-items';

export interface MenuContext {
  readonly submenu: boolean;
  readonly expanded: ReadSignal<boolean>;
  readonly hint: WriteSignal<string>;
  readonly button: ReadSignal<HTMLElement | null>;
  readonly content: ReadSignal<HTMLElement | null>;
  attachMenuButton(button: MenuButton): void;
  attachMenuItems(menuItems: MenuItems): void;
  attachObserver(observer: MenuObserver): void;
  disable(disable: boolean): void;
  disableMenuButton(disable: boolean): void;
  addSubmenu(menu: Menu): void;
  onTransitionEvent(callback: (event: TransitionEvent) => void): void;
}

export interface MenuObserver {
  onOpen?(trigger?: Event): void;
  onClose?(trigger?: Event): void;
}

export const menuContext = createContext<MenuContext>();
