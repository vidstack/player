import { onDispose } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

import { isElementParent } from '../../../utils/dom';

const FOCUSABLE_ELEMENTS_SELECTOR = /* #__PURE__*/ [
  'a[href]',
  '[tabindex]',
  'input',
  'select',
  'button',
]
  .map((selector) => `${selector}:not([aria-hidden])`)
  .join(',');

const VALID_KEYS = /* #__PURE__*/ new Set([
  'Escape',
  'Tab',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'PageUp',
  'End',
  'PageDown',
  'Enter',
  ' ',
]);

export class MenuFocusController {
  protected _index = 0;
  protected _el: HTMLElement | null = null;
  protected _elements: HTMLElement[] = [];

  get _items() {
    return this._elements;
  }

  constructor(protected _closeMenu: (trigger?: Event) => void) {}

  _attach(el: HTMLElement) {
    listenEvent(el, 'focus', this._onFocus.bind(this));
    this._el = el;
  }

  _listen() {
    if (!this._el) return;

    this._update();

    listenEvent(this._el, 'keyup', this._onKeyUp.bind(this));
    listenEvent(this._el, 'keydown', this._onKeyDown.bind(this));

    onDispose(() => {
      this._index = 0;
      this._elements = [];
    });
  }

  protected _focusAt(index: number) {
    this._index = index;
    this._elements[index]?.focus();
    this._elements[index]?.scrollIntoView({
      block: 'center',
    });
  }

  protected _onFocus() {
    const index = this._elements.findIndex((el) => el.getAttribute('aria-checked') === 'true');
    this._focusAt(index >= 0 ? index : 0);
  }

  protected _update() {
    this._index = 0;
    this._elements = this._getFocusableElements();
  }

  protected _onKeyUp(event: KeyboardEvent) {
    if (!VALID_KEYS.has(event.key)) return;
    event.stopPropagation();
    event.preventDefault();
  }

  protected _onKeyDown(event: KeyboardEvent) {
    if (!VALID_KEYS.has(event.key)) return;
    event.stopPropagation();
    event.preventDefault();
    switch (event.key) {
      case 'Escape':
        this._closeMenu(event);
        break;
      case 'Tab':
        this._focusAt(this._nextIndex(event.shiftKey ? -1 : +1));
        break;
      case 'ArrowUp':
        this._focusAt(this._nextIndex(-1));
        break;
      case 'ArrowDown':
        this._focusAt(this._nextIndex(+1));
        break;
      case 'Home':
      case 'PageUp':
        this._focusAt(0);
        break;
      case 'End':
      case 'PageDown':
        this._focusAt(this._elements.length - 1);
        break;
    }
  }

  protected _nextIndex(delta: number) {
    let index = this._index;
    do {
      index = (index + delta + this._elements.length) % this._elements.length;
    } while (this._elements[index].offsetParent === null);
    return index;
  }

  protected _getFocusableElements() {
    if (!this._el) return [];

    const focusableElements = this._el!.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
      elements: HTMLElement[] = [];

    const is = (node: Element) => node.hasAttribute('data-media-menu-items');
    for (const el of focusableElements) {
      // Filter out elements that belong to child submenus.
      if (isElementParent(this._el, el, is)) elements.push(el as HTMLElement);
    }

    return elements;
  }
}

export function getMenuController(el: HTMLElement) {
  return document.getElementById(el.getAttribute('aria-describedby')!);
}
