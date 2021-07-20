/**
 * @template T
 * @param {T} initialValue
 * @returns {import('./types').Context<T>}
 */
export function createContext<T>(initialValue: T): import("./types").Context<T>;
/**
 * Derives a context from others that was created with `createContext`. This assumes the
 * given `contexts` are ALL provided by the same host element.
 *
 * @template {import('./types').ContextTuple} T
 * @template R
 * @param {T} contexts - The contexts to derive values from as it updates.
 * @param {(values: import('./types').ContextTupleValues<T>) => R} derivation - Takes the original context values and outputypes the derived value.
 * @returns {import('./types').DerivedContext<R>}
 */
export function derivedContext<T extends readonly [import("./types").Context<any>, ...import("./types").Context<any>[]], R>(contexts: T, derivation: (values: import("./types").ContextTupleValues<T>) => R): import("./types").DerivedContext<R>;
/**
 * @template T
 * @param {import('./types').Context<T> | import('./types').DerivedContext<T>} context
 * @returns {context is import('./types').DerivedContext<T>}
 */
export function isDerviedContext<T>(context: import("./types").Context<T> | import("./types").DerivedContext<T>): context is import("./types").DerivedContext<T>;
/**
 * Takes in a context record which is essentially an object containing 0 or more contexts, and sets
 * the given `host` element as the provider of all the contexts within the given record.
 *
 * @template {import('./types').ContextRecord<unknown>} ContextRecordType
 * @param {import('./types').ContextHost} host
 * @param {ContextRecordType} contextRecord
 * @returns {import('./types').ContextProviderRecord<ContextRecordType>}
 */
export function provideContextRecord<ContextRecordType extends import("./types").ContextRecord<unknown>>(host: import('./types').ContextHost, contextRecord: ContextRecordType): import("./types").ExtractContextRecordTypes<import("../types/utils.js").ReadonlyIfType<import("./types").DerivedContext<any>, ContextRecordType>>;
