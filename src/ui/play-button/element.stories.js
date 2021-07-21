import '../../media/define.js';
import '../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty, on } from '../../foundation/directives/index.js';
import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';
import { PauseRequestEvent, PlayRequestEvent } from '../../media/index.js';
import { omit } from '../../utils/object.js';
import { TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES } from '../toggle-button/element.stories.js';
import { PLAY_BUTTON_ELEMENT_TAG_NAME } from './PlayButtonElement.js';

export const PLAY_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...omit(TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES, ['pressed']),
  label: { control: StorybookControl.Text, defaultValue: 'Play' },
  mediaPaused: {
    control: StorybookControl.Boolean,
    defaultValue: true
  },
  onPlayRequest: storybookAction(PlayRequestEvent.TYPE),
  onPauseRequest: storybookAction(PauseRequestEvent.TYPE)
};

export default {
  title: 'UI/Controls/Play Button',
  component: PLAY_BUTTON_ELEMENT_TAG_NAME,
  argTypes: PLAY_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
 */
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
}) {
  return html`
    <vds-media-controller
      ${on(PlayRequestEvent.TYPE, onPlayRequest)}
      ${on(PauseRequestEvent.TYPE, onPauseRequest)}
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
      vds-play-button[pressed] .play {
        display: none;
      }

      vds-play-button:not([pressed]) .pause {
        display: none;
      }
    </style>
  `;
}

export const PlayButton = Template.bind({});
