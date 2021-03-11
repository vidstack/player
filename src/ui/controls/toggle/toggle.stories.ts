import { html } from 'lit-element';

import { Story } from '../../../shared/storybook';
import { TOGGLE_STORYBOOK_ARG_TYPES, ToggleProps } from './toggle.args';
import { TOGGLE_TAG_NAME } from './vds-toggle';

export default {
  title: 'UI/Foundation/Controls/Toggle',
  component: TOGGLE_TAG_NAME,
  argTypes: TOGGLE_STORYBOOK_ARG_TYPES,
};

const Template: Story<ToggleProps> = ({ on }) =>
  html`
    <vds-toggle ?on="${on}" style="color: #FF2A5D;">
      <div slot="on">On</div>
      <div slot="off">Off</div>
    </vds-toggle>
  `;

export const Toggle = Template.bind({});
