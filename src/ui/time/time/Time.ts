import {
  CSSResultArray,
  html,
  LitElement,
  property,
  query,
  TemplateResult,
} from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { TimeProps } from './time.args';
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
 * @csspart root - The component's root element (`<time>`).
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
 * <vds-time
 *   label="Current time"
 *   duration="3650"
 *   pad-hours
 *   always-show-hours
 * ></vds-time>
 * ```
 *
 * @example
 * ```css
 * vds-time::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class Time extends LitElement implements TimeProps {
  @query('#root') rootEl!: HTMLTimeElement;

  static get styles(): CSSResultArray {
    return [timeStyles];
  }

  static get parts(): string[] {
    return ['root', 'time'];
  }

  @property() label?: string;

  @property({ type: Number }) duration = 0;

  @property({ type: Boolean, attribute: 'always-show-hours' })
  alwaysShowHours = false;

  @property({ type: Boolean, attribute: 'pad-hours' })
  padHours = false;

  /**
   * The component's root element.
   */
  get rootElement(): HTMLTimeElement {
    return this.rootEl;
  }

  render(): TemplateResult {
    return html`
      <time
        id="root"
        class="${this.getRootClassAttr()}"
        part="${this.getRootPartAttr()}"
        aria-label="${ifNonEmpty(this.label)}"
        datetime="${this.getFormattedDuration()}"
      >
        ${this.renderRootContent()}
      </time>
    `;
  }

  protected renderRootContent(): TemplateResult {
    return html`${this.getFormattedTime()}`;
  }

  /**
   * @returns The duration formatted into human readable form.
   */
  protected getFormattedTime(): string {
    return formatTime(this.duration, this.padHours, this.alwaysShowHours);
  }

  /**
   * @returns A valid HTML5 duration.
   *
   * @spec https://www.w3.org/TR/2014/REC-html5-20141028/infrastructure.html#valid-duration-string
   */
  protected getFormattedDuration(): string {
    return formatHtml5Duration(this.duration);
  }

  /**
   * Override this to modify root CSS Classes.
   */
  protected getRootClassAttr(): string {
    return 'root';
  }

  /**
   * Override this to modify root CSS parts.
   */
  protected getRootPartAttr(): string {
    return 'root time';
  }
}
