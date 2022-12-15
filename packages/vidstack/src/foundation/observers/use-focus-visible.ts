import { effect, ReadSignal } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

export function useFocusVisible($target: ReadSignal<Element | null>) {
  let keyboard = false;
  effect(() => {
    const target = $target();
    if (!target) return;

    listenEvent(document, 'pointerdown', () => {
      keyboard = false;
    });

    listenEvent(target, 'keydown', (e) => {
      if (e.metaKey || e.altKey || e.ctrlKey) return;
      keyboard = true;
    });

    listenEvent(target, 'focus', () => {
      if (keyboard) target.classList.add('focus-visible');
    });

    listenEvent(target, 'blur', () => {
      target.classList.remove('focus-visible');
    });
  });
}
