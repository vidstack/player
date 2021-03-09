import './vds-video';

import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { Story } from '../../shared/storybook';
import { VIDEO_ARG_TYPES, VideoArgTypes } from './video.args';

export default {
  title: 'Providers/Video',
  component: 'vds-video',
  argTypes: VIDEO_ARG_TYPES,
};

const Template: Story<VideoArgTypes> = ({
  width,
  height,
  aspectRatio,
  src,
  poster,
  paused,
  volume,
  currentTime,
  muted,
  playsinline,
  loop,
  controls,
  crossOrigin,
  preload,
  controlsList,
  autoPiP,
  disablePiP,
  disableRemotePlayback,
}) =>
  html`
    <vds-video
      src="${src}"
      width="${width}"
      height="${height}"
      aspect-ratio="${aspectRatio}"
      poster="${poster}"
      ?paused="${paused}"
      volume="${volume}"
      current-time="${currentTime}"
      ?muted="${muted}"
      ?playsinline="${playsinline}"
      ?loop="${loop}"
      ?controls="${controls}"
      cross-origin="${crossOrigin}"
      preload="${preload}"
      controls-list="${ifDefined(controlsList)}"
      ?auto-pip="${autoPiP}"
      ?disable-pip="${disablePiP}"
      ?disable-remote-playback="${disableRemotePlayback}"
    ></vds-video>
  `;

export const Video = Template.bind({});
