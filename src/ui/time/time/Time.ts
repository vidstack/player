import {
  CSSResultArray,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { timeStyles } from './time.css';
import { formatHtml5Duration, formatTime } from './time.utils';

/**
 * Formats and displays a length of time (defined as `duration`). The duration should be provided
 * in seconds.
 *
 * ## Tag
 *
 * @tagname vds-time
 *
 * ## CSS Parts
 *
 * @csspart root - The root component element (`<time>`).
 *
 * ## Examples
 *
 * @example
 * ```html
 * <vds-time duration="50"></vds-time>
 * ```
 *
 * @example
 * ```html
 * <vds-time duration="3650" pad-hours always-show-hours></vds-time>
 * ```
 *
 * @example
 * ```css
 * vds-time::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class Time extends LitElement {
  static get styles(): CSSResultArray {
    return [timeStyles];
  }

  /**
   * The `aria-label` property of the time.
   */
  @property() label?: string;

  /**
   * The length of time in seconds.
   */
  @property({ type: Number }) duration = 0;

  /**
   * Whether the time should always show the hours unit, even if the time is less than
   * 1 hour.
   *
   * @example `20:30` -> `0:20:35`
   */
  @property({ type: Boolean, attribute: 'always-show-hours' })
  alwaysShowHours = false;

  /**
   * Whether the hours unit should be padded with zeroes to a length of 2.
   *
   * @example `1:20:03` -> `01:20:03`
   */
  @property({ type: Boolean, attribute: 'pad-hours' })
  padHours = false;

  render(): TemplateResult {
    return this.renderTime();
  }

  protected renderTime(): TemplateResult {
    return html`
      <time
        class="${this.buildRootClassAttr()}"
        part="${this.buildRootPartAttr()}"
        aria-label="${ifNonEmpty(this.label)}"
        datetime="${this.getFormattedDuration()}"
      >
        ${this.renderContent()}
      </time>
    `;
  }

  protected renderContent(): TemplateResult {
    return html`${this.getFormattedTime()}`;
  }

  protected getFormattedTime(): string {
    return formatTime(this.duration, this.padHours, this.alwaysShowHours);
  }

  protected getFormattedDuration(): string {
    return formatHtml5Duration(this.duration);
  }

  /**
   * Override this to modify root UI CSS Classes.
   */
  protected buildRootClassAttr(): string {
    return 'root';
  }

  /**
   * Override this to modify root UI CSS parts.
   */
  protected buildRootPartAttr(): string {
    return 'root';
  }
}
