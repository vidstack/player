import type { ReactiveControllerHost } from 'lit';

import { vdsEvent } from '../events';

export type ConsumeContextOptions<T> = {
  /**
   * A unique identifier used to pair a context provider and consumer.
   */
  id: symbol;
};

export class ContextConsumerController<T> {
  get id() {
    return this._options.id;
  }

  get value(): T {
    return this._host[this.id] ?? this.initialValue;
  }

  constructor(
    protected readonly _host: ReactiveControllerHost & EventTarget,
    public readonly initialValue: T,
    protected readonly _options: ConsumeContextOptions<T>
  ) {
    _host.addController({
      hostConnected: this._connect.bind(this),
      hostDisconnected: () => {
        delete this._host[this.id];
      }
    });
  }

  /**
   * Attempt connecting to a context provider.
   */
  protected _connect() {
    if (this.id in this._host) {
      return;
    }

    this._host.dispatchEvent(
      vdsEvent('vds-context-consumer-connect', {
        bubbles: true,
        composed: true,
        detail: {
          id: this.id,
          setValue: (value) => {
            this._host[this.id] = value;
          }
        }
      })
    );
  }
}
