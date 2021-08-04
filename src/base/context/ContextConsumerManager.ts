import { ReactiveController, ReactiveControllerHost } from 'lit';

import { DEV_MODE } from '../../env';
import { Logger } from '../logger';
import { Context } from './context';
import { ContextConsumerController } from './ContextConsumerController';

/**
 * Handles managing multiple context consumers on a given DOM element (`ref`).
 */
export abstract class ContextConsumerManager implements ReactiveController {
  protected _ref?: Element;

  protected _logger!: Logger;

  protected _hasHostConnected = false;

  protected readonly _consumers = new Map<
    Context<any>,
    ContextConsumerController<any>
  >();

  constructor(protected readonly _host: ReactiveControllerHost) {
    if (DEV_MODE) {
      this._logger = new Logger(_host, { owner: this });
    }

    if (_host instanceof Element) this.setRef(_host);
    _host.addController(this);
  }

  setRef(newRef?: Element) {
    if (this._ref !== newRef) {
      this._handleRefChange(newRef);
    }
  }

  protected _handleRefChange(newRef?: Element) {
    this._consumers.forEach((consumer) => {
      consumer.stop();
      consumer.setRef(newRef);
      if (this._hasHostConnected) consumer.start();
    });

    this._ref = newRef;

    if (DEV_MODE) {
      this._logger.debug('ref change', newRef);
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

  addContext(context: Context<any>) {
    if (this._consumers.has(context)) return this._consumers.get(context)!;

    let init = false;

    const consumer = context.consume(this._host, {
      onConnect: () => {
        if (init) this._handleContextConnect(consumer);
      },
      onUpdate: () => {
        if (init) this._handleContextUpdate(consumer);
      },
      onDisconnect: () => {
        if (init) this._handleContextDisconnect(consumer);
      }
    });

    init = true;

    // First pass won't be called since `init` would be false.
    if (consumer.isConnected) {
      this._handleContextConnect(consumer);
      this._handleContextUpdate(consumer);
    }

    consumer.setRef(this._ref);
    if (this._hasHostConnected) consumer.start();

    this._consumers.set(context, consumer);

    if (DEV_MODE) {
      this._logger
        .debugGroup('added context')
        .appendWithLabel('Context', context)
        .appendWithLabel('Consumer', consumer)
        .end();
    }

    return consumer;
  }

  removeContext(context: Context<any>) {
    const consumer = this._consumers.get(context);
    consumer?.stop();
    this._consumers.delete(context);

    if (DEV_MODE) {
      this._logger
        .debugGroup('removed context')
        .appendWithLabel('Context', context)
        .appendWithLabel('Consumer', consumer)
        .end();
    }
  }

  protected abstract _handleContextConnect(
    consumer: ContextConsumerController<any>
  );

  protected abstract _handleContextUpdate(
    consumer: ContextConsumerController<any>
  );

  protected abstract _handleContextDisconnect(
    consumer: ContextConsumerController<any>
  );
}
