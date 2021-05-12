import '../../../core/media/controller/vds-media-controller';
import '../../../core/media/container/vds-media-container';

import { html, TemplateResult } from 'lit-html';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
} from '../../../shared/storybook';
import { TimeDurationElementProps } from './time-duration.types';
import { VDS_TIME_DURATION_ELEMENT_TAG_NAME } from './vds-time-duration';

export default {
  title: 'UI/Foundation/Time/Time Duration',
  component: VDS_TIME_DURATION_ELEMENT_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(VDS_TIME_DURATION_ELEMENT_TAG_NAME),
    seconds: {
      table: {
        disable: true,
      },
    },
    fakeDuration: {
      control: 'number',
      defaultValue: 3750,
    },
  },
};

interface FakeProps {
  fakeDuration: number;
}

type Args = FakeProps & TimeDurationElementProps;

function Template({
  fakeDuration,
  label,
  alwaysShowHours,
  padHours,
}: Args): TemplateResult {
  return html`
    <vds-media-controller .duration="${fakeDuration}">
      <vds-media-container>
        <vds-time-duration
          label="${ifNonEmpty(label)}"
          ?always-show-hours="${alwaysShowHours}"
          ?pad-hours="${padHours}"
          style="color: ${SB_THEME_COLOR};"
        ></vds-time-duration>
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-media-container::part(ui) {
        position: relative;
      }
    </style>
  `;
}

export const TimeDuration = Template.bind({});
