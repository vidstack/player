export type GlobalEventHandlerMap = {
  [EventType in keyof GlobalEventHandlersEventMap]?: (
    event: GlobalEventHandlersEventMap[EventType]
  ) => void | Promise<void>;
};

/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 *
 * @param target - The target to listen for the events on.
 * @param type - The name of the event to listen to.
 * @param listener - The function to be called when the event is fired.
 * @param options - Configures the event listener.
 * @returns Stop listening cleanup function.
 * @example
 * ```ts
 * const disposeListener = listen(window, 'resize', () => {});
 *
 * // Stop listening.
 * disposeListener();
 * ```
 */
export function listen<EventType extends keyof GlobalEventHandlerMap>(
  target: EventTarget,
  type: EventType,
  listener: GlobalEventHandlerMap[EventType],
  options?: boolean | EventListenerOptions | AddEventListenerOptions
): () => void {
  target.addEventListener(type, listener as EventListener, options);

  return () => {
    target.removeEventListener(type, listener as EventListener, options);
  };
}
