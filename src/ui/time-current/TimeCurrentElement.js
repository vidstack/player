import { property } from 'lit/decorators.js';

import { consumeContext } from '../../foundation/context/index.js';
import { StorybookControl } from '../../foundation/storybook/index.js';
import { mediaContext } from '../../media/index.js';
import {
  TIME_ELEMENT_STORYBOOK_ARG_TYPES,
  TimeElement
} from '../time/index.js';

export const TIME_CURRENT_ELEMENT_TAG_NAME = 'vds-time-current';

/**
 * Formats and displays the `currentTime` of media playback. Do not mess with the component's
 * `seconds` property as it's automatically managed.
 *
 *
 * @tagname vds-time-current
 * @csspart root - The component's root element (`<time>`).
 * @example
 * ```html
 * <vds-time-current
 *   label="Current time"
 *   pad-hours
 *   always-show-hours
 * ></vds-time-current>
 * ```
 * @example
 * ```css
 * vds-time-current::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeCurrentElement extends TimeElement {
  label = 'Current media time';

  /**
   * @internal
   */
  @property({ attribute: false, state: true })
  @consumeContext(mediaContext.currentTime)
  seconds = mediaContext.currentTime.initialValue;
}

export const TIME_CURRENT_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...TIME_ELEMENT_STORYBOOK_ARG_TYPES,
  // @ts-ignore
  seconds: { table: { disable: true } },
  mediaCurrentTime: { control: StorybookControl.Number, defaultValue: 1800 }
};
