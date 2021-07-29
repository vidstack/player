import '../../media/define';
import '../../media/test-utils/define';
import './define';

import { html } from 'lit';

import { ifNonEmpty } from '../../base/directives';
import { StorybookControl } from '../../base/storybook';
import { omit } from '../../utils/object';
import { TIME_ELEMENT_STORYBOOK_ARG_TYPES } from '../time/element.stories';
import { TIME_CURRENT_ELEMENT_TAG_NAME } from './TimeCurrentElement';

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

function Template({
  // Properties
  alwaysShowHours,
  label,
  padHours,
  // Media Properties
  mediaCurrentTime
}: any) {
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
