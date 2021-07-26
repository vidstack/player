import { isFunction } from '@utils/unit';

import { defineContextConsumer, defineContextProvider } from './define';
import {
  Context,
  ContextConsumeOptions,
  ContextConsumerDeclaration,
  ContextConsumerDeclarations,
  ContextHostConstructor,
  ContextInitializer,
  ContextProvideOptions,
  ContextProviderDeclaration,
  ContextProviderDeclarations
} from './types';

const FINALIZED = Symbol('Vidstack.withContextFinalized');

/**
 * This mixin is provided for plain JavaScript users to consume and provide contexts. If you're
 * using TypeScript refer to the `@consumeContext` and `@provideContext` decorators.
 *
 * @param Base - The base constructor to mix into.
 * @returns `Base` class extended with the ability to provide and consume contexts.
 */
export function WithContext<T extends ContextHostConstructor>(
  Base: T
): ContextInitializer & T {
  return class WithContextMixin extends Base {
    static override get contextConsumers(): ContextConsumerDeclarations {
      return {};
    }

    static override get contextProviders(): ContextProviderDeclarations {
      return {};
    }

    // -------------------------------------------------------------------------------------------
    // Context
    // -------------------------------------------------------------------------------------------

    static get observedAttributes() {
      // @ts-ignore
      const attributes = super.observedAttributes;
      // Piggy backing on this to ensure we're finalized.
      this.finalizeContext();
      return attributes;
    }

    static finalizeContext() {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(FINALIZED)) return;
      this[FINALIZED] = true;

      const superCtor = Object.getPrototypeOf(this);
      if (isFunction(superCtor?.finalizeContext)) {
        superCtor.finalizeContext();
      }

      this.defineContextProviders();
      this.defineContextConsumers();
    }

    protected static defineContextProviders() {
      const contextProviders = this.contextProviders ?? {};

      Object.keys(contextProviders).forEach((contextPropertyName) => {
        const declaration = contextProviders[
          contextPropertyName
        ] as ContextProviderDeclaration<any>;

        const context =
          'context' in declaration ? declaration.context : declaration;

        const options = 'context' in declaration ? declaration : {};

        this.defineContextProvider(contextPropertyName, context, options);
      });
    }

    static defineContextProvider<T = any>(
      name: string,
      context: Context<T>,
      options: ContextProvideOptions<T> = {}
    ) {
      defineContextProvider(this as any, name, context, options);
    }

    protected static defineContextConsumers() {
      const contextConsumers = this.contextConsumers ?? {};

      Object.keys(contextConsumers).forEach((contextPropertyName) => {
        const declaration = contextConsumers[
          contextPropertyName
        ] as ContextConsumerDeclaration<any>;

        const context =
          'context' in declaration ? declaration.context : declaration;

        const options = 'context' in declaration ? declaration : {};

        this.defineContextConsumer(contextPropertyName, context, options);
      });
    }

    static defineContextConsumer<T = any>(
      name: string,
      context: Context<T>,
      options: ContextConsumeOptions<T> = {}
    ) {
      defineContextConsumer(this as any, name, context, options);
    }
  };
}
