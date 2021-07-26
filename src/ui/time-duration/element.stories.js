import '@media/define.js';
import '@media/test-utils/define.js';
import './define.js';

import { ifNonEmpty } from '@base/directives/index.js';
import { StorybookControl } from '@base/storybook/index.js';
import { omit } from '@utils/object.js';
import { html } from 'lit';

import { TIME_ELEMENT_STORYBOOK_ARG_TYPES } from '../time/element.stories.js';
import { TIME_DURATION_ELEMENT_TAG_NAME } from './TimeDurationElement.js';

export const TIME_DURATION_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...omit(TIME_ELEMENT_STORYBOOK_ARG_TYPES, ['seconds']),
  mediaDuration: { control: StorybookControl.Number, defaultValue: 1800 }
};

export default {
  title: 'UI/Time/Time Duration',
  component: TIME_DURATION_ELEMENT_TAG_NAME,
  argTypes: TIME_DURATION_ELEMENT_STORYBOOK_ARG_TYPES,
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
