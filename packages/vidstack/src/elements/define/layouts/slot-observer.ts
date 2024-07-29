import { render, type TemplateResult } from 'lit-html';
import { onDispose } from 'maverick.js';
import { animationFrameThrottle, isDOMNode } from 'maverick.js/std';

export class SlotObserver {
  #roots: HTMLElement[];
  #callback: SlotObserverCallback;

  readonly elements = new Set<HTMLSlotElement>();

  constructor(roots: HTMLElement[], callback: SlotObserverCallback) {
    this.#roots = roots;
    this.#callback = callback;
  }

  connect() {
    this.#update();

    const observer = new MutationObserver(this.#onMutation);
    for (const root of this.#roots) observer.observe(root, { childList: true, subtree: true });
    onDispose(() => observer.disconnect());

    onDispose(this.disconnect.bind(this));
  }

  disconnect() {
    this.elements.clear();
  }

  assign(template: Element | TemplateResult, slot: HTMLSlotElement) {
    if (isDOMNode(template)) {
      slot.textContent = '';
      slot.append(template);
    } else {
      render(null, slot);
      render(template, slot);
    }

    if (!slot.style.display) {
      slot.style.display = 'contents';
    }

    const el = slot.firstElementChild;
    if (!el) return;

    const classList = slot.getAttribute('data-class');
    if (classList) el.classList.add(...classList.split(' '));
  }

  #onMutation = animationFrameThrottle(this.#update.bind(this));

  #update(entries?: MutationRecord[]) {
    if (entries && !entries.some((e) => e.addedNodes.length)) return;

    let changed = false,
      slots = this.#roots.flatMap((root) => [...root.querySelectorAll('slot')]);

    for (const slot of slots) {
      if (!slot.hasAttribute('name') || this.elements.has(slot)) continue;
      this.elements.add(slot);
      changed = true;
    }

    if (changed) this.#callback(this.elements);
  }
}

export interface SlotObserverCallback {
  (slots: Set<HTMLSlotElement>): void;
}
