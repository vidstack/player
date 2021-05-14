// ** Dependencies **
import '../time-current/vds-time-current';
import '../time-duration/vds-time-duration';

import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';

import { buildExportPartsAttr } from '../../../utils/dom';
import { TimeElement } from '../time';
import { TimeCurrentElement } from '../time-current';
import { TimeDurationElement } from '../time-duration';
import { timeProgressElementStyles } from './time-progress.css';
import { TimeProgressElementProps } from './time-progress.types';

/**
 * Formats and displays the progression of playback. The output is displayed as
 * `{currentTime}{timeSeparator}{duration}`.
 *
 * @tagname vds-time-progress
 *
 * @csspart root - The component's root element (`<div>`).
 * @csspart current-time - The `vds-time-current` component.
 * @csspart current-time-* - All `vds-time` parts re-exported with the `current-time` prefix such as `current-time-root`.
 * @csspart duration - The `vds-time-duration` component.
 * @csspart duration-* - All `vds-time` parts re-exported with the `duration` prefix such as `duration-root`.
 * @csspart separator - The time separator element (`<span>`).
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
export class TimeProgressElement
  extends LitElement
  implements TimeProgressElementProps {
  @query('#root') rootEl!: HTMLDivElement;
  @query('#time-current') timeCurrentEl!: TimeCurrentElement;
  @query('#time-duration') timeDurationEl!: TimeDurationElement;
  @query('#separator') separatorEl!: HTMLSpanElement;

  static get styles(): CSSResultGroup {
    return [timeProgressElementStyles];
  }

  static get parts(): string[] {
    return [
      'root',
      'current-time',
      'duration',
      'separator',
      ...TimeElement.parts.map(part => `current-time-${part}`),
      ...TimeElement.parts.map(part => `duration-${part}`),
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

  get rootElement(): HTMLDivElement {
    return this.rootEl;
  }

  get timeCurrent(): TimeCurrentElement {
    return this.timeCurrentEl;
  }

  get timeDuration(): TimeDurationElement {
    return this.timeDurationEl;
  }

  get separatorElement(): HTMLSpanElement {
    return this.separatorEl;
  }

  protected render(): TemplateResult {
    return html`
      <div id="root" part="root">
        ${this.renderTimeCurrent()}${this.renderTimeSeparator()}${this.renderTimeDuration()}
      </div>
    `;
  }

  protected renderTimeCurrent(): TemplateResult {
    return html`
      <vds-time-current
        id="time-current"
        label=${this.currentTimeLabel}
        part=${this.getTimeCurrentPartAttr()}
        ?always-show-hours=${this.alwaysShowHours}
        ?pad-hours=${this.padHours}
        exportparts=${this.getTimeCurrentExportPartsAttr()}
      ></vds-time-current>
    `;
  }

  protected getTimeCurrentPartAttr(): string {
    return 'current-time';
  }

  protected getTimeCurrentExportPartsAttr(): string {
    return buildExportPartsAttr(TimeElement.parts, 'current-time');
  }

  protected renderTimeDuration(): TemplateResult {
    return html`
      <vds-time-duration
        id="time-duration"
        label=${this.durationLabel}
        part=${this.getTimeDurationPartAttr()}
        ?always-show-hours=${this.alwaysShowHours}
        ?pad-hours=${this.padHours}
        exportparts=${this.getTimeDurationExportPartsAttr()}
      ></vds-time-duration>
    `;
  }

  protected getTimeDurationPartAttr(): string {
    return 'duration';
  }

  protected getTimeDurationExportPartsAttr(): string {
    return buildExportPartsAttr(TimeElement.parts, 'duration');
  }

  protected renderTimeSeparator(): TemplateResult {
    return html`
      <span id="separator" part=${this.getTimeSeparatorPartAttr()}>
        ${this.timeSeparator}
      </span>
    `;
  }

  protected getTimeSeparatorPartAttr(): string {
    return 'separator';
  }
}
