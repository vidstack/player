import { DisposalBin, listen } from '@base/events';
import { isNil, notEqual } from '@utils/unit';
import { ReactiveController, ReactiveControllerHost } from 'lit';

import {
  ContextConsumerConnectEvent,
  ContextConsumerConnectEventDetail
} from './events';

export type ProvideContextOptions<T> = {
  /**
   * A unique identifier used to pair a context provider and consumer.
   */
  id: symbol;
  /**
   * Called when the host controller has connected to the DOM.
   */
  onConnect?(): void;
  /**
   * Called when the provider value is updated.
   */
  onUpdate?(newValue: T): void;
  /**
   * Called when the host controller has disconnected from the DOM.
   */
  onDisconnect?(): void;
};

export class ContextProviderController<T> implements ReactiveController {
  protected _value: T;

  protected _target?: EventTarget;

  protected _isProviding = false;

  protected readonly _disposal = new DisposalBin();

  protected readonly _consumers = new Set<
    ContextConsumerConnectEventDetail<any>
  >();

  get id() {
    return this._options.id;
  }

  get value() {
    return this._value;
  }

  set value(newValue: T) {
    if (notEqual(newValue, this._value)) {
      this._value = newValue;
      this._updateConsumers();
    }
  }

  constructor(
    protected readonly _host: ReactiveControllerHost,
    public readonly initialValue: T,
    protected readonly _options: ProvideContextOptions<T>
  ) {
    this._value = initialValue;
    if (_host instanceof EventTarget) this.setTarget(_host);
    _host.addController(this);
  }

  hostConnected() {
    this.start();
    this._options.onConnect?.();
  }

  hostDisconnected() {
    // Reset value on disconnect.
    this.value = this.initialValue;
    this.stop(false);
    this._options.onDisconnect?.();
  }

  setTarget(newTarget?: EventTarget) {
    if (this._target !== newTarget) {
      const consumers = new Set(this._consumers);
      this.stop(false);
      this._target = newTarget;
      this.start();
      consumers.forEach((consumer) => consumer.reconnect());
    }
  }

  /**
   * Start providing context to consumers.
   */
  start() {
    if (this._isProviding || isNil(this._target)) {
      return;
    }

    const dispose = listen(
      this._target,
      'vds-context-consumer-connect',
      this._handleConsumerConnect.bind(this)
    );

    this._disposal.add(dispose);

    this._isProviding = true;
  }

  /**
   * Stop providing context to consumers.
   */
  stop(shouldConsumersReconnect = true) {
    const consumers = new Set(this._consumers);
    this._disposal.empty();
    this._consumers.clear();
    this._isProviding = false;
    if (shouldConsumersReconnect) {
      consumers.forEach((consumer) => consumer.reconnect());
    }
  }

  protected _handleConsumerConnect(event: ContextConsumerConnectEvent) {
    const consumer = event.detail;

    // Validate event was dispatched by a pairable consumer.
    if (consumer.id !== this.id) return;

    // Stop propagation of the event to prevent pairing with similar context providers.
    event.stopImmediatePropagation();

    consumer.onConnect();

    consumer.onUpdate(this._value);

    consumer.onDisconnect(() => {
      this._consumers.delete(consumer);
    });

    this._consumers.add(consumer);
  }

  protected _updateConsumers() {
    if (!this._isProviding) return;

    this._consumers.forEach((consumer) => {
      consumer.onUpdate(this._value);
    });

    this._options.onUpdate?.(this._value);
  }
}
