import type { HTMLAttributes, Ref, ReservedProps } from 'vue';
import type { MediaCaptionButtonElement, MediaFullscreenButtonElement, MediaLiveButtonElement, MediaMuteButtonElement, MediaPIPButtonElement, MediaPlayButtonElement, MediaSeekButtonElement, MediaToggleButtonElement, MediaCaptionsElement, MediaChapterTitleElement, MediaControlsElement, MediaControlsGroupElement, MediaGestureElement, MediaAudioLayoutElement, MediaVideoLayoutElement, MediaLayoutElement, MediaAudioRadioGroupElement, MediaCaptionsRadioGroupElement, MediaChaptersRadioGroupElement, MediaMenuButtonElement, MediaMenuElement, MediaMenuItemElement, MediaMenuItemsElement, MediaMenuPortalElement, MediaQualityRadioGroupElement, MediaRadioElement, MediaRadioGroupElement, MediaSpeedRadioGroupElement, MediaPlayerElement, MediaPosterElement, MediaProviderElement, MediaSliderChaptersElement, MediaSliderElement, MediaSliderPreviewElement, MediaSliderThumbnailElement, MediaSliderValueElement, MediaSliderVideoElement, MediaTimeSliderElement, MediaVolumeSliderElement, MediaThumbnailElement, MediaTimeElement, MediaTooltipContentElement, MediaTooltipElement, MediaTooltipTriggerElement } from './elements';
import type { CaptionButtonProps, FullscreenButtonProps, LiveButtonProps, MuteButtonProps, PIPButtonProps, PlayButtonProps, SeekButtonProps, ToggleButtonProps, CaptionsProps, ControlsProps, ControlsEvents, GestureProps, DefaultLayoutProps, AudioRadioGroupProps, AudioRadioGroupEvents, CaptionsRadioGroupProps, CaptionsRadioGroupEvents, ChapterRadioGroupProps, ChaptersRadioGroupEvents, MenuButtonProps, MenuButtonEvents, MenuProps, MenuEvents, MenuItemsProps, MenuPortalProps, QualityRadioGroupProps, QualityRadioGroupEvents, RadioProps, RadioEvents, RadioGroupProps, RadioGroupEvents, SpeedRadioGroupProps, SpeedRadioGroupEvents, MediaPlayerProps, MediaPlayerEvents, PosterProps, MediaProviderProps, SliderChaptersProps, SliderProps, SliderEvents, SliderPreviewProps, ThumbnailProps, SliderValueProps, SliderVideoProps, SliderVideoEvents, TimeSliderProps, VolumeSliderProps, TimeProps, TooltipContentProps, TooltipProps } from './index';
import type { IconType } from "./icons";

declare module 'vue' {
  export interface GlobalComponents {
    "media-caption-button": MediaCaptionButtonComponent;
    "media-fullscreen-button": MediaFullscreenButtonComponent;
    "media-live-button": MediaLiveButtonComponent;
    "media-mute-button": MediaMuteButtonComponent;
    "media-pip-button": MediaPIPButtonComponent;
    "media-play-button": MediaPlayButtonComponent;
    "media-seek-button": MediaSeekButtonComponent;
    "media-toggle-button": MediaToggleButtonComponent;
    "media-captions": MediaCaptionsComponent;
    "media-chapter-title": MediaChapterTitleComponent;
    "media-controls": MediaControlsComponent;
    "media-controls-group": MediaControlsGroupComponent;
    "media-gesture": MediaGestureComponent;
    "media-audio-layout": MediaAudioLayoutComponent;
    "media-video-layout": MediaVideoLayoutComponent;
    "media-layout": MediaLayoutComponent;
    "media-audio-radio-group": MediaAudioRadioGroupComponent;
    "media-captions-radio-group": MediaCaptionsRadioGroupComponent;
    "media-chapters-radio-group": MediaChaptersRadioGroupComponent;
    "media-menu-button": MediaMenuButtonComponent;
    "media-menu": MediaMenuComponent;
    "media-menu-item": MediaMenuItemComponent;
    "media-menu-items": MediaMenuItemsComponent;
    "media-menu-portal": MediaMenuPortalComponent;
    "media-quality-radio-group": MediaQualityRadioGroupComponent;
    "media-radio": MediaRadioComponent;
    "media-radio-group": MediaRadioGroupComponent;
    "media-speed-radio-group": MediaSpeedRadioGroupComponent;
    "media-player": MediaPlayerComponent;
    "media-poster": MediaPosterComponent;
    "media-provider": MediaProviderComponent;
    "media-slider-chapters": MediaSliderChaptersComponent;
    "media-slider": MediaSliderComponent;
    "media-slider-preview": MediaSliderPreviewComponent;
    "media-slider-thumbnail": MediaSliderThumbnailComponent;
    "media-slider-value": MediaSliderValueComponent;
    "media-slider-video": MediaSliderVideoComponent;
    "media-time-slider": MediaTimeSliderComponent;
    "media-volume-slider": MediaVolumeSliderComponent;
    "media-thumbnail": MediaThumbnailComponent;
    "media-time": MediaTimeComponent;
    "media-tooltip-content": MediaTooltipContentComponent;
    "media-tooltip": MediaTooltipComponent;
    "media-tooltip-trigger": MediaTooltipTriggerComponent;
    "media-icon": HTMLAttributes & { type: IconType }
  }
}

export type ElementRef<T> = string | Ref<T> | ((el: T | null) => void);

export interface EventHandler<T> {
  (event: T): void;
}
/**********************************************************************************************
* MediaCaptionButton
/**********************************************************************************************/

export interface MediaCaptionButtonComponent {
  (props: MediaCaptionButtonAttributes): MediaCaptionButtonElement;
}

export interface MediaCaptionButtonAttributes extends Partial<CaptionButtonProps>, Omit<HTMLAttributes, keyof CaptionButtonProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaCaptionButtonElement>;
}


/**********************************************************************************************
* MediaFullscreenButton
/**********************************************************************************************/

export interface MediaFullscreenButtonComponent {
  (props: MediaFullscreenButtonAttributes): MediaFullscreenButtonElement;
}

export interface MediaFullscreenButtonAttributes extends Partial<FullscreenButtonProps>, Omit<HTMLAttributes, keyof FullscreenButtonProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaFullscreenButtonElement>;
}


/**********************************************************************************************
* MediaLiveButton
/**********************************************************************************************/

export interface MediaLiveButtonComponent {
  (props: MediaLiveButtonAttributes): MediaLiveButtonElement;
}

export interface MediaLiveButtonAttributes extends Partial<LiveButtonProps>, Omit<HTMLAttributes, keyof LiveButtonProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaLiveButtonElement>;
}


/**********************************************************************************************
* MediaMuteButton
/**********************************************************************************************/

export interface MediaMuteButtonComponent {
  (props: MediaMuteButtonAttributes): MediaMuteButtonElement;
}

export interface MediaMuteButtonAttributes extends Partial<MuteButtonProps>, Omit<HTMLAttributes, keyof MuteButtonProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaMuteButtonElement>;
}


/**********************************************************************************************
* MediaPIPButton
/**********************************************************************************************/

export interface MediaPIPButtonComponent {
  (props: MediaPIPButtonAttributes): MediaPIPButtonElement;
}

export interface MediaPIPButtonAttributes extends Partial<PIPButtonProps>, Omit<HTMLAttributes, keyof PIPButtonProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaPIPButtonElement>;
}


/**********************************************************************************************
* MediaPlayButton
/**********************************************************************************************/

export interface MediaPlayButtonComponent {
  (props: MediaPlayButtonAttributes): MediaPlayButtonElement;
}

export interface MediaPlayButtonAttributes extends Partial<PlayButtonProps>, Omit<HTMLAttributes, keyof PlayButtonProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaPlayButtonElement>;
}


/**********************************************************************************************
* MediaSeekButton
/**********************************************************************************************/

export interface MediaSeekButtonComponent {
  (props: MediaSeekButtonAttributes): MediaSeekButtonElement;
}

export interface MediaSeekButtonAttributes extends Partial<SeekButtonProps>, Omit<HTMLAttributes, keyof SeekButtonProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaSeekButtonElement>;
}


/**********************************************************************************************
* MediaToggleButton
/**********************************************************************************************/

export interface MediaToggleButtonComponent {
  (props: MediaToggleButtonAttributes): MediaToggleButtonElement;
}

export interface MediaToggleButtonAttributes extends Partial<ToggleButtonProps>, Omit<HTMLAttributes, keyof ToggleButtonProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaToggleButtonElement>;
}


/**********************************************************************************************
* MediaCaptions
/**********************************************************************************************/

export interface MediaCaptionsComponent {
  (props: MediaCaptionsAttributes): MediaCaptionsElement;
}

export interface MediaCaptionsAttributes extends Partial<CaptionsProps>, Omit<HTMLAttributes, keyof CaptionsProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaCaptionsElement>;
}


/**********************************************************************************************
* MediaChapterTitle
/**********************************************************************************************/

export interface MediaChapterTitleComponent {
  (props: MediaChapterTitleAttributes): MediaChapterTitleElement;
}

export interface MediaChapterTitleAttributes extends Omit<HTMLAttributes, "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaChapterTitleElement>;
}


/**********************************************************************************************
* MediaControls
/**********************************************************************************************/

export interface MediaControlsComponent {
  (props: MediaControlsAttributes): MediaControlsElement;
}

export interface MediaControlsAttributes extends Partial<ControlsProps>, MediaControlsEventAttributes, Omit<HTMLAttributes, keyof ControlsProps | keyof MediaControlsEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaControlsElement>;
}

export interface MediaControlsEventAttributes {
  onChange?: EventHandler<ControlsEvents['change']>;
}

/**********************************************************************************************
* MediaControlsGroup
/**********************************************************************************************/

export interface MediaControlsGroupComponent {
  (props: MediaControlsGroupAttributes): MediaControlsGroupElement;
}

export interface MediaControlsGroupAttributes extends Omit<HTMLAttributes, "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaControlsGroupElement>;
}


/**********************************************************************************************
* MediaGesture
/**********************************************************************************************/

export interface MediaGestureComponent {
  (props: MediaGestureAttributes): MediaGestureElement;
}

export interface MediaGestureAttributes extends Partial<GestureProps>, Omit<HTMLAttributes, keyof GestureProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaGestureElement>;
}


/**********************************************************************************************
* MediaAudioLayout
/**********************************************************************************************/

export interface MediaAudioLayoutComponent {
  (props: MediaAudioLayoutAttributes): MediaAudioLayoutElement;
}

export interface MediaAudioLayoutAttributes extends Partial<DefaultLayoutProps>, Omit<HTMLAttributes, keyof DefaultLayoutProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaAudioLayoutElement>;
}


/**********************************************************************************************
* MediaVideoLayout
/**********************************************************************************************/

export interface MediaVideoLayoutComponent {
  (props: MediaVideoLayoutAttributes): MediaVideoLayoutElement;
}

export interface MediaVideoLayoutAttributes extends Partial<DefaultLayoutProps>, Omit<HTMLAttributes, keyof DefaultLayoutProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaVideoLayoutElement>;
}


/**********************************************************************************************
* MediaLayout
/**********************************************************************************************/

export interface MediaLayoutComponent {
  (props: MediaLayoutAttributes): MediaLayoutElement;
}

export interface MediaLayoutAttributes extends Omit<HTMLAttributes, "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaLayoutElement>;
}


/**********************************************************************************************
* MediaAudioRadioGroup
/**********************************************************************************************/

export interface MediaAudioRadioGroupComponent {
  (props: MediaAudioRadioGroupAttributes): MediaAudioRadioGroupElement;
}

export interface MediaAudioRadioGroupAttributes extends Partial<AudioRadioGroupProps>, MediaAudioRadioGroupEventAttributes, Omit<HTMLAttributes, keyof AudioRadioGroupProps | keyof MediaAudioRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaAudioRadioGroupElement>;
}

export interface MediaAudioRadioGroupEventAttributes {
  onChange?: EventHandler<AudioRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaCaptionsRadioGroup
/**********************************************************************************************/

export interface MediaCaptionsRadioGroupComponent {
  (props: MediaCaptionsRadioGroupAttributes): MediaCaptionsRadioGroupElement;
}

export interface MediaCaptionsRadioGroupAttributes extends Partial<CaptionsRadioGroupProps>, MediaCaptionsRadioGroupEventAttributes, Omit<HTMLAttributes, keyof CaptionsRadioGroupProps | keyof MediaCaptionsRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaCaptionsRadioGroupElement>;
}

export interface MediaCaptionsRadioGroupEventAttributes {
  onChange?: EventHandler<CaptionsRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaChaptersRadioGroup
/**********************************************************************************************/

export interface MediaChaptersRadioGroupComponent {
  (props: MediaChaptersRadioGroupAttributes): MediaChaptersRadioGroupElement;
}

export interface MediaChaptersRadioGroupAttributes extends Partial<ChapterRadioGroupProps>, MediaChaptersRadioGroupEventAttributes, Omit<HTMLAttributes, keyof ChapterRadioGroupProps | keyof MediaChaptersRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaChaptersRadioGroupElement>;
}

export interface MediaChaptersRadioGroupEventAttributes {
  onChange?: EventHandler<ChaptersRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaMenuButton
/**********************************************************************************************/

export interface MediaMenuButtonComponent {
  (props: MediaMenuButtonAttributes): MediaMenuButtonElement;
}

export interface MediaMenuButtonAttributes extends Partial<MenuButtonProps>, MediaMenuButtonEventAttributes, Omit<HTMLAttributes, keyof MenuButtonProps | keyof MediaMenuButtonEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaMenuButtonElement>;
}

export interface MediaMenuButtonEventAttributes {
  onSelect?: EventHandler<MenuButtonEvents['select']>;
}

/**********************************************************************************************
* MediaMenu
/**********************************************************************************************/

export interface MediaMenuComponent {
  (props: MediaMenuAttributes): MediaMenuElement;
}

export interface MediaMenuAttributes extends Partial<MenuProps>, MediaMenuEventAttributes, Omit<HTMLAttributes, keyof MenuProps | keyof MediaMenuEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaMenuElement>;
}

export interface MediaMenuEventAttributes {
  onOpen?: EventHandler<MenuEvents['open']>;
  onClose?: EventHandler<MenuEvents['close']>;
}

/**********************************************************************************************
* MediaMenuItem
/**********************************************************************************************/

export interface MediaMenuItemComponent {
  (props: MediaMenuItemAttributes): MediaMenuItemElement;
}

export interface MediaMenuItemAttributes extends Partial<MenuButtonProps>, MediaMenuItemEventAttributes, Omit<HTMLAttributes, keyof MenuButtonProps | keyof MediaMenuItemEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaMenuItemElement>;
}

export interface MediaMenuItemEventAttributes {
  onSelect?: EventHandler<MenuButtonEvents['select']>;
}

/**********************************************************************************************
* MediaMenuItems
/**********************************************************************************************/

export interface MediaMenuItemsComponent {
  (props: MediaMenuItemsAttributes): MediaMenuItemsElement;
}

export interface MediaMenuItemsAttributes extends Partial<MenuItemsProps>, Omit<HTMLAttributes, keyof MenuItemsProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaMenuItemsElement>;
}


/**********************************************************************************************
* MediaMenuPortal
/**********************************************************************************************/

export interface MediaMenuPortalComponent {
  (props: MediaMenuPortalAttributes): MediaMenuPortalElement;
}

export interface MediaMenuPortalAttributes extends Partial<MenuPortalProps>, Omit<HTMLAttributes, keyof MenuPortalProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaMenuPortalElement>;
}


/**********************************************************************************************
* MediaQualityRadioGroup
/**********************************************************************************************/

export interface MediaQualityRadioGroupComponent {
  (props: MediaQualityRadioGroupAttributes): MediaQualityRadioGroupElement;
}

export interface MediaQualityRadioGroupAttributes extends Partial<QualityRadioGroupProps>, MediaQualityRadioGroupEventAttributes, Omit<HTMLAttributes, keyof QualityRadioGroupProps | keyof MediaQualityRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaQualityRadioGroupElement>;
}

export interface MediaQualityRadioGroupEventAttributes {
  onChange?: EventHandler<QualityRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaRadio
/**********************************************************************************************/

export interface MediaRadioComponent {
  (props: MediaRadioAttributes): MediaRadioElement;
}

export interface MediaRadioAttributes extends Partial<RadioProps>, MediaRadioEventAttributes, Omit<HTMLAttributes, keyof RadioProps | keyof MediaRadioEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaRadioElement>;
}

export interface MediaRadioEventAttributes {
  onChange?: EventHandler<RadioEvents['change']>;
  onSelect?: EventHandler<RadioEvents['select']>;
}

/**********************************************************************************************
* MediaRadioGroup
/**********************************************************************************************/

export interface MediaRadioGroupComponent {
  (props: MediaRadioGroupAttributes): MediaRadioGroupElement;
}

export interface MediaRadioGroupAttributes extends Partial<RadioGroupProps>, MediaRadioGroupEventAttributes, Omit<HTMLAttributes, keyof RadioGroupProps | keyof MediaRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaRadioGroupElement>;
}

export interface MediaRadioGroupEventAttributes {
  onChange?: EventHandler<RadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaSpeedRadioGroup
/**********************************************************************************************/

export interface MediaSpeedRadioGroupComponent {
  (props: MediaSpeedRadioGroupAttributes): MediaSpeedRadioGroupElement;
}

export interface MediaSpeedRadioGroupAttributes extends Partial<SpeedRadioGroupProps>, MediaSpeedRadioGroupEventAttributes, Omit<HTMLAttributes, keyof SpeedRadioGroupProps | keyof MediaSpeedRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaSpeedRadioGroupElement>;
}

export interface MediaSpeedRadioGroupEventAttributes {
  onChange?: EventHandler<SpeedRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaPlayer
/**********************************************************************************************/

export interface MediaPlayerComponent {
  (props: MediaPlayerAttributes): MediaPlayerElement;
}

export interface MediaPlayerAttributes extends Partial<MediaPlayerProps>, MediaPlayerEventAttributes, Omit<HTMLAttributes, keyof MediaPlayerProps | keyof MediaPlayerEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaPlayerElement>;
}

export interface MediaPlayerEventAttributes {
  onMediaPlayerConnect?: EventHandler<MediaPlayerEvents['media-player-connect']>;
  onFindMediaPlayer?: EventHandler<MediaPlayerEvents['find-media-player']>;
  onAudioTracksChange?: EventHandler<MediaPlayerEvents['audio-tracks-change']>;
  onAudioTrackChange?: EventHandler<MediaPlayerEvents['audio-track-change']>;
  onAutoplayChange?: EventHandler<MediaPlayerEvents['autoplay-change']>;
  onAutoplayFail?: EventHandler<MediaPlayerEvents['autoplay-fail']>;
  onCanLoad?: EventHandler<MediaPlayerEvents['can-load']>;
  onCanPlayThrough?: EventHandler<MediaPlayerEvents['can-play-through']>;
  onCanPlay?: EventHandler<MediaPlayerEvents['can-play']>;
  onControlsChange?: EventHandler<MediaPlayerEvents['controls-change']>;
  onDurationChange?: EventHandler<MediaPlayerEvents['duration-change']>;
  onFullscreenChange?: EventHandler<MediaPlayerEvents['fullscreen-change']>;
  onFullscreenError?: EventHandler<MediaPlayerEvents['fullscreen-error']>;
  onLiveChange?: EventHandler<MediaPlayerEvents['live-change']>;
  onLiveEdgeChange?: EventHandler<MediaPlayerEvents['live-edge-change']>;
  onLoadStart?: EventHandler<MediaPlayerEvents['load-start']>;
  onLoadedData?: EventHandler<MediaPlayerEvents['loaded-data']>;
  onLoadedMetadata?: EventHandler<MediaPlayerEvents['loaded-metadata']>;
  onLoopChange?: EventHandler<MediaPlayerEvents['loop-change']>;
  onMediaTypeChange?: EventHandler<MediaPlayerEvents['media-type-change']>;
  onOrientationChange?: EventHandler<MediaPlayerEvents['orientation-change']>;
  onPlayFail?: EventHandler<MediaPlayerEvents['play-fail']>;
  onPlaysinlineChange?: EventHandler<MediaPlayerEvents['playsinline-change']>;
  onPosterChange?: EventHandler<MediaPlayerEvents['poster-change']>;
  onProviderChange?: EventHandler<MediaPlayerEvents['provider-change']>;
  onProviderLoaderChange?: EventHandler<MediaPlayerEvents['provider-loader-change']>;
  onProviderSetup?: EventHandler<MediaPlayerEvents['provider-setup']>;
  onPictureInPictureChange?: EventHandler<MediaPlayerEvents['picture-in-picture-change']>;
  onPictureInPictureError?: EventHandler<MediaPlayerEvents['picture-in-picture-error']>;
  onQualitiesChange?: EventHandler<MediaPlayerEvents['qualities-change']>;
  onQualityChange?: EventHandler<MediaPlayerEvents['quality-change']>;
  onRateChange?: EventHandler<MediaPlayerEvents['rate-change']>;
  onSourceChange?: EventHandler<MediaPlayerEvents['source-change']>;
  onSourcesChange?: EventHandler<MediaPlayerEvents['sources-change']>;
  onTimeUpdate?: EventHandler<MediaPlayerEvents['time-update']>;
  onStreamTypeChange?: EventHandler<MediaPlayerEvents['stream-type-change']>;
  onTextTracksChange?: EventHandler<MediaPlayerEvents['text-tracks-change']>;
  onTextTrackChange?: EventHandler<MediaPlayerEvents['text-track-change']>;
  onViewTypeChange?: EventHandler<MediaPlayerEvents['view-type-change']>;
  onVolumeChange?: EventHandler<MediaPlayerEvents['volume-change']>;
  onAbort?: EventHandler<MediaPlayerEvents['abort']>;
  onAutoplay?: EventHandler<MediaPlayerEvents['autoplay']>;
  onDestroy?: EventHandler<MediaPlayerEvents['destroy']>;
  onEmptied?: EventHandler<MediaPlayerEvents['emptied']>;
  onEnd?: EventHandler<MediaPlayerEvents['end']>;
  onEnded?: EventHandler<MediaPlayerEvents['ended']>;
  onError?: EventHandler<MediaPlayerEvents['error']>;
  onPause?: EventHandler<MediaPlayerEvents['pause']>;
  onPlay?: EventHandler<MediaPlayerEvents['play']>;
  onPlaying?: EventHandler<MediaPlayerEvents['playing']>;
  onProgress?: EventHandler<MediaPlayerEvents['progress']>;
  onReplay?: EventHandler<MediaPlayerEvents['replay']>;
  onSeeked?: EventHandler<MediaPlayerEvents['seeked']>;
  onSeeking?: EventHandler<MediaPlayerEvents['seeking']>;
  onStalled?: EventHandler<MediaPlayerEvents['stalled']>;
  onStarted?: EventHandler<MediaPlayerEvents['started']>;
  onSuspend?: EventHandler<MediaPlayerEvents['suspend']>;
  onWaiting?: EventHandler<MediaPlayerEvents['waiting']>;
  onMediaAudioTrackChangeRequest?: EventHandler<MediaPlayerEvents['media-audio-track-change-request']>;
  onMediaEnterFullscreenRequest?: EventHandler<MediaPlayerEvents['media-enter-fullscreen-request']>;
  onMediaExitFullscreenRequest?: EventHandler<MediaPlayerEvents['media-exit-fullscreen-request']>;
  onMediaEnterPipRequest?: EventHandler<MediaPlayerEvents['media-enter-pip-request']>;
  onMediaExitPipRequest?: EventHandler<MediaPlayerEvents['media-exit-pip-request']>;
  onMediaLiveEdgeRequest?: EventHandler<MediaPlayerEvents['media-live-edge-request']>;
  onMediaLoopRequest?: EventHandler<MediaPlayerEvents['media-loop-request']>;
  onMediaMuteRequest?: EventHandler<MediaPlayerEvents['media-mute-request']>;
  onMediaPauseRequest?: EventHandler<MediaPlayerEvents['media-pause-request']>;
  onMediaPauseControlsRequest?: EventHandler<MediaPlayerEvents['media-pause-controls-request']>;
  onMediaPlayRequest?: EventHandler<MediaPlayerEvents['media-play-request']>;
  onMediaQualityChangeRequest?: EventHandler<MediaPlayerEvents['media-quality-change-request']>;
  onMediaRateChangeRequest?: EventHandler<MediaPlayerEvents['media-rate-change-request']>;
  onMediaResumeControlsRequest?: EventHandler<MediaPlayerEvents['media-resume-controls-request']>;
  onMediaSeekRequest?: EventHandler<MediaPlayerEvents['media-seek-request']>;
  onMediaSeekingRequest?: EventHandler<MediaPlayerEvents['media-seeking-request']>;
  onMediaStartLoading?: EventHandler<MediaPlayerEvents['media-start-loading']>;
  onMediaTextTrackChangeRequest?: EventHandler<MediaPlayerEvents['media-text-track-change-request']>;
  onMediaUnmuteRequest?: EventHandler<MediaPlayerEvents['media-unmute-request']>;
  onMediaVolumeChangeRequest?: EventHandler<MediaPlayerEvents['media-volume-change-request']>;
  onVdsLog?: EventHandler<MediaPlayerEvents['vds-log']>;
  onVideoPresentationChange?: EventHandler<MediaPlayerEvents['video-presentation-change']>;
  onHlsLibLoadStart?: EventHandler<MediaPlayerEvents['hls-lib-load-start']>;
  onHlsLibLoaded?: EventHandler<MediaPlayerEvents['hls-lib-loaded']>;
  onHlsLibLoadError?: EventHandler<MediaPlayerEvents['hls-lib-load-error']>;
  onHlsInstance?: EventHandler<MediaPlayerEvents['hls-instance']>;
  onHlsUnsupported?: EventHandler<MediaPlayerEvents['hls-unsupported']>;
  onHlsMediaAttaching?: EventHandler<MediaPlayerEvents['hls-media-attaching']>;
  onHlsMediaAttached?: EventHandler<MediaPlayerEvents['hls-media-attached']>;
  onHlsMediaDetaching?: EventHandler<MediaPlayerEvents['hls-media-detaching']>;
  onHlsMediaDetached?: EventHandler<MediaPlayerEvents['hls-media-detached']>;
  onHlsBufferReset?: EventHandler<MediaPlayerEvents['hls-buffer-reset']>;
  onHlsBufferCodecs?: EventHandler<MediaPlayerEvents['hls-buffer-codecs']>;
  onHlsBufferCreated?: EventHandler<MediaPlayerEvents['hls-buffer-created']>;
  onHlsBufferAppending?: EventHandler<MediaPlayerEvents['hls-buffer-appending']>;
  onHlsBufferAppended?: EventHandler<MediaPlayerEvents['hls-buffer-appended']>;
  onHlsBufferEos?: EventHandler<MediaPlayerEvents['hls-buffer-eos']>;
  onHlsBufferFlushing?: EventHandler<MediaPlayerEvents['hls-buffer-flushing']>;
  onHlsBufferFlushed?: EventHandler<MediaPlayerEvents['hls-buffer-flushed']>;
  onHlsManifestLoading?: EventHandler<MediaPlayerEvents['hls-manifest-loading']>;
  onHlsManifestLoaded?: EventHandler<MediaPlayerEvents['hls-manifest-loaded']>;
  onHlsManifestParsed?: EventHandler<MediaPlayerEvents['hls-manifest-parsed']>;
  onHlsLevelSwitching?: EventHandler<MediaPlayerEvents['hls-level-switching']>;
  onHlsLevelSwitched?: EventHandler<MediaPlayerEvents['hls-level-switched']>;
  onHlsLevelLoading?: EventHandler<MediaPlayerEvents['hls-level-loading']>;
  onHlsLevelLoaded?: EventHandler<MediaPlayerEvents['hls-level-loaded']>;
  onHlsLevelUpdated?: EventHandler<MediaPlayerEvents['hls-level-updated']>;
  onHlsLevelPtsUpdated?: EventHandler<MediaPlayerEvents['hls-level-pts-updated']>;
  onHlsLevelsUpdated?: EventHandler<MediaPlayerEvents['hls-levels-updated']>;
  onHlsAudioTracksUpdated?: EventHandler<MediaPlayerEvents['hls-audio-tracks-updated']>;
  onHlsAudioTrackSwitching?: EventHandler<MediaPlayerEvents['hls-audio-track-switching']>;
  onHlsAudioTrackSwitched?: EventHandler<MediaPlayerEvents['hls-audio-track-switched']>;
  onHlsAudioTrackLoading?: EventHandler<MediaPlayerEvents['hls-audio-track-loading']>;
  onHlsAudioTrackLoaded?: EventHandler<MediaPlayerEvents['hls-audio-track-loaded']>;
  onHlsSubtitleTracksUpdated?: EventHandler<MediaPlayerEvents['hls-subtitle-tracks-updated']>;
  onHlsSubtitleTracksCleared?: EventHandler<MediaPlayerEvents['hls-subtitle-tracks-cleared']>;
  onHlsSubtitleTrackSwitch?: EventHandler<MediaPlayerEvents['hls-subtitle-track-switch']>;
  onHlsSubtitleTrackLoading?: EventHandler<MediaPlayerEvents['hls-subtitle-track-loading']>;
  onHlsSubtitleTrackLoaded?: EventHandler<MediaPlayerEvents['hls-subtitle-track-loaded']>;
  onHlsSubtitleFragProcessed?: EventHandler<MediaPlayerEvents['hls-subtitle-frag-processed']>;
  onHlsCuesParsed?: EventHandler<MediaPlayerEvents['hls-cues-parsed']>;
  onHlsNonNativeTextTracksFound?: EventHandler<MediaPlayerEvents['hls-non-native-text-tracks-found']>;
  onHlsInitPtsFound?: EventHandler<MediaPlayerEvents['hls-init-pts-found']>;
  onHlsFragLoading?: EventHandler<MediaPlayerEvents['hls-frag-loading']>;
  onHlsFragLoadEmergencyAborted?: EventHandler<MediaPlayerEvents['hls-frag-load-emergency-aborted']>;
  onHlsFragLoaded?: EventHandler<MediaPlayerEvents['hls-frag-loaded']>;
  onHlsFragDecrypted?: EventHandler<MediaPlayerEvents['hls-frag-decrypted']>;
  onHlsFragParsingInitSegment?: EventHandler<MediaPlayerEvents['hls-frag-parsing-init-segment']>;
  onHlsFragParsingUserdata?: EventHandler<MediaPlayerEvents['hls-frag-parsing-userdata']>;
  onHlsFragParsingMetadata?: EventHandler<MediaPlayerEvents['hls-frag-parsing-metadata']>;
  onHlsFragParsed?: EventHandler<MediaPlayerEvents['hls-frag-parsed']>;
  onHlsFragBufferedData?: EventHandler<MediaPlayerEvents['hls-frag-buffered-data']>;
  onHlsFragChanged?: EventHandler<MediaPlayerEvents['hls-frag-changed']>;
  onHlsFpsDrop?: EventHandler<MediaPlayerEvents['hls-fps-drop']>;
  onHlsFpsDropLevelCapping?: EventHandler<MediaPlayerEvents['hls-fps-drop-level-capping']>;
  onHlsError?: EventHandler<MediaPlayerEvents['hls-error']>;
  onHlsDestroying?: EventHandler<MediaPlayerEvents['hls-destroying']>;
  onHlsKeyLoading?: EventHandler<MediaPlayerEvents['hls-key-loading']>;
  onHlsKeyLoaded?: EventHandler<MediaPlayerEvents['hls-key-loaded']>;
  onHlsBackBufferReached?: EventHandler<MediaPlayerEvents['hls-back-buffer-reached']>;
}

/**********************************************************************************************
* MediaPoster
/**********************************************************************************************/

export interface MediaPosterComponent {
  (props: MediaPosterAttributes): MediaPosterElement;
}

export interface MediaPosterAttributes extends Partial<PosterProps>, Omit<HTMLAttributes, keyof PosterProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaPosterElement>;
}


/**********************************************************************************************
* MediaProvider
/**********************************************************************************************/

export interface MediaProviderComponent {
  (props: MediaProviderAttributes): MediaProviderElement;
}

export interface MediaProviderAttributes extends Partial<MediaProviderProps>, Omit<HTMLAttributes, keyof MediaProviderProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaProviderElement>;
}


/**********************************************************************************************
* MediaSliderChapters
/**********************************************************************************************/

export interface MediaSliderChaptersComponent {
  (props: MediaSliderChaptersAttributes): MediaSliderChaptersElement;
}

export interface MediaSliderChaptersAttributes extends Partial<SliderChaptersProps>, Omit<HTMLAttributes, keyof SliderChaptersProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaSliderChaptersElement>;
}


/**********************************************************************************************
* MediaSlider
/**********************************************************************************************/

export interface MediaSliderComponent {
  (props: MediaSliderAttributes): MediaSliderElement;
}

export interface MediaSliderAttributes extends Partial<SliderProps>, MediaSliderEventAttributes, Omit<HTMLAttributes, keyof SliderProps | keyof MediaSliderEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaSliderElement>;
}

export interface MediaSliderEventAttributes {
  onDragStart?: EventHandler<SliderEvents['drag-start']>;
  onDragEnd?: EventHandler<SliderEvents['drag-end']>;
  onValueChange?: EventHandler<SliderEvents['value-change']>;
  onDragValueChange?: EventHandler<SliderEvents['drag-value-change']>;
  onPointerValueChange?: EventHandler<SliderEvents['pointer-value-change']>;
}

/**********************************************************************************************
* MediaSliderPreview
/**********************************************************************************************/

export interface MediaSliderPreviewComponent {
  (props: MediaSliderPreviewAttributes): MediaSliderPreviewElement;
}

export interface MediaSliderPreviewAttributes extends Partial<SliderPreviewProps>, Omit<HTMLAttributes, keyof SliderPreviewProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaSliderPreviewElement>;
}


/**********************************************************************************************
* MediaSliderThumbnail
/**********************************************************************************************/

export interface MediaSliderThumbnailComponent {
  (props: MediaSliderThumbnailAttributes): MediaSliderThumbnailElement;
}

export interface MediaSliderThumbnailAttributes extends Partial<ThumbnailProps>, Omit<HTMLAttributes, keyof ThumbnailProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaSliderThumbnailElement>;
}


/**********************************************************************************************
* MediaSliderValue
/**********************************************************************************************/

export interface MediaSliderValueComponent {
  (props: MediaSliderValueAttributes): MediaSliderValueElement;
}

export interface MediaSliderValueAttributes extends Partial<SliderValueProps>, Omit<HTMLAttributes, keyof SliderValueProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaSliderValueElement>;
}


/**********************************************************************************************
* MediaSliderVideo
/**********************************************************************************************/

export interface MediaSliderVideoComponent {
  (props: MediaSliderVideoAttributes): MediaSliderVideoElement;
}

export interface MediaSliderVideoAttributes extends Partial<SliderVideoProps>, MediaSliderVideoEventAttributes, Omit<HTMLAttributes, keyof SliderVideoProps | keyof MediaSliderVideoEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaSliderVideoElement>;
}

export interface MediaSliderVideoEventAttributes {
  onCanPlay?: EventHandler<SliderVideoEvents['can-play']>;
  onError?: EventHandler<SliderVideoEvents['error']>;
}

/**********************************************************************************************
* MediaTimeSlider
/**********************************************************************************************/

export interface MediaTimeSliderComponent {
  (props: MediaTimeSliderAttributes): MediaTimeSliderElement;
}

export interface MediaTimeSliderAttributes extends Partial<TimeSliderProps>, MediaTimeSliderEventAttributes, Omit<HTMLAttributes, keyof TimeSliderProps | keyof MediaTimeSliderEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaTimeSliderElement>;
}

export interface MediaTimeSliderEventAttributes {
  onDragStart?: EventHandler<SliderEvents['drag-start']>;
  onDragEnd?: EventHandler<SliderEvents['drag-end']>;
  onValueChange?: EventHandler<SliderEvents['value-change']>;
  onDragValueChange?: EventHandler<SliderEvents['drag-value-change']>;
  onPointerValueChange?: EventHandler<SliderEvents['pointer-value-change']>;
}

/**********************************************************************************************
* MediaVolumeSlider
/**********************************************************************************************/

export interface MediaVolumeSliderComponent {
  (props: MediaVolumeSliderAttributes): MediaVolumeSliderElement;
}

export interface MediaVolumeSliderAttributes extends Partial<VolumeSliderProps>, MediaVolumeSliderEventAttributes, Omit<HTMLAttributes, keyof VolumeSliderProps | keyof MediaVolumeSliderEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaVolumeSliderElement>;
}

export interface MediaVolumeSliderEventAttributes {
  onDragStart?: EventHandler<SliderEvents['drag-start']>;
  onDragEnd?: EventHandler<SliderEvents['drag-end']>;
  onValueChange?: EventHandler<SliderEvents['value-change']>;
  onDragValueChange?: EventHandler<SliderEvents['drag-value-change']>;
  onPointerValueChange?: EventHandler<SliderEvents['pointer-value-change']>;
}

/**********************************************************************************************
* MediaThumbnail
/**********************************************************************************************/

export interface MediaThumbnailComponent {
  (props: MediaThumbnailAttributes): MediaThumbnailElement;
}

export interface MediaThumbnailAttributes extends Partial<ThumbnailProps>, Omit<HTMLAttributes, keyof ThumbnailProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaThumbnailElement>;
}


/**********************************************************************************************
* MediaTime
/**********************************************************************************************/

export interface MediaTimeComponent {
  (props: MediaTimeAttributes): MediaTimeElement;
}

export interface MediaTimeAttributes extends Partial<TimeProps>, Omit<HTMLAttributes, keyof TimeProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaTimeElement>;
}


/**********************************************************************************************
* MediaTooltipContent
/**********************************************************************************************/

export interface MediaTooltipContentComponent {
  (props: MediaTooltipContentAttributes): MediaTooltipContentElement;
}

export interface MediaTooltipContentAttributes extends Partial<TooltipContentProps>, Omit<HTMLAttributes, keyof TooltipContentProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaTooltipContentElement>;
}


/**********************************************************************************************
* MediaTooltip
/**********************************************************************************************/

export interface MediaTooltipComponent {
  (props: MediaTooltipAttributes): MediaTooltipElement;
}

export interface MediaTooltipAttributes extends Partial<TooltipProps>, Omit<HTMLAttributes, keyof TooltipProps | "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaTooltipElement>;
}


/**********************************************************************************************
* MediaTooltipTrigger
/**********************************************************************************************/

export interface MediaTooltipTriggerComponent {
  (props: MediaTooltipTriggerAttributes): MediaTooltipTriggerElement;
}

export interface MediaTooltipTriggerAttributes extends Omit<HTMLAttributes, "is">, Omit<ReservedProps, 'ref'> {
  ref?: ElementRef<MediaTooltipTriggerElement>;
}

