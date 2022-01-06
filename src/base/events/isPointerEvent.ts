export function isPointerEvent(
  event: Event | undefined
): event is PointerEvent {
  return event?.type.includes('pointer') ?? false;
}
