import '../../media/define';
import '../../media/test-utils/define';
import './define';

import { html } from 'lit';

import { LOGGER_STORYBOOK_ARG_TYPES } from '../../base/logger';
import { StorybookControl } from '../../base/storybook';
import { BUFFERING_INDICATOR_ELEMENT_TAG_NAME } from './BufferingIndicatorElement';

export const BUFFERING_INDICATOR_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...LOGGER_STORYBOOK_ARG_TYPES,
  mediaCanPlay: {
    control: StorybookControl.Boolean,
    defaultValue: true
  },
  mediaBuffering: {
    control: StorybookControl.Boolean,
    defaultValue: true
  }
};

export default {
  title: 'UI/Buffering Indicator',
  component: BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  argTypes: BUFFERING_INDICATOR_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

function Template({
  logLevel,
  // Media Properties
  mediaCanPlay,
  mediaBuffering
}: any) {
  return html`
    <vds-media-controller log-level=${logLevel}>
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
