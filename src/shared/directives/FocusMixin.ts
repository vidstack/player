import { Constructor, UpdatingElement } from 'lit-element';

import { LIB_PREFIX } from '../constants';

/**
 * A selector selecting focusable nodes.
 *
 * @inspiration https://github.com/carbon-design-system/carbon-web-components
 */
export const focusableSelector = `
  a[href], area[href], input:not([disabled]):not([tabindex='-1']),
  button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']),
  textarea:not([disabled]):not([tabindex='-1']),
  iframe, object, embed, *[tabindex]:not([tabindex='-1']), *[contenteditable=true],
  ${LIB_PREFIX}-control,
`;

export type FocusMixinBase = Constructor<UpdatingElement>;

export type FocusCocktail<T extends FocusMixinBase> = T;

/**
 * Mixes in a `focus()` method that focuses the first focusable element in the shadow DOM.
 * Technically a polyfill for `shadowRoot.delegatesFocus`.
 *
 * @param Base - The constructor to mix into.
 *
 * @inspiration https://github.com/carbon-design-system/carbon-web-components
 */
export function FocusMixin<T extends FocusMixinBase>(
  Base: T,
): FocusCocktail<T> {
  class FocusMixin extends Base {
    /**
     * Focuses on the first focusable element in the shadow DOM.
     */
    focus() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Until `delegatesFocus` is added to `ShadowRoot` definition.
      if (this.shadowRoot?.delegatesFocus) {
        super.focus();
      } else {
        const delegateTarget =
          this.shadowRoot?.querySelector(focusableSelector) ||
          this.querySelector(focusableSelector);
        if (delegateTarget) {
          (delegateTarget as HTMLElement).focus();
        } else {
          super.focus();
        }
      }
    }
  }

  return FocusMixin;
}
