import '../../../media/define.js';
import '../../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import {
  VOLUME_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  VOLUME_SLIDER_ELEMENT_TAG_NAME
} from './VolumeSliderElement.js';

export default {
  title: 'UI/Controls/Volume Slider',
  component: VOLUME_SLIDER_ELEMENT_TAG_NAME,
  argTypes: VOLUME_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES
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
    <vds-media-controller @vds-volume-change-request=${onVolumeChangeRequest}>
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
