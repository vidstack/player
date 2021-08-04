import { ReactiveElement } from 'lit';

import { DEV_MODE } from '../../env';
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
      defineContextConsumer(
        ctor,
        Symbol(`Vidstack.${String(methodName)}`),
        context,
        {
          ...options,
          onUpdate(newValue) {
            if (isFunction(this[methodName])) this[methodName](newValue);
            options?.onUpdate?.(newValue);
          }
        }
      );
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

    const provider = context.provide(element, {
      debug: DEV_MODE && name,
      ...options
    });

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
    let oldValue =
      options.transform?.(context.initialValue) ?? context.initialValue;

    context.consume(element, {
      debug: DEV_MODE && name,
      ...options,
      onUpdate: (newValue) => {
        options.onUpdate?.call(element, newValue);

        // Ignore watchers.
        if (
          typeof name === 'symbol' &&
          name.toString().startsWith('Vidstack.')
        ) {
          return;
        }

        // Trigger setters.
        element[name] = newValue;

        if (options.shouldRequestUpdate) {
          element.requestUpdate(name, oldValue);
          oldValue = newValue;
        }
      }
    });
  });
}
