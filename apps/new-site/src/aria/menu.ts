import type { ActionReturn } from 'svelte/action';
import { get, readonly, writable } from 'svelte/store';
import { ariaBool } from '../utils/aria';
import { inBounds } from '../utils/dom';
import { DisposalBin, listenEvent, onPress } from '../utils/events';
import { isKeyboardEvent, wasEnterKeyPressed } from '../utils/keyboard';
import { hideDocumentScrollbar } from '../utils/scroll';
import { isUndefined } from '../utils/unit';
import { createFocusTrap } from './focus-trap';
import { createPopper, PopperOptions } from './popper';

export interface AriaMenuOptions extends PopperOptions {
  type?: 'menu' | 'dialog';
  portal?: boolean;
  preventScroll?: boolean;
  defaultOpen?: boolean;
  hover?: boolean;
  submenu?: boolean;
  noOutSideClick?: boolean;
  selectors?: {
    focus?: string[];
    close?: string[];
  };
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
    _isMenuOpen = writable(false),
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
      { showDelay: 0, noPositioning: options.portal, ...options },
    ),
    _focusTrap = createFocusTrap({
      selectors: options.selectors?.focus,
      onEscape(event) {
        onChange(event, false);
      },
    });

  function onShow(event?: Event) {
    _popper.show(event, () => {
      if (!options.noPositioning) {
        _openDisposal.add(_popper.watchPosition());
      }

      closeOnSelect();
      closeSubmenuOnPointerLeave();

      if (_menuEl) {
        _menuEl.style.pointerEvents = '';
        _menuEl.dispatchEvent(new Event('aria-open'));
        if (isKeyboardEvent(event)) {
          _menuEl.focus();
          _openDisposal.add(_focusTrap(_menuEl));
        }
      }

      activeMenu.set(_menuEl);
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

      if (get(activeMenu) === _menuEl) activeMenu.set(null);
    });
  }

  function onChange(event?: Event, force?: boolean) {
    event?.stopPropagation();

    const open = !isUndefined(force) ? force : !get(_isMenuOpen);
    if (get(_isMenuOpen) === open) return;

    _triggerEl?.setAttribute('aria-expanded', ariaBool(open));
    _menuEl?.setAttribute('aria-hidden', ariaBool(!open));

    if (options.preventScroll) hideDocumentScrollbar(open);

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
    isMenuOpen: readonly(_isMenuOpen),
    openMenu(event?: Event) {
      onChange(event, true);
    },
    closeMenu(event?: Event) {
      onChange(event, false);
    },
    menuTrigger(triggerEl: HTMLElement): ActionReturn {
      const disposal = new DisposalBin();

      triggerEl.setAttribute('id', _triggerId);
      if (!triggerEl.hasAttribute('role')) triggerEl.setAttribute('role', 'button');
      triggerEl.setAttribute('aria-controls', _menuId);
      triggerEl.setAttribute('aria-expanded', 'false');
      triggerEl.setAttribute('aria-haspopup', options.type ?? 'menu');
      _triggerEl = triggerEl;

      disposal.add(
        onPress(triggerEl, onChange),
        !options.noOutSideClick &&
          listenEvent(document.body, 'pointerup', (e) => onChange(e, false)),
        options.hover && listenEvent(triggerEl, 'pointerenter', (e) => onChange(e, true)),
        listenEvent(triggerEl, 'keydown', (e) => {
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
    menu(menuEl: HTMLElement): ActionReturn {
      const disposal = new DisposalBin();

      _menuEl = menuEl;

      if (options.portal) {
        document.body.append(menuEl);
      } else if (!options.noPositioning) {
        menuEl.style.position = 'absolute';
      }

      menuEl.style.pointerEvents = 'none';
      menuEl.style.display = 'none';
      menuEl.setAttribute('id', _menuId);
      menuEl.setAttribute('role', 'menu');
      menuEl.setAttribute('tabindex', '-1');
      menuEl.setAttribute('aria-hidden', 'true');
      menuEl.setAttribute('aria-describedby', _triggerId);

      disposal.add(
        options.hover &&
          !options.submenu &&
          listenEvent(menuEl, 'pointerleave', (e) => onChange(e, false)),
        options.submenu &&
          listenEvent(menuEl, 'keydown', (e) => {
            if (e.key === 'ArrowLeft') {
              onChange(e, false);
            }
          }),
        // Prevent it bubbling up to document body so we can determine when to close popup.
        listenEvent(menuEl, 'click', (e) => e.stopPropagation()),
        listenEvent(menuEl, 'pointerup', (e) => e.stopPropagation()),
        // Close when another menu is opened
        activeMenu.subscribe((el) => {
          if (el && el !== menuEl && !menuEl.contains(el)) {
            onChange(undefined, false);
          }
        }),
      );

      requestAnimationFrame(() => {
        let parent = menuEl.parentElement;

        while (parent && parent.getAttribute('role') !== 'menu') {
          parent = parent.parentElement;
        }

        if (parent) {
          disposal.add(listenEvent(parent, 'aria-close' as any, (e) => onChange(e, false)));
        }

        if (options.defaultOpen) onChange(undefined, true);
      });

      return {
        destroy() {
          _openDisposal.dispose();
          disposal.dispose();
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
