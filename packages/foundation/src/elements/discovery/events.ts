import { VdsEvent } from '../../events';

export type DisconnectCallback = (callback: () => void) => void;

export type DiscoveryEventDetail<Discoverable extends Element> = {
  element: Discoverable;
  onDisconnect: DisconnectCallback;
};

/**
 * @event
 * @bubbles
 * @composed
 */
export type DiscoveryEvent<Discoverable extends Element> = VdsEvent<
  DiscoveryEventDetail<Discoverable>
>;

export type ScopedDiscoveryEvent<Discoverable extends Element = Element> = {
  TYPE: keyof HTMLElementEventMap;
  new (...args: any): DiscoveryEvent<Discoverable>;
};
