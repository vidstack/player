import '../../../core/fakes/vds-fake-media-provider';

import { html } from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { Story } from '../../../shared/storybook';
import { FULLSCREEN_TOGGLE_STORYBOOK_ARG_TYPES } from './fullscreen-toggle.args';
import {
  FullscreenToggleActions,
  FullscreenToggleFakeProps,
  FullscreenToggleProps,
} from './fullscreen-toggle.types';
import { FULLSCREEN_TOGGLE_TAG_NAME } from './vds-fullscreen-toggle';

export default {
  title: 'UI/Foundation/Controls/Fullscreen Toggle',
  component: FULLSCREEN_TOGGLE_TAG_NAME,
  argTypes: FULLSCREEN_TOGGLE_STORYBOOK_ARG_TYPES,
};

const Template: Story<
  FullscreenToggleProps & FullscreenToggleFakeProps & FullscreenToggleActions
> = ({
  label,
  describedBy,
  disabled,
  fakeFullscreen,
  onUserFullscreenChange,
}) =>
  html`
    <vds-fake-media-provider
      .canPlayCtx="${true}"
      .fullscreenCtx="${fakeFullscreen}"
    >
      <vds-fullscreen-toggle
        label="${ifNonEmpty(label)}"
        described-by="${ifNonEmpty(describedBy)}"
        ?disabled="${disabled}"
        style="color: #FF2A5D;"
        @vds-userfullscreenchange="${onUserFullscreenChange}"
      >
        <div slot="enter">Enter</div>
        <div slot="exit">Exit</div>
      </vds-fullscreen-toggle>
    </vds-fake-media-provider>
  `;

export const FullscreenToggle = Template.bind({});
