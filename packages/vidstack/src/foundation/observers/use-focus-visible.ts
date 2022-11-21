import { onConnect } from 'maverick.js/element';
import { listenEvent } from 'maverick.js/std';

export function useHostedFocusVisible() {
  let usingKeyboard = false;

  onConnect((host) => {
    listenEvent(document, 'pointerdown', () => {
      usingKeyboard = false;
    });

    listenEvent(host, 'keydown', (e) => {
      if (e.metaKey || e.altKey || e.ctrlKey) return;
      usingKeyboard = true;
    });

    listenEvent(host, 'focus', (e) => {
      if (usingKeyboard) {
        host.classList.add('focus-visible');
      }
    });

    listenEvent(host, 'blur', (e) => {
      host.classList.remove('focus-visible');
    });
  });
}
