import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

import { consumeContext } from '../../foundation/context/index.js';
import { ifNonEmpty } from '../../foundation/directives/index.js';
import { StorybookControl } from '../../foundation/storybook/index.js';
import { mediaContext } from '../../media/index.js';
import { formatSpokenTime } from '../../utils/time.js';
import { seekableProgressBarElementStyles } from './styles.js';

export const SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME =
  'vds-seekable-progress-bar';

/**
 * Displays a progress bar from 0 to media duration with the amount of media that is seekable.
 * Seekable media is parts of the media that been downloaded and seeking to it won't result
 * in any delay or any additional loading.
 *
 * @tagname vds-seekable-progress-bar
 * @slot Used to pass content into the progress element.
 * @csspart root - The progress bar element (`<div>`).
 * @cssprop --vds-seekable-progress-bar-bg - The background color of the amount that is seekable (defaults to `#616161`).
 * @cssprop --vds-seekable-progress-bar-height - The height of the progress bar (defaults to `--vds-slider-track-height`).
 * @example
 * ```html
 * <vds-seekable-progress-bar
 *   label="Amount of seekable media"
 * ></vds-seekable-progress-bar>
 * ```
 */
export class SeekableProgressBarElement extends LitElement {
  /**
   * @type {import('lit').CSSResultGroup}
   */
  static get styles() {
    return [seekableProgressBarElementStyles];
  }

  /**
   * @type {string[]}
   */
  static get parts() {
    return ['root'];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * ♿ **ARIA:** The `aria-label` for the progress bar.
   *
   * @type {string}
   */
  @property()
  label = 'Amount of seekable media';

  /**
   * ♿ **ARIA:** Human-readable text alternative for the seekable amount. If you pass
   * in a string containing `{seekableAmount}` or `{duration}` templates they'll be replaced with
   * the spoken form such as `1 hour 30 minutes`.
   *
   * @type {string}
   */
  @property({ attribute: 'value-text' })
  valueText = '{seekableAmount} out of {duration}';

  /**
   * @protected
   * @type {number}
   */
  @state()
  @consumeContext(mediaContext.seekableAmount)
  mediaSeekableAmount = mediaContext.seekableAmount.initialValue;

  /**
   * @protected
   * @type {number}
   */
  @state()
  @consumeContext(mediaContext.duration, { transform: (d) => (d >= 0 ? d : 0) })
  mediaDuration = 0;

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  render() {
    return this.renderProgressBar();
  }

  // -------------------------------------------------------------------------------------------
  // Progress
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLProgressElement>}
   */
  progressBarRef = createRef();

  /**
   * Returns the underlying `<progress>` element.
   *
   * @type {HTMLProgressElement}
   */
  get progressBarElement() {
    return /** @type {HTMLProgressElement} */ (this.progressBarRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderProgressBar() {
    return html`
      <div
        id="progressbar"
        role="progressbar"
        part=${this.getProgressBarPartAttr()}
        style=${styleMap(this.getProgressBarStyleMap())}
        ?hidden=${this.hidden}
        aria-label=${this.label}
        aria-valuemin="0"
        aria-valuenow=${Math.round(this.mediaSeekableAmount)}
        aria-valuemax=${Math.round(this.mediaDuration)}
        aria-valuetext=${this.getProgressBarValueText()}
        ${ref(this.progressBarRef)}
      >
        ${this.renderProgressBarChildren()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getProgressBarPartAttr() {
    return 'root';
  }

  /**
   * @protected
   * @returns {import('lit/directives/style-map').StyleInfo}
   */
  getProgressBarStyleMap() {
    return {
      '--vds-media-seekable': String(this.mediaSeekableAmount),
      '--vds-media-duration': String(this.mediaDuration)
    };
  }

  /**
   * @protected
   * @returns {string}
   */
  getProgressBarValueText() {
    return this.valueText
      .replace('{seekableAmount}', formatSpokenTime(this.mediaSeekableAmount))
      .replace('{duration}', formatSpokenTime(this.mediaDuration));
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderProgressBarChildren() {
    return this.renderProgressBarSlot();
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderProgressBarSlot() {
    return html`
      <slot name=${ifNonEmpty(this.getProgressBarSlotName())}></slot>
    `;
  }

  /**
   * @protected
   * @returns {string | undefined}
   */
  getProgressBarSlotName() {
    return undefined;
  }
}

export const SEEKABLE_PROGRESS_BAR_ELEMENT_STORYBOOK_ARG_TYPES = {
  // Properties
  label: {
    control: StorybookControl.Text,
    defaultValue: 'Amount of seekable media'
  },
  valueText: {
    control: StorybookControl.Text,
    defaultValue: '{seekableAmount} out of {duration}'
  },
  // Media Properties
  mediaSeekableAmount: {
    control: StorybookControl.Number,
    defaultValue: 1800
  },
  mediaDuration: {
    control: StorybookControl.Number,
    defaultValue: 3600
  }
};
