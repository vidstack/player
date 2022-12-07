import { listenEvent } from 'maverick.js/std';

export async function waitForEvent<Event>(
  target: EventTarget,
  type: string,
  options?: (EventListenerOptions | AddEventListenerOptions) & { timeout?: number },
): Promise<Event> {
  return new Promise((resolve, reject) => {
    const timerId = window.setTimeout(() => {
      reject(`Timed out waiting for event \`${type}\`.`);
    }, options?.timeout ?? 1000);
    listenEvent(
      target,
      type as any,
      (event: any) => {
        window.clearTimeout(timerId);
        resolve(event);
      },
      options,
    );
  });
}
