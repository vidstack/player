import { effect, type ReadSignal } from 'maverick.js';
import { setAttribute } from 'maverick.js/std';

import { useMediaContext } from '../../../core/api/media-context';

export function setLayoutName(name: string, isMatch: ReadSignal<boolean>) {
  effect(() => {
    const { player } = useMediaContext(),
      el = player.el;

    el && setAttribute(el, 'data-layout', isMatch() && name);

    return () => el?.removeAttribute('data-layout');
  });
}
