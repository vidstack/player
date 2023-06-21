import { effect, signal, ViewController } from 'maverick.js';
import { listenEvent, setAttribute } from 'maverick.js/std';

let $keyboard = signal(false);

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
  private _focused = signal(false);

  protected override onConnect(el: HTMLElement) {
    effect(() => {
      if (!$keyboard()) {
        this._focused.set(false);
        updateFocusAttr(el, false);
        this.listen('pointerenter', this._onPointerEnter.bind(this));
        this.listen('pointerleave', this._onPointerLeave.bind(this));
        return;
      }

      const active = document.activeElement === el;
      this._focused.set(active);
      updateFocusAttr(el, active);

      this.listen('focus', this._onFocus.bind(this));
      this.listen('blur', this._onBlur.bind(this));
    });
  }

  focused(): boolean {
    return this._focused();
  }

  private _onFocus() {
    this._focused.set(true);
    updateFocusAttr(this.el!, true);
  }

  private _onBlur() {
    this._focused.set(false);
    updateFocusAttr(this.el!, false);
  }

  private _onPointerEnter() {
    updateHoverAttr(this.el!, true);
  }

  private _onPointerLeave() {
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
