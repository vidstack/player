import { onDispose, ViewController } from 'maverick.js';

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
    if (shortcuts) el.setAttribute('aria-keyshortcuts', shortcuts);
  }
}
