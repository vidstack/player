import type { SvelteComponent } from 'svelte';

import type { StageTitle } from '../../components/stage-badge.svelte';

export type NavItem = NavLink | NavMenu;

export interface NavLink {
  id?: string;
  title: string;
  href: string;
}

export interface NavMenu {
  id?: string;
  title: string;
  grid?: boolean;
  items: NavMenuItems;
  /** @example 'top-start' */
  placement?: string;
}

export type NavMenuItems = (NavMenuItem | NavSubmenu)[];

export interface NavMenuItem {
  id?: string;
  title: string;
  description?: string;
  href?: string;
  stage?: StageTitle;
  Icon?: NavIcon;
}

export interface NavSubmenu extends Omit<NavMenuItem, 'href'> {
  featured?: boolean;
  items: NavMenuItem[];
}

export interface NavIcon {
  new (...args: any[]): SvelteComponent<svelteHTML.IntrinsicElements['svg']>;
}
