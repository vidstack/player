import {
  isReactiveElementProto,
  throwIfTC39Decorator
} from '@base/elements/decorators';
import { isFunction } from '@utils/unit';

import { defineContextConsumer, defineContextProvider } from './define';
import { Context, ContextConsumeOptions, ContextProvideOptions } from './types';

export function consumeContext<T>(
  context: Context<T>,
  options: ContextConsumeOptions<T> = {}
): PropertyDecorator {
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

export function provideContext<T>(
  context: Context<T>,
  options: ContextProvideOptions<T> = {}
): PropertyDecorator {
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

export function watchContext<T>(
  context: Context<T>,
  options: ContextConsumeOptions<T> = {}
): MethodDecorator {
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
