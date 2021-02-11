import { isUndefined } from '../utils/unit';

declare global {
  interface Window {
    Mocha?: never;
  }
}

/**
 * Whether we are currently inside a test environment.
 */
export function isTestEnv(): boolean {
  return !isUndefined(window.Mocha);
}
