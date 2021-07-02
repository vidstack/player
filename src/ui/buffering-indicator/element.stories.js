import '../../media/define.js';
import '../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import {
  BUFFERING_INDICATOR_ELEMENT_STORYBOOK_ARG_TYPES,
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME
} from './BufferingIndicatorElement.js';

export default {
  title: 'UI/Foundation/Buffering Indicator',
  component: BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  argTypes: BUFFERING_INDICATOR_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
 */
function Template({
  // Properties
  delay,
  showWhileBooting,
  // Actions
  onBufferingIndicatorShow,
  onBufferingIndicatorHide,
  // Media Properties
  mediaCanPlay,
  mediaBuffering
}) {
  return html`
    <vds-media-controller>
      <vds-media-container>
        <vds-fake-media-provider
          .canPlayContext=${mediaCanPlay}
          .waitingContext=${mediaBuffering}
          slot="media"
        ></vds-fake-media-provider>
        <vds-buffering-indicator
          ?show-while-booting=${showWhileBooting}
          delay=${delay}
          @vds-buffering-indicator-show=${onBufferingIndicatorShow}
          @vds-buffering-indicator-hide=${onBufferingIndicatorHide}
        >
          <div>BUFFERING!</div>
        </vds-buffering-indicator>
      </vds-media-container>
    </vds-media-controller>
  `;
}

export const BufferingIndicator = Template.bind({});
