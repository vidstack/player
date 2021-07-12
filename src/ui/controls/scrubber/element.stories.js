import '../../../media/define.js';
import '../../../media/test-utils/define.js';
import '../scrubber-preview/define';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty, on } from '../../../foundation/directives/index.js';
import {
  createTimeRanges,
  PauseRequestEvent,
  PlayRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent
} from '../../../media/index.js';
import {
  ScrubberPreviewConnectEvent,
  ScrubberPreviewHideEvent,
  ScrubberPreviewShowEvent
} from '../scrubber-preview/index.js';
import {
  SCRUBBER_ELEMENT_STORYBOOK_ARG_TYPES,
  SCRUBBER_ELEMENT_TAG_NAME
} from './ScrubberElement.js';

export default {
  title: 'UI/Controls/Scrubber',
  component: SCRUBBER_ELEMENT_TAG_NAME,
  argTypes: SCRUBBER_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
 */
function Template({
  // Properties
  disabled,
  hidden,
  keyboardStep,
  label,
  orientation,
  pauseWhileDragging,
  progressLabel,
  progressValueText,
  seekingRequestThrottle,
  shiftKeyMultiplier,
  step,
  valueText,
  // Scrubber Preview Properties
  noPreviewClamp,
  noPreviewTrackFill,
  // Scrubber Preview Actions
  onScrubberPreviewConnect,
  onScrubberPreviewShow,
  onScrubberPreviewHide,
  // Media Request Actions
  onPauseRequest,
  onPlayRequest,
  onSeekRequest,
  onSeekingRequest,
  // Media Properties
  mediaCurrentTime,
  mediaDuration,
  mediaPaused,
  mediaSeekableAmount
}) {
  return html`
    <vds-media-controller
      ${on(PlayRequestEvent.TYPE, onPlayRequest)}
      ${on(PauseRequestEvent.TYPE, onPauseRequest)}
      ${on(SeekRequestEvent.TYPE, onSeekRequest)}
      ${on(SeekingRequestEvent.TYPE, onSeekingRequest)}
    >
      <vds-media-container>
        <vds-fake-media-provider
          .canPlayContext=${true}
          .currentTimeContext=${mediaCurrentTime}
          .durationContext=${mediaDuration}
          .pausedContext=${mediaPaused}
          .seekableContext=${createTimeRanges(0, mediaSeekableAmount)}
        ></vds-fake-media-provider>

        <vds-scrubber
          label=${ifNonEmpty(label)}
          orientation=${orientation}
          progress-label=${ifNonEmpty(progressLabel)}
          progress-value-text=${progressValueText}
          seeking-request-throttle=${seekingRequestThrottle}
          step=${step}
          keyboard-step=${keyboardStep}
          shift-key-multiplier=${shiftKeyMultiplier}
          value-text=${valueText}
          ?disabled=${disabled}
          ?hidden=${hidden}
          ?pause-while-dragging=${pauseWhileDragging}
          ${on(ScrubberPreviewConnectEvent.TYPE, onScrubberPreviewConnect)}
          ${on(ScrubberPreviewShowEvent.TYPE, onScrubberPreviewShow)}
          ${on(ScrubberPreviewHideEvent.TYPE, onScrubberPreviewHide)}
        >
          <vds-scrubber-preview
            ?no-clamp=${noPreviewClamp}
            ?no-track-fill=${noPreviewTrackFill}
          >
            <div class="preview">Preview</div>
          </vds-scrubber-preview>
        </vds-scrubber>

        <style>
          vds-scrubber {
            margin-top: 48px;
          }

          .preview {
            background-color: #161616;
            color: #ff2a5d;
            opacity: 1;
            bottom: 20px;
            transition: opacity 0.2s ease-in;
          }

          .preview[hidden] {
            display: block;
            opacity: 0;
          }
        </style>
      </vds-media-container>
    </vds-media-controller>
  `;
}

export const Scrubber = Template.bind({});
