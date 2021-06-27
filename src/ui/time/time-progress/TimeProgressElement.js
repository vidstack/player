// ** Dependencies **
import '../time-current/define.js';
import '../time-duration/define.js';

import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import { VdsElement } from '../../../shared/elements/index.js';
import { StorybookControlType } from '../../../shared/storybook/index.js';
import { buildExportPartsAttr } from '../../../utils/dom.js';
import { TimeElement } from '../time/index.js';
import { TimeCurrentElement } from '../time-current/index.js';
import { TimeDurationElement } from '../time-duration/index.js';
import { timeProgressElementStyles } from './css.js';

export const TIME_PROGRESS_ELEMENT_TAG_NAME = 'vds-time-progress';

/** @typedef {import('./types').TimeProgressDisplay} TimeProgressDisplay */

/**
 * Formats and displays the progression of playback. The output is displayed as
 * `{currentTime}{timeSeparator}{duration}`.
 *
 * @implements {TimeProgressDisplay}
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
export class TimeProgressElement extends VdsElement {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [timeProgressElementStyles];
  }

  /** @type {string[]} */
  static get parts() {
    return [
      'root',
      'current-time',
      'duration',
      'separator',
      ...TimeElement.parts.map((part) => `current-time-${part}`),
      ...TimeElement.parts.map((part) => `duration-${part}`)
    ];
  }

  constructor() {
    super();

    // Properties
    this.currentTimeLabel = 'Current time';
    this.timeSeparator = '/';
    this.durationLabel = 'Duration';
    this.alwaysShowHours = false;
    this.padHours = false;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /** @type {import('lit').PropertyDeclarations} */
  static get properties() {
    return {
      currentTimeLabel: { attribute: 'current-time-label' },
      durationLabel: { attribute: 'duration-label' },
      timeSeparator: { attribute: 'time-separator' },
      alwaysShowHours: { type: Boolean, attribute: 'always-show-hours' },
      padHours: { type: Boolean, attribute: 'pad-hours' }
    };
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  rootRef = createRef();

  get rootElement() {
    return /** @type {HTMLDivElement} */ (this.rootRef.value);
  }

  render() {
    return html`
      <div id="root" part="root" ${ref(this.rootRef)}>
        ${this.renderTimeCurrent()}${this.renderTimeSeparator()}${this.renderTimeDuration()}
      </div>
    `;
  }

  // -------------------------------------------------------------------------------------------
  // Time Current
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {import('lit/directives/ref').Ref<TimeCurrentElement>}
   */
  timeCurrentRef = createRef();

  get timeCurrentElement() {
    return /** @type {TimeCurrentElement} */ (this.timeCurrentRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderTimeCurrent() {
    return html`
      <vds-time-current
        id="time-current"
        label=${this.currentTimeLabel}
        part=${this.getTimeCurrentPartAttr()}
        ?always-show-hours=${this.alwaysShowHours}
        ?pad-hours=${this.padHours}
        exportparts=${this.getTimeCurrentExportPartsAttr()}
        ${ref(this.timeCurrentRef)}
      ></vds-time-current>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getTimeCurrentPartAttr() {
    return 'current-time';
  }

  /**
   * @protected
   * @returns {string}
   */
  getTimeCurrentExportPartsAttr() {
    return buildExportPartsAttr(TimeElement.parts, 'current-time');
  }

  // -------------------------------------------------------------------------------------------
  // Time Duration
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {import('lit/directives/ref').Ref<TimeDurationElement>}
   */
  timeDurationRef = createRef();

  get timeDurationElement() {
    return /** @type {TimeDurationElement} */ (this.timeDurationRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderTimeDuration() {
    return html`
      <vds-time-duration
        id="time-duration"
        label=${this.durationLabel}
        part=${this.getTimeDurationPartAttr()}
        ?always-show-hours=${this.alwaysShowHours}
        ?pad-hours=${this.padHours}
        exportparts=${this.getTimeDurationExportPartsAttr()}
        ${ref(this.timeDurationRef)}
      ></vds-time-duration>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getTimeDurationPartAttr() {
    return 'duration';
  }

  /**
   * @protected
   * @returns {string}
   */
  getTimeDurationExportPartsAttr() {
    return buildExportPartsAttr(TimeElement.parts, 'duration');
  }

  // -------------------------------------------------------------------------------------------
  // Separator
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {import('lit/directives/ref').Ref<HTMLSpanElement>}
   */
  separatorRef = createRef();

  get separatorElement() {
    return /** @type {HTMLSpanElement} */ (this.separatorRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderTimeSeparator() {
    return html`
      <span
        id="separator"
        part=${this.getTimeSeparatorPartAttr()}
        ${ref(this.separatorRef)}
      >
        ${this.timeSeparator}
      </span>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getTimeSeparatorPartAttr() {
    return 'separator';
  }
}

/**
 * @readonly
 * @type {import('./types').TimeProgressElementStorybookArgTypes}
 */
export const TIME_PROGRESS_ELEMENT_STORYBOOK_ARG_TYPES = {
  alwaysShowHours: {
    control: StorybookControlType.Boolean,
    defaultValue: false
  },
  currentTimeLabel: {
    control: StorybookControlType.Text,
    defaultValue: 'Current time'
  },
  durationLabel: {
    control: StorybookControlType.Text,
    defaultValue: 'Duration'
  },
  padHours: { control: StorybookControlType.Boolean, defaultValue: false },
  timeSeparator: { control: StorybookControlType.Text, defaultValue: '/' },
  mediaCurrentTime: {
    control: StorybookControlType.Number,
    defaultValue: 1800
  },
  mediaDuration: { control: StorybookControlType.Number, defaultValue: 3600 }
};
