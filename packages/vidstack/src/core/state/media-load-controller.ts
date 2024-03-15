import { onDispose } from 'maverick.js';
import { waitIdlePeriod } from 'maverick.js/std';

import { MediaPlayerController } from '../api/player-controller';

export class MediaLoadController extends MediaPlayerController {
  constructor(
    private _type: 'load' | 'posterLoad',
    private _callback: () => void,
  ) {
    super();
  }

  override async onAttach(el: HTMLElement) {
    if (__SERVER__) return;

    const load = this.$props[this._type]();

    if (load === 'eager') {
      requestAnimationFrame(this._callback);
    } else if (load === 'idle') {
      waitIdlePeriod(this._callback);
    } else if (load === 'visible') {
      let dispose: (() => void) | undefined,
        observer = new IntersectionObserver((entries) => {
          if (!this.scope) return;
          if (entries[0].isIntersecting) {
            dispose?.();
            dispose = undefined;
            this._callback();
          }
        });

      observer.observe(el);
      dispose = onDispose(() => observer.disconnect());
    }
  }
}
