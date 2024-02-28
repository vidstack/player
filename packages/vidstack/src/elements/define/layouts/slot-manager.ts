import { onDispose } from 'maverick.js';
import { animationFrameThrottle } from 'maverick.js/std';

import { SlotObserver } from './slot-observer';

let id = 0,
  slotIdAttr = 'data-slot-id';

export class SlotManager {
  readonly slots: SlotObserver;

  constructor(protected _roots: HTMLElement[]) {
    this.slots = new SlotObserver(_roots, this._update.bind(this));
  }

  connect() {
    this.slots.connect();
    this._update();

    const mutations = new MutationObserver(this._onMutation);
    for (const root of this._roots) mutations.observe(root, { childList: true });
    onDispose(() => mutations.disconnect());
  }

  private _onMutation = animationFrameThrottle(this._update.bind(this));

  private _update() {
    for (const root of this._roots) {
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
