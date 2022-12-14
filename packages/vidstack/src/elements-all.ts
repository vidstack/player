import { MediaElementDefinition } from './player/media/element/media-element';
import { AudioElementDefinition } from './player/providers/audio/audio-element';
import { HLSVideoElementDefinition } from './player/providers/hls/hls-video-element';
import { VideoElementDefinition } from './player/providers/video/video-element';

export default [
  MediaElementDefinition,
  AudioElementDefinition,
  VideoElementDefinition,
  HLSVideoElementDefinition,
];
