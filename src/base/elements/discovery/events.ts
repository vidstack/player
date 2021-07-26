import { VdsEvent } from '../../events/index';

export type DiscoveryEventDetail<Discoverable extends Element> = {
  element: Discoverable;
  onDisconnect: (callback: () => void) => void;
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
  TYPE: keyof GlobalEventHandlersEventMap;
  new (...args: any): DiscoveryEvent<Discoverable>;
};
