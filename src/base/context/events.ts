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
   * A unique identifier for the current consumer.
   */
  consumerId: symbol;
  /**
   * A name for debugging purposes.
   */
  name?: string | symbol;
  /**
   * Called when the consumer has successfully connected to a pairable provider.
   */
  onConnect(): void;
  /**
   * Called by the provider when the current context value has changed.
   */
  onUpdate(newValue: T): void;
  /**
   * The provider uses this to pass a cleanup callback to the consumer which should be invoked
   * once the consumer host disconnects.
   */
  onDisconnect(callback: () => void): void;
  /**
   * The provider can request the consumer to reconnect if needed. Generally called when the
   * current provider ref changes.
   */
  reconnect(): void;
};

export type ContextConsumerConnectEvent = VdsEvent<
  ContextConsumerConnectEventDetail<any>
>;
