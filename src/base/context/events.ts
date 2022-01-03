import { VdsEvent } from '../events';

export type ContextEvents = {
  'vds-context-consumer-connect': ContextConsumerConnectEvent;
};

export type ContextConsumerConnectEventDetail<T> = {
  /**
   * A unique identifier used to pair a context provider and consumer.
   */
  id: symbol;
  /**
   * Sets value on context consumer.
   */
  setValue(value: T): void;
};

export type ContextConsumerConnectEvent = VdsEvent<
  ContextConsumerConnectEventDetail<any>
>;
