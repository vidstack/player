import '../../../core/fakes/vds-fake-media-provider';

import { html } from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { Story } from '../../../shared/storybook';
import {
  PLAYBACK_TOGGLE_STORYBOOK_ARG_TYPES,
  PlaybackToggleFakeProps,
  PlaybackToggleProps,
} from './playback-toggle.args';
import { PLAYBACK_TOGGLE_TAG_NAME } from './vds-playback-toggle';

export default {
  title: 'UI/Foundation/Controls/Playback Toggle',
  component: PLAYBACK_TOGGLE_TAG_NAME,
  argTypes: PLAYBACK_TOGGLE_STORYBOOK_ARG_TYPES,
};

const Template: Story<PlaybackToggleProps & PlaybackToggleFakeProps> = ({
  label,
  describedBy,
  disabled,
  fakePaused,
}) =>
  html`
    <vds-fake-media-provider
      .isPlaybackReadyCtx="${true}"
      .pausedCtx="${fakePaused}"
    >
      <vds-playback-toggle
        label="${ifNonEmpty(label)}"
        described-by="${ifNonEmpty(describedBy)}"
        ?disabled="${disabled}"
        style="color: #FF2A5D;"
      >
        <div slot="play">Play</div>
        <div slot="pause">Pause</div>
      </vds-playback-toggle>
    </vds-fake-media-provider>
  `;

export const PlaybackToggle = Template.bind({});
