import '../../../core/fakes/vds-fake-media-provider';

import { html } from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { Story } from '../../../shared/storybook';
import { TIME_PROGRESS_STORYBOOK_ARG_TYPES } from './time-progress.args';
import {
  TimeProgressFakeProps,
  TimeProgressProps,
} from './time-progress.types';
import { TIME_PROGRESS_TAG_NAME } from './vds-time-progress';

export default {
  title: 'UI/Foundation/Time/Time Progress',
  component: TIME_PROGRESS_TAG_NAME,
  argTypes: TIME_PROGRESS_STORYBOOK_ARG_TYPES,
};

const Template: Story<TimeProgressProps & TimeProgressFakeProps> = ({
  label,
  alwaysShowHours,
  padHours,
  timeSeparator,
  fakeCurrentTime,
  fakeDuration,
}) =>
  html`
    <vds-fake-media-provider
      .currentTimeCtx="${fakeCurrentTime}"
      .durationCtx="${fakeDuration}"
    >
      <vds-time-progress
        label="${ifNonEmpty(label)}"
        time-separator="${timeSeparator}"
        ?always-show-hours="${alwaysShowHours}"
        ?pad-hours="${padHours}"
        style="color: #FF2A5D;"
      ></vds-time-progress>
    </vds-fake-media-provider>
  `;

export const TimeProgress = Template.bind({});
