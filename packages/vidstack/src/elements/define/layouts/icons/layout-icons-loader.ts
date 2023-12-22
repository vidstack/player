import { onDispose } from 'maverick.js';

import { IconsLoader } from './icons-loader';

export abstract class LayoutIconsLoader extends IconsLoader {
  override connect() {
    super.connect();

    const target = this._root.parentElement;
    if (!target) return;

    let dispose: (() => void) | undefined,
      observer = new IntersectionObserver((entries) => {
        if (!entries[0]?.isIntersecting) return;
        dispose?.();
        dispose = undefined;
        this.load();
      });

    observer.observe(target);
    dispose = onDispose(() => observer.disconnect());
  }
}
