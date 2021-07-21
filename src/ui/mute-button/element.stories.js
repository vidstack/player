import '../../media/define.js';
import '../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty, on } from '../../foundation/directives/index.js';
import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';
import { MuteRequestEvent, UnmuteRequestEvent } from '../../media/index.js';
import { omit } from '../../utils/object.js';
import { TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES } from '../toggle-button/element.stories.js';
import { MUTE_BUTTON_ELEMENT_TAG_NAME } from './MuteButtonElement.js';

export const MUTE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...omit(TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES, ['pressed']),
  label: { control: StorybookControl.Text, defaultValue: 'Mute' },
  mediaMuted: {
    control: StorybookControl.Boolean,
    defaultValue: false
  },
  onMuteRequest: storybookAction(MuteRequestEvent.TYPE),
  onUnmuteRequest: storybookAction(UnmuteRequestEvent.TYPE)
};

export default {
  title: 'UI/Controls/Mute Button',
  component: MUTE_BUTTON_ELEMENT_TAG_NAME,
  argTypes: MUTE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
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
  onMuteRequest,
  onUnmuteRequest,
  // Media Properties
  mediaMuted
}) {
  return html`
    <vds-media-controller
      ${on(MuteRequestEvent.TYPE, onMuteRequest)}
      ${on(UnmuteRequestEvent.TYPE, onUnmuteRequest)}
    >
      <vds-media-container>
        <vds-fake-media-provider
          .canPlayContext=${true}
          .mutedContext=${mediaMuted}
        ></vds-fake-media-provider>

        <vds-mute-button
          label=${ifNonEmpty(label)}
          described-by=${ifNonEmpty(describedBy)}
          ?disabled=${disabled}
        >
          <div class="mute">Mute</div>
          <div class="unmute">Unmute</div>
        </vds-mute-button>
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-mute-button[pressed] .mute {
        display: none;
      }

      vds-mute-button:not([pressed]) .unmute {
        display: none;
      }
    </style>
  `;
}

export const MuteButton = Template.bind({});
