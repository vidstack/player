import { onDispose } from 'maverick.js';
import { listenEvent, wasEnterKeyPressed } from 'maverick.js/std';

import { isElementParent, isHTMLElement } from '../../../utils/dom';
import { scrollIntoCenter } from '../../../utils/scroll';

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
  _closeMenu(trigger?: Event): void;
}

export class MenuFocusController {
  protected _index = -1;
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
      this._index = -1;
      this._elements = [];
    });
  }

  _update() {
    this._index = 0;
    this._elements = this._getFocusableElements();
  }

  _scroll(index = this._findActiveIndex()) {
    const element = this._elements[index];
    if (element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollIntoCenter(element, {
            behavior: 'smooth',
            boundary: (el) => {
              return !el.hasAttribute('data-root');
            },
          });
        });
      });
    }
  }

  _focusActive(scroll = true) {
    const index = this._findActiveIndex();
    this._focusAt(index >= 0 ? index : 0, scroll);
  }

  protected _focusAt(index: number, scroll = true) {
    this._index = index;
    if (this._elements[index]) {
      this._elements[index].focus({ preventScroll: true });
      if (scroll) this._scroll(index);
    } else {
      this._el?.focus({ preventScroll: true });
    }
  }

  protected _findActiveIndex() {
    return this._elements.findIndex(
      (el) =>
        document.activeElement === el ||
        (el.getAttribute('role') === 'menuitemradio' && el.getAttribute('aria-checked') === 'true'),
    );
  }

  protected _onFocus() {
    if (this._index >= 0) return;
    this._update();
    this._focusActive();
  }

  protected _validateKeyEvent(event: KeyboardEvent) {
    const el = event.target;

    if (wasEnterKeyPressed(event) && el instanceof Element) {
      const role = el.getAttribute('role');
      return !/a|input|select|button/.test(el.localName) && !role;
    }

    return VALID_KEYS.has(event.key);
  }

  protected _onKeyUp(event: KeyboardEvent) {
    if (!this._validateKeyEvent(event)) return;

    event.stopPropagation();
    event.preventDefault();
  }

  protected _onKeyDown(event: KeyboardEvent) {
    if (!this._validateKeyEvent(event)) return;

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
        isHTMLElement(el) &&
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
