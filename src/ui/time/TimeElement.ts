import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

import { ifNonEmpty } from '../../base/directives';
import { ElementLogger } from '../../base/logger';
import { DEV_MODE } from '../../global/env';
import { formatHtml5Duration, formatTime } from '../../utils/time';
import { timeElementStyles } from './styles';

/**
 * Formats and displays a length of time given in `seconds`.
 *
 * @tagname vds-time
 * @csspart root - The component's root element (`<time>`).
 * @example
 * ```html
 * <vds-time seconds="50"></vds-time>
 * ```
 * @example
 * ```html
 * <vds-time
 *   label="Current time"
 *   seconds="3650"
 *   pad-hours
 *   always-show-hours
 * ></vds-time>
 * ```
 * @example
 * ```css
 * vds-time::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [timeElementStyles];
  }

  static get parts(): string[] {
    return ['root', 'time'];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /* c8 ignore next */
  protected readonly _logger = DEV_MODE && new ElementLogger(this);

  /**
   * ♿ **ARIA:** The `aria-label` property of the time.
   */
  @property()
  label: string | undefined;

  /**
   * The length of time in seconds.
   */
  @property({ type: Number })
  seconds = 0;

  /**
   * Whether the time should always show the hours unit, even if the time is less than
   * 1 hour.
   *
   * @example `20:30` -> `0:20:35`
   */
  @property({ attribute: 'always-show-hours', type: Boolean })
  alwaysShowHours = false;

  /**
   * Whether the hours unit should be padded with zeroes to a length of 2.
   *
   * @example `1:20:03` -> `01:20:03`
   */
  @property({ attribute: 'pad-hours', type: Boolean })
  padHours = false;

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  protected readonly _rootRef = createRef<HTMLTimeElement>();

  /**
   * The component's root element.
   */
  get rootElement() {
    return this._rootRef.value;
  }

  protected override render(): TemplateResult {
    return html`
      <time
        id="root"
        part="root time"
        aria-label=${ifNonEmpty(this.label)}
        datetime=${this._getFormattedDuration()}
        ${ref(this._rootRef)}
      >
        ${this._renderRootChildren()}
      </time>
    `;
  }

  protected _renderRootChildren(): TemplateResult {
    return html`${this._getFormattedTime()}`;
  }

  /**
   * @returns The seconds formatted into human readable form.
   */
  protected _getFormattedTime(): string {
    return formatTime(this.seconds, this.padHours, this.alwaysShowHours);
  }

  /**
   * @returns A valid HTML5 duration.
   * @see https://www.w3.org/TR/2014/REC-html5-20141028/infrastructure.html#valid-duration-string
   */
  protected _getFormattedDuration(): string {
    return formatHtml5Duration(this.seconds);
  }
}
