import './define';

import { html } from 'lit';

import { StorybookControl } from '../../base/storybook';
import { SCRIM_ELEMENT_TAG_NAME } from './ScrimElement';

export const SCRIM_STORYBOOK_ARG_TYPES = {
  direction: {
    control: StorybookControl.Select,
    options: ['up', 'down'],
    defaultValue: 'up'
  }
};

export default {
  title: 'UI/Scrim',
  component: SCRIM_ELEMENT_TAG_NAME,
  argTypes: SCRIM_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

function Template({
  // Properties
  direction
}: any) {
  return html`
    <div id="container">
      <vds-scrim direction=${direction}></vds-scrim>
    </div>

    <style>
      #container {
        position: relative;
        width: 300px;
        height: 258px;
        background-color: white;
      }

      vds-scrim {
        width: 100%;
        height: 100%;
      }
    </style>
  `;
}

export const Scrim = Template.bind({});
