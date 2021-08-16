import '../../media/test-utils/define';
import './define';

import { html } from 'lit';

import { ifNonEmpty, on } from '../../base/directives';
import { LOGGER_STORYBOOK_ARG_TYPES } from '../../base/logger';
import { storybookAction, StorybookControl } from '../../base/storybook';
import { omit } from '../../utils/object';
import { TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES } from '../toggle-button/element.stories';
import { PLAY_BUTTON_ELEMENT_TAG_NAME } from './PlayButtonElement';

export const PLAY_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...LOGGER_STORYBOOK_ARG_TYPES,
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
  logLevel,
  describedBy,
  disabled,
  // Actions
  onPlayRequest,
  onPauseRequest,
  // Media Properties
  mediaPaused
}: any) {
  return html`
    <vds-fake-media-player
      log-level=${logLevel}
      .mediaCanPlay=${true}
      .mediaPaused=${mediaPaused}
      ${on('vds-play-request', onPlayRequest)}
      ${on('vds-pause-request', onPauseRequest)}
    >
      <vds-play-button
        label=${ifNonEmpty(label)}
        described-by=${ifNonEmpty(describedBy)}
        ?disabled=${disabled}
        slot="ui"
      >
        <div class="play">Play</div>
        <div class="pause">Pause</div>
      </vds-play-button>
    </vds-fake-media-player>

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
