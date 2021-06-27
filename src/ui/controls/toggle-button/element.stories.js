import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import {
  VDS_TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME
} from './ToggleButtonElement.js';

export default {
  title: 'UI/Foundation/Controls/Toggle Button',
  component: VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME,
  argTypes: VDS_TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {import('./types').ToggleButtonElementStorybookArgs} args
 */
function Template({
  // Properties
  label,
  disabled,
  describedBy,
  pressed,
  // Actions
  onClick,
  onFocus,
  onBlur
}) {
  return html`
    <vds-toggle-button
      label=${ifNonEmpty(label)}
      described-by=${ifNonEmpty(describedBy)}
      ?pressed=${pressed}
      ?disabled=${disabled}
      @click=${onClick}
      @focus=${onFocus}
      @blur=${onBlur}
    >
      <div slot="pressed">Pressed</div>
      <div>Not Pressed</div>
    </vds-toggle-button>
  `;
}

export const ToggleButton = Template.bind({});
