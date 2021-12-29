import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

import { ElementLogger } from '../../base/logger';
import { DEV_MODE } from '../../global/env';
import { subscribeToMediaService } from '../../media';
import { formatSpokenTime } from '../../utils/time';
import { seekableProgressBarElementStyles } from './styles';

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
  static override get styles(): CSSResultGroup {
    return [seekableProgressBarElementStyles];
  }

  static get parts(): string[] {
    return ['root'];
  }

  constructor() {
    super();
    subscribeToMediaService(this, ({ context }) => {
      this._mediaSeekableAmount = context.seekableAmount;
      this._mediaDuration = context.duration >= 0 ? context.duration : 0;
    });
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /* c8 ignore next */
  protected readonly _logger = DEV_MODE && new ElementLogger(this);

  /**
   * ♿ **ARIA:** The `aria-label` for the progress bar.
   */
  @property() label = 'Amount of seekable media';

  /**
   * ♿ **ARIA:** Human-readable text alternative for the seekable amount. If you pass
   * in a string containing `{seekableAmount}` or `{duration}` templates they'll be replaced with
   * the spoken form such as `1 hour 30 minutes`.
   */
  @property({ attribute: 'value-text' })
  valueText = '{seekableAmount} out of {duration}';

  @state() protected _mediaSeekableAmount = 0;
  @state() protected _mediaDuration = 0;

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override render(): TemplateResult {
    return this._renderProgressBar();
  }

  // -------------------------------------------------------------------------------------------
  // Progress
  // -------------------------------------------------------------------------------------------

  protected readonly _progressBarRef = createRef<HTMLProgressElement>();

  /**
   * Returns the underlying `<progress>` element.
   */
  get progressBarElement() {
    return this._progressBarRef.value;
  }

  protected _renderProgressBar(): TemplateResult {
    return html`
      <div
        id="progressbar"
        role="progressbar"
        part="root"
        style=${styleMap({
          '--vds-media-seekable': String(this._mediaSeekableAmount),
          '--vds-media-duration': String(this._mediaDuration)
        })}
        ?hidden=${this.hidden}
        aria-label=${this.label}
        aria-valuemin="0"
        aria-valuenow=${Math.round(this._mediaSeekableAmount)}
        aria-valuemax=${Math.round(this._mediaDuration)}
        aria-valuetext=${this._getProgressBarValueText()}
        ${ref(this._progressBarRef)}
      >
        ${this._renderProgressBarChildren()}
      </div>
    `;
  }

  protected _getProgressBarValueText(): string {
    return this.valueText
      .replace('{seekableAmount}', formatSpokenTime(this._mediaSeekableAmount))
      .replace('{duration}', formatSpokenTime(this._mediaDuration));
  }

  protected _renderProgressBarChildren(): TemplateResult {
    return this._renderProgressBarSlot();
  }

  protected _renderProgressBarSlot(): TemplateResult {
    return html`<slot></slot>`;
  }
}
