import { registerLiteCustomElement } from 'maverick.js/element';

import { PlayerDefinition } from './player/element/element';
import { OutletDefinition } from './player/media/outlet/element';
import { FullscreenButtonDefinition } from './player/ui/fullscreen-button/element';
import { MuteButtonDefinition } from './player/ui/mute-button/element';
import { PlayButtonDefinition } from './player/ui/play-button/element';
import { PosterDefinition } from './player/ui/poster/element';
import { SliderValueTextDefinition } from './player/ui/slider-value-text/element';
import { SliderVideoDefinition } from './player/ui/slider-video/element';
import { TimeSliderDefinition } from './player/ui/time-slider/element';
import { TimeDefinition } from './player/ui/time/element';
import { VolumeSliderDefinition } from './player/ui/volume-slider/element';

export default function registerAllElements(): void {
  [
    PlayerDefinition,
    OutletDefinition,
    PosterDefinition,
    PlayButtonDefinition,
    MuteButtonDefinition,
    FullscreenButtonDefinition,
    TimeSliderDefinition,
    VolumeSliderDefinition,
    TimeDefinition,
    SliderValueTextDefinition,
    SliderVideoDefinition,
  ].map(registerLiteCustomElement);
}
