import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../foundation/directives/index.js';
import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';
import { BUTTON_ELEMENT_TAG_NAME } from './ButtonElement.js';

export const BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  controls: { control: StorybookControl.Text },
  describedBy: { control: StorybookControl.Text },
  disabled: { control: StorybookControl.Boolean },
  expanded: { control: StorybookControl.Boolean },
  hasPopup: { control: StorybookControl.Boolean },
  hidden: { control: StorybookControl.Boolean },
  label: { control: StorybookControl.Text },
  pressed: { control: StorybookControl.Boolean },
  title: { control: StorybookControl.Text, defaultValue: 'Title' },
  type: {
    control: StorybookControl.Select,
    options: ['button', 'submit', 'reset', 'menu'],
    defaultValue: 'button'
  },
  onClick: storybookAction('click'),
  onFocus: storybookAction('focus'),
  onBlur: storybookAction('blur')
};

export default {
  title: 'UI/Controls/Button',
  component: BUTTON_ELEMENT_TAG_NAME,
  argTypes: BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
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
