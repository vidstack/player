import { html } from 'lit';

import { VdsElement } from '../../foundation/elements/index.js';
import {
  storybookAction,
  StorybookControlType
} from '../../foundation/storybook/index.js';
import { mediaContext } from '../../media/index.js';
import { getSlottedChildren, setAttribute } from '../../utils/dom.js';
import { isNil } from '../../utils/unit.js';
import {
  BufferingIndicatorHideEvent,
  BufferingIndicatorShowEvent
} from './events.js';
import { bufferingIndicatorElementStyles } from './styles.js';

export const BUFFERING_INDICATOR_ELEMENT_TAG_NAME = 'vds-buffering-indicator';

/**
 * Display an indicator when either the provider/media is booting or media playback has
 * stopped because of a lack of temporary data. This component will always render the default
 * `<slot>`, however, a `hidden` attribute will be applied to the slot when it shoud not be visible.
 *
 * ⚠️ **IMPORTANT:** The styling is left to you, it will only apply the `hidden` attribute.
 *
 *
 * @tagname vds-buffering-indicator
 *
 * @slot Used to pass in the content to be displayed while buffering.
 *
 * @example
 * ```html
 * <vds-buffering-indicator show-while-booting delay="500">
 *   <!-- `hidden` attribute will automatically be applied/removed -->
 *   <div hidden>
 *     <!-- ... -->
 *   </div>
 * </vds-buffering-indicator>
 * ```
 */
export class BufferingIndicatorElement extends VdsElement {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [bufferingIndicatorElementStyles];
  }

  /** @type {string[]} */
  static get events() {
    return [BufferingIndicatorHideEvent.TYPE, BufferingIndicatorShowEvent.TYPE];
  }

  constructor() {
    super();

    // Properties
    /**
     * Delays the showing of the buffering indicator in the hopes that it resolves itself within
     * that delay. This can be helpful in avoiding unnecessary or fast flashing indicators that
     * may stress the user out. The delay number is in milliseconds.
     *
     * @type {number}
     * @example `300` => 300 milliseconds
     */
    this.delay = 0;

    /**
     * Whether the indicator should be shown while the provider/media is booting, in other words
     * before it's ready for playback (`canPlay === false`).
     *
     * @type {boolean}
     */
    this.showWhileBooting = false;

    // Context
    /** @protected @readonly @type {boolean} */
    this.mediaCanPlay = mediaContext.canPlay.initialValue;
    /** @protected @readonly @type {boolean} */
    this.mediaIsWaiting = mediaContext.waiting.initialValue;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {HTMLElement | undefined}
   */
  defaultSlotEl;

  /** @type {import('lit').PropertyDeclarations} */
  static get properties() {
    return {
      delay: { type: Number },
      showWhileBooting: { type: Boolean, attribute: 'show-while-booting' }
    };
  }

  /** @type {import('../../foundation/context/types').ContextConsumerDeclarations} */
  static get contextConsumers() {
    return {
      mediaCanPlay: mediaContext.canPlay,
      mediaIsWaiting: mediaContext.waiting
    };
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  updated(changedProps) {
    this.handleTogglingHiddenAttr();
    super.updated(changedProps);
  }

  disconnectedCallback() {
    this.clearDelay();
    super.disconnectedCallback();
    this.wasPrevHidden = true;
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  /** @returns {import('lit').TemplateResult} */
  render() {
    return html`<slot @slotchange=${this.handleDefaultSlotChange}></slot>`;
  }

  /**
   * @protected
   */
  handleDefaultSlotChange() {
    this.defaultSlotEl = /** @type {HTMLElement} */ (
      getSlottedChildren(this)[0]
    );
    this.handleTogglingHiddenAttr();
  }

  /**
   * @protected
   * @returns {boolean}
   */
  isIndicatorHidden() {
    return (
      (!this.showWhileBooting || this.mediaCanPlay) && !this.mediaIsWaiting
    );
  }

  /**
   * @protected
   * @type {unknown | undefined}
   */
  delayTimeout;

  /**
   * @protected
   */
  clearDelay() {
    window.clearTimeout(/** @type {number} */ (this.delayTimeout));
    this.delayTimeout = undefined;
  }

  /**
   * @protected
   */
  handleTogglingHiddenAttr() {
    this.clearDelay();

    const shouldBeHidden = this.isIndicatorHidden();

    if (shouldBeHidden || this.delay === 0) {
      this.toggleHiddenAttr();
      return;
    }

    this.delayTimeout = setTimeout(() => {
      this.toggleHiddenAttr();
    }, this.delay);
  }

  /**
   * @protected
   * @type {boolean}
   */
  wasPrevHidden = true;

  /**
   * @protected
   */
  toggleHiddenAttr() {
    if (isNil(this.defaultSlotEl)) return;

    const shouldBeHidden = this.isIndicatorHidden();
    setAttribute(this.defaultSlotEl, 'hidden', shouldBeHidden ? '' : undefined);

    const didChange = this.wasPrevHidden !== shouldBeHidden;
    if (didChange) {
      this.dispatchIndicatorChangeEvent();
      this.wasPrevHidden = shouldBeHidden;
    }
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   */
  dispatchIndicatorChangeEvent() {
    const Event = !this.wasPrevHidden
      ? BufferingIndicatorHideEvent
      : BufferingIndicatorShowEvent;

    this.dispatchEvent(new Event());
  }
}

export const BUFFERING_INDICATOR_ELEMENT_STORYBOOK_ARG_TYPES = {
  delay: { control: StorybookControlType.Number, defaultValue: 0 },
  showWhileBooting: {
    control: StorybookControlType.Boolean,
    defaultValue: false
  },
  mediaCanPlay: {
    control: StorybookControlType.Boolean,
    defaultValue: true
  },
  mediaBuffering: {
    control: StorybookControlType.Boolean,
    defaultValue: true
  },
  onBufferingIndicatorShow: storybookAction(BufferingIndicatorShowEvent.TYPE),
  onBufferingIndicatorHide: storybookAction(BufferingIndicatorHideEvent.TYPE)
};
