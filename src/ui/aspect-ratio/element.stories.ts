import '../../media/test-utils/define';
import './define';

import { html } from 'lit';

import { ifNonEmpty } from '../../base/directives';
import { StorybookControl } from '../../base/storybook';
import { ASPECT_RATIO_ELEMENT_TAG_NAME } from './AspectRatioElement';

export const ASPECT_RATIO_ELEMENT_STORYBOOK_ARG_TYPES = {
  minHeight: {
    control: StorybookControl.Text,
    defaultValue: '150px'
  },
  maxHeight: { control: StorybookControl.Text, defaultValue: '100vh' },
  ratio: { control: StorybookControl.Text, defaultValue: '2:1' }
};

export default {
  title: 'UI/Aspect Ratio',
  component: ASPECT_RATIO_ELEMENT_TAG_NAME,
  argTypes: ASPECT_RATIO_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

function Template({
  // Properties
  minHeight,
  maxHeight,
  ratio
}: any) {
  return html`
    <vds-aspect-ratio
      min-height=${ifNonEmpty(minHeight)}
      max-height=${ifNonEmpty(maxHeight)}
      ratio=${ifNonEmpty(ratio)}
    >
      <vds-fake-media-player></vds-fake-media-player>
    </vds-aspect-ratio>
  `;
}

export const AspectRatio = Template.bind({});
