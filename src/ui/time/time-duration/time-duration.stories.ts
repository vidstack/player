import '../../../core/fakes/vds-fake-media-provider';

import { html } from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { Story } from '../../../shared/storybook';
import { TIME_DURATION_STORYBOOK_ARG_TYPES } from './time-duration.args';
import {
  TimeDurationFakeProps,
  TimeDurationProps,
} from './time-duration.types';
import { TIME_DURATION_TAG_NAME } from './vds-time-duration';

export default {
  title: 'UI/Foundation/Time/Time Duration',
  component: TIME_DURATION_TAG_NAME,
  argTypes: TIME_DURATION_STORYBOOK_ARG_TYPES,
};

const Template: Story<TimeDurationProps & TimeDurationFakeProps> = ({
  label,
  alwaysShowHours,
  padHours,
  fakeDuration,
}) =>
  html`
    <vds-fake-media-provider .durationCtx="${fakeDuration}">
      <vds-time-duration
        label="${ifNonEmpty(label)}"
        ?always-show-hours="${alwaysShowHours}"
        ?pad-hours="${padHours}"
        style="color: #FF2A5D;"
      ></vds-time-duration>
    </vds-fake-media-provider>
  `;

export const TimeDuration = Template.bind({});
