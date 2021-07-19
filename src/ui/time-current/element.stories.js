import '../../media/define.js';
import '../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../foundation/directives/index.js';
import {
  TIME_CURRENT_ELEMENT_STORYBOOK_ARG_TYPES,
  TIME_CURRENT_ELEMENT_TAG_NAME
} from './TimeCurrentElement.js';

export default {
  title: 'UI/Time/Time Current',
  component: TIME_CURRENT_ELEMENT_TAG_NAME,
  argTypes: TIME_CURRENT_ELEMENT_STORYBOOK_ARG_TYPES
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
  mediaCurrentTime
}) {
  return html`
    <vds-media-controller .currentTime=${mediaCurrentTime}>
      <vds-media-container>
        <vds-fake-media-provider
          .canPlayContext=${true}
          .currentTimeContext=${mediaCurrentTime}
        ></vds-fake-media-provider>

        <vds-time-current
          label=${ifNonEmpty(label)}
          ?always-show-hours=${alwaysShowHours}
          ?pad-hours=${padHours}
        ></vds-time-current>
      </vds-media-container>
    </vds-media-controller>
  `;
}

export const TimeCurrent = Template.bind({});
