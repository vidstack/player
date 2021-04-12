import '../../../core/fakes/vds-fake-media-provider';

import { html, TemplateResult } from 'lit-html';

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
    <vds-fake-media-provider
      .currentTimeCtx="${fakeCurrentTime}"
      .durationCtx="${fakeDuration}"
    >
      <vds-time-progress
        label="${ifNonEmpty(label)}"
        time-separator="${timeSeparator}"
        current-time-label="${ifNonEmpty(currentTimeLabel)}"
        duration-label="${ifNonEmpty(durationLabel)}"
        ?always-show-hours="${alwaysShowHours}"
        ?pad-hours="${padHours}"
        style="color: ${SB_THEME_COLOR};"
      ></vds-time-progress>
    </vds-fake-media-provider>
  `;
}

export const TimeProgress = Template.bind({});
