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
  const $focus = signal(false);

  onConnect(() => {
    const target = $target()!;

    effect(() => {
      if (!$keyboard()) {
        $focus.set(false);
        updateFocusAttr(target, false);
        listenEvent(target, 'pointerenter', () => updateHoverAttr(target, true));
        listenEvent(target, 'pointerleave', () => updateHoverAttr(target, false));
        return;
      }

      updateFocusAttr(target, document.activeElement === target);

      listenEvent(target, 'focus', () => {
        $focus.set(true);
        updateFocusAttr(target, true);
      });

      listenEvent(target, 'blur', () => {
        $focus.set(false);
        updateFocusAttr(target, false);
      });
    });
  });

  return $focus;
}

function updateFocusAttr(target: Element, visible: boolean) {
  setAttribute(target, 'data-focus', visible);
  setAttribute(target, 'data-hocus', visible);
}

function updateHoverAttr(target: Element, visible: boolean) {
  setAttribute(target, 'data-hocus', visible);
}
