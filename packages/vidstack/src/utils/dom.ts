import { effect, getScope, scoped } from 'maverick.js';
import { isKeyboardClick, listenEvent, setAttribute } from 'maverick.js/std';

export function setAttributeIfEmpty(target: Element, name: string, value: string) {
  if (!target.hasAttribute(name)) target.setAttribute(name, value);
}

export function setARIALabel(target: Element, label: () => string | null) {
  if (target.hasAttribute('aria-label') || target.hasAttribute('aria-describedby')) return;

  function updateAriaDescription() {
    setAttribute(target, 'aria-label', label());
  }

  if (__SERVER__) updateAriaDescription();
  else effect(updateAriaDescription);
}

export function isElementParent(
  owner: Element,
  node: Element | null,
  test?: (node: Element) => boolean,
) {
  while (node) {
    if (node === owner) {
      return true;
    } else if (node.localName === owner.localName || test?.(node)) {
      break;
    } else {
      node = node.parentElement;
    }
  }

  return false;
}

export function onPress(
  target: EventTarget,
  handler: (event: PointerEvent | KeyboardEvent) => void,
) {
  listenEvent(target, 'pointerup', handler as any);
  listenEvent(target, 'keydown', (event) => {
    if (isKeyboardClick(event)) handler(event);
  });
}

export function scopedRaf(callback: () => void) {
  if (__SERVER__) return callback();
  const scope = getScope();
  requestAnimationFrame(() => scoped(callback, scope));
}
