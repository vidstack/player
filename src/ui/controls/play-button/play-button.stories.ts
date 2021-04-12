import '../../../core/fakes/vds-fake-media-provider';

import { html, TemplateResult } from 'lit-html';

import { VdsUserEvents } from '../../../core';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
  VdsEventsToStorybookActions,
} from '../../../shared/storybook';
import { PlayButtonElementProps } from './play-button.types';
import { VDS_PLAY_BUTTON_ELEMENT_TAG_NAME } from './vds-play-button';

export default {
  title: 'UI/Foundation/Controls/Play Button',
  component: VDS_PLAY_BUTTON_ELEMENT_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(VDS_PLAY_BUTTON_ELEMENT_TAG_NAME),
    pressed: {
      table: {
        disable: true,
      },
    },
    fakePaused: {
      control: 'boolean',
      defaultValue: true,
    },
  },
};

interface FakeProps {
  fakePaused: boolean;
}

type Args = FakeProps &
  PlayButtonElementProps &
  VdsEventsToStorybookActions<VdsUserEvents>;

function Template({
  // Fakes
  fakePaused,
  // Props
  label,
  describedBy,
  disabled,
  // Events
  onVdsUserPlay,
  onVdsUserPause,
}: Args): TemplateResult {
  return html`
    <vds-fake-media-provider .canPlayCtx="${true}" .pausedCtx="${fakePaused}">
      <vds-play-button
        label="${ifNonEmpty(label)}"
        described-by="${ifNonEmpty(describedBy)}"
        ?disabled="${disabled}"
        style="color: ${SB_THEME_COLOR};"
        @vds-user-play="${onVdsUserPlay}"
        @vds-user-pause="${onVdsUserPause}"
      >
        <div slot="play">Play</div>
        <div slot="pause">Pause</div>
      </vds-play-button>
    </vds-fake-media-provider>
  `;
}

export const PlayButton = Template.bind({});
