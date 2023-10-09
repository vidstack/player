import {
  CaptionButton,
  Captions,
  Controls,
  ControlsGroup,
  FullscreenButton,
  Gesture,
  LiveButton,
  MediaPlayer,
  MediaProvider,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuPortal,
  MuteButton,
  PIPButton,
  PlayButton,
  Poster,
  Radio,
  RadioGroup,
  SeekButton,
  Slider,
  SliderChapters,
  SliderPreview,
  SliderThumbnail,
  SliderValue,
  SliderVideo,
  Thumbnail,
  Time,
  TimeSlider,
  ToggleButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VolumeSlider,
} from 'vidstack';

// Core
export class MediaPlayerInstance extends MediaPlayer {}
export class MediaProviderInstance extends MediaProvider {}
// Controls
export class ControlsInstance extends Controls {}
export class ControlsGroupInstance extends ControlsGroup {}
// Buttons
export class ToggleButtonInstance extends ToggleButton {}
export class CaptionButtonInstance extends CaptionButton {}
export class FullscreenButtonInstance extends FullscreenButton {}
export class LiveButtonInstance extends LiveButton {}
export class MuteButtonInstance extends MuteButton {}
export class PIPButtonInstance extends PIPButton {}
export class PlayButtonInstance extends PlayButton {}
export class SeekButtonInstance extends SeekButton {}
// Tooltip
export class TooltipInstance extends Tooltip {}
export class TooltipTriggerInstance extends TooltipTrigger {}
export class TooltipContentInstance extends TooltipContent {}
// Sliders
export class SliderInstance extends Slider {}
export class TimeSliderInstance extends TimeSlider {}
export class VolumeSliderInstance extends VolumeSlider {}
export class SliderThumbnailInstance extends SliderThumbnail {}
export class SliderValueInstance extends SliderValue {}
export class SliderVideoInstance extends SliderVideo {}
export class SliderPreviewInstance extends SliderPreview {}
export class SliderChaptersInstance extends SliderChapters {}
// Menus
export class MenuInstance extends Menu {}
export class MenuButtonInstance extends MenuButton {}
export class MenuItemsInstance extends MenuItems {}
export class MenuItemInstance extends MenuItem {}
export class MenuPortalInstance extends MenuPortal {}
export class RadioGroupInstance extends RadioGroup {}
export class RadioInstance extends Radio {}
// Display
export class CaptionsInstance extends Captions {}
export class GestureInstance extends Gesture {}
export class PosterInstance extends Poster {}
export class ThumbnailInstance extends Thumbnail {}
export class TimeInstance extends Time {}
