import './vds-hls';

import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { ifNonEmpty } from '../../shared/directives/if-non-empty';
import { Story } from '../../shared/storybook';
import { VIDEO_ARG_TYPES, VideoArgTypes } from '../video/video.args';

export default {
  title: 'Providers/Hls',
  component: 'vds-hls',
  argTypes: {
    ...VIDEO_ARG_TYPES,
    src: {
      control: 'text',
      defaultValue: 'https://media.vidstack.io/hls/index.m3u8',
    },
    libSrc: {
      control: 'text',
      defaultValue:
        'https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.min.js',
    },
  },
};

export interface HlsArgTypes extends VideoArgTypes {
  libSrc: string;
}

const Template: Story<HlsArgTypes> = ({
  width,
  height,
  aspectRatio,
  src,
  libSrc,
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
    <vds-hls
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
      lib-src="${ifNonEmpty(libSrc)}"
      controls-list="${ifDefined(controlsList)}"
      ?auto-pip="${autoPiP}"
      ?disable-pip="${disablePiP}"
      ?disable-remote-playback="${disableRemotePlayback}"
    ></vds-hls>
  `;

export const Hls = Template.bind({});
