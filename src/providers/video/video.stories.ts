import './vds-video';

import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { Story } from '../../shared/storybook';
import { MediaCrossOriginOption, MediaPreloadOption } from '../file';
import { VideoControlsList } from './video.types';

export default {
  title: 'Providers/Video',
  component: 'vds-video',
  argTypes: {
    width: {
      control: 'number',
    },
    aspectRatio: {
      control: 'text',
    },
    src: {
      control: 'text',
      defaultValue: 'https://media.vidstack.io/720p.mp4',
    },
    poster: {
      control: 'text',
      defaultValue: 'https://media.vidstack.io/poster.png',
    },
    paused: {
      control: 'boolean',
      defaultValue: true,
    },
    volume: {
      control: {
        type: 'number',
        step: 0.01,
      },
      defaultValue: 1,
    },
    currentTime: {
      control: 'number',
      defaultValue: 0,
    },
    muted: {
      control: 'boolean',
      defaultValue: false,
    },
    controls: {
      control: 'boolean',
      defaultValue: false,
    },
    crossOrigin: {
      control: 'text',
      defaultValue: 'anonymous',
    },
    preload: {
      control: 'text',
      defaultValue: 'metadata',
    },
    controlsList: {
      control: 'text',
      defaultValue: undefined,
    },
    autoPiP: {
      control: 'boolean',
      defaultValue: false,
    },
    disablePiP: {
      control: 'boolean',
      defaultValue: false,
    },
    disableRemotePlayback: {
      control: 'boolean',
      defaultValue: false,
    },
  },
};

export type VideoArgTypes = {
  width: number;
  aspectRatio: string;
  src: string;
  poster: string;
  paused: boolean;
  volume: number;
  currentTime: number;
  muted: boolean;
  controls: boolean;
  crossOrigin: MediaCrossOriginOption;
  preload: MediaPreloadOption;
  controlsList?: VideoControlsList;
  autoPiP: boolean;
  disablePiP: boolean;
  disableRemotePlayback: boolean;
};

const Template: Story<VideoArgTypes> = ({
  width,
  aspectRatio,
  src,
  poster,
  paused,
  volume,
  currentTime,
  muted,
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
      aspect-ratio="${aspectRatio}"
      poster="${poster}"
      ?paused="${paused}"
      volume="${volume}"
      current-time="${currentTime}"
      ?muted="${muted}"
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
