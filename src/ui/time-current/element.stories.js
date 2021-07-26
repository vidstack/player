import '@media/define.js';
import '@media/test-utils/define.js';
import './define.js';

import { ifNonEmpty } from '@base/directives/index.js';
import { StorybookControl } from '@base/storybook/index.js';
import { omit } from '@utils/object.js';
import { html } from 'lit';

import { TIME_ELEMENT_STORYBOOK_ARG_TYPES } from '../time/element.stories.js';
import { TIME_CURRENT_ELEMENT_TAG_NAME } from './TimeCurrentElement.js';

export const TIME_CURRENT_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...omit(TIME_ELEMENT_STORYBOOK_ARG_TYPES, ['seconds']),
  mediaCurrentTime: { control: StorybookControl.Number, defaultValue: 1800 }
};

export default {
  title: 'UI/Time/Time Current',
  component: TIME_CURRENT_ELEMENT_TAG_NAME,
  argTypes: TIME_CURRENT_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
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
