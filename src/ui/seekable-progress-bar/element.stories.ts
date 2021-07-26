import '@media/define';
import '@media/test-utils/define';
import './define';

import { ifNonEmpty } from '@base/directives/index';
import { StorybookControl } from '@base/storybook/index';
import { createTimeRanges } from '@media/index';
import { html } from 'lit';

import { SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME } from './SeekableProgressBarElement';

export const SEEKABLE_PROGRESS_BAR_ELEMENT_STORYBOOK_ARG_TYPES = {
  // Properties
  label: {
    control: StorybookControl.Text,
    defaultValue: 'Amount of seekable media'
  },
  valueText: {
    control: StorybookControl.Text,
    defaultValue: '{seekableAmount} out of {duration}'
  },
  // Media Properties
  mediaSeekableAmount: {
    control: StorybookControl.Number,
    defaultValue: 1800
  },
  mediaDuration: {
    control: StorybookControl.Number,
    defaultValue: 3600
  }
};

export default {
  title: 'UI/Controls/Seekable Progress Bar',
  component: SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME,
  argTypes: SEEKABLE_PROGRESS_BAR_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

function Template({
  // Properties
  label,
  valueText,
  // Media Properties
  mediaSeekableAmount,
  mediaDuration
}: any) {
  return html`
    <vds-media-controller>
      <vds-media-container>
        <vds-fake-media-provider
          .canPlayContext=${true}
          .seekableContext=${createTimeRanges(0, mediaSeekableAmount)}
          .durationContext=${mediaDuration}
        ></vds-fake-media-provider>

        <vds-seekable-progress-bar
          label=${ifNonEmpty(label)}
          value-text=${ifNonEmpty(valueText)}
        ></vds-seekable-progress-bar>
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-seekable-progress-bar {
        --vds-seekable-progress-bar-height: 8px;
        background: #ababab;
      }
    </style>
  `;
}

export const SeekableProgressBar = Template.bind({});
