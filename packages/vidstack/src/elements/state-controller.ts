import { effect, type ReadSignal } from 'maverick.js';
import { requestScopedAnimationFrame } from '../utils/dom';

export class StateController {
  constructor(
    private _el: HTMLElement,
    private _states: ReadSignal<Record<string, boolean>>,
  ) {
    this._observe(this._el);
    requestScopedAnimationFrame(() => {
      const tooltip = this._getTooltip();
      if (tooltip) this._observe(tooltip);
    });
  }

  private _getTooltip() {
    const describedBy =
      this._el.getAttribute('aria-describedby') ?? this._el.getAttribute('data-describedby');
    return describedBy && document.getElementById(describedBy);
  }

  private _observe(root: HTMLElement) {
    effect(this._update.bind(this, root));
  }

  private _update(root: HTMLElement) {
    const states = this._states();
    for (const state of Object.keys(states)) {
      const el = root.querySelector<HTMLElement>(`[data-state="${state}"]`);
      if (el) {
        const display = el.localName === 'slot' ? 'contents' : 'inline-block';
        el.style.display = !states[state] ? 'none' : display;
      }
    }
  }
}
