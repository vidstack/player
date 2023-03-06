import { effect, ReadSignal, signal } from 'maverick.js';
import { onConnect } from 'maverick.js/element';
import { listenEvent, setAttribute } from 'maverick.js/std';

let $keyboard = signal(false);

if (!__SERVER__) {
  listenEvent(document, 'pointerdown', () => {
    $keyboard.set(false);
  });

  listenEvent(document, 'keydown', (e) => {
    if (e.metaKey || e.altKey || e.ctrlKey) return;
    $keyboard.set(true);
  });
}

export function useFocusVisible($target: ReadSignal<Element | null>): ReadSignal<boolean> {
  const $focused = signal(false);

  onConnect(() => {
    const target = $target()!;

    effect(() => {
      if (!$keyboard()) {
        $focused.set(false);
        updateFocusAttr(target, false);
        listenEvent(target, 'pointerenter', () => updateHoverAttr(target, true));
        listenEvent(target, 'pointerleave', () => updateHoverAttr(target, false));
        return;
      }

      const active = document.activeElement === target;
      $focused.set(active);
      updateFocusAttr(target, active);

      listenEvent(target, 'focus', () => {
        $focused.set(true);
        updateFocusAttr(target, true);
      });

      listenEvent(target, 'blur', () => {
        $focused.set(false);
        updateFocusAttr(target, false);
      });
    });
  });

  return $focused;
}

function updateFocusAttr(target: Element, isFocused: boolean) {
  setAttribute(target, 'data-focus', isFocused);
  setAttribute(target, 'data-hocus', isFocused);
}

function updateHoverAttr(target: Element, isHovering: boolean) {
  setAttribute(target, 'data-hocus', isHovering);
}
