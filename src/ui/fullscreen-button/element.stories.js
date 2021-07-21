import '../../media/define.js';
import '../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../foundation/directives/index.js';
import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';
import {
  EnterFullscreenRequestEvent,
  ExitFullscreenRequestEvent
} from '../../media/index.js';
import { omit } from '../../utils/object.js';
import { TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES } from '../toggle-button/element.stories.js';
import { FULLSCREEN_BUTTON_ELEMENT_TAG_NAME } from './FullscreenButtonElement.js';

export const FULLSCREEN_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...omit(TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES, ['pressed']),
  label: { control: StorybookControl.Text, defaultValue: 'Fullscreen' },
  mediaFullscreen: {
    control: StorybookControl.Boolean,
    defaultValue: false
  },
  onEnterFullscreenRequest: storybookAction(EnterFullscreenRequestEvent.TYPE),
  onExitFullscreenRequest: storybookAction(ExitFullscreenRequestEvent.TYPE)
};

export default {
  title: 'UI/Controls/Fullscreen Button',
  component: FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  argTypes: FULLSCREEN_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
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
  onEnterFullscreenRequest,
  onExitFullscreenRequest,
  // Media Properties
  mediaFullscreen
}) {
  return html`
    <vds-media-controller
      @vds-enter-fullscreen-request="${onEnterFullscreenRequest}"
      @vds-exit-fullscreen-request="${onExitFullscreenRequest}"
    >
      <vds-media-container>
        <vds-fake-media-provider
          .canPlayContext="${true}"
          .fullscreenContext="${mediaFullscreen}"
        ></vds-fake-media-provider>

        <vds-fullscreen-button
          label="${ifNonEmpty(label)}"
          described-by="${ifNonEmpty(describedBy)}"
          ?disabled="${disabled}"
        >
          <div class="enter">Enter</div>
          <div class="exit">Exit</div>
        </vds-fullscreen-button>
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-fullscreen-button[pressed] .enter {
        display: none;
      }

      vds-fullscreen-button:not([pressed]) .exit {
        display: none;
      }
    </style>
  `;
}

export const FullscreenButton = Template.bind({});
