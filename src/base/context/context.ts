import { ReactiveControllerHost } from 'lit';

import { DEV_MODE } from '../../env';
import { ReadonlyIfType } from '../../helpers';
import {
  ConsumeContextOptions,
  ContextConsumerController
} from './ContextConsumerController';
import {
  ContextProviderController,
  ProvideContextOptions
} from './ContextProviderController';

/**
 * Creates and returns a pairable context consumer and provider.
 */
export function createContext<T>(initialValue: T): Context<T> {
  const id = Symbol('Vidstack.context');
  return {
    id: id,
    initialValue,
    consume(host, options) {
      return new ContextConsumerController(host, initialValue, {
        ...options,
        id
      });
    },
    provide(host, options) {
      return new ContextProviderController(host, initialValue, {
        ...options,
        id
      });
    }
  };
}

/**
 * Derives a context from others that was created with `createContext`. This assumes the
 * given `contexts` are ALL provided by the same host element.
 *
 * @param contexts - The contexts to derive values from as it updates.
 * @param derivation - Takes the original context values and outputs the derived value.
 */
export function derivedContext<T extends ContextTuple, R>(
  contexts: T,
  derivation: (values: ContextTupleValues<T>) => R
): DerivedContext<R> {
  const initialValue = derivation(contexts.map((c) => c.initialValue) as any);

  const derivedContext = createContext(initialValue);

  return {
    id: derivedContext.id,
    initialValue,
    isDerived: true,
    consume: derivedContext.consume,
    provide(host) {
      let connections = 0;
      const values: unknown[] = [];
      const derivedProvider = derivedContext.provide(host);

      contexts.forEach((context, i) => {
        context.consume(host, {
          onConnect() {
            connections += 1;
          },
          onUpdate(newValue) {
            values[i] = newValue;
            if (connections === contexts.length) {
              derivedProvider.value = derivation(values as any);
            }
          },
          onDisconnect() {
            connections -= 1;
            if (connections === 0) derivedProvider.value = initialValue;
          }
        });
      });

      return derivedProvider;
    }
  };
}

export function isDerviedContext<T>(
  context: Context<T> | DerivedContext<T>
): context is DerivedContext<T> {
  return !!(context as DerivedContext<T>).isDerived;
}

/**
 * Takes in a context record which is essentially an object containing 0 or more contexts, and sets
 * the given `host` element as the provider of all the contexts within the given record.
 *
 * @param host
 * @param contextRecord
 */
export function provideContextRecord<T extends ContextRecord<unknown>>(
  host: ReactiveControllerHost,
  contextRecord: T,
  options?: { [P in keyof T]?: Omit<ProvideContextOptions<T[P]>, 'id'> }
): ContextProviderRecord<T> {
  const providers = {} as Partial<ContextProviderRecord<T>>;

  Object.keys(contextRecord).forEach((contextKey) => {
    const context = contextRecord[contextKey] as Context<unknown>;

    const providerOptions = options?.[
      contextKey
    ] as ProvideContextOptions<unknown>;

    const provider = context.provide(host, {
      name: DEV_MODE && contextKey,
      ...providerOptions
    });

    Object.defineProperty(providers, contextKey, {
      enumerable: true,
      configurable: false,
      get() {
        return provider.value;
      },
      set: isDerviedContext(context)
        ? undefined
        : (newValue) => {
            provider.value = newValue;
          }
    });
  });

  return providers as ContextProviderRecord<T>;
}

export interface Context<T> {
  readonly id: symbol;
  readonly initialValue: T;
  provide(
    host: ReactiveControllerHost,
    options?: Omit<ProvideContextOptions<T>, 'id'>
  ): ContextProviderController<T>;
  consume(
    host: ReactiveControllerHost,
    options?: Omit<ConsumeContextOptions<T>, 'id'>
  ): ContextConsumerController<T>;
}

export type DerivedContext<T> = Context<T> & {
  isDerived: true;
};

export type ExtractContextType<C> = C extends Context<infer X> ? X : never;

export type ContextTuple = readonly [Context<any>, ...Array<Context<any>>];

export type ContextTupleValues<Tuple> = {
  readonly [K in keyof Tuple]: ExtractContextType<Tuple[K]>;
};

export type ContextRecord<RecordType> = {
  readonly [P in keyof RecordType]:
    | Context<RecordType[P]>
    | DerivedContext<RecordType[P]>;
};

export type ExtractContextRecordTypes<
  ContextRecordType extends ContextRecord<any>
> = {
  [P in keyof ContextRecordType]: ExtractContextType<ContextRecordType[P]>;
};

export type ContextProviderRecord<
  ContextRecordType extends ContextRecord<any>
> = ExtractContextRecordTypes<
  ReadonlyIfType<DerivedContext<any>, ContextRecordType>
>;
