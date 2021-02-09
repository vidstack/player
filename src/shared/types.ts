export type Constructor<T = Record<string, unknown>> = {
  new (...args: any[]): T;
  prototype: T;
};
