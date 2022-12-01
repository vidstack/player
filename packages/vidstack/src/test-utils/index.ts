import { listenEvent } from 'maverick.js/std';

export async function waitForEvent<EventType extends keyof HTMLElementEventMap>(
  target: EventTarget,
  type: EventType,
  options?: (EventListenerOptions | AddEventListenerOptions) & { timeout?: number },
): Promise<HTMLElementEventMap[EventType]> {
  return new Promise((resolve, reject) => {
    const timerId = window.setTimeout(() => {
      reject(`Timed out waiting for event \`${type}\`.`);
    }, options?.timeout ?? 1000);

    listenEvent(
      target,
      type as string,
      (event: any) => {
        window.clearTimeout(timerId);
        resolve(event);
      },
      options,
    );
  });
}
