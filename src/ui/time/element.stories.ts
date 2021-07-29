import './define';

import { html } from 'lit';

import { ifNonEmpty } from '../../base/directives';
import { StorybookControl } from '../../base/storybook';
import { TIME_ELEMENT_TAG_NAME } from './TimeElement';

export const TIME_ELEMENT_STORYBOOK_ARG_TYPES = {
  alwaysShowHours: {
    control: StorybookControl.Boolean,
    defaultValue: false
  },
  label: { control: StorybookControl.Text },
  padHours: { control: StorybookControl.Boolean, defaultValue: false },
  seconds: { control: StorybookControl.Number, defaultValue: 0 }
};

export default {
  title: 'UI/Time/Time',
  component: TIME_ELEMENT_TAG_NAME,
  argTypes: TIME_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

function Template({
  // Properties
  label,
  seconds,
  alwaysShowHours,
  padHours
}: any) {
  return html`
    <vds-time
      label=${ifNonEmpty(label)}
      seconds=${seconds}
      ?always-show-hours=${alwaysShowHours}
      ?pad-hours=${padHours}
    ></vds-time>
  `;
}

export const Time = Template.bind({});
