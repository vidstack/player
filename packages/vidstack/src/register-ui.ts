import { BufferingIndicator } from './player/ui/buffering-indicator';
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
import { AudioMenuButton } from './player/ui/menu/audio/menu-button';
import { AudioMenuItems } from './player/ui/menu/audio/menu-items';
import { CaptionsMenuButton } from './player/ui/menu/captions/menu-button';
import { CaptionsMenuItems } from './player/ui/menu/captions/menu-items';
import { ChaptersMenuItems } from './player/ui/menu/chapters-menu-items';
import { Menu } from './player/ui/menu/menu';
import { MenuButton } from './player/ui/menu/menu-button';
import { MenuItems } from './player/ui/menu/menu-items';
import { PlaybackRateMenuButton } from './player/ui/menu/playback-rate/menu-button';
import { PlaybackRateMenuItems } from './player/ui/menu/playback-rate/menu-items';
import { QualityMenuButton } from './player/ui/menu/quality/menu-button';
import { QualityMenuItems } from './player/ui/menu/quality/menu-items';
import { Radio } from './player/ui/menu/radio/radio';
import { RadioGroup } from './player/ui/menu/radio/radio-group';
import { Poster } from './player/ui/poster';
import { SliderThumbnail } from './player/ui/sliders/slider-thumbnail';
import { SliderValue } from './player/ui/sliders/slider-value';
import { SliderVideo } from './player/ui/sliders/slider-video';
import { Slider } from './player/ui/sliders/slider/slider';
import { TimeSlider } from './player/ui/sliders/time-slider/time-slider';
import { VolumeSlider } from './player/ui/sliders/volume-slider';
import { Thumbnail } from './player/ui/thumbnail';
import { Time } from './player/ui/time';
import { Tooltip } from './player/ui/tooltip/tooltip';

export function getUIComponents() {
  return [
    Poster,
    BufferingIndicator,
    Tooltip,
    Thumbnail,
    PlayButton,
    MuteButton,
    PIPButton,
    FullscreenButton,
    CaptionButton,
    SeekButton,
    Slider,
    TimeSlider,
    VolumeSlider,
    SliderThumbnail,
    SliderValue,
    SliderVideo,
    Time,
    ToggleButton,
    LiveIndicator,
    Captions,
    Gesture,
    Menu,
    MenuButton,
    MenuItems,
    RadioGroup,
    Radio,
    AudioMenuButton,
    AudioMenuItems,
    CaptionsMenuButton,
    CaptionsMenuItems,
    ChaptersMenuItems,
    QualityMenuButton,
    QualityMenuItems,
    PlaybackRateMenuButton,
    PlaybackRateMenuItems,
  ];
}
