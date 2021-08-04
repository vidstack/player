import { ReactiveController, ReactiveControllerHost } from 'lit';

import { DEV_MODE } from '../../env';
import { isNil, notEqual } from '../../utils/unit';
import { DisposalBin, listen } from '../events';
import { Logger } from '../logger';
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
   * Provide a name for debugging.
   */
  debug?: string | symbol;
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

  protected _ref?: Element;

  protected _isProviding = false;

  protected readonly _logger!: Logger;

  protected readonly _disposal = new DisposalBin();

  protected readonly _consumers = new Set<
    ContextConsumerConnectEventDetail<any>
  >();

  get id() {
    return this._options.id;
  }

  get debug() {
    return this._options.debug;
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

  /**
   * Whether the provider has attached to an element and is providing the context.
   */
  get isConnected() {
    return this._isProviding;
  }

  constructor(
    protected readonly _host: ReactiveControllerHost,
    public readonly initialValue: T,
    protected readonly _options: ProvideContextOptions<T>
  ) {
    if (DEV_MODE && _options.debug) {
      this._logger = new Logger(_host, {
        name: `🧵 ${String(this.debug)}`,
        owner: this
      });
    }

    this._value = initialValue;
    if (_host instanceof Element) this.setRef(_host);
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

  /**
   * Set a reference to a DOM element that this controller will use to provide the context from
   * by listening to consumer connect events at the given reference.
   */
  setRef(newRef?: Element) {
    if (this._ref !== newRef) {
      this._handleRefChange(newRef);
    }
  }

  protected _handleRefChange(newRef?: Element) {
    const consumers = new Set(this._consumers);
    this.stop(false);
    this._ref = newRef;
    this.start();
    consumers.forEach((consumer) => consumer.reconnect());
  }

  /**
   * Start providing context to consumers.
   */
  start() {
    if (this._isProviding || isNil(this._ref)) {
      return;
    }

    const dispose = listen(
      this._ref,
      'vds-context-consumer-connect',
      this._handleConsumerConnect.bind(this)
    );

    this._disposal.add(dispose);

    this._isProviding = true;

    if (DEV_MODE && this.debug) {
      this._logger.debug('started');
    }
  }

  /**
   * Stop providing context to consumers.
   */
  stop(shouldConsumersReconnect = true) {
    if (!this._isProviding && this._consumers.size === 0) return;

    const consumers = new Set(this._consumers);

    this._disposal.empty();
    this._consumers.clear();
    this._isProviding = false;

    if (shouldConsumersReconnect) {
      consumers.forEach((consumer) => consumer.reconnect());
    }

    if (DEV_MODE && this.debug) {
      this._logger.debug('stopped');
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

    if (DEV_MODE && this.debug) {
      this._logger.debug('updating to', this._value);
    }

    this._consumers.forEach((consumer) => {
      consumer.onUpdate(this._value);
    });

    this._options.onUpdate?.(this._value);
  }
}
