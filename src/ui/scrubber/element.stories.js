import '../../media/define.js';
import '../../media/test-utils/define.js';
import '../scrubber-preview/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty, on } from '../../foundation/directives/index.js';
import { StorybookControl } from '../../foundation/storybook/StorybookControl.js';
import { createTimeRanges } from '../../media/index.js';
import { omit } from '../../utils/object.js';
import { SCRUBBER_PREVIEW_ELEMENT_STORYBOOK_ARG_TYPES } from '../scrubber-preview/storybook.js';
import { SEEKABLE_PROGRESS_BAR_ELEMENT_STORYBOOK_ARG_TYPES } from '../seekable-progress-bar/element.stories.js';
import { TIME_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES } from '../time-slider/element.stories.js';
import { SCRUBBER_ELEMENT_TAG_NAME } from './ScrubberElement.js';

export const SCRUBBER_ELEMENT_STORYBOOK_ARG_TYPES = {
  // Time Slider Properties
  ...TIME_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  progressValueText:
    SEEKABLE_PROGRESS_BAR_ELEMENT_STORYBOOK_ARG_TYPES.valueText,
  // Scrubber Preview Properties
  ...omit(SCRUBBER_PREVIEW_ELEMENT_STORYBOOK_ARG_TYPES, [
    'noClamp',
    'noTrackFill'
  ]),
  noPreviewClamp: SCRUBBER_PREVIEW_ELEMENT_STORYBOOK_ARG_TYPES.noClamp,
  noPreviewTrackFill: SCRUBBER_PREVIEW_ELEMENT_STORYBOOK_ARG_TYPES.noTrackFill,
  // Media Properties
  mediaSeekableAmount: {
    control: StorybookControl.Number,
    defaultValue: 1800
  }
};

export default {
  title: 'UI/Controls/Scrubber',
  component: SCRUBBER_ELEMENT_TAG_NAME,
  argTypes: SCRUBBER_ELEMENT_STORYBOOK_ARG_TYPES,
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
      ${on('vds-play-request', onPlayRequest)}
      ${on('vds-pause-request', onPauseRequest)}
      ${on('vds-seek-request', onSeekRequest)}
      ${on('vds-seeking-request', onSeekingRequest)}
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
          ${on('vds-scrubber-preview-connect', onScrubberPreviewConnect)}
          ${on('vds-scrubber-preview-show', onScrubberPreviewShow)}
          ${on('vds-scrubber-preview-hide', onScrubberPreviewHide)}
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
