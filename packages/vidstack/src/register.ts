import { registerLiteCustomElement } from 'maverick.js/element';

import { MediaIconDefinition } from './icons/element';
import { PlayerDefinition } from './player/element/element';
import { OutletDefinition } from './player/media/outlet/element';
import { FullscreenButtonDefinition } from './player/ui/fullscreen-button/element';
import { LiveIndicatorDefinition } from './player/ui/live-indicator/element';
import { MuteButtonDefinition } from './player/ui/mute-button/element';
import { PlayButtonDefinition } from './player/ui/play-button/element';
import { PosterDefinition } from './player/ui/poster/element';
import { SeekButtonDefinition } from './player/ui/seek-button/element';
import { SliderThumbnailDefinition } from './player/ui/slider-thumbnail/element';
import { SliderValueTextDefinition } from './player/ui/slider-value-text/element';
import { SliderVideoDefinition } from './player/ui/slider-video/element';
import { SliderDefinition } from './player/ui/slider/element';
import { TimeSliderDefinition } from './player/ui/time-slider/element';
import { TimeDefinition } from './player/ui/time/element';
import { ToggleButtonDefinition } from './player/ui/toggle-button/element';
import { VolumeSliderDefinition } from './player/ui/volume-slider/element';

export default function registerAllElements(): void {
  [
    MediaIconDefinition,
    PlayerDefinition,
    OutletDefinition,
    PosterDefinition,
    PlayButtonDefinition,
    MuteButtonDefinition,
    SeekButtonDefinition,
    FullscreenButtonDefinition,
    TimeSliderDefinition,
    VolumeSliderDefinition,
    ToggleButtonDefinition,
    TimeDefinition,
    SliderDefinition,
    SliderValueTextDefinition,
    SliderThumbnailDefinition,
    SliderVideoDefinition,
    LiveIndicatorDefinition,
  ].map(registerLiteCustomElement);
}
