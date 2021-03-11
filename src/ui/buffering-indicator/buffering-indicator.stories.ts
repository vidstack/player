import '../../core/fakes/vds-fake-media-provider';

import { html } from 'lit-element';

import { Story } from '../../shared/storybook';
import {
  BUFFERING_INDICATOR_STORYBOOK_ARG_TYPES,
  BufferingIndicatorActions,
  BufferingIndicatorFakeProps,
  BufferingIndicatorProps,
} from './buffering-indicator.args';
import { BUFFERING_INDICATOR_TAG_NAME } from './vds-buffering-indicator';

export default {
  title: 'UI/Foundation/Buffering Indicator',
  component: BUFFERING_INDICATOR_TAG_NAME,
  argTypes: BUFFERING_INDICATOR_STORYBOOK_ARG_TYPES,
};

const Template: Story<
  BufferingIndicatorProps &
    BufferingIndicatorFakeProps &
    BufferingIndicatorActions
> = ({ showWhileBooting, delay = 0, fakeBuffering, onShow, onHide }) =>
  html`
    <vds-fake-media-provider playback-ready .isBufferingCtx="${fakeBuffering}">
      <vds-buffering-indicator
        ?show-while-booting="${showWhileBooting}"
        delay="${delay}"
        style="color: #FF2A5D;"
        @vds-buffering-indicator-show="${onShow}"
        @vds-buffering-indicator-hide="${onHide}"
      >
        <div>I'm Buffering!</div>
      </vds-buffering-indicator>
    </vds-fake-media-provider>
  `;

export const BufferingIndicator = Template.bind({});
