import '../../media/define.js';
import '../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import {
  BUFFERING_INDICATOR_ELEMENT_STORYBOOK_ARG_TYPES,
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME
} from './BufferingIndicatorElement.js';

export default {
  title: 'UI/Buffering Indicator',
  component: BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  argTypes: BUFFERING_INDICATOR_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
 */
function Template({
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
        ></vds-fake-media-provider>
        <vds-buffering-indicator>
          <div>BUFFERING!</div>
        </vds-buffering-indicator>
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-buffering-indicator {
        opacity: 0;
        transition: opacity 0.3s ease-out;
        transition-delay: 500ms;
      }

      vds-buffering-indicator[media-waiting],
      vds-buffering-indicator:not([media-can-play]) {
        opacity: 1;
      }
    </style>
  `;
}

export const BufferingIndicator = Template.bind({});
