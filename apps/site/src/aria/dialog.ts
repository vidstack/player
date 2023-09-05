import { createAriaMenu, type AriaMenuOptions } from './menu';

export function createAriaDialog(options?: AriaMenuOptions) {
  return createAriaMenu({
    portal: true,
    preventScroll: true,
    selectors: {
      close: ['[data-close]'],
    },
    ...options,
    placement: false,
  });
}
