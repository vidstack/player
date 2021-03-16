import {
  CSSResultArray,
  html,
  LitElement,
  property,
  query,
  TemplateResult,
} from 'lit-element';

import { buildExportPartsAttr } from '../../../utils/dom';
import { Time } from '../time';
import { TimeCurrent } from '../time-current';
import { TimeDuration } from '../time-duration';
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
 * @csspart current-time-* - All `vds-time` parts re-exported with the `current-time` prefix such as `current-time-root`.
 * @csspart duration - The `vds-time-duration` component.
 * @csspart duration-* - All `vds-time` parts re-exported with the `duration` prefix such as `duration-root`.
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
  @query('#root') rootEl!: HTMLDivElement;
  @query('#time-current') timeCurrentEl!: TimeCurrent;
  @query('#time-duration') timeDurationEl!: TimeDuration;
  @query('#separator') separatorEl!: HTMLSpanElement;

  static get styles(): CSSResultArray {
    return [timeProgressStyles];
  }

  static get parts(): string[] {
    return [
      'root',
      'current-time',
      'duration',
      'separator',
      ...Time.parts.map(part => `current-time-${part}`),
      ...Time.parts.map(part => `duration-${part}`),
    ];
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

  /**
   * The component's root element.
   */
  get rootElement(): HTMLDivElement {
    return this.rootEl;
  }

  /**
   * The underlying `vds-time-current` component.
   */
  get timeCurrent(): TimeCurrent {
    return this.timeCurrentEl;
  }

  /**
   * The underlying `vds-time-duration` component.
   */
  get timeDuration(): TimeDuration {
    return this.timeDurationEl;
  }

  /**
   * The separator element.
   */
  get separatorElement(): HTMLSpanElement {
    return this.separatorEl;
  }

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
        id="time-current"
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
    return buildExportPartsAttr(Time.parts, 'current-time');
  }

  protected renderDuration(): TemplateResult {
    return html`
      <vds-time-duration
        id="time-duration"
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
    return buildExportPartsAttr(Time.parts, 'duration');
  }

  protected renderTimeSeparator(): TemplateResult {
    return html`
      <span id="separator" part="${this.getTimeSeparatorPartAttr()}">
        ${this.timeSeparator}
      </span>
    `;
  }

  protected getTimeSeparatorPartAttr(): string {
    return 'separator';
  }
}
