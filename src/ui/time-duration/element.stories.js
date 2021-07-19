import '../../media/define.js';
import '../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../foundation/directives/index.js';
import {
  TIME_DURATION_ELEMENT_STORYBOOK_ARG_TYPES,
  TIME_DURATION_ELEMENT_TAG_NAME
} from './TimeDurationElement.js';

export default {
  title: 'UI/Time/Time Duration',
  component: TIME_DURATION_ELEMENT_TAG_NAME,
  argTypes: TIME_DURATION_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
 */
function Template({
  // Properties
  alwaysShowHours,
  label,
  padHours,
  // Media Properties
  mediaDuration
}) {
  return html`
    <vds-media-controller>
      <vds-media-container>
        <vds-fake-media-provider
          .canPlayContext=${true}
          .durationContext=${mediaDuration}
        ></vds-fake-media-provider>

        <vds-time-duration
          label=${ifNonEmpty(label)}
          ?always-show-hours=${alwaysShowHours}
          ?pad-hours=${padHours}
        ></vds-time-duration>
      </vds-media-container>
    </vds-media-controller>
  `;
}

export const TimeDuration = Template.bind({});
