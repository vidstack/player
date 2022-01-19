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
