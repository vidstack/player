export type Constructor<T = Record<string, unknown>> = {
  new (...args: any[]): T;
  prototype: T;
};

export type Callback<T> = (value: T) => void;
