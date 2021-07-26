import '@media/define.js';
import '@media/test-utils/define.js';
import './define.js';

import { ifNonEmpty, on } from '@base/directives/index.js';
import { storybookAction, StorybookControl } from '@base/storybook/index.js';
import { omit } from '@utils/object.js';
import { html } from 'lit';

import { TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES } from '../toggle-button/element.stories.js';
import { FULLSCREEN_BUTTON_ELEMENT_TAG_NAME } from './FullscreenButtonElement.js';

export const FULLSCREEN_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...omit(TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES, ['pressed']),
  label: { control: StorybookControl.Text, defaultValue: 'Fullscreen' },
  mediaFullscreen: {
    control: StorybookControl.Boolean,
    defaultValue: false
  },
  onEnterFullscreenRequest: storybookAction('vds-enter-fullscreen-request'),
  onExitFullscreenRequest: storybookAction('vds-exit-fullscreen-request')
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
      ${on('vds-enter-fullscreen-request', onEnterFullscreenRequest)}
      ${on('vds-exit-fullscreen-request', onExitFullscreenRequest)}
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
      vds-fullscreen-button[media-fullscreen] .enter {
        display: none;
      }

      vds-fullscreen-button:not([media-fullscreen]) .exit {
        display: none;
      }
    </style>
  `;
}

export const FullscreenButton = Template.bind({});
