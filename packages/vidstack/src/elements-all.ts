import MediaDefinition from './player/media/element/element';
import AudioDefinition from './player/providers/audio/element';
import HLSVideoDefinition from './player/providers/hls/element';
import VideoDefinition from './player/providers/video/element';
import AspectRatioDefinition from './player/ui/aspect-ratio/element';
import FullscreenButtonDefinition from './player/ui/fullscreen-button/element';
import MuteButtonDefinition from './player/ui/mute-button/element';
import PlayButtonDefinition from './player/ui/play-button/element';
import PosterDefinition from './player/ui/poster/element';
import { SliderValueTextDefinition } from './player/ui/slider-value-text/element';
import SliderVideoDefinition from './player/ui/slider-video/element';
import TimeSliderDefinition from './player/ui/time-slider/element';
import TimeElementDefinition from './player/ui/time/element';
import VolumeSliderDefinition from './player/ui/volume-slider/element';

export default [
  AspectRatioDefinition,
  PosterDefinition,
  MediaDefinition,
  AudioDefinition,
  VideoDefinition,
  HLSVideoDefinition,
  PlayButtonDefinition,
  MuteButtonDefinition,
  FullscreenButtonDefinition,
  TimeSliderDefinition,
  VolumeSliderDefinition,
  TimeElementDefinition,
  SliderValueTextDefinition,
  SliderVideoDefinition,
];
