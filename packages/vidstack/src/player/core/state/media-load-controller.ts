import { ComponentController, ComponentInstance } from 'maverick.js/element';

import type { PlayerAPI } from '../player';

export class MediaLoadController extends ComponentController<PlayerAPI> {
  constructor(instance: ComponentInstance<PlayerAPI>, private _callback: () => void) {
    super(instance);
  }

  protected override async onAttach(el: HTMLElement) {
    if (__SERVER__) return;

    const load = this.$props.load();

    if (load === 'eager') {
      requestAnimationFrame(this._callback);
    } else if (load === 'idle') {
      const { waitIdlePeriod } = await import('maverick.js/std');
      waitIdlePeriod(this._callback);
    } else if (load === 'visible') {
      const observer = new IntersectionObserver((entries) => {
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
