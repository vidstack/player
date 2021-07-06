import { isUndefined } from '../../utils/unit.js';
import { defineContextConsumer, defineContextProvider } from './define.js';

/**
 * @template T
 * @param {import("./types").Context<T>} context
 * @param {import("./types").ContextConsumeOptions<T>} [options]
 * @returns {PropertyDecorator}
 */
export function consumeContext(context, options = {}) {
  /**
   * Legacy Decorator
   *
   * @param {any} proto
   * @param {string | symbol} name
   * @link https://www.typescriptlang.org/docs/handbook/decorators.html
   */
  function legacy(proto, name) {
    /** @type {typeof import('lit').ReactiveElement} */
    const ctor = proto.constructor;

    if (isUndefined(ctor.addInitializer)) {
      throw Error(
        `[vds]: \`${ctor.name}\` must extend \`ReactiveElement\` to use the \`@consumeContext\` decorator.`
      );
    }

    defineContextConsumer(ctor, name, context, options);
  }

  /**
   * TC39 Decorator
   *
   * @param {any} context
   * @link https://github.com/tc39/proposal-decorators
   */
  function standard(context) {
    // TODO: implement when spec formalized.
    throw Error('[@consumeContext] TC39 decorators are not supported yet.');
  }

  /**
   * @param {any} protoOrContext
   * @param {string | symbol} [propertyKey]
   * @returns {ReturnType<typeof legacy | typeof standard>}
   */
  function decorator(protoOrContext, propertyKey) {
    return !isUndefined(propertyKey)
      ? legacy(protoOrContext, propertyKey)
      : standard(protoOrContext);
  }

  return decorator;
}

/**
 * @template T
 * @param {import("./types").Context<T>} context
 * @param {import("./types").ContextProvideOptions<T>} [options]
 * @returns {PropertyDecorator}
 */
export function provideContext(context, options = {}) {
  /**
   * Legacy Decorator
   *
   * @param {any} proto
   * @param {string | symbol} name
   * @link https://www.typescriptlang.org/docs/handbook/decorators.html
   */
  function legacy(proto, name) {
    /** @type {typeof import('lit').ReactiveElement} */
    const ctor = proto.constructor;

    if (isUndefined(ctor.addInitializer)) {
      throw Error(
        `[vds]: \`${ctor.name}\` must extend \`ReactiveElement\` to use the \`@provideContext\` decorator.`
      );
    }

    defineContextProvider(ctor, name, context, options);
  }

  /**
   * TC39 Decorator
   *
   * @param {any} context
   * @link https://github.com/tc39/proposal-decorators
   */
  function standard(context) {
    // TODO: implement when spec formalized.
    throw Error('[@provideContext] TC39 decorators are not supported yet.');
  }

  /**
   * @param {any} protoOrContext
   * @param {string | symbol} [propertyKey]
   * @returns {ReturnType<typeof legacy | typeof standard>}
   */
  function decorator(protoOrContext, propertyKey) {
    return !isUndefined(propertyKey)
      ? legacy(protoOrContext, propertyKey)
      : standard(protoOrContext);
  }

  return decorator;
}
