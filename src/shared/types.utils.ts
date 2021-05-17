// eslint-disable-next-line @typescript-eslint/ban-types
export type Constructor<T = object> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
  prototype: T;
};

export type Writeable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Separator = ' ' | '-' | '_';

export type CamelCase<
  T extends string
> = T extends `${Separator}${infer Suffix}`
  ? CamelCase<Suffix>
  : T extends `${infer Prefix}${Separator}`
  ? CamelCase<Prefix>
  : T extends `${infer Prefix}${Separator}${infer Suffix}`
  ? CamelCase<`${Prefix}${Capitalize<Suffix>}`>
  : T;

export type PascalCase<T extends string> = Capitalize<CamelCase<T>>;

export type MethodsOnly<T> = Omit<
  T,
  {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [K in keyof T]-?: T[K] extends Function ? never : K;
  }[keyof T]
>;

export type Callback<ValueType> = (value: ValueType) => void;

export type UnknownFunction = (...args: unknown[]) => unknown;

export type Unsubscribe = Callback<void>;

export interface Cancelable {
  cancel(): void;
}

// V8ToIstanbul fails when no value is exported.
export default class {}
