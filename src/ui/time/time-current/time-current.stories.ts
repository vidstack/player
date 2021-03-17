import '../../../core/fakes/vds-fake-media-provider';

import { html } from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { Story } from '../../../shared/storybook';
import { TIME_CURRENT_STORYBOOK_ARG_TYPES } from './time-current.args';
import { TimeCurrentFakeProps, TimeCurrentProps } from './time-current.types';
import { TIME_CURRENT_TAG_NAME } from './vds-time-current';

export default {
  title: 'UI/Foundation/Time/Time Current',
  component: TIME_CURRENT_TAG_NAME,
  argTypes: TIME_CURRENT_STORYBOOK_ARG_TYPES,
};

const Template: Story<TimeCurrentProps & TimeCurrentFakeProps> = ({
  label,
  alwaysShowHours,
  padHours,
  fakeCurrentTime,
}) =>
  html`
    <vds-fake-media-provider .currentTimeCtx="${fakeCurrentTime}">
      <vds-time-current
        label="${ifNonEmpty(label)}"
        ?always-show-hours="${alwaysShowHours}"
        ?pad-hours="${padHours}"
        style="color: #FF2A5D;"
      ></vds-time-current>
    </vds-fake-media-provider>
  `;

export const TimeCurrent = Template.bind({});
