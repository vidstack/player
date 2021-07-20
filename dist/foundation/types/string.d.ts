export declare type Separator = ' ' | '-' | '_';
export declare type CamelCase<T extends string> = T extends `${Separator}${infer Suffix}` ? CamelCase<Suffix> : T extends `${infer Prefix}${Separator}` ? CamelCase<Prefix> : T extends `${infer Prefix}${Separator}${infer Suffix}` ? CamelCase<`${Prefix}${Capitalize<Suffix>}`> : T;
export declare type PascalCase<T extends string> = Capitalize<CamelCase<T>>;
