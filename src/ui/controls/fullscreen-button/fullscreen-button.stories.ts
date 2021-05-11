import '../../../core/fakes/vds-fake-media-provider';

import { html, TemplateResult } from 'lit-html';

import { VdsUserEvents } from '../../../core';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
  VdsEventsToStorybookActions,
} from '../../../shared/storybook';
import { FullscreenButtonElementProps } from './fullscreen-button.types';
import { VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME } from './vds-fullscreen-button';

export default {
  title: 'UI/Foundation/Controls/Fullscreen Button',
  component: VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(
      VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
    ),
    pressed: {
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
  FullscreenButtonElementProps &
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
      <vds-fullscreen-button
        label="${ifNonEmpty(label)}"
        described-by="${ifNonEmpty(describedBy)}"
        ?disabled="${disabled}"
        style="color: ${SB_THEME_COLOR};"
        @vds-user-fullscreen-change="${onVdsUserFullscreenChange}"
      >
        <div slot="enter">Enter</div>
        <div slot="exit">Exit</div>
      </vds-fullscreen-button>
    </vds-fake-media-provider>
  `;
}

export const FullscreenButton = Template.bind({});
