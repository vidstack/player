import { html, TemplateResult } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
} from '../../../shared/storybook';
import { ToggleButtonElementProps } from './toggle-button.types';
import { VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME } from './vds-toggle-button';

export default {
  title: 'UI/Foundation/Controls/Toggle Button',
  component: VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME,
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
    ...buildStorybookControlsFromManifest(VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME),
  },
};

type Args = ToggleButtonElementProps & { 'pressed ': boolean };

function Template({
  // Props
  label,
  disabled,
  describedBy,
  ...args
}: Args): TemplateResult {
  return html`
    <vds-toggle-button
      label="${ifNonEmpty(label)}"
      described-by="${ifNonEmpty(describedBy)}"
      ?pressed="${args['pressed ']}"
      ?disabled="${disabled}"
      style="color: ${SB_THEME_COLOR};"
    >
      <div slot="pressed">Pressed</div>
      <div>Not Pressed</div>
    </vds-toggle-button>
  `;
}

export const ToggleButton = Template.bind({});
