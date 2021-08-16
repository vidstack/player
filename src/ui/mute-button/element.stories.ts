import '../../media/test-utils/define';
import './define';

import { html } from 'lit';

import { ifNonEmpty, on } from '../../base/directives';
import { LOGGER_STORYBOOK_ARG_TYPES } from '../../base/logger';
import { storybookAction, StorybookControl } from '../../base/storybook';
import { omit } from '../../utils/object';
import { TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES } from '../toggle-button/element.stories';
import { MUTE_BUTTON_ELEMENT_TAG_NAME } from './MuteButtonElement';

export const MUTE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...LOGGER_STORYBOOK_ARG_TYPES,
  ...omit(TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES, ['pressed']),
  label: { control: StorybookControl.Text, defaultValue: 'Mute' },
  mediaMuted: {
    control: StorybookControl.Boolean,
    defaultValue: false
  },
  onMuteRequest: storybookAction('vds-mute-request'),
  onUnmuteRequest: storybookAction('vds-unmute-request')
};

export default {
  title: 'UI/Controls/Mute Button',
  component: MUTE_BUTTON_ELEMENT_TAG_NAME,
  argTypes: MUTE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

function Template({
  // Properties
  label,
  logLevel,
  describedBy,
  disabled,
  // Actions
  onMuteRequest,
  onUnmuteRequest,
  // Media Properties
  mediaMuted
}: any) {
  return html`
    <vds-fake-media-player
      log-level=${logLevel}
      .mediaCanPlay=${true}
      .mediaMuted=${mediaMuted}
      ${on('vds-mute-request', onMuteRequest)}
      ${on('vds-unmute-request', onUnmuteRequest)}
    >
      <vds-mute-button
        label=${ifNonEmpty(label)}
        described-by=${ifNonEmpty(describedBy)}
        ?disabled=${disabled}
        slot="ui"
      >
        <div class="mute">Mute</div>
        <div class="unmute">Unmute</div>
      </vds-mute-button>
    </vds-fake-media-player>

    <style>
      vds-mute-button[media-muted] .mute {
        display: none;
      }

      vds-mute-button:not([media-muted]) .unmute {
        display: none;
      }
    </style>
  `;
}

export const MuteButton = Template.bind({});
