import { flip, offset, shift } from '@floating-ui/dom';
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
  offset?: number;
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
    _isVisible = writable(false),
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
      {
        strategy: 'fixed',
        placement: 'bottom',
        middleware: [
          offset(options.offset ?? 6),
          flip(),
          shift({ padding: options.offset ?? 6 }),
          ...(options.middleware || []),
        ],
        ...options,
      },
    ),
    _focusTrap = createFocusTrap({
      onEscape(event) {
        onClose(event);
      },
    });

  function onOpen(event?: Event) {
    if (disabled) return;

    _isVisible.set(true);
    requestAnimationFrame(() => {
      _isOpen.set(true);
    });

    _popper.show(event, () => {
      if (_triggerEl) {
        _openDisposal.add(_popper.watchPosition());

        if (_triggerEl) {
          _openDisposal.add(listenEvent(_triggerEl, 'pointerup', (e) => e.stopPropagation()));
        }

        if (_menuEl) {
          _openDisposal.add(listenEvent(_menuEl, 'pointerup', (e) => e.stopPropagation()));
        }

        _openDisposal.add(
          listenEvent(document.body, 'pointerup', (e) => {
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

      requestAnimationFrame(() => {
        _isVisible.set(false);
      });
    });
  }

  function onToggle(event?: Event) {
    get(_isOpen) ? onClose(event) : onOpen(event);
  }

  return {
    selectedValues: readonly(_selectedValues),
    isSelectOpen: readonly(_isOpen),
    isSelectVisible: readonly(_isVisible),
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
      el.style.zIndex = '999999';

      document.body.append(el);

      const disposal = new DisposalBin();

      if (_triggerEl) {
        function onResize() {
          if (!_triggerEl) return;
          el.style.width = _triggerEl.offsetWidth + 'px';
        }

        onResize();
        const observer = new ResizeObserver(onResize);
        observer.observe(_triggerEl);
        disposal.add(() => observer.disconnect());
      }

      disposal.add(
        activeSelect.subscribe((current) => {
          if (current && el !== current) onClose();
        }),
      );

      return {
        destroy() {
          disposal.dispose();
          _menuEl?.remove();
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
