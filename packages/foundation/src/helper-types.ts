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

export type ReadonlyIfType<T, O> = Readonly<Omit<O, Exclude<keyof O, Values<KeysOfType<O, T>>>>> &
  Omit<O, keyof Omit<O, Exclude<keyof O, Values<KeysOfType<O, T>>>>>;

export type OmitTypesFromRecord<RecordType, OmitType> = Omit<
  RecordType,
  KeysOfType<RecordType, OmitType>[keyof RecordType]
>;

// -------------------------------------------------------------------------------------------
// String
// -------------------------------------------------------------------------------------------

export type CamelToKebabCase<T extends string> = string extends T
  ? string
  : T extends `${infer C0}${infer R}`
  ? `${C0 extends Lowercase<C0> ? '' : '-'}${Lowercase<C0>}${CamelToKebabCase<R>}`
  : '';

export type CamelToKebabKeys<T> = {
  [K in keyof T as CamelToKebabCase<Extract<K, string>>]: T[K];
};

// -------------------------------------------------------------------------------------------
// The following is from this StackOverflow link: https://stackoverflow.com/a/49579497
//
// Essentially a "hack" to pick `readonly` keys from a `Record` type.
// -------------------------------------------------------------------------------------------

export type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? A
  : B;

export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>;
}[keyof T];

export type ReadonlyKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>;
}[keyof T];
