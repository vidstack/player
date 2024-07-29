import { effect, signal, ViewController } from 'maverick.js';
import { listenEvent, setAttribute } from 'maverick.js/std';

export let $keyboard = signal(false);

if (!__SERVER__) {
  listenEvent(document, 'pointerdown', () => {
    $keyboard.set(false);
  });

  listenEvent(document, 'keydown', (e) => {
    if (e.metaKey || e.altKey || e.ctrlKey) return;
    $keyboard.set(true);
  });
}

export class FocusVisibleController extends ViewController {
  #focused = signal(false);

  protected override onConnect(el: HTMLElement) {
    effect(() => {
      if (!$keyboard()) {
        this.#focused.set(false);
        updateFocusAttr(el, false);
        this.listen('pointerenter', this.#onPointerEnter.bind(this));
        this.listen('pointerleave', this.#onPointerLeave.bind(this));
        return;
      }

      const active = document.activeElement === el;
      this.#focused.set(active);
      updateFocusAttr(el, active);

      this.listen('focus', this.#onFocus.bind(this));
      this.listen('blur', this.#onBlur.bind(this));
    });
  }

  focused(): boolean {
    return this.#focused();
  }

  #onFocus() {
    this.#focused.set(true);
    updateFocusAttr(this.el!, true);
  }

  #onBlur() {
    this.#focused.set(false);
    updateFocusAttr(this.el!, false);
  }

  #onPointerEnter() {
    updateHoverAttr(this.el!, true);
  }

  #onPointerLeave() {
    updateHoverAttr(this.el!, false);
  }
}

function updateFocusAttr(el: Element, isFocused: boolean) {
  setAttribute(el, 'data-focus', isFocused);
  setAttribute(el, 'data-hocus', isFocused);
}

function updateHoverAttr(el: Element, isHovering: boolean) {
  setAttribute(el, 'data-hocus', isHovering);
  setAttribute(el, 'data-hover', isHovering);
}
