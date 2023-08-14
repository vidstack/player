import { effect, onDispose, peek, signal } from 'maverick.js';
import { animationFrameThrottle } from 'maverick.js/std';

export class SlotObserver {
  private _roots = signal<HTMLElement[]>([]);
  private _slots = new Set<HTMLSlotElement>();

  get elements() {
    return this._slots;
  }

  constructor(private _callback: SlotObserverCallback) {}

  connect() {
    effect(this._watchRoots.bind(this));
    onDispose(this.disconnect.bind(this));
  }

  disconnect() {
    this._roots.set([]);
    this._slots.clear();
  }

  observe(...roots: HTMLElement[]) {
    this._roots.set((r) => [...r, ...roots]);
  }

  private _watchRoots() {
    const roots = this._roots(),
      observer = new MutationObserver(this._onMutation);

    for (const root of roots) {
      observer.observe(root, { childList: true });
    }

    this._update();

    return () => {
      observer.disconnect();
    };
  }

  private _onMutation = animationFrameThrottle(this._update.bind(this));

  private _update() {
    this._slots = new Set();

    for (const root of peek(this._roots)) {
      for (const slot of root.querySelectorAll('slot')) this._slots.add(slot);
    }

    this._callback(this._slots);
  }
}

export interface SlotObserverCallback {
  (slots: Set<HTMLSlotElement>): void;
}
