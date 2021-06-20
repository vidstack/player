import { LitElement } from 'lit';

import { currentSafariVersion } from '../../utils/support.js';

/**
 * A selector selecting focusable nodes.
 *
 * @inspiration https://github.com/carbon-design-system/carbon-web-components
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
 * @template {import('../types/utils').Constructor<LitElement>} T
 * @param {T} Base - The constructor to mix into.
 * @returns {T}
 *
 * @inspiration https://github.com/carbon-design-system/carbon-web-components
 */
export function WithFocus(Base) {
	return class WithFocusMixin extends Base {
		createRenderRoot() {
			return this.attachShadow({
				mode: 'open',
				/**
				 * This change disables delegatesFocus feature in shadow DOM in recent Safari, notably `14.x`.
				 * Safari `14.x` introduced delegatesFocus, but using it causes the browser to crash.
				 *
				 * @op https://github.com/carbon-design-system/carbon-web-components/pull/496
				 * @report https://bugs.webkit.org/show_bug.cgi?id=215622.
				 */
				delegatesFocus: currentSafariVersion() <= 537
			});
		}

		/**
		 * Focuses on the first focusable element in the shadow DOM.
		 */
		focus() {
			// @ts-ignore: Until `delegatesFocus` is added to `ShadowRoot` definition.
			if (this.shadowRoot?.delegatesFocus) {
				super.focus();
			} else {
				const delegateTarget =
					this.shadowRoot?.querySelector(focusableSelector) ||
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
