import type { MarkdownHeading } from '@vessel-js/app';
import { getContext, setContext } from 'svelte';
import type { Readable, Writable } from 'svelte/store';

export type OnThisPageConfig = {
  canUpdateHash?: (hash: string) => boolean;
  cleanHash?: (hash: string) => string;
};

export type OnThisPageContext = {
  override: Writable<MarkdownHeading[] | null>;
  config: Readable<OnThisPageConfig>;
};

const CTX_KEY = Symbol('');

export function getOnThisPageContext(): OnThisPageContext {
  return getContext(CTX_KEY);
}

export function setOnThisPageContext(context: OnThisPageContext) {
  setContext(CTX_KEY, context);
}
