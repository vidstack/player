import './define.js';

import { html } from 'lit';

import {
  TOGGLE_ELEMENT_STORYBOOK_ARG_TYPES,
  TOGGLE_ELEMENT_TAG_NAME
} from './ToggleElement.js';

export default {
  title: 'UI/Foundation/Controls/Toggle',
  component: TOGGLE_ELEMENT_TAG_NAME,
  argTypes: TOGGLE_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {import('./types').ToggleElementStorybookArgs} args
 */
function Template({ pressed }) {
  return html`
    <vds-toggle ?pressed=${pressed}>
      <div>Not Pressed</div>
      <div slot="pressed">Pressed</div>
    </vds-toggle>
  `;
}

export const Toggle = Template.bind({});
