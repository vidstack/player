import '../../../core/fakes/vds-fake-media-provider';

import { html, TemplateResult } from 'lit-html';

import { VdsUserEvents } from '../../../core';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
  VdsEventsToStorybookActions,
} from '../../../shared/storybook';
import { PlaybackToggleProps } from './playback-toggle.types';
import { PLAYBACK_TOGGLE_TAG_NAME } from './vds-playback-toggle';

export default {
  title: 'UI/Foundation/Controls/Playback Toggle',
  component: PLAYBACK_TOGGLE_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(PLAYBACK_TOGGLE_TAG_NAME),
    on: {
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
  PlaybackToggleProps &
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
      <vds-playback-toggle
        label="${ifNonEmpty(label)}"
        described-by="${ifNonEmpty(describedBy)}"
        ?disabled="${disabled}"
        style="color: ${SB_THEME_COLOR};"
        @vds-user-play="${onVdsUserPlay}"
        @vds-user-pause="${onVdsUserPause}"
      >
        <div slot="play">Play</div>
        <div slot="pause">Pause</div>
      </vds-playback-toggle>
    </vds-fake-media-provider>
  `;
}

export const PlaybackToggle = Template.bind({});
