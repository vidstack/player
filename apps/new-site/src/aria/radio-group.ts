import type { ActionReturn } from 'svelte/action';
import { get, readonly, writable } from 'svelte/store';
import { ariaBool } from '../utils/aria';
import { DisposalBin, onPress } from '../utils/events';

export interface AriaRadioGroupOptions<T extends string> {
  defaultValue: T;
  menu?: boolean;
  onSelect?(value: T, event: Event): void;
}

export function createAriaRadioGroup<T extends string = string>(options: AriaRadioGroupOptions<T>) {
  let _radioValue = writable<T>(options.defaultValue),
    _radios = new Set<HTMLElement>();

  return {
    radioValue: readonly(_radioValue),
    radioGroup(radioGroupEl: HTMLElement, label: string): ActionReturn {
      radioGroupEl.setAttribute('aria-label', label);
      radioGroupEl.setAttribute('role', options.menu ? 'group' : 'radiogroup');
      return {};
    },
    radio(radioEl: HTMLElement, value: T): ActionReturn {
      const disposal = new DisposalBin();

      radioEl.setAttribute('role', options.menu ? 'menuradioitem' : 'radio');
      radioEl.setAttribute('aria-checked', ariaBool(value === get(_radioValue)));
      _radios.add(radioEl);

      disposal.add(
        onPress(radioEl, (event) => {
          for (const _radio of _radios) {
            radioEl.setAttribute('aria-checked', ariaBool(_radio === radioEl));
          }

          _radioValue.set(value);
          options.onSelect?.(value, event);
        }),
      );

      return {
        destroy() {
          disposal.dispose();
          _radios.delete(radioEl);
        },
      };
    },
  };
}
