export type DebouncedFunction<Args extends unknown[]> = {
  (this: unknown, ...args: Args): void;
  cancel: () => void;
  pending: () => boolean;
};

export type ThrottledFunction<Args extends unknown[]> = {
  (this: unknown, ...args: Args): void;
  cancel: () => void;
  pending: () => boolean;
};

export interface ThorttleOptions {
  leading: boolean;
  trailing: boolean;
}
