import '../../../core/fakes/vds-fake-media-provider';

import { html } from 'lit-element';

import { createTimeRanges } from '../../../core';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { Story } from '../../../shared/storybook';
import { SCRUBBER_STORYBOOK_ARG_TYPES } from './scrubber.args';
import {
  ScrubberActions,
  ScrubberFakeProps,
  ScrubberProps,
} from './scrubber.types';
import { SCRUBBER_TAG_NAME } from './vds-scrubber';

export default {
  title: 'UI/Foundation/Controls/Scrubber',
  component: SCRUBBER_TAG_NAME,
  argTypes: SCRUBBER_STORYBOOK_ARG_TYPES,
};

const Template: Story<ScrubberProps & ScrubberFakeProps & ScrubberActions> = ({
  sliderLabel,
  progressLabel,
  progressText,
  hidden,
  disabled,
  step,
  stepMultiplier,
  orientation,
  throttle,
  fakeCurrentTime,
  fakeSeekableAmount,
  fakeDuration,
  onDragStart,
  onDragEnd,
  onUserSeeked,
  onUserSeeking,
  onPreviewShow,
  onPreviewHide,
  onPreviewTimeUpdate,
}) =>
  html`
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
        throttle="${throttle}"
        @vds-slider-drag-start="${onDragStart}"
        @vds-slider-drag-end="${onDragEnd}"
        @vds-user-seeked="${onUserSeeked}"
        @vds-user-seeking="${onUserSeeking}"
        @vds-scrubber-preview-show="${onPreviewShow}"
        @vds-scrubber-preview-hide="${onPreviewHide}"
        @vds-scrubber-preview-time-update="${onPreviewTimeUpdate}"
      >
        <div class="preview" slot="preview">Preview</div>
      </vds-scrubber>
    </vds-fake-media-provider>

    <style>
      vds-scrubber {
        margin-top: 48px;
        max-width: 50%;
      }

      .preview {
        background-color: #161616;
        color: #ff2a5d;
        opacity: 1;
        position: absolute;
        left: 0;
        bottom: 28px;
        transition: opacity 0.3s ease-in;
      }

      .preview[hidden] {
        opacity: 0;
      }
    </style>
  `;

export const Scrubber = Template.bind({});
