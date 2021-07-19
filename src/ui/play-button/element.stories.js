import '../../media/define.js';
import '../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty, on } from '../../foundation/directives/index.js';
import { PauseRequestEvent, PlayRequestEvent } from '../../media/index.js';
import {
  PLAY_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  PLAY_BUTTON_ELEMENT_TAG_NAME
} from './PlayButtonElement.js';

export default {
  title: 'UI/Controls/Play Button',
  component: PLAY_BUTTON_ELEMENT_TAG_NAME,
  argTypes: PLAY_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES
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
          <div slot="play">Play</div>
          <div slot="pause">Pause</div>
        </vds-play-button>
      </vds-media-container>
    </vds-media-controller>
  `;
}

export const PlayButton = Template.bind({});
