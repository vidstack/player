import type { ReactiveControllerHost } from 'lit';

import { GlobalEventHandlerMap, listen } from './events';

/**
 * Add an event listener to the given `host` element until it's disconnected from the DOM, at which
 * point the listener will be removed.
 */
export function hostedEventListener<
  EventType extends keyof GlobalEventHandlerMap
>(
  host: ReactiveControllerHost & EventTarget,
  type: EventType,
  listener: GlobalEventHandlerMap[EventType],
  options?: (EventListenerOptions | AddEventListenerOptions) & {
    target?: EventTarget;
  }
) {
  const off = listen(options?.target ?? host, type, listener, options);
  host.addController({ hostDisconnected: off });
}
