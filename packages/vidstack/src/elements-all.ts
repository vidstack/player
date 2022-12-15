import { MediaElementDefinition } from './player/media/element/media-element';
import { AudioElementDefinition } from './player/providers/audio/audio-element';
import { HLSVideoElementDefinition } from './player/providers/hls/hls-video-element';
import { VideoElementDefinition } from './player/providers/video/video-element';
import { PlayButtonElementDefinition } from './player/ui/play-button/play-button-element';

export default [
  MediaElementDefinition,
  AudioElementDefinition,
  VideoElementDefinition,
  HLSVideoElementDefinition,
  PlayButtonElementDefinition,
];
