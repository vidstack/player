import '../../../core/media/controller/vds-media-controller';
import '../../../core/media/container/vds-media-container';
import '../../../core/fakes/vds-fake-media-provider';

import { html, TemplateResult } from 'lit';

import { VdsMediaRequestEvents } from '../../../core';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  DOMEventsToStorybookActions,
  SB_THEME_COLOR,
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
  DOMEventsToStorybookActions<VdsMediaRequestEvents>;

function Template({
  // Fakes
  fakeMuted,
  // Props
  label,
  describedBy,
  disabled,
  // Events
  onVdsMuteRequest,
  onVdsUnmuteRequest,
}: Args): TemplateResult {
  return html`
    <vds-media-controller .canPlay=${true} .muted=${fakeMuted}>
      <vds-media-container>
        <vds-fake-media-provider slot="media"></vds-fake-media-provider>

        <vds-mute-button
          label=${ifNonEmpty(label)}
          described-by=${ifNonEmpty(describedBy)}
          ?disabled=${disabled}
          style="color: ${SB_THEME_COLOR};"
          @vds-mute-request=${onVdsMuteRequest}
          @vds-unmute-request=${onVdsUnmuteRequest}
        >
          <div slot="mute">Mute</div>
          <div slot="unmute">Unmute</div>
        </vds-mute-button>
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-media-container::part(ui) {
        position: relative;
      }
    </style>
  `;
}

export const MuteButton = Template.bind({});
