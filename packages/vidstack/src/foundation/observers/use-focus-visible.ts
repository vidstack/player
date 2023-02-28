import { effect, ReadSignal, signal } from 'maverick.js';
import { onConnect } from 'maverick.js/element';
import { listenEvent, setAttribute } from 'maverick.js/std';

export function useFocusVisible($target: ReadSignal<Element | null>) {
  onConnect(() => {
    const target = $target()!,
      $keyboard = usingKeyboard();

    effect(() => {
      if (!$keyboard()) {
        updateFocusAttr(target, false);
        listenEvent(target, 'pointerenter', () => updateHoverAttr(target, true));
        listenEvent(target, 'pointerleave', () => updateHoverAttr(target, false));
        return;
      }

      updateFocusAttr(target, document.activeElement === target);
      listenEvent(target, 'focus', () => updateFocusAttr(target, true));
      listenEvent(target, 'blur', () => updateFocusAttr(target, false));
    });
  });
}

let trackingKeyboard = false,
  $keyboard = signal(false);

export function usingKeyboard(): ReadSignal<boolean> {
  if (trackingKeyboard) return $keyboard;

  listenEvent(document, 'pointerdown', () => {
    $keyboard.set(false);
  });

  listenEvent(document, 'keydown', (e) => {
    if (e.metaKey || e.altKey || e.ctrlKey) return;
    $keyboard.set(true);
  });

  trackingKeyboard = true;
  return $keyboard;
}

function updateFocusAttr(target: Element, visible: boolean) {
  setAttribute(target, 'data-focus', visible);
  setAttribute(target, 'data-hocus', visible);
}

function updateHoverAttr(target: Element, visible: boolean) {
  setAttribute(target, 'data-hocus', visible);
}
