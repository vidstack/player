import { ReactiveElement } from 'lit';

import { isDerviedContext } from './context';
import { Context, ContextConsumeOptions, ContextProvideOptions } from './types';

const PROVIDERS = Symbol('Vidstack.providers');
const CONSUMERS = Symbol('Vidstack.consumers');

export function defineContextProvider<T = any>(
  ctor: typeof ReactiveElement,
  name: string | symbol,
  context: Context<T>,
  options: ContextProvideOptions<T> = {}
) {
  // Might be called by decorator.
  // @ts-expect-error
  ctor.finalizeContext?.();

  ctor.addInitializer((element) => {
    // @ts-expect-error
    if (!element[PROVIDERS]) element[PROVIDERS] = new Map();
    const provider = context.provide(element, options);
    // @ts-expect-error
    element[PROVIDERS].set(name, provider);
  });

  Object.defineProperty(ctor.prototype, name, {
    enumerable: true,
    configurable: true,
    get() {
      return this[PROVIDERS].get(name).value;
    },
    set: isDerviedContext(context)
      ? function () {
          // console.warn(`Context provider property [${name}] is derived, thus it's readonly.`);
        }
      : function (newValue) {
          // @ts-ignore
          this[PROVIDERS].get(name).value = newValue;
        }
  });
}

function initConsumer<T = any>(
  element: ReactiveElement,
  name: string | symbol,
  context: Context<T>,
  options: ContextConsumeOptions<T> = {}
) {
  let initialized = false;
  let oldValue =
    options.transform?.(context.initialValue) ?? context.initialValue;

  const consumer = context.consume(element, {
    ...options,
    onUpdate: (newValue) => {
      if (!initialized) return;

      // Trigger setters.
      // @ts-expect-error
      element[name] = newValue;

      // TODO: REMOVE
      element.requestUpdate(name, oldValue);
      oldValue = newValue;

      options.onUpdate?.call(element, newValue);
    }
  });

  // @ts-expect-error
  element[CONSUMERS].set(name, consumer);
  initialized = true;
}

export function defineContextConsumer<T = any>(
  ctor: typeof ReactiveElement,
  name: string | symbol,
  context: Context<T>,
  options: ContextConsumeOptions<T> = {}
) {
  // Might be called by decorator.
  // @ts-expect-error
  ctor.finalizeContext?.();

  ctor.addInitializer((element) => {
    // @ts-expect-error
    if (!element[CONSUMERS]) element[CONSUMERS] = new Map();
    initConsumer(element, name, context, options);
  });

  Object.defineProperty(ctor.prototype, name, {
    enumerable: true,
    configurable: true,
    get() {
      return this[CONSUMERS].get(name).value;
    },
    set() {
      // console.warn(`Context consumer property [${name}] is readonly.`);
    }
  });
}
