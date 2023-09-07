import type { ActionReturn } from 'svelte/action';
import { get, readonly, writable } from 'svelte/store';

import { ariaBool } from '../utils/aria';
import { inBounds } from '../utils/dom';
import { DisposalBin, listenEvent, onPress } from '../utils/events';
import { isKeyboardEvent, wasEnterKeyPressed } from '../utils/keyboard';
import { hideDocumentScrollbar } from '../utils/scroll';
import { isUndefined } from '../utils/unit';
import { createFocusTrap } from './focus-trap';
import { createPopper, type PopperOptions } from './popper';

export interface AriaMenuOptions extends PopperOptions {
  type?: 'menu' | 'dialog';
  portal?: boolean;
  preventScroll?: boolean;
  defaultOpen?: boolean;
  hover?: boolean;
  submenu?: boolean;
  noClickOut?: boolean;
  selectors?: {
    focus?: string[];
    close?: string[];
  };
  onOpen?(event?: Event): void;
  onClose?(event?: Event): void;
}

let id = 0;

const activeMenu = writable<HTMLElement | null>();

export function createAriaMenu(options: AriaMenuOptions) {
  let _id = ++id,
    _triggerId = `aria-menu-trigger-${_id}`,
    _menuId = `aria-menu-${_id}`,
    _triggerEl: HTMLElement | null = null,
    _menuEl: HTMLElement | null = null,
    _arrowEl: HTMLElement | null = null,
    _openDisposal = new DisposalBin(),
    _isMenuOpen = writable<boolean>(!!options.defaultOpen),
    _isMenuVisible = writable<boolean>(!!options.defaultOpen),
    _popper = createPopper(
      {
        get triggerEl() {
          return _triggerEl;
        },
        get contentEl() {
          return _menuEl;
        },
        get arrowEl() {
          return _arrowEl;
        },
      },
      {
        showDelay: 0,
        strategy: 'fixed',
        ...options,
      },
    ),
    _focusTrap = createFocusTrap({
      selectors: options.selectors?.focus,
      onEscape(event) {
        onChange(event, false);
      },
    });

  function onShow(event?: Event) {
    _popper.show(event, () => {
      if (options.placement !== false) {
        _openDisposal.add(_popper.watchPosition());
      }

      if (!options.noClickOut) {
        _openDisposal.add(listenEvent(document.body, 'pointerup', (e) => onChange(e, false)));
      }

      closeOnSelect();
      closeSubmenuOnPointerLeave();

      if (_menuEl) {
        _menuEl.style.pointerEvents = '';
        _menuEl.dispatchEvent(new Event('aria-open'));

        // Prevent it bubbling up to document body so we can determine when to close popup.
        const root = _menuEl.querySelector('[data-menu-root]') || _menuEl;
        _openDisposal.add(listenEvent(root, 'pointerup', (e) => e.stopPropagation()));

        if (isKeyboardEvent(event)) {
          _menuEl.focus();
          _openDisposal.add(_focusTrap(_menuEl));
        }
      }

      activeMenu.set(_menuEl);
      options.onOpen?.(event);
    });
  }

  function onHide(event?: Event) {
    _popper.hide(event, () => {
      _openDisposal.dispose();

      if (isKeyboardEvent(event)) {
        _triggerEl?.focus();
      }

      if (_menuEl) {
        _menuEl.style.pointerEvents = 'none';
        _menuEl.dispatchEvent(new Event('aria-close'));
      }

      requestAnimationFrame(() => {
        _isMenuVisible.set(false);
        options.onClose?.(event);
      });

      if (get(activeMenu) === _menuEl) activeMenu.set(null);
    });
  }

  function onChange(event?: Event, force?: boolean) {
    event?.stopPropagation();

    const open = !isUndefined(force) ? force : !get(_isMenuOpen);
    if (_menuEl?.getAttribute('aria-hidden') == String(!open)) return;

    _triggerEl?.setAttribute('aria-expanded', ariaBool(open));
    _menuEl?.setAttribute('aria-hidden', ariaBool(!open));

    if (options.preventScroll) hideDocumentScrollbar(open);

    if (open) _isMenuVisible.set(true);
    requestAnimationFrame(() => {
      _isMenuOpen.set(open);
    });

    if (!open) {
      onHide(event);
    } else {
      onShow(event);
    }
  }

  function closeSubmenuOnPointerLeave() {
    if (!options.submenu) return;

    const id = setTimeout(() => {
      if (_menuEl) {
        _openDisposal.add(
          listenEvent(_menuEl, 'pointerleave', (event) => {
            if (_triggerEl && !inBounds(_triggerEl, event.clientX, event.clientY)) {
              onChange(event, false);
            }
          }),
        );
      }
    }, 500);

    _openDisposal.add(() => window.clearTimeout(id));
  }

  function closeOnSelect() {
    if (!_menuEl || !options.selectors?.close) return;

    const closeTargets = Array.from(
      _menuEl.querySelectorAll(options.selectors.close.join(',')),
    ) as HTMLElement[];

    for (const closeEl of closeTargets) {
      _openDisposal.add(
        listenEvent(
          closeEl,
          'keydown',
          (e) => wasEnterKeyPressed(e) && setTimeout(() => onChange(e, false), 150),
        ),
      );

      let pointerTimer = -1;
      _openDisposal.add(
        listenEvent(closeEl, 'pointerup', (e) => {
          window.clearTimeout(pointerTimer);
          // Prevent user scrolling triggering close.
          const y = _menuEl!.scrollTop;
          pointerTimer = window.setTimeout(() => {
            if (_menuEl!.scrollTop === y) {
              onChange(e, false);
            }
          }, 150);
        }),
      );
    }
  }

  return {
    triggerId: _triggerEl,
    menuId: _menuId,
    isMenuOpen: readonly(_isMenuOpen),
    isMenuVisible: readonly(_isMenuVisible),
    openMenu(event?: Event) {
      onChange(event, true);
    },
    closeMenu(event?: Event) {
      onChange(event, false);
    },
    menuTrigger(el: HTMLElement): ActionReturn {
      const disposal = new DisposalBin();

      el.setAttribute('id', _triggerId);
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      el.setAttribute('aria-controls', _menuId);
      el.setAttribute('aria-expanded', 'false');
      el.setAttribute('aria-haspopup', options.type ?? 'menu');
      _triggerEl = el;

      disposal.add(
        onPress(el, onChange),
        options.hover && listenEvent(el, 'pointerenter', (e) => onChange(e, true)),
        listenEvent(el, 'keydown', (e) => {
          if (!options.submenu && e.key === 'ArrowDown') {
            onChange(e, true);
          }

          if (options.submenu && e.key === 'ArrowRight') {
            onChange(e, true);
          }
        }),
      );

      return {
        destroy() {
          if (get(_isMenuOpen) && options.preventScroll) {
            hideDocumentScrollbar(false);
          }

          _openDisposal.dispose();
          disposal.dispose();
          _triggerEl = null;
        },
      };
    },
    menu(el: HTMLElement): ActionReturn {
      const disposal = new DisposalBin();

      _menuEl = el;

      if (options.portal) {
        document.body.append(el);
      } else if (options.placement !== false) {
        el.style.position = 'fixed';
      }

      el.style.pointerEvents = 'none';
      el.style.display = 'none';

      el.setAttribute('id', _menuId);
      el.setAttribute('role', options.type ?? 'menu');
      el.setAttribute('tabindex', '-1');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('aria-describedby', _triggerId);

      disposal.add(
        options.hover &&
          !options.submenu &&
          listenEvent(el, 'pointerleave', (e) => onChange(e, false)),
        options.submenu &&
          listenEvent(el, 'keydown', (e) => {
            if (e.key === 'ArrowLeft') {
              onChange(e, false);
            }
          }),
        // Close when another menu is opened
        !options.noClickOut &&
          activeMenu.subscribe((current) => {
            if (current && el !== current && !el.contains(current)) {
              onChange(undefined, false);
            }
          }),
      );

      requestAnimationFrame(() => {
        let parent = el.parentElement;

        while (parent && parent.getAttribute('role') !== 'menu') {
          parent = parent.parentElement;
        }

        if (parent) {
          disposal.add(
            listenEvent(parent, 'aria-open' as any, (e) => {
              if (el.querySelector('[data-active]')) {
                setTimeout(() => onChange(e, true), 0);
              }
            }),
            listenEvent(parent, 'aria-close' as any, (e) => onChange(e, false)),
          );
        }

        if (options.defaultOpen) onChange(undefined, true);
      });

      return {
        destroy() {
          _openDisposal.dispose();
          disposal.dispose();
          _menuEl?.remove();
          _menuEl = null;
        },
      };
    },
    menuArrow(el: HTMLElement): ActionReturn {
      _arrowEl = el;
      return {
        destroy() {
          _arrowEl = null;
        },
      };
    },
  };
}
