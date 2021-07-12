import '../../../media/define.js';
import '../../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../foundation/directives/index.js';
import { createTimeRanges } from '../../../media/index.js';
import {
  SEEKABLE_PROGRESS_BAR_ELEMENT_STORYBOOK_ARG_TYPES,
  SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME
} from './SeekableProgressBarElement.js';

export default {
  title: 'UI/Controls/Seekable Progress Bar',
  component: SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME,
  argTypes: SEEKABLE_PROGRESS_BAR_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
 */
function Template({
  // Properties
  label,
  valueText,
  // Media Properties
  mediaSeekableAmount,
  mediaDuration
}) {
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
