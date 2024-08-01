import { effect, signal, ViewController } from 'maverick.js';
import { EventsController, listenEvent, setAttribute } from 'maverick.js/std';

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
      const events = new EventsController(el);

      if (!$keyboard()) {
        this.#focused.set(false);
        updateFocusAttr(el, false);

        events
          .add('pointerenter', this.#onPointerEnter.bind(this))
          .add('pointerleave', this.#onPointerLeave.bind(this));

        return;
      }

      const active = document.activeElement === el;
      this.#focused.set(active);
      updateFocusAttr(el, active);

      events.add('focus', this.#onFocus.bind(this)).add('blur', this.#onBlur.bind(this));
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
