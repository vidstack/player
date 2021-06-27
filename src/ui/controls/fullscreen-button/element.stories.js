import '../../../media/define.js';
import '../../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import {
  VDS_FULLSCREEN_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME
} from './FullscreenButtonElement.js';

export default {
  title: 'UI/Foundation/Controls/Fullscreen Button',
  component: VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  argTypes: VDS_FULLSCREEN_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {import('./types').FullscreenButtonElementStorybookArgs} args
 */
function Template({
  // Properties
  label,
  describedBy,
  disabled,
  // Actions
  onVdsEnterFullscreenRequest,
  onVdsExitFullscreenRequest,
  // Media Properties
  mediaFullscreen
}) {
  return html`
    <vds-media-controller
      @vds-enter-fullscreen-request="${onVdsEnterFullscreenRequest}"
      @vds-exit-fullscreen-request="${onVdsExitFullscreenRequest}"
    >
      <vds-media-container>
        <vds-fake-media-provider
          .canPlayContext="${true}"
          .fullscreenContext="${mediaFullscreen}"
          slot="media"
        ></vds-fake-media-provider>

        <vds-fullscreen-button
          label="${ifNonEmpty(label)}"
          described-by="${ifNonEmpty(describedBy)}"
          ?disabled="${disabled}"
        >
          <div slot="enter">Enter</div>
          <div slot="exit">Exit</div>
        </vds-fullscreen-button>
      </vds-media-container>
    </vds-media-controller>
  `;
}

export const FullscreenButton = Template.bind({});
