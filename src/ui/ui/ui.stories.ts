import '../../core/fakes/vds-fake-media-provider';

import { html, TemplateResult } from 'lit-html';

import {
  buildStorybookControlsFromManifest,
  SB_THEME_COLOR,
} from '../../shared/storybook';
import { VDS_UI_ELEMENT_TAG_NAME } from './vds-ui';

export default {
  title: 'UI/Foundation/Ui',
  component: VDS_UI_ELEMENT_TAG_NAME,
  argTypes: {
    ...buildStorybookControlsFromManifest(VDS_UI_ELEMENT_TAG_NAME),
    fakeCanPlay: {
      control: 'boolean',
      defaultValue: true,
    },
    fakeIsAudioView: {
      control: 'boolean',
      defaultValue: false,
    },
    fakeIsVideoView: {
      control: 'boolean',
      defaultValue: false,
    },
  },
};

interface FakeProps {
  fakeCanPlay: boolean;
  fakeIsAudioView: boolean;
  fakeIsVideoView: boolean;
}

type Args = FakeProps;

function Template({
  // Fakes
  fakeCanPlay,
  fakeIsAudioView,
  fakeIsVideoView,
}: Args): TemplateResult {
  return html`
    <vds-fake-media-provider
      .canPlayCtx="${fakeCanPlay}"
      .isAudioViewCtx="${fakeIsAudioView}"
      .isVideoViewCtx="${fakeIsVideoView}"
    >
      <vds-ui style="color: ${SB_THEME_COLOR};"><div>UI</div></vds-ui>
    </vds-fake-media-provider>

    <style>
      vds-ui::part(root-hidden) {
        display: none;
      }
    </style>
  `;
}

export const Ui = Template.bind({});
