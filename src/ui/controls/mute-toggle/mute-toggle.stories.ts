import '../../../core/fakes/vds-fake-media-provider';

import { html } from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { Story } from '../../../shared/storybook';
import { MUTE_TOGGLE_STORYBOOK_ARG_TYPES } from './mute-toggle.args';
import { MuteToggleFakeProps, MuteToggleProps } from './mute-toggle.types';
import { MUTE_TOGGLE_TAG_NAME } from './vds-mute-toggle';

export default {
  title: 'UI/Foundation/Controls/Mute Toggle',
  component: MUTE_TOGGLE_TAG_NAME,
  argTypes: MUTE_TOGGLE_STORYBOOK_ARG_TYPES,
};

const Template: Story<MuteToggleProps & MuteToggleFakeProps> = ({
  label,
  describedBy,
  disabled,
  fakeMuted,
}) =>
  html`
    <vds-fake-media-provider .canPlayCtx="${true}" .mutedCtx="${fakeMuted}">
      <vds-mute-toggle
        label="${ifNonEmpty(label)}"
        described-by="${ifNonEmpty(describedBy)}"
        ?disabled="${disabled}"
        style="color: #FF2A5D;"
      >
        <div slot="mute">Mute</div>
        <div slot="unmute">Unmute</div>
      </vds-mute-toggle>
    </vds-fake-media-provider>
  `;

export const MuteToggle = Template.bind({});
