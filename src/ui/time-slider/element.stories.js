import '@media/define.js';
import '@media/test-utils/define.js';
import './define.js';

import { ifNonEmpty, on } from '@base/directives/index.js';
import { storybookAction, StorybookControl } from '@base/storybook/index.js';
import { pick } from '@utils/object.js';
import { html } from 'lit';

import { SLIDER_ELEMENT_STORYBOOK_ARG_TYPES } from '../slider/element.stories.js';
import { TIME_SLIDER_ELEMENT_TAG_NAME } from './TimeSliderElement.js';

export const TIME_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES = {
  // Properties
  ...pick(SLIDER_ELEMENT_STORYBOOK_ARG_TYPES, [
    'disabled',
    'hidden',
    'orientation'
  ]),
  keyboardStep: { control: StorybookControl.Number, defaultValue: 5 },
  label: {
    control: StorybookControl.Text,
    defaultValue: 'Media time slider'
  },
  pauseWhileDragging: { control: StorybookControl.Boolean },
  seekingRequestThrottle: {
    control: StorybookControl.Number,
    defaultValue: 100
  },
  shiftKeyMultiplier: { control: StorybookControl.Number, defaultValue: 2 },
  step: { control: StorybookControl.Number, defaultValue: 0.25 },
  valueText: {
    control: StorybookControl.Text,
    defaultValue: '{currentTime} out of {duration}'
  },
  // Media Properties
  mediaCurrentTime: {
    control: StorybookControl.Number,
    defaultValue: 1800
  },
  mediaDuration: {
    control: StorybookControl.Number,
    defaultValue: 3600
  },
  mediaPaused: {
    control: StorybookControl.Boolean,
    defaultValue: true
  },
  // Media Request Actions
  onPlayRequest: storybookAction('vds-play-request'),
  onPauseRequest: storybookAction('vds-pause-request'),
  onSeekingRequest: storybookAction('vds-seeking-request'),
  onSeekRequest: storybookAction('vds-seek-request')
};

export default {
  title: 'UI/Controls/Time Slider',
  component: TIME_SLIDER_ELEMENT_TAG_NAME,
  argTypes: TIME_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
 */
function Template({
  // Properties
  label,
  step,
  keyboardStep,
  shiftKeyMultiplier,
  hidden,
  disabled,
  valueText,
  orientation,
  pauseWhileDragging,
  seekingRequestThrottle,
  // Media Properties
  mediaCurrentTime,
  mediaDuration,
  mediaPaused,
  // Media Request Actions
  onPlayRequest,
  onPauseRequest,
  onSeekingRequest,
  onSeekRequest
}) {
  return html`
    <vds-media-controller
      ${on('vds-play-request', onPlayRequest)}
      ${on('vds-pause-request', onPauseRequest)}
      ${on('vds-seeking-request', onSeekingRequest)}
      ${on('vds-seek-request', onSeekRequest)}
    >
      <vds-media-container>
        <vds-fake-media-provider
          .canPlayContext=${true}
          .currentTimeContext=${mediaCurrentTime}
          .durationContext=${mediaDuration}
          .pausedContext=${mediaPaused}
        ></vds-fake-media-provider>

        <vds-time-slider
          keyboard-step=${keyboardStep}
          label=${ifNonEmpty(label)}
          orientation=${orientation}
          shift-key-multiplier=${shiftKeyMultiplier}
          step=${step}
          value-text=${ifNonEmpty(valueText)}
          seeking-request-throttle=${seekingRequestThrottle}
          ?disabled=${disabled}
          ?hidden=${hidden}
          ?pause-while-dragging=${pauseWhileDragging}
        ></vds-time-slider>
      </vds-media-container>
    </vds-media-controller>
  `;
}

export const TimeSlider = Template.bind({});
