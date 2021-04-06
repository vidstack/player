import { html, TemplateResult } from 'lit-html';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
} from '../../../shared/storybook';
import { ToggleControlProps } from './toggle-control.types';
import { TOGGLE_CONTROL_TAG_NAME } from './vds-toggle-control';

export default {
  title: 'UI/Foundation/Controls/Toggle Control',
  component: TOGGLE_CONTROL_TAG_NAME,
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
    ...buildStorybookControlsFromManifest(TOGGLE_CONTROL_TAG_NAME),
  },
};

type Args = ToggleControlProps & { 'on ': boolean };

function Template({
  // Props
  label,
  disabled,
  describedBy,
  ...args
}: Args): TemplateResult {
  return html`
    <vds-toggle-control
      label="${ifNonEmpty(label)}"
      described-by="${ifNonEmpty(describedBy)}"
      ?on="${args['on ']}"
      ?disabld="${disabled}"
      style="color: ${SB_THEME_COLOR};"
    >
      <div slot="on">On</div>
      <div slot="off">Off</div>
    </vds-toggle-control>
  `;
}

export const ToggleControl = Template.bind({});
