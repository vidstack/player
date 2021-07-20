/**
 * @template {any} T
 * @param {typeof import('lit').ReactiveElement} ctor
 * @param {string|symbol} name
 * @param {import('./types').Context<T>} context
 * @param {import('./types').ContextProvideOptions<T>} [options]
 */
export function defineContextProvider<T extends unknown>(ctor: typeof import('lit').ReactiveElement, name: string | symbol, context: import("./types").Context<T>, options?: import("./types").ContextProvideOptions<T> | undefined): void;
/**
 * @template {any} T
 * @param {typeof import('lit').ReactiveElement} ctor
 * @param {string|symbol} name
 * @param {import('./types').Context<T>} context
 * @param {import('./types').ContextConsumeOptions<T>} [options]
 */
export function defineContextConsumer<T extends unknown>(ctor: typeof import('lit').ReactiveElement, name: string | symbol, context: import("./types").Context<T>, options?: import("./types").ContextConsumeOptions<T> | undefined): void;
