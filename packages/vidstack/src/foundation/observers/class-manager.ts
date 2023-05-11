import { effect, onDispose, peek, signal, type ReadSignal } from 'maverick.js';
import { setAttribute } from 'maverick.js/std';

/**
 * Efficient way of applying dynamic class signals to arbitrary DOM selectors. This is to avoid
 * creating multiple effects for each selector/class pair.
 */
export class ClassManager {
  protected _rafId = -1;
  protected _observer: MutationObserver;
  protected _map = new Map<string, ReadSignal<string | null>>();
  protected _classes = signal<ReadSignal<string | null>[]>([]);

  constructor(protected _el: HTMLElement) {
    this._observer = new MutationObserver(this._onMutation.bind(this));
    this._observer.observe(_el, { subtree: true, childList: true });
    effect(this._watch.bind(this));
    onDispose(this._destroy.bind(this));
  }

  protected _onMutation(records: MutationRecord[]) {
    const selector = Array.from(this._map.keys()).join(',');
    for (const record of records) {
      for (const node of record.addedNodes) {
        if ((node as Element).matches(selector)) this._update();
      }
    }
  }

  _observe(selector: string, $class: ReadSignal<string | null>) {
    this._map.set(selector, $class);
    this._classes.set((c) => [...c, $class]);
    return this;
  }

  protected _watch() {
    for (const c of this._classes()) c();
    this._update();
  }

  protected _update() {
    window.cancelAnimationFrame(this._rafId);
    this._rafId = requestAnimationFrame(() => {
      for (const [selector, classes] of this._map) {
        const _class = peek(classes);
        for (const el of this._el.querySelectorAll(selector)) {
          setAttribute(el, 'class', _class);
        }
      }

      this._rafId = -1;
    });
  }

  protected _destroy() {
    this._classes.set([]);
    this._map.clear();
    this._observer.disconnect();
  }
}
