import { html } from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { Story } from '../../../shared/storybook';
import { CONTROL_STORYBOOK_ARG_TYPES } from './control.args';
import { ControlActions, ControlProps } from './control.types';
import { CONTROL_TAG_NAME } from './vds-control';

export default {
  title: 'UI/Foundation/Controls/Control',
  component: CONTROL_TAG_NAME,
  argTypes: CONTROL_STORYBOOK_ARG_TYPES,
};

const Template: Story<ControlProps & ControlActions> = ({
  label,
  describedBy,
  controls,
  hasPopup,
  hidden,
  disabled,
  type,
  expanded,
  pressed,
  onClick,
  onFocus,
  onBlur,
}) =>
  html`
    <vds-control
      label="${ifNonEmpty(label)}"
      described-by="${ifNonEmpty(describedBy)}"
      controls="${ifNonEmpty(controls)}"
      type="${ifNonEmpty(type)}"
      ?hidden="${hidden}"
      ?disabled="${disabled}"
      ?has-popup="${hasPopup}"
      ?expanded="${expanded}"
      ?pressed="${pressed}"
      style="color: #FF2A5D;"
      @click="${onClick}"
      @focus="${onFocus}"
      @blur="${onBlur}"
    >
      Hello
    </vds-control>
  `;

export const Control = Template.bind({});
