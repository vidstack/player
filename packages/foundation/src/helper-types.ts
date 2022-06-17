// eslint-disable-next-line @typescript-eslint/ban-types
export type Constructor<T = object> = {
  new (...args: any[]): T;
  prototype: T;
};

export type KeysOfType<O, T> = {
  [P in keyof O]: O[P] extends T ? P : never;
};

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type Values<T> = T extends { [k: string]: infer V } ? V : never;
