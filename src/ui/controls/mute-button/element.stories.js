import '../../../media/define.js';
import '../../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import {
  VDS_MUTE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  VDS_MUTE_BUTTON_ELEMENT_TAG_NAME
} from './MuteButtonElement.js';

export default {
  title: 'UI/Foundation/Controls/Mute Button',
  component: VDS_MUTE_BUTTON_ELEMENT_TAG_NAME,
  argTypes: VDS_MUTE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {import('./types').MuteButtonElementStorybookArgs} args
 */
function Template({
  // Properties
  label,
  describedBy,
  disabled,
  // Actions
  onVdsMuteRequest,
  onVdsUnmuteRequest,
  // Media Properties
  mediaMuted
}) {
  return html`
    <vds-media-controller
      @vds-mute-request=${onVdsMuteRequest}
      @vds-unmute-request=${onVdsUnmuteRequest}
    >
      <vds-media-container>
        <vds-fake-media-provider
          .canPlayContext=${true}
          .mutedContext=${mediaMuted}
          slot="media"
        ></vds-fake-media-provider>

        <vds-mute-button
          label=${ifNonEmpty(label)}
          described-by=${ifNonEmpty(describedBy)}
          ?disabled=${disabled}
        >
          <div slot="mute">Mute</div>
          <div slot="unmute">Unmute</div>
        </vds-mute-button>
      </vds-media-container>
    </vds-media-controller>
  `;
}

export const MuteButton = Template.bind({});
