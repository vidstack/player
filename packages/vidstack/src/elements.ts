/**
 * Loads element definitions and registers them in the browser's custom elements registry.
 *
 * @example
 * ```ts
 * import { defineCustomElements } from "vidstack/elements";
 *
 * await defineCustomElements();
 * ```
 */
export async function defineCustomElements() {
  if (__SERVER__) return;
  return (await import('./register.js')).default();
}
