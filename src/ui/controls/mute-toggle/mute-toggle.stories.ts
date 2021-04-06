import '../../../core/fakes/vds-fake-media-provider';

import { html, TemplateResult } from 'lit-html';

import { VdsUserEvents } from '../../../core';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
  VdsEventsToStorybookActions,
} from '../../../shared/storybook';
import { MuteToggleProps } from './mute-toggle.types';
import { MUTE_TOGGLE_TAG_NAME } from './vds-mute-toggle';

export default {
  title: 'UI/Foundation/Controls/Mute Toggle',
  component: MUTE_TOGGLE_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(MUTE_TOGGLE_TAG_NAME),
    on: {
      table: {
        disable: true,
      },
    },
    fakeMuted: {
      control: 'boolean',
      defaultValue: false,
    },
  },
};

interface FakeProps {
  fakeMuted: boolean;
}

type Args = FakeProps &
  MuteToggleProps &
  VdsEventsToStorybookActions<VdsUserEvents>;

function Template({
  // Fakes
  fakeMuted,
  // Props
  label,
  describedBy,
  disabled,
  // Events
  onVdsUserMutedChange,
}: Args): TemplateResult {
  return html`
    <vds-fake-media-provider .canPlayCtx="${true}" .mutedCtx="${fakeMuted}">
      <vds-mute-toggle
        label="${ifNonEmpty(label)}"
        described-by="${ifNonEmpty(describedBy)}"
        ?disabled="${disabled}"
        style="color: ${SB_THEME_COLOR};"
        @vds-user-muted-change="${onVdsUserMutedChange}"
      >
        <div slot="mute">Mute</div>
        <div slot="unmute">Unmute</div>
      </vds-mute-toggle>
    </vds-fake-media-provider>
  `;
}

export const MuteToggle = Template.bind({});
