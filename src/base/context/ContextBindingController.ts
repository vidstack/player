import { DEV_MODE } from '../../global/env';
import { Context } from './context';
import { ContextConsumerController } from './ContextConsumerController';
import { ContextConsumerManager } from './ContextConsumerManager';

/**
 * An abstract class for binding something to a context. For example, you might bind
 * attributes, CSS properties or any number of things in the DOM to a context value.
 */
export abstract class ContextBindingController<
  Binding
> extends ContextConsumerManager {
  protected _bindings = new Map<ContextConsumerController<any>, Binding>();

  bind(context: Context<any>, binding: Binding) {
    const consumer = this.addContext(context);
    this._bindings.set(consumer, binding);

    // First pass won't be called since `bindings` won't contain consumer at time context is added.
    if (consumer.isConnected) {
      this._handleContextConnect(consumer);
      this._handleContextUpdate(consumer);
    }

    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger
        .debugGroup('add binding')
        .appendWithLabel('Context', context)
        .appendWithLabel('Consumer', consumer)
        .appendWithLabel('Binding', binding)
        .end();
    }
    /* c8 ignore stop */

    return this;
  }

  /**
   * Removes a context binding.
   */
  unbind(context: Context<any>) {
    const consumer = this._consumers.get(context);
    this.removeContext(context);

    const binding = consumer ? this._bindings.get(consumer) : undefined;
    if (consumer) this._bindings.delete(consumer);

    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger
        .debugGroup('remove binding')
        .appendWithLabel('Context', context)
        .appendWithLabel('Consumer', consumer)
        .appendWithLabel('Binding', binding)
        .end();
    }
    /* c8 ignore stop */

    return this;
  }

  protected _handleContextConnect(consumer: ContextConsumerController<any>) {
    if (!this._bindings.has(consumer)) return;
    const binding = this._bindings.get(consumer)!;
    this._handleBindToContext(consumer, binding);

    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger
        .debugGroup('binding connected')
        .appendWithLabel('Consumer', consumer)
        .appendWithLabel('Binding', binding)
        .end();
    }
    /* c8 ignore stop */
  }

  protected abstract _handleBindToContext(
    consumer: ContextConsumerController<any>,
    binding: Binding
  );

  protected _handleContextUpdate(consumer: ContextConsumerController<any>) {
    if (!this._bindings.has(consumer)) return;
    const binding = this._bindings.get(consumer)!;
    this._handleBindingUpdate(consumer, binding);

    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger
        .debugGroup('binding update')
        .appendWithLabel('Consumer', consumer)
        .appendWithLabel('Binding', binding)
        .end();
    }
    /* c8 ignore stop */
  }

  protected abstract _handleBindingUpdate(
    consumer: ContextConsumerController<any>,
    binding: Binding
  );

  protected _handleContextDisconnect(consumer: ContextConsumerController<any>) {
    if (!this._bindings.has(consumer)) return;
    const binding = this._bindings.get(consumer)!;
    this._handleUnbindFromContext(consumer, binding);

    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger
        .debugGroup('binding disconnected')
        .appendWithLabel('Consumer', consumer)
        .appendWithLabel('Binding', binding)
        .end();
    }
    /* c8 ignore stop */
  }

  protected abstract _handleUnbindFromContext(
    consumer: ContextConsumerController<any>,
    binding: Binding
  );
}
