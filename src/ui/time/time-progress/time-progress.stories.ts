import '../../../core/media/controller/vds-media-controller';
import '../../../core/media/container/vds-media-container';

import { html, TemplateResult } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
} from '../../../shared/storybook';
import { TimeProgressElementProps } from './time-progress.types';
import { VDS_TIME_PROGRESS_ELEMENT_TAG_NAME } from './vds-time-progress';

export default {
  title: 'UI/Foundation/Time/Time Progress',
  component: VDS_TIME_PROGRESS_ELEMENT_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(VDS_TIME_PROGRESS_ELEMENT_TAG_NAME),
    seconds: {
      table: {
        disable: true,
      },
    },
    fakeCurrentTime: {
      control: 'number',
      defaultValue: 3750,
    },
    fakeDuration: {
      control: 'number',
      defaultValue: 7500,
    },
  },
};

interface FakeProps {
  fakeCurrentTime: number;
  fakeDuration: number;
}

type Args = FakeProps & TimeProgressElementProps;

function Template({
  // Fakes
  fakeCurrentTime,
  fakeDuration,
  // Props
  label,
  alwaysShowHours,
  padHours,
  currentTimeLabel,
  durationLabel,
  timeSeparator,
}: Args): TemplateResult {
  return html`
    <vds-media-controller
      .currentTime="${fakeCurrentTime}"
      .duration="${fakeDuration}"
    >
      <vds-media-container>
        <vds-time-progress
          label="${ifNonEmpty(label)}"
          time-separator="${timeSeparator}"
          current-time-label="${ifNonEmpty(currentTimeLabel)}"
          duration-label="${ifNonEmpty(durationLabel)}"
          ?always-show-hours="${alwaysShowHours}"
          ?pad-hours="${padHours}"
          style="color: ${SB_THEME_COLOR};"
        ></vds-time-progress>
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-media-container::part(ui) {
        position: relative;
      }
    </style>
  `;
}

export const TimeProgress = Template.bind({});
