import type { ReadSignal } from 'maverick.js';
import { useHostConnected } from 'maverick.js/std';

export function withConnectedHost<T extends Element>(
  target: ReadSignal<T | null>,
): ReadSignal<T | null> {
  const $connected = useHostConnected();
  return () => ($connected() ? target() : null);
}
