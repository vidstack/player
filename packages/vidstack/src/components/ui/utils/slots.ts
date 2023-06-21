import { effect, onDispose, ViewController, type ReadSignal } from 'maverick.js';
import { setStyle } from 'maverick.js/std';

import { requestScopedAnimationFrame } from '../../../utils/dom';

export class Slots extends ViewController {
  constructor(private _slots: ReadSignal<Record<string, boolean>>) {
    super();
  }

  protected override onConnect(el: HTMLElement): void {
    this._observe(el);
    onDispose(
      requestScopedAnimationFrame(() => {
        const tooltip = this._getTooltip();
        if (tooltip) this._observe(tooltip);
      }),
    );
  }

  private _getTooltip() {
    const describedBy =
      this.el!.getAttribute('aria-describedby') || this.el!.getAttribute('data-describedby');
    return describedBy && document.getElementById(describedBy);
  }

  private _observe(el: HTMLElement) {
    return effect(() => {
      const slots = this._slots();
      for (const slot of Object.keys(slots)) {
        const slotEl = el.querySelector(`[slot="${slot}"],[data-state="${slot}"]`);
        slotEl &&
          setStyle(slotEl as HTMLElement, 'display', !slots[slot] ? 'none' : 'inline-block');
      }
    });
  }
}
