import { effect, onDispose, peek, signal, type ReadSignal } from 'maverick.js';
import { isDOMElement, setAttribute } from 'maverick.js/std';

/**
 * Efficient way of applying dynamic class signals to arbitrary DOM selectors. This is to avoid
 * creating multiple effects for each selector/class pair.
 */
export class ClassManager {
  protected _rafId = -1;
  protected _root: Element;
  protected _observer: MutationObserver;
  protected _map = new Map<string, ReadSignal<string | null>>();
  protected _classes = signal<ReadSignal<string | null>[]>([]);

  constructor(el: HTMLElement) {
    this._root = el.firstChild! as Element;
    this._observer = new MutationObserver(this._onMutation.bind(this));
    this._observer.observe(this._root, { subtree: true, childList: true });
    effect(this._watch.bind(this));
    onDispose(this._destroy.bind(this));
  }

  protected _onMutation(records: MutationRecord[]) {
    const selector = Array.from(this._map.keys()).join(',');
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (isDOMElement(node) && node.matches(selector)) this._update();
      }
    }
  }

  _observe(selector: string, $class: ReadSignal<string | null>) {
    this._map.set(selector, $class);
    this._classes.set((c) => [...c, $class]);
    return this;
  }

  _update() {
    window.cancelAnimationFrame(this._rafId);
    this._rafId = requestAnimationFrame(() => {
      for (const [selector, classes] of this._map) {
        const _class = peek(classes);
        for (const el of this._root.querySelectorAll(selector)) {
          setAttribute(el, 'class', _class);
        }
      }

      this._rafId = -1;
    });
  }

  protected _watch() {
    for (const c of this._classes()) c();
    this._update();
  }

  protected _destroy() {
    this._classes.set([]);
    this._map.clear();
    this._observer.disconnect();
  }
}
