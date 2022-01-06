import { GlobalEventHandlerMap, listen } from '../../base/events';

export async function waitForEvent<
  EventType extends keyof GlobalEventHandlerMap
>(
  target: EventTarget,
  type: EventType,
  options?: (EventListenerOptions | AddEventListenerOptions) & {
    timeout?: number;
  }
): Promise<GlobalEventHandlersEventMap[EventType]> {
  return new Promise((resolve, reject) => {
    const timerId = window.setTimeout(() => {
      reject(`Timed out waiting for event \`${type}\`.`);
    }, options?.timeout ?? 1000);

    listen(
      target,
      type,
      (e) => {
        window.clearTimeout(timerId);
        resolve(e);
      },
      options
    );
  });
}
