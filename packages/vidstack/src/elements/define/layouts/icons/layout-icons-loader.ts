import { onDispose } from 'maverick.js';

import { useMediaContext } from '../../../../core/api/media-context';
import { IconsLoader } from './icons-loader';

export abstract class LayoutIconsLoader extends IconsLoader {
  override connect() {
    super.connect();

    const { player } = useMediaContext();
    if (!player.el) return;

    let dispose: (() => void) | undefined,
      observer = new IntersectionObserver((entries) => {
        if (!entries[0]?.isIntersecting) return;
        dispose?.();
        dispose = undefined;
        this.load();
      });

    observer.observe(player.el);
    dispose = onDispose(() => observer.disconnect());
  }
}
