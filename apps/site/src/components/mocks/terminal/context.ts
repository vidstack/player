import { getContext, setContext } from 'svelte';

const KEY = Symbol();

export interface TerminalContext {
  directory: string;
  branch: string;
}

export function getTerminalContext() {
  return getContext<TerminalContext>(KEY);
}

export function setTerminalContext(ctx: TerminalContext) {
  setContext(KEY, ctx);
}
