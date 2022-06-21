// @ts-nocheck

import { getWindow } from './dom.js';

/**
 * Does not shim `window` object to avoid breaking environment detection of other libraries.
 */

if (typeof window === 'undefined' && globalThis.document === undefined) {
  const window = getWindow();
  Object.assign(globalThis, window);
}
