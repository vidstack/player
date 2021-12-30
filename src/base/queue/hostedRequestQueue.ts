import type { ReactiveControllerHost } from 'lit';

import { RequestQueue } from './RequestQueue';

/**
 * Creates and returns a `RequestQueue` that starts when the given `host` element connects
 * to the DOM, and destroys it when the `host`disconnects from the DOM.
 */
export function createHostedRequestQueue(host: ReactiveControllerHost) {
  const q = new RequestQueue();

  host.addController({
    hostConnected: q.start.bind(q),
    hostDisconnected: q.destroy.bind(q)
  });

  return q;
}
