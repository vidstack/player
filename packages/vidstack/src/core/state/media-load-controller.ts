import { onDispose } from 'maverick.js';
import { waitIdlePeriod } from 'maverick.js/std';

import { MediaPlayerController } from '../api/player-controller';

export class MediaLoadController extends MediaPlayerController {
  #type: 'load' | 'posterLoad';
  #callback: () => void;

  constructor(type: 'load' | 'posterLoad', callback: () => void) {
    super();
    this.#type = type;
    this.#callback = callback;
  }

  override async onAttach(el: HTMLElement) {
    if (__SERVER__) return;

    const load = this.$props[this.#type]();

    if (load === 'eager') {
      requestAnimationFrame(this.#callback);
    } else if (load === 'idle') {
      waitIdlePeriod(this.#callback);
    } else if (load === 'visible') {
      let dispose: (() => void) | undefined,
        observer = new IntersectionObserver((entries) => {
          if (!this.scope) return;
          if (entries[0].isIntersecting) {
            dispose?.();
            dispose = undefined;
            this.#callback();
          }
        });

      observer.observe(el);
      dispose = onDispose(() => observer.disconnect());
    }
  }
}
