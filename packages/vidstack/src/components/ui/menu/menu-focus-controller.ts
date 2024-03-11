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
  .map((selector) => `${selector}:not([aria-hidden='true'])`)
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

export interface MenuFocusControllerDelegate {
  _getScrollContainer(): HTMLElement | null;
  _closeMenu(trigger?: Event): void;
}

export class MenuFocusController {
  protected _index = 0;
  protected _el: HTMLElement | null = null;
  protected _elements: HTMLElement[] = [];

  get _items() {
    return this._elements;
  }

  constructor(protected _delegate: MenuFocusControllerDelegate) {}

  _attachMenu(el: HTMLElement) {
    listenEvent(el, 'focus', this._onFocus.bind(this));

    this._el = el;
    onDispose(() => {
      this._el = null;
    });
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

  _update() {
    this._index = 0;
    this._elements = this._getFocusableElements();
  }

  _scroll(index = this._findActiveIndex()) {
    const element = this._elements[index],
      container = this._delegate._getScrollContainer();
    if (element && container) {
      requestAnimationFrame(() => {
        container.scrollTop =
          element.offsetTop - container.offsetHeight / 2 + element.offsetHeight / 2;
      });
    }
  }

  _focusActive() {
    const index = this._findActiveIndex();
    this._focusAt(index >= 0 ? index : 0);
  }

  protected _focusAt(index: number) {
    this._index = index;
    if (this._elements[index]) {
      this._elements[index].focus();
      this._scroll(index);
    } else {
      this._el?.focus();
    }
  }

  protected _findActiveIndex() {
    return this._elements.findIndex(
      (el) => document.activeElement === el || el.getAttribute('aria-checked') === 'true',
    );
  }

  protected _onFocus() {
    this._update();
    this._focusActive();
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
        this._delegate._closeMenu(event);
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
    } while (this._elements[index]?.offsetParent === null);
    return index;
  }

  protected _getFocusableElements() {
    if (!this._el) return [];

    const focusableElements = this._el!.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
      elements: HTMLElement[] = [];

    const is = (node: Element) => {
      return node.getAttribute('role') === 'menu';
    };

    for (const el of focusableElements) {
      // Filter out elements that belong to child submenus.
      if (
        el instanceof HTMLElement &&
        el.offsetParent !== null && // does not have display: none
        isElementParent(this._el, el, is)
      ) {
        elements.push(el);
      }
    }

    return elements;
  }
}

export function getMenuController(el: HTMLElement) {
  return document.getElementById(el.getAttribute('aria-describedby')!);
}
