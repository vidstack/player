import { onDispose, ViewController } from 'maverick.js';
import { isArray, isString } from 'maverick.js/std';

import { useMediaContext } from '../api/media-context';
import type { MediaKeyShortcut } from './types';

export class ARIAKeyShortcuts extends ViewController {
  constructor(private _shortcut: MediaKeyShortcut) {
    super();
  }

  protected override onAttach(el: HTMLElement): void {
    const { $props, ariaKeys } = useMediaContext(),
      keys = el.getAttribute('aria-keyshortcuts');

    if (keys) {
      ariaKeys[this._shortcut] = keys;

      if (!__SERVER__) {
        onDispose(() => {
          delete ariaKeys[this._shortcut];
        });
      }

      return;
    }

    const shortcuts = $props.keyShortcuts()[this._shortcut];
    if (shortcuts) {
      const keys = isArray(shortcuts)
        ? shortcuts.join(' ')
        : isString(shortcuts)
        ? shortcuts
        : shortcuts?.keys;
      el.setAttribute('aria-keyshortcuts', isArray(keys) ? keys.join(' ') : keys);
    }
  }
}
