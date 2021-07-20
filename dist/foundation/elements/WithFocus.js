import { currentSafariVersion } from '../../utils/support.js';
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
    'vds-button',
    'vds-slider',
    'vds-play-button',
    'vds-mute-button',
    'vds-fullscreen-button',
    'vds-scrubber'
  ].join(', ')}
`;
/**
 * Mixes in a `focus()` method that focuses the first focusable element in the shadow DOM.
 * Technically a polyfill for `shadowRoot.delegatesFocus`.
 *
 * @mixin
 * @template {import('../types').Constructor<LitElement>} T
 * @param {T} Base - The constructor to mix into.
 * @returns {T}
 * @see https://github.com/carbon-design-system/carbon-web-components
 */
export function WithFocus(Base) {
  return class WithFocusMixin extends Base {
    static get shadowRootOptions() {
      return Object.assign(Object.assign({}, Base.shadowRootOptions), {
        /**
         * This change disables delegatesFocus feature in shadow DOM in recent Safari, notably `14.x`.
         * Safari `14.x` introduced delegatesFocus, but using it causes the browser to crash.
         *
         * @see https://github.com/carbon-design-system/carbon-web-components/pull/496
         * @see https://bugs.webkit.org/show_bug.cgi?id=215622.
         */
        delegatesFocus: currentSafariVersion() <= 537
      });
    }
    /**
     * Focuses on the first focusable element in the shadow DOM.
     */
    focus() {
      var _a, _b;
      // @ts-ignore: Until `delegatesFocus` is added to `ShadowRoot` definition.
      if (
        (_a = this.shadowRoot) === null || _a === void 0
          ? void 0
          : _a.delegatesFocus
      ) {
        super.focus();
      } else {
        const delegateTarget =
          ((_b = this.shadowRoot) === null || _b === void 0
            ? void 0
            : _b.querySelector(focusableSelector)) ||
          this.querySelector(focusableSelector);
        if (delegateTarget) {
          /** @type {HTMLElement} */ (delegateTarget).focus();
        } else {
          super.focus();
        }
      }
    }
  };
}
