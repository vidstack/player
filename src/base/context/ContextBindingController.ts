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

    return this;
  }

  /**
   * Removes a context binding.
   */
  unbind(context: Context<any>) {
    const consumer = this._consumers.get(context);
    this.removeContext(context);
    if (consumer) this._bindings.delete(consumer);
    return this;
  }

  protected _handleContextConnect(consumer: ContextConsumerController<any>) {
    if (!this._bindings.has(consumer)) return;
    const binding = this._bindings.get(consumer)!;
    this._handleBindToContext(consumer, binding);
  }

  protected abstract _handleBindToContext(
    consumer: ContextConsumerController<any>,
    binding: Binding
  );

  protected _handleContextUpdate(consumer: ContextConsumerController<any>) {
    if (!this._bindings.has(consumer)) return;
    const binding = this._bindings.get(consumer)!;
    this._handleBindingUpdate(consumer, binding);
  }

  protected abstract _handleBindingUpdate(
    consumer: ContextConsumerController<any>,
    binding: Binding
  );

  protected _handleContextDisconnect(consumer: ContextConsumerController<any>) {
    if (!this._bindings.has(consumer)) return;
    const binding = this._bindings.get(consumer)!;
    this._handleUnbindFromContext(consumer, binding);
  }

  protected abstract _handleUnbindFromContext(
    consumer: ContextConsumerController<any>,
    binding: Binding
  );
}
