import { html, TemplateResult } from 'lit-html';

import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
} from '../../../shared/storybook';
import { ToggleElementProps } from './toggle.types';
import { VDS_TOGGLE_ELEMENT_TAG_NAME } from './vds-toggle';

export default {
  title: 'UI/Foundation/Controls/Toggle',
  component: VDS_TOGGLE_ELEMENT_TAG_NAME,
  argTypes: {
    // Avoid clashing with `pressed` slot name.
    'pressed ': {
      control: 'boolean',
      default: false,
      description: 'Whether the toggle is in the pressed state.',
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
    ...buildStorybookControlsFromManifest(VDS_TOGGLE_ELEMENT_TAG_NAME),
  },
};

type Args = ToggleElementProps & { 'pressed ': boolean };

function Template(args: Args): TemplateResult {
  return html`
    <vds-toggle
      ?pressed="${args['pressed ']}"
      style="color: ${SB_THEME_COLOR};"
    >
      <div slot="pressed">Pressed</div>
      <div slot="not-pressed">Not Pressed</div>
    </vds-toggle>
  `;
}

export const Toggle = Template.bind({});
