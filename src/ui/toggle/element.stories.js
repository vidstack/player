import './define.js';

import { html } from 'lit';

import { StorybookControl } from '../../foundation/storybook/index.js';
import { TOGGLE_ELEMENT_TAG_NAME } from './ToggleElement.js';

export const TOGGLE_ELEMENT_STORYBOOK_ARG_TYPES = {
  pressed: { control: StorybookControl.Boolean, defaultValue: false }
};

export default {
  title: 'UI/Controls/Toggle',
  component: TOGGLE_ELEMENT_TAG_NAME,
  argTypes: TOGGLE_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
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
