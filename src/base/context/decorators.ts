import { ReactiveElement } from 'lit';

import { isFunction } from '../../utils/unit';
import {
  isReactiveElementProto,
  throwIfTC39Decorator
} from '../elements/decorators';
import { Context, isDerviedContext } from './context';
import { ConsumeContextOptions } from './ContextConsumerController';
import { ProvideContextOptions } from './ContextProviderController';

export function consumeContext<T>(
  context: Context<T>,
  options: Omit<ConsumeContextOptions<T>, 'id'> = {}
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
  options: Omit<ProvideContextOptions<T>, 'id'> = {}
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
  options: Omit<ConsumeContextOptions<T>, 'id'> = {}
): MethodDecorator {
  return function (proto, methodName) {
    const decoratorName = watchContext.name;

    // TODO: implement when spec formalized.
    throwIfTC39Decorator(decoratorName, proto);

    if (isReactiveElementProto(decoratorName, proto)) {
      const ctor = proto.constructor;
      defineContextConsumer(ctor, Symbol('Vidstack.watchContext'), context, {
        ...options,
        onUpdate(newValue) {
          if (isFunction(this[methodName])) this[methodName](newValue);
          options?.onUpdate?.(newValue);
        }
      });
    }
  };
}

const PROVIDERS = Symbol('Vidstack.providers');
const CONSUMERS = Symbol('Vidstack.consumers');

export function defineContextProvider<T = any>(
  ctor: typeof ReactiveElement,
  name: string | symbol,
  context: Context<T>,
  options: Omit<ProvideContextOptions<T>, 'id'> = {}
) {
  // Might be called by decorator.
  // @ts-expect-error
  ctor.finalizeContext?.();

  ctor.addInitializer((element) => {
    if (!element[PROVIDERS]) element[PROVIDERS] = new Map();
    const provider = context.provide(element, options);
    element[PROVIDERS].set(name, provider);
  });

  Object.defineProperty(ctor.prototype, name, {
    enumerable: true,
    configurable: true,
    get() {
      return this[PROVIDERS].get(name).value;
    },
    set: isDerviedContext(context)
      ? function () {}
      : function (newValue) {
          // @ts-expect-error
          this[PROVIDERS].get(name).value = newValue;
        }
  });
}

export function defineContextConsumer<T = any>(
  ctor: typeof ReactiveElement,
  name: string | symbol,
  context: Context<T>,
  options: Omit<ConsumeContextOptions<T>, 'id'> = {}
) {
  // Might be called by decorator.
  // @ts-expect-error
  ctor.finalizeContext?.();

  ctor.addInitializer((element) => {
    if (!element[CONSUMERS]) element[CONSUMERS] = new Map();

    let oldValue =
      options.transform?.(context.initialValue) ?? context.initialValue;

    const consumer = context.consume(element, {
      ...options,
      onUpdate: (newValue) => {
        if (options.shouldRequestUpdate ?? true) {
          element.requestUpdate(name, oldValue);
          oldValue = newValue;
        }

        options.onUpdate?.call(element, newValue);
      }
    });

    element[CONSUMERS].set(name, consumer);
  });

  Object.defineProperty(ctor.prototype, name, {
    enumerable: true,
    configurable: true,
    get() {
      return this[CONSUMERS].get(name).value;
    },
    set() {
      // no-op
    }
  });
}
