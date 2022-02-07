import { LitElement } from 'lit';

import { Constructor } from '../../global/helpers';
import { currentSafariVersion } from '../../utils/support';

/**
 * A selector selecting focusable nodes.
 *
 * @see https://github.com/carbon-design-system/carbon-web-components
 */
export const focusableSelector = `
  ${[
    'a[href]',
    'area[href]',
    `input:not([disabled]):not([tabindex='-1'])`,
    `button:not([disabled]):not([tabindex='-1'])`,
    `select:not([disabled]):not([tabindex='-1'])`,
    `textarea:not([disabled]):not([tabindex='-1'])`,
    'iframe',
    'object',
    'embed',
    `*[tabindex]:not([tabindex='-1'])`,
    '*[contenteditable=true]',
    'vds-fullscreen-button',
    'vds-mute-button',
    'vds-play-button',
    'vds-scrubber',
    'vds-slider',
    'vds-time-slider',
    'vds-volume-slider'
  ].join(', ')}
`;

/**
 * Mixes in a `focus()` method that focuses the first focusable element in the shadow DOM.
 * Technically a polyfill for `shadowRoot.delegatesFocus`.
 *
 * @param Base - The constructor to mix into.
 * @see https://github.com/carbon-design-system/carbon-web-components
 */
export function WithFocus<T extends Constructor<LitElement>>(Base: T): T {
  return class WithFocusMixin extends Base {
    static get shadowRootOptions() {
      return {
        // @ts-ignore
        ...Base.shadowRootOptions,
        /**
         * This change disables delegatesFocus feature in shadow DOM in recent Safari, notably `14.x`.
         * Safari `14.x` introduced delegatesFocus, but using it causes the browser to crash.
         *
         * @see https://github.com/carbon-design-system/carbon-web-components/pull/496
         * @see https://bugs.webkit.org/show_bug.cgi?id=215622.
         */
        delegatesFocus: currentSafariVersion() <= 537
      };
    }

    /**
     * Focuses on the first focusable element in the shadow DOM.
     */
    override focus() {
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
  };
}
