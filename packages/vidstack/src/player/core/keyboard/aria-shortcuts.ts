import { onDispose } from 'maverick.js';
import { ComponentController, ComponentInstance } from 'maverick.js/element';

import { useMedia } from '../api/context';
import type { MediaKeyShortcut } from './types';

export class ARIAKeyShortcuts extends ComponentController {
  constructor(instance: ComponentInstance, private _shortcut: MediaKeyShortcut) {
    super(instance);
  }

  protected override onAttach(el: HTMLElement): void {
    const { $props, ariaKeys } = useMedia(),
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
