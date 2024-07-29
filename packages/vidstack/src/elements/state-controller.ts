import { effect, onDispose, type ReadSignal } from 'maverick.js';

import { requestScopedAnimationFrame } from '../utils/dom';

export class StateController {
  #el: HTMLElement | null;
  #states: ReadSignal<Record<string, boolean>>;

  constructor(el: HTMLElement | null, states: ReadSignal<Record<string, boolean>>) {
    this.#el = el;
    this.#states = states;

    if (this.#el) this.#observe(this.#el);

    onDispose(() => {
      this.#el = null;
    });

    requestScopedAnimationFrame(() => {
      const tooltip = this.#getTooltip();
      if (tooltip) this.#observe(tooltip);
    });
  }

  #getTooltip() {
    if (!this.#el) return;

    const describedBy =
      this.#el.getAttribute('aria-describedby') ?? this.#el.getAttribute('data-describedby');

    return describedBy && document.getElementById(describedBy);
  }

  #observe(root: HTMLElement) {
    effect(this.#update.bind(this, root));
  }

  #update(root: HTMLElement) {
    const states = this.#states();
    for (const state of Object.keys(states)) {
      const el = root.querySelector<HTMLElement>(`[data-state="${state}"]`);
      if (el) {
        const display = el.localName === 'slot' ? 'contents' : 'inline-block';
        el.style.display = !states[state] ? 'none' : display;
      }
    }
  }
}
