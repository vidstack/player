import { getContext, setContext } from 'svelte';
import { type Readable } from 'svelte/store';

export type NavLink = {
  title: string;
  slug: string;
  match?: RegExp | null;
};

export type NavLinks = NavLink[];

export type NavbarContext = {
  links: Readable<NavLinks>;
};

const CTX_KEY = Symbol('');

export function getNavbarContext(): NavbarContext {
  return getContext(CTX_KEY);
}

export function setNavbarContext(context: NavbarContext) {
  setContext(CTX_KEY, context);
}
