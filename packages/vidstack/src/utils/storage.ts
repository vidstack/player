/**
 * A safe wrapper around `localStorage` for environments where it's not available. In some
 * mobile WebViews (or when the user has disabled storage) `localStorage` can be `null` or throw
 * on access, which would otherwise crash the player.
 *
 * @see {@link https://github.com/vidstack/player/issues/1444}
 */
export const LocalStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // no-op
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // no-op
    }
  },
};
