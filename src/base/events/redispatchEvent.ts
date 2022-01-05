import { VdsEvent } from './VdsEvent';

export function redispatchEvent(
  target: EventTarget,
  event: Event | CustomEvent | VdsEvent
) {
  if (event.bubbles && event.composed) return;

  const newEvent = new VdsEvent(event.type, {
    originalEvent: (event as VdsEvent).originalEvent ?? event,
    detail: (event as CustomEvent).detail,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    composed: event.composed
  });

  target.dispatchEvent(newEvent);
}
