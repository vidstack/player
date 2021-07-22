import '../../media/define.js';
import '../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { on } from '../../foundation/directives/index.js';
import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';
import { pick } from '../../utils/object.js';
import { SLIDER_ELEMENT_STORYBOOK_ARG_TYPES } from '../slider/element.stories.js';
import { VOLUME_SLIDER_ELEMENT_TAG_NAME } from './VolumeSliderElement.js';

export const VOLUME_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES = {
  // Properties
  ...pick(SLIDER_ELEMENT_STORYBOOK_ARG_TYPES, [
    'disabled',
    'hidden',
    'orientation'
  ]),
  label: {
    control: StorybookControl.Text,
    defaultValue: 'Volume slider'
  },
  step: {
    control: StorybookControl.Number,
    defaultValue: 0.5
  },
  keyboardStep: {
    control: StorybookControl.Number,
    defaultValue: 0.5
  },
  shiftKeyMultiplier: {
    control: StorybookControl.Number,
    defaultValue: 10
  },
  // Media Properties
  mediaVolume: {
    control: {
      type: StorybookControl.Number,
      step: 0.05
    },
    defaultValue: 0.5
  },
  // Media Request Actions
  onVolumeChangeRequest: storybookAction('vds-volume-change-request')
};

export default {
  title: 'UI/Controls/Volume Slider',
  component: VOLUME_SLIDER_ELEMENT_TAG_NAME,
  argTypes: VOLUME_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
 */
function Template({
  // Properties
  disabled,
  hidden,
  orientation,
  label,
  step,
  keyboardStep,
  shiftKeyMultiplier,
  // Media Properties
  mediaVolume,
  // Media Requests
  onVolumeChangeRequest
}) {
  return html`
    <vds-media-controller
      ${on('vds-volume-change-request', onVolumeChangeRequest)}
    >
      <vds-media-container>
        <vds-fake-media-provider
          .canPlayContext=${true}
          .volumeContext=${mediaVolume}
        ></vds-fake-media-provider>

        <vds-volume-slider
          label=${label}
          orientation=${orientation}
          step=${step}
          keyboard-step=${keyboardStep}
          shift-key-multiplier=${shiftKeyMultiplier}
          ?disabled=${disabled}
          ?hidden=${hidden}
        ></vds-volume-slider>
      </vds-media-container>
    </vds-media-controller>
  `;
}

export const VolumeSlider = Template.bind({});
