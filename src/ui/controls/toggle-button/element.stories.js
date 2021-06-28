import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../foundation/directives/index.js';
import {
  TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  TOGGLE_BUTTON_ELEMENT_TAG_NAME
} from './ToggleButtonElement.js';

export default {
  title: 'UI/Foundation/Controls/Toggle Button',
  component: TOGGLE_BUTTON_ELEMENT_TAG_NAME,
  argTypes: TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES
};

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
