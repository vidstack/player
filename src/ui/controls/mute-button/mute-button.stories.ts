import '../../../core/fakes/vds-fake-media-provider';

import { html, TemplateResult } from 'lit-html';

import { VdsUserEvents } from '../../../core';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
  VdsEventsToStorybookActions,
} from '../../../shared/storybook';
import { MuteButtonElementProps } from './mute-button.types';
import { VDS_MUTE_BUTTON_ELEMENT_TAG_NAME } from './vds-mute-button';

export default {
  title: 'UI/Foundation/Controls/Mute Button',
  component: VDS_MUTE_BUTTON_ELEMENT_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(VDS_MUTE_BUTTON_ELEMENT_TAG_NAME),
    pressed: {
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
  MuteButtonElementProps &
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
      <vds-mute-button
        label="${ifNonEmpty(label)}"
        described-by="${ifNonEmpty(describedBy)}"
        ?disabled="${disabled}"
        style="color: ${SB_THEME_COLOR};"
        @vds-user-muted-change="${onVdsUserMutedChange}"
      >
        <div slot="mute">Mute</div>
        <div slot="unmute">Unmute</div>
      </vds-mute-button>
    </vds-fake-media-provider>
  `;
}

export const MuteButton = Template.bind({});
