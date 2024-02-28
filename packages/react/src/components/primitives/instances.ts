import {
  AirPlayButton,
  AudioGainSlider,
  CaptionButton,
  Captions,
  Controls,
  ControlsGroup,
  FullscreenButton,
  Gesture,
  GoogleCastButton,
  LiveButton,
  MediaAnnouncer,
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
  QualitySlider,
  Radio,
  RadioGroup,
  SeekButton,
  Slider,
  SliderChapters,
  SliderPreview,
  SliderThumbnail,
  SliderValue,
  SliderVideo,
  SpeedSlider,
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
export class MediaAnnouncerInstance extends MediaAnnouncer {}
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
export class AirPlayButtonInstance extends AirPlayButton {}
export class GoogleCastButtonInstance extends GoogleCastButton {}
export class SeekButtonInstance extends SeekButton {}
// Tooltip
export class TooltipInstance extends Tooltip {}
export class TooltipTriggerInstance extends TooltipTrigger {}
export class TooltipContentInstance extends TooltipContent {}
// Sliders
export class SliderInstance extends Slider {}
export class TimeSliderInstance extends TimeSlider {}
export class VolumeSliderInstance extends VolumeSlider {}
export class AudioGainSliderInstance extends AudioGainSlider {}
export class SpeedSliderInstance extends SpeedSlider {}
export class QualitySliderInstance extends QualitySlider {}
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
