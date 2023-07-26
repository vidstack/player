import type { SvelteComponent } from 'svelte';
import type { navIcons } from './nav-icons';

export type NavItem = NavLink | NavMenu;

export interface NavLink {
  title: string;
  href: string;
}

export interface NavMenu {
  title: string;
  grid?: boolean;
  items: NavMenuItems;
  /** @example 'top-start' */
  placement?: string;
}

export type NavMenuItems = (NavMenuItem | NavSubmenu)[];

export interface NavMenuItem {
  title: string;
  description: string;
  badge?: '1.0' | 'Beta' | 'Planned' | 'Soon';
  icon?: keyof typeof navIcons;
  href?: string;
}

export interface NavSubmenu extends Omit<NavMenuItem, 'href'> {
  featured?: boolean;
  items: NavMenuItem[];
}

export interface NavIcon {
  new (...args: any[]): SvelteComponent<svelteHTML.IntrinsicElements['svg']>;
}
