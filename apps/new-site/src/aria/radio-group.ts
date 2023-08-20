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
    radioGroup(el: HTMLElement, label: string): ActionReturn {
      el.setAttribute('aria-label', label);
      el.setAttribute('role', options.menu ? 'group' : 'radiogroup');
      return {};
    },
    radio(el: HTMLElement, value: T): ActionReturn {
      const disposal = new DisposalBin();

      el.setAttribute('role', options.menu ? 'menuradioitem' : 'radio');
      el.setAttribute('aria-checked', ariaBool(value === get(_radioValue)));
      _radios.add(el);

      disposal.add(
        onPress(el, (event) => {
          for (const _radio of _radios) {
            el.setAttribute('aria-checked', ariaBool(_radio === el));
          }

          _radioValue.set(value);
          options.onSelect?.(value, event);
        }),
      );

      return {
        destroy() {
          disposal.dispose();
          _radios.delete(el);
        },
      };
    },
  };
}
