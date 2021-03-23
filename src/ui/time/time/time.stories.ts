import { html } from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { Story } from '../../../shared/storybook';
import { TIME_STORYBOOK_ARG_TYPES } from './time.args';
import { TimeProps } from './time.types';
import { TIME_TAG_NAME } from './vds-time';

export default {
  title: 'UI/Foundation/Time/Time',
  component: TIME_TAG_NAME,
  argTypes: TIME_STORYBOOK_ARG_TYPES,
};

const Template: Story<TimeProps> = ({
  label,
  seconds,
  alwaysShowHours,
  padHours,
}) =>
  html`<vds-time
    label="${ifNonEmpty(label)}"
    seconds="${seconds}"
    ?always-show-hours="${alwaysShowHours}"
    ?pad-hours="${padHours}"
    style="color: #FF2A5D;"
  ></vds-time> `;

export const Time = Template.bind({});
