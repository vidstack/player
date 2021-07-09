import '../../../media/define.js';
import '../../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { PlayRequestEvent } from '../../../../types/media/index.js';
import { ifNonEmpty, on } from '../../../foundation/directives/index.js';
import {
  createTimeRanges,
  PauseRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent
} from '../../../media/index.js';
import {
  ScrubberPreviewHideEvent,
  ScrubberPreviewShowEvent,
  ScrubberPreviewTimeUpdateEvent
} from './events.js';
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
  noPreviewClamp,
  noPreviewTrack,
  orientation,
  pauseWhileDragging,
  previewTimeThrottle,
  progressLabel,
  progressText,
  label,
  step,
  keyboardStep,
  shiftKeyMultiplier,
  throttle,
  userSeekingThrottle,
  // Scrubber Actions
  onScrubberPreviewShow,
  onScrubberPreviewHide,
  onScrubberPreviewTimeUpdate,
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
          orientation=${orientation}
          preview-time-throttle=${previewTimeThrottle}
          progress-label=${ifNonEmpty(progressLabel)}
          progress-text=${ifNonEmpty(progressText)}
          label=${ifNonEmpty(label)}
          keyboard-step=${keyboardStep}
          shift-key-multiplier=${shiftKeyMultiplier}
          step=${step}
          throttle=${throttle}
          user-seeking-throttle=${userSeekingThrottle}
          ?disabled=${disabled}
          ?hidden=${hidden}
          ?no-preview-clamp=${noPreviewClamp}
          ?no-preview-track=${noPreviewTrack}
          ?pause-while-dragging=${pauseWhileDragging}
          ${on(ScrubberPreviewHideEvent.TYPE, onScrubberPreviewHide)}
          ${on(ScrubberPreviewShowEvent.TYPE, onScrubberPreviewShow)}
          ${on(
            ScrubberPreviewTimeUpdateEvent.TYPE,
            onScrubberPreviewTimeUpdate
          )}
        >
          <div class="preview" slot="preview">Preview</div>
        </vds-scrubber>
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-scrubber {
        margin-top: 48px;
      }

      .preview {
        background-color: #161616;
        color: #ff2a5d;
        opacity: 1;
        position: absolute;
        left: 0;
        bottom: 40px;
        transition: opacity 0.3s ease-in;
      }

      .preview[hidden] {
        opacity: 0;
      }
    </style>
  `;
}

export const Scrubber = Template.bind({});
