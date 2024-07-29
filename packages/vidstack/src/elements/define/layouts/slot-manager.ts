import { onDispose } from 'maverick.js';
import { animationFrameThrottle } from 'maverick.js/std';

import { SlotObserver } from './slot-observer';

let id = 0,
  slotIdAttr = 'data-slot-id';

export class SlotManager {
  readonly #roots: HTMLElement[];
  readonly slots: SlotObserver;

  constructor(roots: HTMLElement[]) {
    this.#roots = roots;
    this.slots = new SlotObserver(roots, this.#update.bind(this));
  }

  connect() {
    this.slots.connect();
    this.#update();

    const mutations = new MutationObserver(this.#onMutation);
    for (const root of this.#roots) mutations.observe(root, { childList: true });
    onDispose(() => mutations.disconnect());
  }

  #onMutation = animationFrameThrottle(this.#update.bind(this));

  #update() {
    for (const root of this.#roots) {
      for (const node of root.children) {
        if (node.nodeType !== 1) continue;

        const name = node.getAttribute('slot');
        if (!name) continue;

        (node as HTMLElement).style.display = 'none';

        let slotId = node.getAttribute(slotIdAttr);
        if (!slotId) {
          node.setAttribute(slotIdAttr, (slotId = ++id + ''));
        }

        for (const slot of this.slots.elements) {
          if (slot.getAttribute('name') !== name || slot.getAttribute(slotIdAttr) === slotId) {
            continue;
          }

          const clone = document.importNode(node, true);

          if (name.includes('-icon')) clone.classList.add('vds-icon');
          (clone as HTMLElement).style.display = '';
          clone.removeAttribute('slot');

          this.slots.assign(clone, slot);
          slot.setAttribute(slotIdAttr, slotId);
        }
      }
    }
  }
}
