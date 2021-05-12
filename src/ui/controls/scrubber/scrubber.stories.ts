import '../../../core/media/controller/vds-media-controller';
import '../../../core/media/container/vds-media-container';
import '../../../core/fakes/vds-fake-media-provider';

import { html, TemplateResult } from 'lit';

import { createTimeRanges, VdsMediaRequestEvents } from '../../../core';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  DOMEventsToStorybookActions,
} from '../../../shared/storybook';
import { VdsScrubberEvents } from './scrubber.events';
import { ScrubberElementProps } from './scrubber.types';
import { VDS_SCRUBBER_ELEMENT_TAG_NAME } from './vds-scrubber';

export default {
  title: 'UI/Foundation/Controls/Scrubber',
  component: VDS_SCRUBBER_ELEMENT_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(VDS_SCRUBBER_ELEMENT_TAG_NAME),
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
  ScrubberElementProps &
  DOMEventsToStorybookActions<VdsScrubberEvents> &
  DOMEventsToStorybookActions<VdsMediaRequestEvents>;

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
  previewTimeThrottle,
  userSeekingThrottle,
  noPreviewTrack,
  noPreviewClamp,
  // Scrubber Events
  onVdsScrubberPreviewShow,
  onVdsScrubberPreviewHide,
  onVdsScrubberPreviewTimeUpdate,
  // Media Request Events
  onVdsSeekRequest,
  onVdsSeekingRequest,
}: Args): TemplateResult {
  return html`
    <vds-media-controller
      .canPlay="${true}"
      .currentTime="${fakeCurrentTime}"
      .duration="${fakeDuration}"
      .seekable="${createTimeRanges(0, fakeSeekableAmount)}"
    >
      <vds-media-container>
        <vds-fake-media-provider slot="media"></vds-fake-media-provider>

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
          ?no-preview-clamp="${noPreviewClamp}"
          throttle="${throttle}"
          preview-time-throttle="${previewTimeThrottle}"
          user-seeking-throttle="${userSeekingThrottle}"
          @vds-seek-request="${onVdsSeekRequest}"
          @vds-seeking-request="${onVdsSeekingRequest}"
          @vds-scrubber-preview-show="${onVdsScrubberPreviewShow}"
          @vds-scrubber-preview-hide="${onVdsScrubberPreviewHide}"
          @vds-scrubber-preview-time-update="${onVdsScrubberPreviewTimeUpdate}"
        >
          <div class="preview" slot="preview">Preview</div>
        </vds-scrubber>
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-media-container::part(ui) {
        position: relative;
      }

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
