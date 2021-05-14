import '../../core/media/controller/vds-media-controller';
import '../../core/media/container/vds-media-container';

import { html, TemplateResult } from 'lit';

import {
  buildStorybookControlsFromManifest,
  DOMEventsToStorybookActions,
  SB_THEME_COLOR,
} from '../../shared/storybook';
import { VdsBufferingIndicatorEvents } from './buffering-indicator.events';
import { BufferingIndicatorElementProps } from './buffering-indicator.types';
import { VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME } from './vds-buffering-indicator';

export default {
  title: 'UI/Foundation/Buffering Indicator',
  component: VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(
      VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
    ),
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
  BufferingIndicatorElementProps &
  DOMEventsToStorybookActions<VdsBufferingIndicatorEvents>;

function Template({
  // Fakes
  fakeCanPlay,
  fakeBuffering,
  // Props
  delay,
  showWhileBooting,
  // Events
  onVdsBufferingIndicatorShow,
  onVdsBufferingIndicatorHide,
}: Args): TemplateResult {
  return html`
    <vds-media-controller .canPlay=${fakeCanPlay} .waiting=${fakeBuffering}>
      <vds-media-container>
        <vds-buffering-indicator
          delay=${delay}
          ?show-while-booting=${showWhileBooting}
          style="color: ${SB_THEME_COLOR};"
          @vds-buffering-indicator-show=${onVdsBufferingIndicatorShow}
          @vds-buffering-indicator-hide=${onVdsBufferingIndicatorHide}
        >
          <div>I'm Buffering!</div>
        </vds-buffering-indicator>
      </vds-media-container>
    </vds-media-controller>

    <style>
      vds-media-container::part(ui) {
        position: relative;
      }
    </style>
  `;
}

export const BufferingIndicator = Template.bind({});
