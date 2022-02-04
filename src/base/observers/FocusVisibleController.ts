import type { ReactiveElement } from 'lit';

import { DisposalBin, eventListener, listen } from '../events';

/**
 * `:focus-visible` polyfill which adds the `focus-visible` class to the given `host` element
 * when a focus event occurs following a keyboard event.
 */
export class FocusVisibleController {
  constructor(protected readonly _host: ReactiveElement) {
    const disposal = new DisposalBin();

    let hadKeyboardEvent = false;

    disposal.add(
      listen(document, 'pointerdown', () => {
        hadKeyboardEvent = false;
      })
    );

    eventListener(_host, 'keydown', (e) => {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        return;
      }

      hadKeyboardEvent = true;
    });

    eventListener(_host, 'focus', (e) => {
      if (hadKeyboardEvent) {
        _host.classList.add('focus-visible');
      }
    });

    eventListener(_host, 'blur', (e) => {
      _host.classList.remove('focus-visible');
    });

    _host.addController({
      hostDisconnected: () => {
        disposal.empty();
      }
    });
  }
}

export function focusVisiblePolyfill(host: ReactiveElement) {
  return new FocusVisibleController(host);
}
