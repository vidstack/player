import type { ActionReturn } from 'svelte/action';
import { get, readonly, writable } from 'svelte/store';

import { ariaBool } from '../utils/aria';
import { DisposalBin, listenEvent, onPress } from '../utils/events';
import { isKeyboardEvent } from '../utils/keyboard';
import { isArray } from '../utils/unit';
import { createFocusTrap } from './focus-trap';
import { createPopper, type PopperOptions } from './popper';

export interface AriaSelectOptions<T extends string> extends PopperOptions {
  defaultValue?: T | T[];
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  onSelect?(value: T, event: Event): void;
}

let id = 0;

const activeSelect = writable<HTMLElement | null>();

export function createSelect<T extends string = string>({
  defaultValue,
  multiple,
  required,
  disabled,
  ...options
}: AriaSelectOptions<T>) {
  let _id = ++id,
    _optionId = 0,
    _triggerId = `aria-select-trigger-${_id}`,
    _menuId = `aria-select-${_id}`,
    _triggerEl: HTMLElement | null = null,
    _menuEl: HTMLElement | null = null,
    _activeDescendant = writable(''),
    _isOpen = writable(false),
    _openDisposal = new DisposalBin(),
    _selectedValues = writable<T[]>(
      !defaultValue ? [] : isArray(defaultValue) ? defaultValue : [defaultValue],
    ),
    _options = new Map<HTMLElement, T>(),
    _popper = createPopper(
      {
        get triggerEl() {
          return _triggerEl;
        },
        get contentEl() {
          return _menuEl;
        },
      },
      { strategy: 'absolute', ...options },
    ),
    _focusTrap = createFocusTrap({
      onEscape(event) {
        onClose(event);
      },
    });

  function onOpen(event?: Event) {
    if (disabled) return;

    requestAnimationFrame(() => {
      _isOpen.set(true);
    });

    _popper.show(event, () => {
      if (_triggerEl) {
        // Look for parent incase it's a menu since events won't bubble up to document body.
        let root = _triggerEl.parentElement;
        while (root && !root.hasAttribute('data-root') && root.getAttribute('role') !== 'menu') {
          root = root.parentElement;
        }

        _openDisposal.add(
          listenEvent(root || document.body, 'pointerup', (e) => {
            onClose(e);
          }),
        );

        _triggerEl.setAttribute('aria-expanded', 'true');
      }

      if (_menuEl) {
        _menuEl.setAttribute('aria-hidden', 'false');
        _menuEl.style.pointerEvents = '';
        if (isKeyboardEvent(event)) {
          _menuEl.focus();
          _openDisposal.add(_focusTrap(_menuEl));
        }
      }

      activeSelect.set(_menuEl);
    });
  }

  function onClose(event?: Event) {
    requestAnimationFrame(() => {
      _isOpen.set(false);
    });

    _popper.hide(event, () => {
      _openDisposal.dispose();

      if (_triggerEl) {
        _triggerEl.setAttribute('aria-expanded', 'false');
      }

      if (_menuEl) {
        _menuEl.setAttribute('aria-hidden', 'true');
        _menuEl.style.pointerEvents = 'none';
      }

      if (isKeyboardEvent(event)) {
        _triggerEl?.focus();
      }

      if (get(activeSelect) === _menuEl) activeSelect.set(null);
    });
  }

  function onToggle(event?: Event) {
    get(_isOpen) ? onClose(event) : onOpen(event);
  }

  return {
    selectedValues: readonly(_selectedValues),
    isSelectOpen: readonly(_isOpen),
    selectTrigger(el: HTMLElement, label: string): ActionReturn {
      _triggerEl = el;

      el.setAttribute('id', _triggerId);
      el.setAttribute('aria-controls', _menuId);
      el.setAttribute('aria-label', label);
      el.setAttribute('aria-haspopup', 'listbox');
      el.setAttribute('aria-expanded', 'false');
      el.setAttribute('tabindex', '0');

      if (options.readonly) el.setAttribute('aria-readonly', 'true');
      if (required) el.setAttribute('aria-required', 'true');
      if (multiple) el.setAttribute('aria-multiselectable', '');

      const disposal = new DisposalBin();
      disposal.add(
        onPress(el, onToggle),
        listenEvent(el, 'click', (e) => e.stopPropagation()),
        listenEvent(el, 'pointerup', (e) => e.stopPropagation()),
        _activeDescendant.subscribe((id) => {
          el.setAttribute('aria-activedescendant', id);
        }),
      );

      return {
        destroy() {
          disposal.dispose();
          _openDisposal.dispose();
          _triggerEl = null;
        },
      };
    },
    selectMenu(el: HTMLElement): ActionReturn {
      _menuEl = el;

      el.style.pointerEvents = 'none';
      el.style.display = 'none';

      el.setAttribute('id', _menuId);
      el.setAttribute('aria-labelledby', _triggerId);
      el.setAttribute('role', 'listbox');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('tabindex', '-1');

      const disposal = new DisposalBin();
      disposal.add(
        listenEvent(el, 'click', (e) => e.stopPropagation()),
        listenEvent(el, 'pointerup', (e) => e.stopPropagation()),
        activeSelect.subscribe((current) => {
          if (current && el !== current) onClose();
        }),
      );

      return {
        destroy() {
          disposal.dispose();
          _menuEl = null;
        },
      };
    },
    selectOption(el: HTMLElement, value: T): ActionReturn {
      const id = `aria-select-option-${_id}-${++_optionId}`;

      el.setAttribute('id', id);
      el.setAttribute('role', 'option');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-selected', ariaBool(get(_selectedValues).includes(value)));

      _options.set(el, value);

      const disposal = new DisposalBin();
      disposal.add(
        onPress(el, (event) => {
          const values = get(_selectedValues);

          for (const [option, _value] of _options) {
            option.setAttribute('aria-selected', ariaBool(values.includes(_value)));
          }

          if (multiple) {
            if (!values.includes(value)) {
              _selectedValues.set([...values, value]);
            } else {
              _selectedValues.set(values.filter((v) => v !== value));
            }
          } else {
            _selectedValues.set([value]);
          }

          options.onSelect?.(value, event);
          _activeDescendant.set(id);
          if (!multiple) onClose(event);
        }),
      );

      return {
        destroy() {
          disposal.dispose();
          _options.delete(el);
        },
      };
    },
  };
}
