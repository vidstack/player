import { html, TemplateResult } from 'lit-html';

import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
} from '../../../shared/storybook';
import { ToggleProps } from './toggle.types';
import { TOGGLE_TAG_NAME } from './vds-toggle';

export default {
  title: 'UI/Foundation/Controls/Toggle',
  component: TOGGLE_TAG_NAME,
  argTypes: {
    // Avoid clashing with `on` slot name.
    'on ': {
      control: 'boolean',
      default: false,
      description: 'Whether the toggle is in the `on` state.',
      table: {
        category: 'properties',
        defaultValue: {
          summary: 'false',
        },
        type: {
          summary: 'boolean',
        },
      },
    },
    ...buildStorybookControlsFromManifest(TOGGLE_TAG_NAME),
  },
};

type Args = ToggleProps & { 'on ': boolean };

function Template(args: Args): TemplateResult {
  return html`
    <vds-toggle ?on="${args['on ']}" style="color: ${SB_THEME_COLOR};">
      <div slot="on">On</div>
      <div slot="off">Off</div>
    </vds-toggle>
  `;
}

export const Toggle = Template.bind({});
