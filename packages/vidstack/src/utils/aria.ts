import type { ReadSignal } from 'maverick.js';

export function ariaBool(value: boolean): 'true' | 'false' {
  return value ? 'true' : 'false';
}

export function $ariaBool(signal: ReadSignal<boolean>): ReadSignal<'true' | 'false'> {
  return () => ariaBool(signal());
}
