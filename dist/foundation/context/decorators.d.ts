/**
 * @template T
 * @param {import("./types").Context<T>} context
 * @param {import("./types").ContextConsumeOptions<T>} [options]
 * @returns {PropertyDecorator}
 */
export function consumeContext<T>(context: import("./types").Context<T>, options?: import("./types").ContextConsumeOptions<T> | undefined): PropertyDecorator;
/**
 * @template T
 * @param {import("./types").Context<T>} context
 * @param {import("./types").ContextProvideOptions<T>} [options]
 * @returns {PropertyDecorator}
 */
export function provideContext<T>(context: import("./types").Context<T>, options?: import("./types").ContextProvideOptions<T> | undefined): PropertyDecorator;
/**
 * @template T
 * @param {import("./types").Context<T>} context
 * @param {import("./types").ContextConsumeOptions<T>} [options]
 * @returns {MethodDecorator}
 */
export function watchContext<T>(context: import("./types").Context<T>, options?: import("./types").ContextConsumeOptions<T> | undefined): MethodDecorator;
/**
 * @param {string} decoratorName
 * @param {(proto: any, name: string | symbol) => void} legacyDecorator
 * @returns {PropertyDecorator}
 */
export function reactiveElementDecorator(decoratorName: string, legacyDecorator: (proto: any, name: string | symbol) => void): PropertyDecorator;
