import { html, TemplateResult } from 'lit-html';

import { createTimeRanges, VdsUserEvents } from '../../../core';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  VdsEventsToStorybookActions,
} from '../../../shared/storybook';
import { VdsScrubberEvents } from './scrubber.events';
import { ScrubberProps } from './scrubber.types';
import { SCRUBBER_TAG_NAME } from './vds-scrubber';

export default {
  title: 'UI/Foundation/Controls/Scrubber',
  component: SCRUBBER_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(SCRUBBER_TAG_NAME),
    fakeCurrentTime: {
      control: 'number',
      defaultValue: 1000,
    },
    fakeDuration: {
      control: 'number',
      defaultValue: 3600,
    },
    fakeSeekableAmount: {
      control: 'number',
      defaultValue: 1800,
    },
  },
};

interface FakeProps {
  fakeCurrentTime: number;
  fakeDuration: number;
  fakeSeekableAmount: number;
}

type Args = FakeProps &
  ScrubberProps &
  VdsEventsToStorybookActions<VdsScrubberEvents> &
  VdsEventsToStorybookActions<VdsUserEvents>;

function Template({
  // Fakes
  fakeCurrentTime,
  fakeSeekableAmount,
  fakeDuration,
  // Props
  sliderLabel,
  progressLabel,
  progressText,
  hidden,
  disabled,
  step,
  stepMultiplier,
  orientation,
  throttle,
  previewThrottle,
  userSeekingThrottle,
  noPreviewTrack,
  // Scrubber Events
  onVdsScrubberPreviewShow,
  onVdsScrubberPreviewHide,
  onVdsScrubberPreviewTimeUpdate,
  // User Events
  onVdsUserSeeking,
  onVdsUserSeeked,
}: Args): TemplateResult {
  return html`
    <vds-fake-media-provider
      .canPlayCtx="${true}"
      .currentTimeCtx="${fakeCurrentTime}"
      .durationCtx="${fakeDuration}"
      .seekableCtx="${createTimeRanges(0, fakeSeekableAmount)}"
    >
      <vds-scrubber
        slider-label="${ifNonEmpty(sliderLabel)}"
        progress-label="${ifNonEmpty(progressLabel)}"
        progress-text="${ifNonEmpty(progressText)}"
        ?hidden="${hidden}"
        ?disabled="${disabled}"
        step="${step}"
        step-multiplier="${stepMultiplier}"
        orientation="${orientation}"
        ?no-preview-track="${noPreviewTrack}"
        throttle="${throttle}"
        preview-throttle="${previewThrottle}"
        user-seeking-throttle="${userSeekingThrottle}"
        @vds-user-seeking="${onVdsUserSeeking}"
        @vds-user-seeked="${onVdsUserSeeked}"
        @vds-scrubber-preview-show="${onVdsScrubberPreviewShow}"
        @vds-scrubber-preview-hide="${onVdsScrubberPreviewHide}"
        @vds-scrubber-preview-time-update="${onVdsScrubberPreviewTimeUpdate}"
      >
        <div class="preview" slot="preview">Preview</div>
      </vds-scrubber>
    </vds-fake-media-provider>

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
