import {
  CSSResultArray,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';

import { TimeProgressProps } from './time-progress.args';
import { timeProgressStyles } from './time-progress.css';

/**
 * Formats and displays the progression of playback. The output is displayed as
 * `{currentTime}{timeSeparator}{duration}`.
 *
 * ## Tag
 *
 * @tagname vds-time-progress
 *
 * ## CSS Parts
 *
 * @csspart root - The component's root element (`<div>`).
 * @csspart current-time - The `vds-time-current` component.
 * @csspart current-time-root - The `vds-time-current` component's root element (`<time>`).
 * @csspart duration - The `vds-time-duration` component.
 * @csspart duration-root - The `vds-time-duration` component's root element (`<time>`).
 * @csspart separator - The time separator element (`<span>`).
 *
 * ## Examples
 *
 * @example
 * ```html
 * <vds-time-progress
 *   current-time-label="Current time"
 *   duration-label="Duration"
 *   pad-hours
 *   always-show-hours
 * ></vds-time-progress>
 * ```
 *
 * @example
 * ```css
 * vds-time-progress::part(current-time) {
 *   font-size: 16px;
 * }
 *
 * vds-time-progress::part(duration) {
 *   font-size: 16px;
 * }
 *
 * vds-time-progress::part(separator) {
 *   margin: 0 2px;
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeProgress extends LitElement implements TimeProgressProps {
  static get styles(): CSSResultArray {
    return [timeProgressStyles];
  }

  @property({ attribute: 'current-time-label' })
  currentTimeLabel = 'Current time';

  @property({ attribute: 'duration-label' })
  durationLabel = 'Duration';

  @property({ attribute: 'time-separator' })
  timeSeparator = '/';

  @property({ type: Boolean, attribute: 'always-show-hours' })
  alwaysShowHours = false;

  @property({ type: Boolean, attribute: 'pad-hours' })
  padHours = false;

  render(): TemplateResult {
    return html`
      <div id="root" part="root">
        ${this.renderCurrentTime()}${this.renderTimeSeparator()}${this.renderDuration()}
      </div>
    `;
  }

  protected renderCurrentTime(): TemplateResult {
    return html`
      <vds-time-current
        label="${this.currentTimeLabel}"
        part="${this.getCurrentTimePartAttr()}"
        ?always-show-hours="${this.alwaysShowHours}"
        ?pad-hours="${this.padHours}"
        exportparts="${this.getCurrentTimeExportPartsAttr()}"
      ></vds-time-current>
    `;
  }

  protected getCurrentTimePartAttr(): string {
    return 'current-time';
  }

  protected getCurrentTimeExportPartsAttr(): string {
    return 'root: current-time-root';
  }

  protected renderDuration(): TemplateResult {
    return html`
      <vds-time-duration
        label="${this.durationLabel}"
        part="${this.getDurationPartAttr()}"
        ?always-show-hours="${this.alwaysShowHours}"
        ?pad-hours="${this.padHours}"
        exportparts="${this.getDurationExportPartsAttr()}"
      ></vds-time-duration>
    `;
  }

  protected getDurationPartAttr(): string {
    return 'duration';
  }

  protected getDurationExportPartsAttr(): string {
    return 'root: duration-root';
  }

  protected renderTimeSeparator(): TemplateResult {
    return html`
      <span id="separator" part="${this.getTimeSeparatorPartAttr()}">
        ${this.timeSeparator}
      </span>
    `;
  }

  protected getTimeSeparatorPartAttr(): string {
    return 'separator time-separator';
  }
}
