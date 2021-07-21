import { isFunction, isUndefined } from '../../utils/unit.js';
import { defineContextConsumer, defineContextProvider } from './define.js';

/**
 * @template T
 * @param {import("./types").Context<T>} context
 * @param {import("./types").ContextConsumeOptions<T>} [options]
 * @returns {PropertyDecorator}
 */
export function consumeContext(context, options = {}) {
  return reactiveElementDecorator(consumeContext.name, (proto, name) => {
    /** @type {typeof import('lit').ReactiveElement} */
    const ctor = proto.constructor;
    defineContextConsumer(ctor, name, context, options);
  });
}

/**
 * @template T
 * @param {import("./types").Context<T>} context
 * @param {import("./types").ContextProvideOptions<T>} [options]
 * @returns {PropertyDecorator}
 */
export function provideContext(context, options = {}) {
  return reactiveElementDecorator(provideContext.name, (proto, name) => {
    /** @type {typeof import('lit').ReactiveElement} */
    const ctor = proto.constructor;
    defineContextProvider(ctor, name, context, options);
  });
}

/**
 * @template T
 * @param {import("./types").Context<T>} context
 * @param {import("./types").ContextConsumeOptions<T>} [options]
 * @returns {MethodDecorator}
 */
export function watchContext(context, options) {
  return reactiveElementDecorator(watchContext.name, (proto, name) => {
    /** @type {typeof import('lit').ReactiveElement} */
    const ctor = proto.constructor;

    defineContextConsumer(ctor, Symbol('Vidstack.watchContext'), context, {
      ...options,
      onUpdate(value) {
        if (isFunction(this[name])) this[name](value);
        options?.onUpdate?.call(this, value);
      }
    });
  });
}

/**
 * @param {string} decoratorName
 * @param {(proto: any, name: string | symbol) => void} legacyDecorator
 * @returns {PropertyDecorator}
 */
export function reactiveElementDecorator(decoratorName, legacyDecorator) {
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
        `[vds]: \`${ctor.name}\` must extend \`ReactiveElement\` to use the \`@${decoratorName}\` decorator.`
      );
    }

    legacyDecorator(proto, name);
  }

  /**
   * TC39 Decorator
   *
   * @param {any} context
   * @link https://github.com/tc39/proposal-decorators
   */
  function standard(context) {
    // TODO: implement when spec formalized.
    throw Error(`[@${decoratorName}] TC39 decorators are not supported yet.`);
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
