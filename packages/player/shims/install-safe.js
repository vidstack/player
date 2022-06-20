//@ts-nocheck

import { getWindow } from './dom.js';

/**
 * Does not shim `window` object to avoid breaking environment detection of other libraries.
 */

if (
  typeof window === 'undefined' &&
  globalThis.document === undefined &&
  !/test/.test(process.env.NODE_ENV) &&
  !import.meta.env?.TEST
) {
  const window = getWindow();
  Object.assign(globalThis, window);
}
