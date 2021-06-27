export type Separator = ' ' | '-' | '_';

export type CamelCase<T extends string> =
  T extends `${Separator}${infer Suffix}`
    ? CamelCase<Suffix>
    : T extends `${infer Prefix}${Separator}`
    ? CamelCase<Prefix>
    : T extends `${infer Prefix}${Separator}${infer Suffix}`
    ? CamelCase<`${Prefix}${Capitalize<Suffix>}`>
    : T;

export type PascalCase<T extends string> = Capitalize<CamelCase<T>>;
