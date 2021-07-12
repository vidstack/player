import '../../../media/define.js';
import '../../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty, on } from '../../../foundation/directives/index.js';
import {
  PauseRequestEvent,
  PlayRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent
} from '../../../media/index.js';
import {
  TIME_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  TIME_SLIDER_ELEMENT_TAG_NAME
} from './TimeSliderElement.js';

export default {
  title: 'UI/Controls/Time Slider',
  component: TIME_SLIDER_ELEMENT_TAG_NAME,
  argTypes: TIME_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES
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
      ${on(PlayRequestEvent.TYPE, onPlayRequest)}
      ${on(PauseRequestEvent.TYPE, onPauseRequest)}
      ${on(SeekingRequestEvent.TYPE, onSeekingRequest)}
      ${on(SeekRequestEvent.TYPE, onSeekRequest)}
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
