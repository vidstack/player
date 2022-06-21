// @ts-nocheck

import { getWindow } from './dom.js';

if (globalThis.window === undefined) {
  const window = getWindow();
  Object.assign(globalThis, window);
  globalThis.window = globalThis;
}
