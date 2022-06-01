import { getContext, setContext } from 'svelte';
import { type Readable } from 'svelte/store';

export type OnThisPageConfig = {
  canUpdateHash?: (hash: string) => boolean;
  cleanHash?: (hash: string) => string;
};

export type OnThisPageContext = Readable<OnThisPageConfig>;

const CTX_KEY = Symbol('');

export function getOnThisPageContext(): OnThisPageContext {
  return getContext(CTX_KEY);
}

export function setOnThisPageContext(context: OnThisPageContext) {
  setContext(CTX_KEY, context);
}
