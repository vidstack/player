import type { ReactiveControllerHost } from 'lit';

import { DisposalBin, listen } from '../events';
import type { ContextConsumerConnectEvent } from './events';

export type ProvideContextOptions<T> = {
  /**
   * A unique identifier used to pair a context provider and consumer.
   */
  id: symbol;
};

export class ContextProviderController<T> {
  protected _stopDisposal = new DisposalBin();
  protected _value: T;

  get id() {
    return this._options.id;
  }

  get value() {
    return this._value;
  }

  constructor(
    protected readonly _host: ReactiveControllerHost & EventTarget,
    readonly _initValue: () => T,
    protected readonly _options: ProvideContextOptions<T>
  ) {
    this._value = _initValue();
    _host.addController({
      hostConnected: this.start.bind(this),
      hostDisconnected: this.stop.bind(this)
    });
  }

  /**
   * Start providing context to consumers.
   */
  start() {
    const dispose = listen(
      this._host,
      'vds-context-consumer-connect',
      this._handleConsumerConnect.bind(this)
    );

    this._stopDisposal.add(dispose);
  }

  /**
   * Stop providing context to consumers.
   */
  stop() {
    this._stopDisposal.empty();
  }

  protected _handleConsumerConnect(event: ContextConsumerConnectEvent) {
    const consumer = event.detail;

    // Validate event was dispatched by a pairable consumer.
    if (consumer.id !== this.id) return;

    // Stop propagation of the event to prevent pairing with similar context providers.
    event.stopImmediatePropagation();

    consumer.setValue(this._value);
  }
}
