import { isFunction } from '../../utils/unit.js';
import {
  isReactiveElementProto,
  throwIfTC39Decorator
} from '../elements/decorators.js';
import { defineContextConsumer, defineContextProvider } from './define.js';

/**
 * @template T
 * @param {import("./types").Context<T>} context
 * @param {import("./types").ContextConsumeOptions<T>} [options]
 * @returns {PropertyDecorator}
 */
export function consumeContext(context, options = {}) {
  return function (proto, propertyKey) {
    const decoratorName = consumeContext.name;

    // TODO: implement when spec formalized.
    throwIfTC39Decorator(decoratorName, proto);

    if (isReactiveElementProto(decoratorName, proto)) {
      const ctor = proto.constructor;
      defineContextConsumer(ctor, propertyKey, context, options);
    }
  };
}

/**
 * @template T
 * @param {import("./types").Context<T>} context
 * @param {import("./types").ContextProvideOptions<T>} [options]
 * @returns {PropertyDecorator}
 */
export function provideContext(context, options = {}) {
  return function (proto, propertyKey) {
    const decoratorName = provideContext.name;

    // TODO: implement when spec formalized.
    throwIfTC39Decorator(decoratorName, proto);

    if (isReactiveElementProto(decoratorName, proto)) {
      const ctor = proto.constructor;
      defineContextProvider(ctor, propertyKey, context, options);
    }
  };
}

/**
 * @template T
 * @param {import("./types").Context<T>} context
 * @param {import("./types").ContextConsumeOptions<T>} [options]
 * @returns {MethodDecorator}
 */
export function watchContext(context, options) {
  return function (proto, methodName) {
    const decoratorName = watchContext.name;

    // TODO: implement when spec formalized.
    throwIfTC39Decorator(decoratorName, proto);

    if (isReactiveElementProto(decoratorName, proto)) {
      const ctor = proto.constructor;
      defineContextConsumer(ctor, Symbol('Vidstack.watchContext'), context, {
        ...options,
        onUpdate(value) {
          if (isFunction(this[methodName])) this[methodName](value);
          options?.onUpdate?.call(this, value);
        }
      });
    }
  };
}
