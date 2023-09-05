import { SvelteComponent } from 'svelte';

export type SidebarItems = Record<string, SidebarItem[]>;

export type SidebarItem = SidebarLink | SidebarGroup;

export interface SidebarLink {
  title: string;
  href: string;
}

export interface SidebarGroup {
  title: string;
  items: SidebarLink[];
}

export interface SidebarFeatureItem {
  title: string;
  href: string;
  Icon?: SidebarIcon;
}

export function isSidebarGroup(item: SidebarItem): item is SidebarGroup {
  return 'items' in item;
}

export interface SidebarIcon {
  new (...args: any[]): SvelteComponent<svelteHTML.IntrinsicElements['svg']>;
}
