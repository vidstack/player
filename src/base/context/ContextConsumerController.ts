import type { ReactiveControllerHost } from 'lit';

import { vdsEvent } from '../events';

export type ConsumeContextOptions<T> = {
  /**
   * A unique identifier used to pair a context provider and consumer.
   */
  id: symbol;
};

export class ContextConsumerController<T> {
  protected _value: T;

  get id() {
    return this._options.id;
  }

  get value() {
    return this._value;
  }

  constructor(
    protected readonly _host: ReactiveControllerHost & EventTarget,
    public readonly initialValue: T,
    protected readonly _options: ConsumeContextOptions<T>
  ) {
    this._value = initialValue;
    _host.addController({
      hostConnected: this.connect.bind(this)
    });
  }

  /**
   * Attempt connecting to a context provider.
   */
  connect() {
    this._host.dispatchEvent(
      vdsEvent('vds-context-consumer-connect', {
        bubbles: true,
        composed: true,
        detail: {
          id: this.id,
          setValue: (value) => {
            this._value = value;
          }
        }
      })
    );
  }
}
