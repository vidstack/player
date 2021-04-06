import { html, TemplateResult } from 'lit-html';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
} from '../../../shared/storybook';
import { TimeProps } from './time.types';
import { TIME_TAG_NAME } from './vds-time';

export default {
  title: 'UI/Foundation/Time/Time',
  component: TIME_TAG_NAME,
  argTypes: buildStorybookControlsFromManifest(TIME_TAG_NAME),
};

type Args = TimeProps;

function Template({
  // Props
  label,
  seconds,
  alwaysShowHours,
  padHours,
}: Args): TemplateResult {
  return html`
    <vds-time
      label="${ifNonEmpty(label)}"
      seconds="${seconds}"
      ?always-show-hours="${alwaysShowHours}"
      ?pad-hours="${padHours}"
      style="color: ${SB_THEME_COLOR};"
    ></vds-time>
  `;
}

export const Time = Template.bind({});
