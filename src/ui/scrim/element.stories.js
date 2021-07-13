import './define.js';

import { html } from 'lit';

import {
  SCRIM_ELEMENT_TAG_NAME,
  SCRIM_STORYBOOK_ARG_TYPES
} from './ScrimElement.js';

export default {
  title: 'UI/Scrim',
  component: SCRIM_ELEMENT_TAG_NAME,
  argTypes: SCRIM_STORYBOOK_ARG_TYPES
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
 */
function Template({
  // Properties
  direction
}) {
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
