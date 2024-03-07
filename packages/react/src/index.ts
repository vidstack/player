export * from 'vidstack';
export * from './components/primitives/instances';

// Core
export type { PlayerSrc } from './source';
export { type MediaPlayerProps, MediaPlayer } from './components/player';
export { type MediaAnnouncerProps, MediaAnnouncer } from './components/announcer';
export { type MediaProviderProps, MediaProvider } from './components/provider';
export { type IconProps, Icon, type IconComponent } from './icon';
export { Track, type TrackProps } from './components/text-track';

// Controls
export * as Controls from './components/ui/controls';
export type {
  RootProps as ControlsProps,
  GroupProps as ControlsGroupProps,
} from './components/ui/controls';

// Tooltip
export * as Tooltip from './components/ui/tooltip';
export type {
  RootProps as TooltipProps,
  TriggerProps as TooltipTriggerProps,
  ContentProps as TooltipContentProps,
} from './components/ui/tooltip';

// Buttons
export { type ToggleButtonProps, ToggleButton } from './components/ui/buttons/toggle-button';
export { type AirPlayButtonProps, AirPlayButton } from './components/ui/buttons/airplay-button';
export {
  type GoogleCastButtonProps,
  GoogleCastButton,
} from './components/ui/buttons/google-cast-button';
export { type PlayButtonProps, PlayButton } from './components/ui/buttons/play-button';
export { type CaptionButtonProps, CaptionButton } from './components/ui/buttons/caption-button';
export {
  type FullscreenButtonProps,
  FullscreenButton,
} from './components/ui/buttons/fullscreen-button';
export { type MuteButtonProps, MuteButton } from './components/ui/buttons/mute-button';
export { type PIPButtonProps, PIPButton } from './components/ui/buttons/pip-button';
export { type SeekButtonProps, SeekButton } from './components/ui/buttons/seek-button';
export { type LiveButtonProps, LiveButton } from './components/ui/buttons/live-button';

// Slider
export * as Slider from './components/ui/sliders/slider';
export * as VolumeSlider from './components/ui/sliders/volume-slider';
export * as QualitySlider from './components/ui/sliders/quality-slider';
export * as AudioGainSlider from './components/ui/sliders/audio-gain-slider';
export * as SpeedSlider from './components/ui/sliders/speed-slider';
export * as TimeSlider from './components/ui/sliders/time-slider';
export type {
  RootProps as SliderProps,
  ValueProps as SliderValueProps,
  PreviewProps as SliderPreviewProps,
  StepsProps as SliderStepsProps,
} from './components/ui/sliders/slider';
export type { RootProps as VolumeSliderProps } from './components/ui/sliders/volume-slider';
export type { RootProps as AudioGainSliderProps } from './components/ui/sliders/audio-gain-slider';
export type { RootProps as SpeedSliderProps } from './components/ui/sliders/speed-slider';
export type { RootProps as QualitySliderProps } from './components/ui/sliders/quality-slider';
export type {
  RootProps as TimeSliderProps,
  ChaptersProps as SliderChapterProps,
  ChapterTitleProps as SliderChapterTitleProps,
  ThumbnailProps as SliderThumbnailProps,
  ThumbnailImgProps as SliderThumbnailImgProps,
  VideoProps as SliderVideoProps,
} from './components/ui/sliders/time-slider';

// Radio
export * as RadioGroup from './components/ui/radio-group';
export type {
  RootProps as RadioGroupProps,
  ItemProps as RadioProps,
} from './components/ui/radio-group';

// Menu
export * as Menu from './components/ui/menu';
export type {
  RootProps as MenuProps,
  ButtonProps as MenuButtonProps,
  PortalProps as MenuPortalProps,
  ItemsProps as MenuItemsProps,
  ContentProps as MenuContentProps,
  ItemProps as MenuItemProps,
  RadioGroupProps as MenuRadioGroupProps,
  RadioProps as MenuRadioProps,
} from './components/ui/menu';

// Display
export { Title, type TitleProps } from './components/ui/title';
export { ChapterTitle, type ChapterTitleProps } from './components/ui/chapter-title';
export { type GestureProps, Gesture } from './components/ui/gesture';
export { Captions, type CaptionsProps } from './components/ui/captions';
export { type PosterProps, Poster } from './components/ui/poster';
export { type TimeProps, Time } from './components/ui/time';

// Caption
export * as Caption from './components/ui/caption';
export type {
  RootProps as CaptionProps,
  TextProps as CaptionTextProps,
} from './components/ui/caption';

// Thumbnail
export * as Thumbnail from './components/ui/thumbnail';
export type {
  RootProps as ThumbnailProps,
  ImgProps as ThumbnailImgProps,
} from './components/ui/thumbnail';

// Spinner
export * as Spinner from './components/ui/spinner';
export type {
  RootProps as SpinnerProps,
  TrackProps as SpinnerTrackProps,
  TrackFillProps as SpinnerTrackFillProps,
} from './components/ui/spinner';

// Hooks
export * from './hooks/use-state';
export * from './hooks/use-media-context';
export * from './hooks/use-media-player';
export * from './hooks/use-media-provider';
export * from './hooks/use-media-remote';
export * from './hooks/use-media-state';
export * from './hooks/use-thumbnails';
export * from './hooks/use-slider-state';
export * from './hooks/use-slider-preview';
export * from './hooks/use-text-cues';
export * from './hooks/use-active-text-cues';
export * from './hooks/use-active-text-track';
export * from './hooks/use-chapter-title';
export * from './hooks/create-text-track';
export * from './hooks/options/use-audio-gain-options';
export * from './hooks/options/use-audio-options';
export * from './hooks/options/use-caption-options';
export * from './hooks/options/use-chapter-options';
export * from './hooks/options/use-video-quality-options';
export * from './hooks/options/use-playback-rate-options';

// Layouts
export type { DefaultLayoutProps } from './components/layouts/default';
export type { PlyrLayoutProps } from './components/layouts/plyr';
