export type Constructor<T = object> = {
  new (...args: any[]): T;
  prototype: T;
};

export type Writeable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type PublicOnly<T> = Pick<T, keyof T>;

export type Fallback<T, R> = T extends void | unknown | any ? R : T;

export type MethodsOnly<T> = Omit<
  T,
  {
    [K in keyof T]-?: T[K] extends Function ? never : K;
  }[keyof T]
>;

export type Callback<ValueType> = (value: ValueType) => void;

export type UnknownFunction = (...args: unknown[]) => unknown;

export type Unsubscribe = Callback<void>;

export interface Cancelable {
  cancel(): void;
}

export type KeysOfType<T, O> = {
  [P in keyof O]: O[P] extends T ? P : never;
};

export type Values<T> = T extends { [k: string]: infer V } ? V : never;

export type ReadonlyIfType<T, O> = Readonly<
  Omit<O, Exclude<keyof O, Values<KeysOfType<T, O>>>>
> &
  Omit<O, keyof Omit<O, Exclude<keyof O, Values<KeysOfType<T, O>>>>>;

/**
 * The following is from this SO link: https://stackoverflow.com/a/49579497
 */

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? A
  : B;

export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >;
}[keyof T];

export type ReadonlyKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    never,
    P
  >;
}[keyof T];
