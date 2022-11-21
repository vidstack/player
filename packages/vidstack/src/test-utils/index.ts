import { listen } from 'maverick.js/std';

export async function waitForEvent<EventType extends keyof MaverickEventRecord>(
  target: EventTarget,
  type: EventType,
  options?: (EventListenerOptions | AddEventListenerOptions) & { timeout?: number },
): Promise<MaverickEventRecord[EventType]> {
  return new Promise((resolve, reject) => {
    const timerId = window.setTimeout(() => {
      reject(`Timed out waiting for event \`${type}\`.`);
    }, options?.timeout ?? 1000);

    listen(
      target,
      type,
      (event: any) => {
        window.clearTimeout(timerId);
        resolve(event);
      },
      options,
    );
  });
}
