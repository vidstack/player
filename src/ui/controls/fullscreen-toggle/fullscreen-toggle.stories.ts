import '../../../core/fakes/vds-fake-media-provider';

import { html, TemplateResult } from 'lit-html';

import { VdsUserEvents } from '../../../core';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
  VdsEventsToStorybookActions,
} from '../../../shared/storybook';
import { FullscreenToggleProps } from './fullscreen-toggle.types';
import { FULLSCREEN_TOGGLE_TAG_NAME } from './vds-fullscreen-toggle';

export default {
  title: 'UI/Foundation/Controls/Fullscreen Toggle',
  component: FULLSCREEN_TOGGLE_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(FULLSCREEN_TOGGLE_TAG_NAME),
    on: {
      table: {
        disable: true,
      },
    },
    fakeFullscreen: {
      control: 'boolean',
      defaultValue: false,
    },
  },
};

interface FakeProps {
  fakeFullscreen: boolean;
}

type Args = FakeProps &
  FullscreenToggleProps &
  VdsEventsToStorybookActions<VdsUserEvents>;

function Template({
  // Fakes
  fakeFullscreen,
  // Props
  label,
  describedBy,
  disabled,
  // Events
  onVdsUserFullscreenChange,
}: Args): TemplateResult {
  return html`
    <vds-fake-media-provider
      .canPlayCtx="${true}"
      .fullscreenCtx="${fakeFullscreen}"
    >
      <vds-fullscreen-toggle
        label="${ifNonEmpty(label)}"
        described-by="${ifNonEmpty(describedBy)}"
        ?disabled="${disabled}"
        style="color: ${SB_THEME_COLOR};"
        @vds-user-fullscreen-change="${onVdsUserFullscreenChange}"
      >
        <div slot="enter">Enter</div>
        <div slot="exit">Exit</div>
      </vds-fullscreen-toggle>
    </vds-fake-media-provider>
  `;
}

export const FullscreenToggle = Template.bind({});
