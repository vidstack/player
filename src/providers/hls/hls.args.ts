import { VIDEO_ARG_TYPES, VideoArgTypes } from '../video';

export interface HlsArgTypes extends VideoArgTypes {
  libSrc: string;
}

export const HLS_ARG_TYPES = {
  ...VIDEO_ARG_TYPES,
  src: {
    ...VIDEO_ARG_TYPES['src'],
    defaultValue: 'https://media.vidstack.io/hls/index.m3u8',
  },
  libSrc: {
    control: 'text',
    defaultValue: 'https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.min.js',
  },
};
