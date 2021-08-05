import { ReactiveController, ReactiveControllerHost } from 'lit';

import { DEV_MODE } from '../../env';
import { isNil, isUndefined, notEqual } from '../../utils/unit';
import { vdsEvent } from '../events';
import { Logger } from '../logger';

export type ConsumeContextOptions<T> = {
  /**
   * A unique identifier used to pair a context provider and consumer.
   */
  id: symbol;
  /**
   * Provide a name for debugging.
   */
  name?: string | symbol;
  /**
   * Whether context updates should also request an update on the controller host to trigger
   * a re-render.
   */
  shouldRequestUpdate?: boolean;
  /**
   * Called when the consumer has connected to a provider.
   */
  onConnect?(): void;
  /**
   * Called when the consumed value is updated.
   */
  onUpdate?(newValue: T): void;
  /**
   * Called when the host controller has disconnected from the DOM or from a connected provider.
   */
  onDisconnect?(): void;
  /**
   * Used to transform the consumed value as it's updated.
   */
  transform?: (newValue: T) => T;
};

export class ContextConsumerController<T> implements ReactiveController {
  protected _value: T;

  protected _ref?: Element;

  protected _hasConnectedToProvider = false;

  protected readonly _logger!: Logger;

  /**
   * Custom `DisposalBin` so there's no infinite dep cycle:
   *
   * Logger -> ContextConsumer -> DisposalBin -> Logger -> ...
   */
  protected readonly _stopDisposal = {
    _bin: [] as (() => void)[],
    add(cb: () => void) {
      if (cb) this._bin.push(cb);
    },
    empty() {
      this._bin.forEach((fn) => fn());
      this._bin = [];
    }
  };

  protected readonly consumerId = Symbol('Vidstack.consumerId');

  get id() {
    return this._options.id;
  }

  get name() {
    return this._options.name;
  }

  get value() {
    return this._value;
  }

  /**
   * Whether the consumer is currently connected to a provider.
   */
  get isConnected() {
    return this._hasConnectedToProvider;
  }

  constructor(
    protected readonly _host: ReactiveControllerHost,
    public readonly initialValue: T,
    protected readonly _options: ConsumeContextOptions<T>
  ) {
    if (DEV_MODE && _options.name) {
      this._logger = new Logger(_host, {
        name: `🧵 ${String(this.name)}`,
        owner: this
      });
    }

    this._value = this._transformValue(initialValue);
    if (_host instanceof Element) this.setRef(_host);
    _host.addController(this);
  }

  hostConnected() {
    this.start();
  }

  hostDisconnected() {
    this._handleContextUpdate(this.initialValue);
    this.stop();
  }

  /**
   * Set a reference to a DOM element that this controller will use to connect to a provider
   * by dispatching a connect event from it. The reference element's position in the DOM will
   * dictate which provider it connects to, since it'll connect to the first parent provider
   * that provides the current context.
   */
  setRef(newRef?: Element) {
    this._ref = newRef;
  }

  /**
   * Start consuming context.
   */
  start() {
    if (this._hasConnectedToProvider || isNil(this._ref)) return;

    if (DEV_MODE && this.name) {
      this._logger.debug('attempting to connect...');
    }

    this._ref.dispatchEvent(
      vdsEvent('vds-context-consumer-connect', {
        bubbles: true,
        composed: true,
        detail: {
          id: this.id,
          name: this.name,
          consumerId: this.consumerId,
          onConnect: this._handleContextConnect.bind(this),
          onUpdate: this._handleContextUpdate.bind(this),
          onDisconnect: this._handleContextDisconnect.bind(this),
          reconnect: this.reconnect.bind(this)
        }
      })
    );
  }

  /**
   * Stop consuming context.
   */
  stop() {
    if (!this._hasConnectedToProvider) return;

    this._stopDisposal.empty();
    this._options.onDisconnect?.();
    this._hasConnectedToProvider = false;

    if (DEV_MODE && this.name) {
      this._logger.debug('stopped');
    }
  }

  /**
   * Stop current connection to provider and attempts to reconnect.
   */
  reconnect() {
    if (DEV_MODE && this.name) {
      this._logger.debug('reconnecting');
    }

    this.stop();
    this.start();
  }

  protected _handleContextConnect() {
    this._hasConnectedToProvider = true;
    this._options.onConnect?.();
    this._options.onUpdate?.(this._value);

    if (DEV_MODE && this.name) {
      this._logger.debug('connected');
    }
  }

  protected _handleContextUpdate(newValue: T) {
    const transformedValue = this._transformValue(newValue);

    if (notEqual(transformedValue, this._value)) {
      this._value = transformedValue;
      this._options.onUpdate?.(transformedValue);

      if (this._options.shouldRequestUpdate) {
        this._host.requestUpdate();
      }

      if (DEV_MODE && this.name) {
        this._logger.debug('updated to', newValue);
      }
    }
  }

  protected _handleContextDisconnect(callback: () => void) {
    this._stopDisposal.add(callback);
  }

  protected _transformValue(value: T): T {
    return !isUndefined(this._options.transform)
      ? this._options.transform(value)
      : value;
  }
}
