import type { ReactiveControllerHost } from 'lit';

import { DisposalBin, vdsEvent } from '../../events';

/**
 * Fires the given `eventType` when the given `host` connects to the DOM. A discovery event
 * also contains an event detail of the form `{ element: host; onDisconnect: () => void; }`.
 */
export function discover(
  host: ReactiveControllerHost & EventTarget,
  eventType: keyof GlobalEventHandlersEventMap
) {
  const disconnectDisposal = new DisposalBin();

  host.addController({
    hostConnected() {
      const event = vdsEvent(eventType, {
        bubbles: true,
        composed: true,
        detail: {
          element: host,
          onDisconnect: (callback) => {
            disconnectDisposal.add(callback);
          }
        }
      });

      host.dispatchEvent(event);
    },
    hostDisconnected() {
      disconnectDisposal.empty();
    }
  });
}
