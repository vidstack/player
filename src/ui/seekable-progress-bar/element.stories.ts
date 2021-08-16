import '../../media/test-utils/define';
import './define';

import { html } from 'lit';

import { ifNonEmpty } from '../../base/directives';
import { LOGGER_STORYBOOK_ARG_TYPES } from '../../base/logger';
import { StorybookControl } from '../../base/storybook';
import { createTimeRanges } from '../../media';
import { SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME } from './SeekableProgressBarElement';

export const SEEKABLE_PROGRESS_BAR_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...LOGGER_STORYBOOK_ARG_TYPES,
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
  logLevel,
  valueText,
  // Media Properties
  mediaSeekableAmount,
  mediaDuration
}: any) {
  return html`
    <vds-fake-media-player
      log-level=${logLevel}
      .mediaCanPlay=${true}
      .mediaSeekable=${createTimeRanges(0, mediaSeekableAmount)}
      .mediaDuration=${mediaDuration}
    >
      <vds-seekable-progress-bar
        label=${ifNonEmpty(label)}
        value-text=${ifNonEmpty(valueText)}
        slot="ui"
      ></vds-seekable-progress-bar>
    </vds-fake-media-player>

    <style>
      vds-seekable-progress-bar {
        --vds-seekable-progress-bar-height: 8px;
        background: #ababab;
      }
    </style>
  `;
}

export const SeekableProgressBar = Template.bind({});
