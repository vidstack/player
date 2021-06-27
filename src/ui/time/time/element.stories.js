import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import {
  TIME_ELEMENT_STORYBOOK_ARG_TYPES,
  TIME_ELEMENT_TAG_NAME
} from './TimeElement.js';

export default {
  title: 'UI/Foundation/Time/Time',
  component: TIME_ELEMENT_TAG_NAME,
  argTypes: TIME_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {import('./types').TimeElementStorybookArgs} args
 */
function Template({
  // Properties
  label,
  seconds,
  alwaysShowHours,
  padHours
}) {
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
