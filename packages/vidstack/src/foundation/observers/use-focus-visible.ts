import { effect, ReadSignal } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

export function useFocusVisible($target: ReadSignal<HTMLElement | null>) {
  let usingKeyboard = false;

  effect(() => {
    const target = $target();
    if (!target) return;

    listenEvent(document, 'pointerdown', () => {
      usingKeyboard = false;
    });

    listenEvent(target, 'keydown', (e) => {
      if (e.metaKey || e.altKey || e.ctrlKey) return;
      usingKeyboard = true;
    });

    listenEvent(target, 'focus', () => {
      if (usingKeyboard) target.classList.add('focus-visible');
    });

    listenEvent(target, 'blur', () => {
      target.classList.remove('focus-visible');
    });
  });
}
