import { waitIdlePeriod } from 'maverick.js/std';

import { MediaPlayerController } from '../api/player-controller';

export class MediaLoadController extends MediaPlayerController {
  constructor(private _callback: () => void) {
    super();
  }

  override async onAttach(el: HTMLElement) {
    if (__SERVER__) return;

    const load = this.$props.load();

    if (load === 'eager') {
      requestAnimationFrame(this._callback);
    } else if (load === 'idle') {
      waitIdlePeriod(this._callback);
    } else if (load === 'visible') {
      const observer = new IntersectionObserver((entries) => {
        if (!this.scope) return;

        if (entries[0].isIntersecting) {
          observer.disconnect();
          this._callback();
        }
      });

      observer.observe(el);
      return observer.disconnect.bind(observer);
    }
  }
}
