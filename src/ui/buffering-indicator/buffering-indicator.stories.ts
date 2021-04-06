import '../../core/fakes/vds-fake-media-provider';

import { html, TemplateResult } from 'lit-html';

import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
  VdsEventsToStorybookActions,
} from '../../shared/storybook';
import { VdsBufferingIndicatorEvents } from './buffering-indicator.events';
import { BufferingIndicatorProps } from './buffering-indicator.types';
import { BUFFERING_INDICATOR_TAG_NAME } from './vds-buffering-indicator';

export default {
  title: 'UI/Foundation/Buffering Indicator',
  component: BUFFERING_INDICATOR_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(BUFFERING_INDICATOR_TAG_NAME),
    fakeCanPlay: {
      control: 'boolean',
      defaultValue: true,
    },
    fakeBuffering: {
      control: 'boolean',
      defaultValue: true,
    },
  },
};

interface FakeProps {
  fakeCanPlay: boolean;
  fakeBuffering: boolean;
}

type Args = FakeProps &
  BufferingIndicatorProps &
  VdsEventsToStorybookActions<VdsBufferingIndicatorEvents>;

function Template({
  // Fakes
  fakeCanPlay,
  fakeBuffering,
  // Props
  delay,
  showWhileBooting,
  // Events
  onVdsBufferingShow,
  onVdsBufferingHide,
}: Args): TemplateResult {
  return html`
    <vds-fake-media-provider
      .canPlayCtx="${fakeCanPlay}"
      .waitingCtx="${fakeBuffering}"
    >
      <vds-buffering-indicator
        ?show-while-booting="${showWhileBooting}"
        delay="${delay}"
        style="color: ${SB_THEME_COLOR};"
        @vds-buffering-show="${onVdsBufferingShow}"
        @vds-buffering-hide="${onVdsBufferingHide}"
      >
        <div>I'm Buffering!</div>
      </vds-buffering-indicator>
    </vds-fake-media-provider>
  `;
}

export const BufferingIndicator = Template.bind({});
