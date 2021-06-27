import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import {
  BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  BUTTON_ELEMENT_TAG_NAME
} from './ButtonElement.js';

export default {
  title: 'UI/Foundation/Controls/Button',
  component: BUTTON_ELEMENT_TAG_NAME,
  argTypes: BUTTON_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {import('./types').ButtonElementStorybookArgs} args
 */
function Template({
  // Properties
  controls,
  describedBy,
  disabled,
  expanded,
  hasPopup,
  hidden,
  label,
  pressed,
  title,
  type,
  // Actions
  onClick,
  onFocus,
  onBlur
}) {
  return html`
    <vds-button
      label=${ifNonEmpty(label)}
      described-by=${ifNonEmpty(describedBy)}
      controls=${ifNonEmpty(controls)}
      type=${ifNonEmpty(type)}
      ?hidden=${hidden}
      ?disabled=${disabled}
      ?has-popup=${hasPopup}
      ?expanded=${expanded}
      ?pressed=${pressed}
      @click=${onClick}
      @focus=${onFocus}
      @blur=${onBlur}
    >
      ${title}
    </vds-button>
  `;
}

export const Button = Template.bind({});
