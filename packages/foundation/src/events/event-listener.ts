import { type ReactiveControllerHost } from 'lit';

import { type HTMLElementEventCallbackMap, listen } from '../utils/events';

/**
 * Add an event listener to the given `host` element until it's disconnected from the DOM, at which
 * point the listener will be removed.
 */
export function eventListener<EventType extends keyof HTMLElementEventCallbackMap>(
  host: ReactiveControllerHost & EventTarget,
  type: EventType,
  listener: HTMLElementEventCallbackMap[EventType],
  options?: (EventListenerOptions | AddEventListenerOptions) & {
    target?: EventTarget;
  },
) {
  let off: (() => void) | undefined;

  function attach() {
    if (!off) {
      off = listen(options?.target ?? host, type, listener, options);
    }
  }

  attach();

  host.addController({
    hostConnected() {
      attach();
    },
    hostDisconnected() {
      off?.();
      off = undefined;
    },
  });
}
