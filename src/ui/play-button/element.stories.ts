import '@media/define';
import '@media/test-utils/define';
import './define';

import { ifNonEmpty, on } from '@base/directives/index';
import { storybookAction, StorybookControl } from '@base/storybook/index';
import { omit } from '@utils/object';
import { html } from 'lit';

import { TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES } from '../toggle-button/element.stories';
import { PLAY_BUTTON_ELEMENT_TAG_NAME } from './PlayButtonElement';

export const PLAY_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...omit(TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES, ['pressed']),
  label: { control: StorybookControl.Text, defaultValue: 'Play' },
  mediaPaused: {
    control: StorybookControl.Boolean,
    defaultValue: true
  },
  onPlayRequest: storybookAction('vds-play-request'),
  onPauseRequest: storybookAction('vds-pause-request')
};

export default {
  title: 'UI/Controls/Play Button',
  component: PLAY_BUTTON_ELEMENT_TAG_NAME,
  argTypes: PLAY_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

function Template({
  // Properties
  label,
  describedBy,
  disabled,
  // Actions
  onPlayRequest,
  onPauseRequest,
  // Media Properties
  mediaPaused
}: any) {
  return html`
    <vds-media-controller
      ${on('vds-play-request', onPlayRequest)}
      ${on('vds-pause-request', onPauseRequest)}
    >
      <vds-media-container>
        <vds-fake-media-provider
          .canPlayContext=${true}
          .pausedContext=${mediaPaused}
        ></vds-fake-media-provider>

        <vds-play-button
          label=${ifNonEmpty(label)}
          described-by=${ifNonEmpty(describedBy)}
          ?disabled=${disabled}
        >
          <div class="play">Play</div>
          <div class="pause">Pause</div>
        </vds-play-button>
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-play-button:not([media-paused]) .play {
        display: none;
      }

      vds-play-button[media-paused] .pause {
        display: none;
      }
    </style>
  `;
}

export const PlayButton = Template.bind({});
