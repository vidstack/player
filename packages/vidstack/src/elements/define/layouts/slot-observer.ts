import { render, type TemplateResult } from 'lit-html';
import { onDispose } from 'maverick.js';
import { animationFrameThrottle } from 'maverick.js/std';

export class SlotObserver {
  readonly elements = new Set<HTMLSlotElement>();

  constructor(
    protected _root: HTMLElement,
    protected _callback: SlotObserverCallback,
  ) {}

  connect() {
    this._update();

    const observer = new MutationObserver(this._onMutation);
    observer.observe(this._root, { childList: true });
    onDispose(() => observer.disconnect());

    onDispose(this.disconnect.bind(this));
  }

  disconnect() {
    this.elements.clear();
  }

  assign(template: Element | TemplateResult, slot: HTMLSlotElement) {
    if (template instanceof Node) {
      slot.textContent = '';
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

  private _update() {
    for (const slot of this._root.querySelectorAll('slot')) {
      if (slot.hasAttribute('name')) this.elements.add(slot);
    }

    this._callback(this.elements);
  }
}

export interface SlotObserverCallback {
  (slots: Set<HTMLSlotElement>): void;
}
