import '../../../core/fakes/vds-fake-media-provider';

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
    <vds-fake-media-provider .durationCtx="${fakeDuration}">
      <vds-time-duration
        label="${ifNonEmpty(label)}"
        ?always-show-hours="${alwaysShowHours}"
        ?pad-hours="${padHours}"
        style="color: ${SB_THEME_COLOR};"
      ></vds-time-duration>
    </vds-fake-media-provider>
  `;
}

export const TimeDuration = Template.bind({});
