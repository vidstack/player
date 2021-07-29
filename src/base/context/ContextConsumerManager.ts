import { ReactiveController, ReactiveControllerHost } from 'lit';

import { Context } from './context';
import { ContextConsumerController } from './ContextConsumerController';

/**
 * Handles managing multiple contexts on a given DOM element (`ref`).
 */
export class ContextConsumerManager implements ReactiveController {
  protected _ref?: Element;

  protected _hasHostConnected = false;

  protected readonly _consumers = new Map<
    string,
    ContextConsumerController<unknown>
  >();

  constructor(protected readonly _host: ReactiveControllerHost) {
    if (_host instanceof Element) this.setRef(_host);
    _host.addController(this);
  }

  setRef(newRef: Element) {
    if (this._ref !== newRef) {
      this._consumers.forEach((consumer) => {
        consumer.stop();
        consumer.setRef(newRef);
        if (this._hasHostConnected) consumer.start();
      });

      this._ref = newRef;
    }
  }

  hostConnected() {
    this._hasHostConnected = true;
    this._consumers.forEach((consumer) => consumer.start());
  }

  hostDisconnected() {
    this._hasHostConnected = false;
    this._consumers.forEach((consumer) => consumer.stop());
  }

  addContext(key: string, context: Context<unknown>) {
    const consumer = context.consume(this._host, {
      onConnect: () => this._handleContextConnect(key),
      onUpdate: (value) => this._handleContextUpdate(key, value),
      onDisconnect: () => this._handleContextDisconnect(key)
    });

    consumer.setRef(this._ref);
    if (this._hasHostConnected) consumer.start();

    this._consumers.set(key, consumer);
  }

  removeContext(key: string) {
    this._consumers.get(key)?.stop();
    this._consumers.delete(key);
  }

  protected _handleContextConnect(key: string) {}

  protected _handleContextUpdate(key: string, value: unknown) {}

  protected _handleContextDisconnect(key: string) {}
}
