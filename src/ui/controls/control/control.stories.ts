import { html, TemplateResult } from 'lit-html';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
} from '../../../shared/storybook';
import { ControlProps } from './control.types';
import { CONTROL_TAG_NAME } from './vds-control';

export default {
  title: 'UI/Foundation/Controls/Control',
  component: CONTROL_TAG_NAME,
  argTypes: buildStorybookControlsFromManifest(CONTROL_TAG_NAME),
};

type Args = ControlProps;

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
      style="color: ${SB_THEME_COLOR};"
    >
      Hello
    </vds-control>
  `;
}

export const Control = Template.bind({});
