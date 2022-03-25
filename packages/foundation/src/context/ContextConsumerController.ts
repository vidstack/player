import { type ReactiveControllerHost } from 'lit';

import { vdsEvent } from '../events';

export type ConsumeContextOptions<T> = {
  /**
   * A unique identifier used to pair a context provider and consumer.
   */
  id: symbol;
};

export type ContextConsumerHost = ReactiveControllerHost & Node;

export type OrphanContextConsumer = {
  host: ContextConsumerHost;
  setValue(value: any): void;
};

const orphanConsumers = new Map<symbol, OrphanContextConsumer[]>();

export class ContextConsumerController<T> {
  protected _registered = false;
  protected _registrationCallbacks?: ((value: T) => void)[] = [];

  get id() {
    return this._options.id;
  }

  get value(): T {
    return this._host[this.id] ?? this.initialValue;
  }

  get registered() {
    return this._registered;
  }

  constructor(
    protected readonly _host: ContextConsumerHost,
    public readonly initialValue: T,
    protected readonly _options: ConsumeContextOptions<T>,
  ) {
    _host.addController({
      hostConnected: () => {
        this._connect();
      },
      hostDisconnected: () => {
        delete this._host[this.id];
      },
    });
  }

  /**
   * Attempt connecting to a context provider.
   */
  protected _connect() {
    if (this.id in this._host) return;

    const setValue = (value) => {
      this._host[this.id] = value;
      this._registered = true;
      this._registrationCallbacks?.forEach((fn) => fn(value));
      this._registrationCallbacks = undefined;
    };

    this._host.dispatchEvent(
      vdsEvent('vds-context-consumer-connect', {
        bubbles: true,
        composed: true,
        detail: {
          id: this.id,
          setValue,
        },
      }),
    );

    if (!this.registered) {
      const orphans = orphanConsumers.get(this.id) ?? [];
      orphans.push({ host: this._host, setValue });
      orphanConsumers.set(this.id, orphans);
    }
  }

  whenRegistered(callback: (value: T) => void) {
    if (this.registered) {
      callback(this.value);
      return;
    }

    this._registrationCallbacks?.push(callback);
  }
}

export function adoptOrphans(id: symbol, provider: Node) {
  const orphans = orphanConsumers.get(id) ?? [];
  const adoptees = orphans.filter(({ host }) => provider.contains(host));

  orphanConsumers.set(
    id,
    orphans.filter(({ host }) => !provider.contains(host)),
  );

  return adoptees;
}
