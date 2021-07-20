export declare type Constructor<T = object> = {
    new (...args: any[]): T;
    prototype: T;
};
export declare type Writeable<T> = {
    -readonly [P in keyof T]: T[P];
};
export declare type PublicOnly<T> = Pick<T, keyof T>;
export declare type Fallback<T, R> = T extends void | unknown | any ? R : T;
export declare type MethodsOnly<T> = Omit<T, {
    [K in keyof T]-?: T[K] extends Function ? never : K;
}[keyof T]>;
export declare type PromiseThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export declare type PromisifyRecord<Record> = {
    [P in keyof Record]: Record[P] extends (...args: any) => void ? (...args: Parameters<Record[P]>) => Promise<PromiseThenArg<ReturnType<Record[P]>>> : Record[P];
};
export declare type Callback<ValueType> = (value: ValueType) => void;
export declare type UnknownFunction = (...args: unknown[]) => unknown;
export declare type Unsubscribe = Callback<void>;
export interface Cancelable {
    cancel(): void;
}
export declare type KeysOfType<T, O> = {
    [P in keyof O]: O[P] extends T ? P : never;
};
export declare type Values<T> = T extends {
    [k: string]: infer V;
} ? V : never;
export declare type ReadonlyIfType<T, O> = Readonly<Omit<O, Exclude<keyof O, Values<KeysOfType<T, O>>>>> & Omit<O, keyof Omit<O, Exclude<keyof O, Values<KeysOfType<T, O>>>>>;
/**
 * The following is from this SO link: https://stackoverflow.com/a/49579497
 */
declare type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;
export declare type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P>;
}[keyof T];
export declare type ReadonlyKeys<T> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, never, P>;
}[keyof T];
export {};
