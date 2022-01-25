import { GlobalEventHandlerMap, listen } from '../base/events';

export function isPointerEvent(
  event: Event | undefined
): event is PointerEvent {
  return event?.type.includes('pointer') ?? false;
}

export function isKeyboardEvent(
  event: Event | undefined
): event is KeyboardEvent {
  return event?.type.startsWith('key') ?? false;
}

export function isKeyboardClick(event: Event | undefined) {
  return isKeyboardEvent(event) && (event.key === 'Enter' || event.key === ' ');
}

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
