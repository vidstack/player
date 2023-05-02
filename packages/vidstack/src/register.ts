import { registerLiteCustomElement } from 'maverick.js/element';

import { Icon } from './icons/component';
import { Ads } from './player/core/ads/ads';
import { Outlet } from './player/core/outlet/outlet';
import { Player } from './player/core/player';
import { CaptionButton } from './player/ui/buttons/caption-button';
import { FullscreenButton } from './player/ui/buttons/fullscreen-button';
import { MuteButton } from './player/ui/buttons/mute-button';
import { PIPButton } from './player/ui/buttons/pip-button';
import { PlayButton } from './player/ui/buttons/play-button';
import { SeekButton } from './player/ui/buttons/seek-button';
import { ToggleButton } from './player/ui/buttons/toggle-button';
import { Captions } from './player/ui/captions/captions';
import { Gesture } from './player/ui/gesture';
import { LiveIndicator } from './player/ui/live-indicator';
import { Poster } from './player/ui/poster';
import { SliderThumbnail } from './player/ui/sliders/slider-thumbnail';
import { SliderValue } from './player/ui/sliders/slider-value';
import { SliderVideo } from './player/ui/sliders/slider-video';
import { Slider } from './player/ui/sliders/slider/slider';
import { TimeSlider } from './player/ui/sliders/time-slider/time-slider';
import { VolumeSlider } from './player/ui/sliders/volume-slider';
import { Time } from './player/ui/time';

export default function registerAllElements(): void {
  [
    Player,
    Outlet,
    Poster,
    Icon,
    PlayButton,
    MuteButton,
    PIPButton,
    FullscreenButton,
    CaptionButton,
    SeekButton,
    Slider,
    SliderThumbnail,
    SliderValue,
    SliderVideo,
    Time,
    TimeSlider,
    ToggleButton,
    VolumeSlider,
    LiveIndicator,
    Captions,
    Gesture,
    Ads
  ].map(registerLiteCustomElement);
}
