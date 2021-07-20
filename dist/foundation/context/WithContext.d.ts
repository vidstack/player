/**
 * @template {import('./types').ContextHostConstructor} T
 * @param {T} Base
 * @returns {import('./types').ContextInitializer & T}
 */
export function WithContext<T extends import("./types").ContextHostConstructor>(Base: T): import("./types").ContextInitializer & T;
