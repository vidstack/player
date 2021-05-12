import { ReactiveElement } from 'lit';

import { BUTTON_ELEMENT_TAG_NAME } from '../../ui/controls/button/button.types';
import { FULLSCREEN_BUTTON_ELEMENT_TAG_NAME } from '../../ui/controls/fullscreen-button/fullscreen-button.types';
import { MUTE_BUTTON_ELEMENT_TAG_NAME } from '../../ui/controls/mute-button/mute-button.types';
import { PLAY_BUTTON_ELEMENT_TAG_NAME } from '../../ui/controls/play-button/play-button.types';
import { SCRUBBER_ELEMENT_TAG_NAME } from '../../ui/controls/scrubber/scrubber.types';
import { SLIDER_ELEMENT_TAG_NAME } from '../../ui/controls/slider/slider.types';
import { currentSafariVersion } from '../../utils/support';
import { LIB_PREFIX } from '../constants';
import { Constructor } from '../types';

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
  ${[
    BUTTON_ELEMENT_TAG_NAME,
    SLIDER_ELEMENT_TAG_NAME,
    PLAY_BUTTON_ELEMENT_TAG_NAME,
    MUTE_BUTTON_ELEMENT_TAG_NAME,
    FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
    SCRUBBER_ELEMENT_TAG_NAME,
  ]
    .map(tagName => `${LIB_PREFIX}-${tagName}`)
    .join(', ')}
`;

/**
 * Mixes in a `focus()` method that focuses the first focusable element in the shadow DOM.
 * Technically a polyfill for `shadowRoot.delegatesFocus`.
 *
 * @param Base - The constructor to mix into.
 *
 * @inspiration https://github.com/carbon-design-system/carbon-web-components
 */
export function WithFocus<T extends Constructor<ReactiveElement>>(Base: T): T {
  return class WithFocus extends Base {
    createRenderRoot(): ShadowRoot {
      return this.attachShadow({
        mode: 'open',
        /**
         * This change disables delegatesFocus feature in shadow DOM in recent Safari, notably `14.x`.
         * Safari `14.x` introduced delegatesFocus, but using it causes the browser to crash.
         *
         * @op https://github.com/carbon-design-system/carbon-web-components/pull/496
         * @report https://bugs.webkit.org/show_bug.cgi?id=215622.
         */
        delegatesFocus: currentSafariVersion() <= 537,
      });
    }

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
  };
}
