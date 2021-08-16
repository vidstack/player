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
  mediaWaiting: {
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
  mediaWaiting
}: any) {
  return html`
    <vds-fake-media-player
      log-level=${logLevel}
      .mediaCanPlay=${mediaCanPlay}
      .mediaWaiting=${mediaWaiting}
    >
      <vds-buffering-indicator slot="ui">
        <div>BUFFERING!</div>
      </vds-buffering-indicator>
    </vds-fake-media-player>

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
