import { type ReactiveControllerHost } from 'lit';

import { vdsEvent } from '../../events';
import { DisposalBin } from '../../utils/events';
import { type DisconnectCallback } from './events';

export type DiscovererHost = ReactiveControllerHost & HTMLElement;

export type DiscoveryCallback = (element: HTMLElement, onDisconnect: DisconnectCallback) => void;

export type Discoverer = {
  host: DiscovererHost;
  callback: DiscoveryCallback;
};

export type Discoverable = {
  element: HTMLElement;
  onDisconnect: DisconnectCallback;
};

const discoverers = new Map<symbol, Set<Discoverer>>();
const discoverables = new Map<symbol, Set<Discoverable>>();

function connect(discoverable: HTMLElement, id: symbol, onDisconnect: DisconnectCallback) {
  for (const { host, callback } of Array.from(discoverers.get(id) ?? [])) {
    if (host !== discoverable && host.contains(discoverable)) {
      callback(discoverable, onDisconnect);
    }
  }
}

function find(host: DiscovererHost, id: symbol) {
  return Array.from(discoverables.get(id) ?? []).filter(
    ({ element }) => host !== element && host.contains(element),
  );
}

export function discover(host: DiscovererHost, id: symbol, callback: DiscoveryCallback) {
  const discoverer: Discoverer = { host, callback };

  host.addController({
    hostConnected: () => {
      // This handles a late discoverer connection.
      for (const { element, onDisconnect } of find(host, id)) {
        callback(element, onDisconnect);
      }

      discoverers.set(id, (discoverers.get(id) ?? new Set()).add(discoverer));
    },
    hostDisconnected: () => {
      discoverers.get(id)?.delete(discoverer);
    },
  });
}

/**
 * Fires the given `eventType` when the given `host` connects to the DOM. A discovery event
 * also contains an event detail of the form `{ element: host; onDisconnect: () => void; }`.
 *
 * The discoverable element can be registered so other elements can be guaranteed to discover
 * it using the `discover()` function. Events can be missed depending on the define import order
 * because slotted custom elements may be defined before their parent.
 */
export function discoverable(
  host: DiscovererHost,
  eventType: keyof VdsElementEventMap,
  options: { register?: symbol } = {},
) {
  const id = options.register;

  const disconnectDisposal = new DisposalBin();
  const onDisconnect: DisconnectCallback = (callback) => {
    disconnectDisposal.add(callback);
  };

  const discoverable = {
    element: host,
    onDisconnect,
  };

  host.addController({
    hostConnected() {
      const event = vdsEvent(eventType, {
        bubbles: true,
        composed: true,
        detail: discoverable,
      });

      host.dispatchEvent(event);

      if (id) {
        discoverables.set(id, (discoverables.get(id) ?? new Set()).add(discoverable));
        connect(host, id, onDisconnect);
      }
    },
    hostDisconnected() {
      disconnectDisposal.empty();

      if (id) {
        discoverables.get(id)?.delete(discoverable);
      }
    },
  });
}
