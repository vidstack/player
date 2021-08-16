import '../../media/test-utils/define';
import './define';

import { html } from 'lit';

import { ifNonEmpty } from '../../base/directives';
import { LOGGER_STORYBOOK_ARG_TYPES } from '../../base/logger';
import { StorybookControl } from '../../base/storybook';
import { omit } from '../../utils/object';
import { TIME_ELEMENT_STORYBOOK_ARG_TYPES } from '../time/element.stories';
import { TIME_DURATION_ELEMENT_TAG_NAME } from './TimeDurationElement';

export const TIME_DURATION_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...LOGGER_STORYBOOK_ARG_TYPES,
  ...omit(TIME_ELEMENT_STORYBOOK_ARG_TYPES, ['seconds']),
  mediaDuration: { control: StorybookControl.Number, defaultValue: 1800 }
};

export default {
  title: 'UI/Time/Time Duration',
  component: TIME_DURATION_ELEMENT_TAG_NAME,
  argTypes: TIME_DURATION_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

function Template({
  // Properties
  alwaysShowHours,
  label,
  logLevel,
  padHours,
  // Media Properties
  mediaDuration
}: any) {
  return html`
    <vds-fake-media-player
      log-level=${logLevel}
      .mediaCanPlay=${true}
      .mediaDuration=${mediaDuration}
    >
      <vds-time-duration
        label=${ifNonEmpty(label)}
        ?always-show-hours=${alwaysShowHours}
        ?pad-hours=${padHours}
        slot="ui"
      ></vds-time-duration>
    </vds-fake-media-player>
  `;
}

export const TimeDuration = Template.bind({});
