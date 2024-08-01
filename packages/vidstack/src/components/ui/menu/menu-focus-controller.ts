import { onDispose } from 'maverick.js';
import { EventsController, listenEvent, wasEnterKeyPressed } from 'maverick.js/std';

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
  closeMenu(trigger?: Event): void;
}

export class MenuFocusController {
  #index = -1;
  #el: HTMLElement | null = null;
  #elements: HTMLElement[] = [];
  #delegate: MenuFocusControllerDelegate;

  get items() {
    return this.#elements;
  }

  constructor(delegate: MenuFocusControllerDelegate) {
    this.#delegate = delegate;
  }

  attachMenu(el: HTMLElement) {
    listenEvent(el, 'focus', this.#onFocus.bind(this));

    this.#el = el;
    onDispose(() => {
      this.#el = null;
    });
  }

  listen() {
    if (!this.#el) return;

    this.update();

    new EventsController(this.#el)
      .add('keyup', this.#onKeyUp.bind(this))
      .add('keydown', this.#onKeyDown.bind(this));

    onDispose(() => {
      this.#index = -1;
      this.#elements = [];
    });
  }

  update() {
    this.#index = 0;
    this.#elements = this.#getFocusableElements();
  }

  scroll(index = this.#findActiveIndex()) {
    const element = this.#elements[index];
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

  focusActive(scroll = true) {
    const index = this.#findActiveIndex();
    this.#focusAt(index >= 0 ? index : 0, scroll);
  }

  #focusAt(index: number, scroll = true) {
    this.#index = index;
    if (this.#elements[index]) {
      this.#elements[index].focus({ preventScroll: true });
      if (scroll) this.scroll(index);
    } else {
      this.#el?.focus({ preventScroll: true });
    }
  }

  #findActiveIndex() {
    return this.#elements.findIndex(
      (el) =>
        document.activeElement === el ||
        (el.getAttribute('role') === 'menuitemradio' && el.getAttribute('aria-checked') === 'true'),
    );
  }

  #onFocus() {
    if (this.#index >= 0) return;
    this.update();
    this.focusActive();
  }

  #validateKeyEvent(event: KeyboardEvent) {
    const el = event.target;

    if (wasEnterKeyPressed(event) && el instanceof Element) {
      const role = el.getAttribute('role');
      return !/a|input|select|button/.test(el.localName) && !role;
    }

    return VALID_KEYS.has(event.key);
  }

  #onKeyUp(event: KeyboardEvent) {
    if (!this.#validateKeyEvent(event)) return;

    event.stopPropagation();
    event.preventDefault();
  }

  #onKeyDown(event: KeyboardEvent) {
    if (!this.#validateKeyEvent(event)) return;

    event.stopPropagation();
    event.preventDefault();

    switch (event.key) {
      case 'Escape':
        this.#delegate.closeMenu(event);
        break;
      case 'Tab':
        this.#focusAt(this.#nextIndex(event.shiftKey ? -1 : +1));
        break;
      case 'ArrowUp':
        this.#focusAt(this.#nextIndex(-1));
        break;
      case 'ArrowDown':
        this.#focusAt(this.#nextIndex(+1));
        break;
      case 'Home':
      case 'PageUp':
        this.#focusAt(0);
        break;
      case 'End':
      case 'PageDown':
        this.#focusAt(this.#elements.length - 1);
        break;
    }
  }

  #nextIndex(delta: number) {
    let index = this.#index;
    do {
      index = (index + delta + this.#elements.length) % this.#elements.length;
    } while (this.#elements[index]?.offsetParent === null);
    return index;
  }

  #getFocusableElements() {
    if (!this.#el) return [];

    const focusableElements = this.#el!.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
      elements: HTMLElement[] = [];

    const is = (node: Element) => {
      return node.getAttribute('role') === 'menu';
    };

    for (const el of focusableElements) {
      // Filter out elements that belong to child submenus.
      if (
        isHTMLElement(el) &&
        el.offsetParent !== null && // does not have display: none
        isElementParent(this.#el, el, is)
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
