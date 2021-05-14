import { html, TemplateResult } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
} from '../../../shared/storybook';
import { ButtonElementProps } from './button.types';
import { VDS_BUTTON_ELEMENT_TAG_NAME } from './vds-button';

export default {
  title: 'UI/Foundation/Controls/Button',
  component: VDS_BUTTON_ELEMENT_TAG_NAME,
  argTypes: buildStorybookControlsFromManifest(VDS_BUTTON_ELEMENT_TAG_NAME),
};

type Args = ButtonElementProps;

function Template({
  label,
  describedBy,
  controls,
  hasPopup,
  hidden,
  disabled,
  type,
  expanded,
  pressed,
}: Args): TemplateResult {
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
      style="color: ${SB_THEME_COLOR};"
    >
      Hello
    </vds-button>
  `;
}

export const Button = Template.bind({});
