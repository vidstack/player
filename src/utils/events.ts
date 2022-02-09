import { GlobalEventHandlerMap, listen } from '../base/events';

function eventTypeIncludes(event: Event | undefined, types: string[]) {
  return types.some((type) => event?.type.includes(type) ?? false);
}

export function isPointerEvent(
  event: Event | undefined
): event is PointerEvent {
  return eventTypeIncludes(event, ['pointer']);
}

export function isTouchEvent(event: Event | undefined): event is TouchEvent {
  return eventTypeIncludes(event, ['touch']);
}

export function isMouseEvent(event: Event | undefined): event is MouseEvent {
  return eventTypeIncludes(event, ['click', 'mouse']);
}

export function isKeyboardEvent(
  event: Event | undefined
): event is KeyboardEvent {
  return eventTypeIncludes(event, ['key']);
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
