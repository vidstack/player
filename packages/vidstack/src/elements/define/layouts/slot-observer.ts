import { render, type TemplateResult } from 'lit-html';
import { onDispose } from 'maverick.js';
import { animationFrameThrottle, isDOMNode } from 'maverick.js/std';

export class SlotObserver {
  readonly elements = new Set<HTMLSlotElement>();

  constructor(
    protected _roots: HTMLElement[],
    protected _callback: SlotObserverCallback,
  ) {}

  connect() {
    this._update();

    const observer = new MutationObserver(this._onMutation);
    for (const root of this._roots) observer.observe(root, { childList: true, subtree: true });
    onDispose(() => observer.disconnect());

    onDispose(this.disconnect.bind(this));
  }

  disconnect() {
    this.elements.clear();
  }

  assign(template: Element | TemplateResult, slot: HTMLSlotElement) {
    slot.textContent = '';

    if (isDOMNode(template)) {
      slot.append(template);
    } else {
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

  private _onMutation = animationFrameThrottle(this._update.bind(this));

  private _update(entries?: MutationRecord[]) {
    if (entries && !entries.some((e) => e.addedNodes.length)) return;

    let changed = false,
      slots = this._roots.flatMap((root) => [...root.querySelectorAll('slot')]);

    for (const slot of slots) {
      if (!slot.hasAttribute('name') || this.elements.has(slot)) continue;
      this.elements.add(slot);
      changed = true;
    }

    if (changed) this._callback(this.elements);
  }
}

export interface SlotObserverCallback {
  (slots: Set<HTMLSlotElement>): void;
}
