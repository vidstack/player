import type { JSX } from 'solid-js';
import type { MediaCaptionButtonElement, MediaFullscreenButtonElement, MediaLiveButtonElement, MediaMuteButtonElement, MediaPIPButtonElement, MediaPlayButtonElement, MediaSeekButtonElement, MediaToggleButtonElement, MediaCaptionsElement, MediaChapterTitleElement, MediaControlsElement, MediaControlsGroupElement, MediaGestureElement, MediaAudioLayoutElement, MediaVideoLayoutElement, MediaLayoutElement, MediaAudioRadioGroupElement, MediaCaptionsRadioGroupElement, MediaChaptersRadioGroupElement, MediaMenuButtonElement, MediaMenuElement, MediaMenuItemElement, MediaMenuItemsElement, MediaMenuPortalElement, MediaQualityRadioGroupElement, MediaRadioElement, MediaRadioGroupElement, MediaSpeedRadioGroupElement, MediaPlayerElement, MediaPosterElement, MediaProviderElement, MediaSliderChaptersElement, MediaSliderElement, MediaSliderPreviewElement, MediaSliderThumbnailElement, MediaSliderValueElement, MediaSliderVideoElement, MediaTimeSliderElement, MediaVolumeSliderElement, MediaThumbnailElement, MediaTimeElement, MediaTooltipContentElement, MediaTooltipElement, MediaTooltipTriggerElement } from './elements';
import type { CaptionButtonProps, FullscreenButtonProps, LiveButtonProps, MuteButtonProps, PIPButtonProps, PlayButtonProps, SeekButtonProps, ToggleButtonProps, CaptionsProps, ControlsProps, ControlsEvents, GestureProps, DefaultLayoutProps, AudioRadioGroupProps, AudioRadioGroupEvents, CaptionsRadioGroupProps, CaptionsRadioGroupEvents, ChapterRadioGroupProps, ChaptersRadioGroupEvents, MenuButtonProps, MenuButtonEvents, MenuProps, MenuEvents, MenuItemsProps, MenuPortalProps, QualityRadioGroupProps, QualityRadioGroupEvents, RadioProps, RadioEvents, RadioGroupProps, RadioGroupEvents, SpeedRadioGroupProps, SpeedRadioGroupEvents, MediaPlayerProps, MediaPlayerEvents, PosterProps, MediaProviderProps, SliderChaptersProps, SliderProps, SliderEvents, SliderPreviewProps, ThumbnailProps, SliderValueProps, SliderVideoProps, SliderVideoEvents, TimeSliderProps, VolumeSliderProps, TimeProps, TooltipContentProps, TooltipProps } from './index';
import type { IconType } from "./icons";

declare module "solid-js"{
  namespace JSX {
    interface IntrinsicElements {
      "media-caption-button": MediaCaptionButtonAttributes;
    "media-fullscreen-button": MediaFullscreenButtonAttributes;
    "media-live-button": MediaLiveButtonAttributes;
    "media-mute-button": MediaMuteButtonAttributes;
    "media-pip-button": MediaPIPButtonAttributes;
    "media-play-button": MediaPlayButtonAttributes;
    "media-seek-button": MediaSeekButtonAttributes;
    "media-toggle-button": MediaToggleButtonAttributes;
    "media-captions": MediaCaptionsAttributes;
    "media-chapter-title": MediaChapterTitleAttributes;
    "media-controls": MediaControlsAttributes;
    "media-controls-group": MediaControlsGroupAttributes;
    "media-gesture": MediaGestureAttributes;
    "media-audio-layout": MediaAudioLayoutAttributes;
    "media-video-layout": MediaVideoLayoutAttributes;
    "media-layout": MediaLayoutAttributes;
    "media-audio-radio-group": MediaAudioRadioGroupAttributes;
    "media-captions-radio-group": MediaCaptionsRadioGroupAttributes;
    "media-chapters-radio-group": MediaChaptersRadioGroupAttributes;
    "media-menu-button": MediaMenuButtonAttributes;
    "media-menu": MediaMenuAttributes;
    "media-menu-item": MediaMenuItemAttributes;
    "media-menu-items": MediaMenuItemsAttributes;
    "media-menu-portal": MediaMenuPortalAttributes;
    "media-quality-radio-group": MediaQualityRadioGroupAttributes;
    "media-radio": MediaRadioAttributes;
    "media-radio-group": MediaRadioGroupAttributes;
    "media-speed-radio-group": MediaSpeedRadioGroupAttributes;
    "media-player": MediaPlayerAttributes;
    "media-poster": MediaPosterAttributes;
    "media-provider": MediaProviderAttributes;
    "media-slider-chapters": MediaSliderChaptersAttributes;
    "media-slider": MediaSliderAttributes;
    "media-slider-preview": MediaSliderPreviewAttributes;
    "media-slider-thumbnail": MediaSliderThumbnailAttributes;
    "media-slider-value": MediaSliderValueAttributes;
    "media-slider-video": MediaSliderVideoAttributes;
    "media-time-slider": MediaTimeSliderAttributes;
    "media-volume-slider": MediaVolumeSliderAttributes;
    "media-thumbnail": MediaThumbnailAttributes;
    "media-time": MediaTimeAttributes;
    "media-tooltip-content": MediaTooltipContentAttributes;
    "media-tooltip": MediaTooltipAttributes;
    "media-tooltip-trigger": MediaTooltipTriggerAttributes;
    "media-icon": JSX.HTMLAttributes<HTMLElement> & { type: IconType };
    }
  }
}

export interface EventHandler<T> {
  (event: T): void;
}
/**********************************************************************************************
* MediaCaptionButton
/**********************************************************************************************/


export interface MediaCaptionButtonAttributes extends Partial<CaptionButtonProps>, Omit<JSX.HTMLAttributes<MediaCaptionButtonElement>, keyof CaptionButtonProps | "is"> {
}


/**********************************************************************************************
* MediaFullscreenButton
/**********************************************************************************************/


export interface MediaFullscreenButtonAttributes extends Partial<FullscreenButtonProps>, Omit<JSX.HTMLAttributes<MediaFullscreenButtonElement>, keyof FullscreenButtonProps | "is"> {
}


/**********************************************************************************************
* MediaLiveButton
/**********************************************************************************************/


export interface MediaLiveButtonAttributes extends Partial<LiveButtonProps>, Omit<JSX.HTMLAttributes<MediaLiveButtonElement>, keyof LiveButtonProps | "is"> {
}


/**********************************************************************************************
* MediaMuteButton
/**********************************************************************************************/


export interface MediaMuteButtonAttributes extends Partial<MuteButtonProps>, Omit<JSX.HTMLAttributes<MediaMuteButtonElement>, keyof MuteButtonProps | "is"> {
}


/**********************************************************************************************
* MediaPIPButton
/**********************************************************************************************/


export interface MediaPIPButtonAttributes extends Partial<PIPButtonProps>, Omit<JSX.HTMLAttributes<MediaPIPButtonElement>, keyof PIPButtonProps | "is"> {
}


/**********************************************************************************************
* MediaPlayButton
/**********************************************************************************************/


export interface MediaPlayButtonAttributes extends Partial<PlayButtonProps>, Omit<JSX.HTMLAttributes<MediaPlayButtonElement>, keyof PlayButtonProps | "is"> {
}


/**********************************************************************************************
* MediaSeekButton
/**********************************************************************************************/


export interface MediaSeekButtonAttributes extends Partial<SeekButtonProps>, Omit<JSX.HTMLAttributes<MediaSeekButtonElement>, keyof SeekButtonProps | "is"> {
}


/**********************************************************************************************
* MediaToggleButton
/**********************************************************************************************/


export interface MediaToggleButtonAttributes extends Partial<ToggleButtonProps>, Omit<JSX.HTMLAttributes<MediaToggleButtonElement>, keyof ToggleButtonProps | "is"> {
}


/**********************************************************************************************
* MediaCaptions
/**********************************************************************************************/


export interface MediaCaptionsAttributes extends Partial<CaptionsProps>, Omit<JSX.HTMLAttributes<MediaCaptionsElement>, keyof CaptionsProps | "is"> {
}


/**********************************************************************************************
* MediaChapterTitle
/**********************************************************************************************/


export interface MediaChapterTitleAttributes extends Omit<JSX.HTMLAttributes<MediaChapterTitleElement>, "is"> {
}


/**********************************************************************************************
* MediaControls
/**********************************************************************************************/


export interface MediaControlsAttributes extends Partial<ControlsProps>, MediaControlsEventAttributes, Omit<JSX.HTMLAttributes<MediaControlsElement>, keyof ControlsProps | keyof MediaControlsEventAttributes | "is"> {
}

export interface MediaControlsEventAttributes {
  /**
Fired when the active state of the controls change.
@detail isVisible
*/
  "on:change"?: EventHandler<ControlsEvents['change']>;
}

/**********************************************************************************************
* MediaControlsGroup
/**********************************************************************************************/


export interface MediaControlsGroupAttributes extends Omit<JSX.HTMLAttributes<MediaControlsGroupElement>, "is"> {
}


/**********************************************************************************************
* MediaGesture
/**********************************************************************************************/


export interface MediaGestureAttributes extends Partial<GestureProps>, Omit<JSX.HTMLAttributes<MediaGestureElement>, keyof GestureProps | "is"> {
}


/**********************************************************************************************
* MediaAudioLayout
/**********************************************************************************************/


export interface MediaAudioLayoutAttributes extends Partial<DefaultLayoutProps>, Omit<JSX.HTMLAttributes<MediaAudioLayoutElement>, keyof DefaultLayoutProps | "is"> {
}


/**********************************************************************************************
* MediaVideoLayout
/**********************************************************************************************/


export interface MediaVideoLayoutAttributes extends Partial<DefaultLayoutProps>, Omit<JSX.HTMLAttributes<MediaVideoLayoutElement>, keyof DefaultLayoutProps | "is"> {
}


/**********************************************************************************************
* MediaLayout
/**********************************************************************************************/


export interface MediaLayoutAttributes extends Omit<JSX.HTMLAttributes<MediaLayoutElement>, "is"> {
}


/**********************************************************************************************
* MediaAudioRadioGroup
/**********************************************************************************************/


export interface MediaAudioRadioGroupAttributes extends Partial<AudioRadioGroupProps>, MediaAudioRadioGroupEventAttributes, Omit<JSX.HTMLAttributes<MediaAudioRadioGroupElement>, keyof AudioRadioGroupProps | keyof MediaAudioRadioGroupEventAttributes | "is"> {
}

export interface MediaAudioRadioGroupEventAttributes {
  /**
Fired when the checked radio changes.
@detail track
*/
  "on:change"?: EventHandler<AudioRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaCaptionsRadioGroup
/**********************************************************************************************/


export interface MediaCaptionsRadioGroupAttributes extends Partial<CaptionsRadioGroupProps>, MediaCaptionsRadioGroupEventAttributes, Omit<JSX.HTMLAttributes<MediaCaptionsRadioGroupElement>, keyof CaptionsRadioGroupProps | keyof MediaCaptionsRadioGroupEventAttributes | "is"> {
}

export interface MediaCaptionsRadioGroupEventAttributes {
  /**
Fired when the checked radio changes. The event detail will be `null` when no track is selected
or captions are turned off.
@detail track
*/
  "on:change"?: EventHandler<CaptionsRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaChaptersRadioGroup
/**********************************************************************************************/


export interface MediaChaptersRadioGroupAttributes extends Partial<ChapterRadioGroupProps>, MediaChaptersRadioGroupEventAttributes, Omit<JSX.HTMLAttributes<MediaChaptersRadioGroupElement>, keyof ChapterRadioGroupProps | keyof MediaChaptersRadioGroupEventAttributes | "is"> {
}

export interface MediaChaptersRadioGroupEventAttributes {
  /**
Fired when the checked radio changes.
@detail cue
*/
  "on:change"?: EventHandler<ChaptersRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaMenuButton
/**********************************************************************************************/


export interface MediaMenuButtonAttributes extends Partial<MenuButtonProps>, MediaMenuButtonEventAttributes, Omit<JSX.HTMLAttributes<MediaMenuButtonElement>, keyof MenuButtonProps | keyof MediaMenuButtonEventAttributes | "is"> {
}

export interface MediaMenuButtonEventAttributes {
  /**
Fired when the button is pressed via mouse, touch, or keyboard.
undefined
*/
  "on:select"?: EventHandler<MenuButtonEvents['select']>;
}

/**********************************************************************************************
* MediaMenu
/**********************************************************************************************/


export interface MediaMenuAttributes extends Partial<MenuProps>, MediaMenuEventAttributes, Omit<JSX.HTMLAttributes<MediaMenuElement>, keyof MenuProps | keyof MediaMenuEventAttributes | "is"> {
}

export interface MediaMenuEventAttributes {
  /**
Fired when the menu is opened.
undefined
*/
  "on:open"?: EventHandler<MenuEvents['open']>;
  /**
Fired when the menu is closed.
undefined
*/
  "on:close"?: EventHandler<MenuEvents['close']>;
}

/**********************************************************************************************
* MediaMenuItem
/**********************************************************************************************/


export interface MediaMenuItemAttributes extends Partial<MenuButtonProps>, MediaMenuItemEventAttributes, Omit<JSX.HTMLAttributes<MediaMenuItemElement>, keyof MenuButtonProps | keyof MediaMenuItemEventAttributes | "is"> {
}

export interface MediaMenuItemEventAttributes {
  /**
Fired when the button is pressed via mouse, touch, or keyboard.
undefined
*/
  "on:select"?: EventHandler<MenuButtonEvents['select']>;
}

/**********************************************************************************************
* MediaMenuItems
/**********************************************************************************************/


export interface MediaMenuItemsAttributes extends Partial<MenuItemsProps>, Omit<JSX.HTMLAttributes<MediaMenuItemsElement>, keyof MenuItemsProps | "is"> {
}


/**********************************************************************************************
* MediaMenuPortal
/**********************************************************************************************/


export interface MediaMenuPortalAttributes extends Partial<MenuPortalProps>, Omit<JSX.HTMLAttributes<MediaMenuPortalElement>, keyof MenuPortalProps | "is"> {
}


/**********************************************************************************************
* MediaQualityRadioGroup
/**********************************************************************************************/


export interface MediaQualityRadioGroupAttributes extends Partial<QualityRadioGroupProps>, MediaQualityRadioGroupEventAttributes, Omit<JSX.HTMLAttributes<MediaQualityRadioGroupElement>, keyof QualityRadioGroupProps | keyof MediaQualityRadioGroupEventAttributes | "is"> {
}

export interface MediaQualityRadioGroupEventAttributes {
  /**
Fired when the checked radio changes.
@detail quality
*/
  "on:change"?: EventHandler<QualityRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaRadio
/**********************************************************************************************/


export interface MediaRadioAttributes extends Partial<RadioProps>, MediaRadioEventAttributes, Omit<JSX.HTMLAttributes<MediaRadioElement>, keyof RadioProps | keyof MediaRadioEventAttributes | "is"> {
}

export interface MediaRadioEventAttributes {
  /**
Fired when the radio's checked value changes.
@detail isSelected
*/
  "on:change"?: EventHandler<RadioEvents['change']>;
  /**
Fired when the radio is pressed via mouse, touch, or, keyboard. This will not fire if the radio
is programmatically selected.
undefined
*/
  "on:select"?: EventHandler<RadioEvents['select']>;
}

/**********************************************************************************************
* MediaRadioGroup
/**********************************************************************************************/


export interface MediaRadioGroupAttributes extends Partial<RadioGroupProps>, MediaRadioGroupEventAttributes, Omit<JSX.HTMLAttributes<MediaRadioGroupElement>, keyof RadioGroupProps | keyof MediaRadioGroupEventAttributes | "is"> {
}

export interface MediaRadioGroupEventAttributes {
  /**
Fired when the checked radio changes.
@detail value
*/
  "on:change"?: EventHandler<RadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaSpeedRadioGroup
/**********************************************************************************************/


export interface MediaSpeedRadioGroupAttributes extends Partial<SpeedRadioGroupProps>, MediaSpeedRadioGroupEventAttributes, Omit<JSX.HTMLAttributes<MediaSpeedRadioGroupElement>, keyof SpeedRadioGroupProps | keyof MediaSpeedRadioGroupEventAttributes | "is"> {
}

export interface MediaSpeedRadioGroupEventAttributes {
  /**
Fired when the checked radio changes.
@detail speed
*/
  "on:change"?: EventHandler<SpeedRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaPlayer
/**********************************************************************************************/


export interface MediaPlayerAttributes extends Partial<MediaPlayerProps>, MediaPlayerEventAttributes, Omit<JSX.HTMLAttributes<MediaPlayerElement>, keyof MediaPlayerProps | keyof MediaPlayerEventAttributes | "is"> {
}

export interface MediaPlayerEventAttributes {
  /**
Fired when the player element `<media-player>` connects to the DOM.
@detail player
*/
  "on:media-player-connect"?: EventHandler<MediaPlayerEvents['media-player-connect']>;
  "on:find-media-player"?: EventHandler<MediaPlayerEvents['find-media-player']>;
  /**
Fired when an audio track has been added or removed.
@detail audioTrack
*/
  "on:audio-tracks-change"?: EventHandler<MediaPlayerEvents['audio-tracks-change']>;
  /**
Fired when the current audio track changes.
@detail audioTrack
*/
  "on:audio-track-change"?: EventHandler<MediaPlayerEvents['audio-track-change']>;
  /**
Fired when the `autoplay` property has changed value.
@detail isAutoplay
*/
  "on:autoplay-change"?: EventHandler<MediaPlayerEvents['autoplay-change']>;
  /**
Fired when an autoplay attempt has failed. The event detail contains the error that
had occurred on the last autoplay attempt which caused it to fail.
undefined
*/
  "on:autoplay-fail"?: EventHandler<MediaPlayerEvents['autoplay-fail']>;
  /**
Fired when the provider can begin loading media. This depends on the type of `loading`
that has been configured. The `eager` strategy will be immediate, and `lazy` once the provider
has entered the viewport.
undefined
*/
  "on:can-load"?: EventHandler<MediaPlayerEvents['can-load']>;
  /**
Fired when the user agent can play the media, and estimates that **enough** data has been
loaded to play the media up to its end without having to stop for further buffering of content.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
*/
  "on:can-play-through"?: EventHandler<MediaPlayerEvents['can-play-through']>;
  /**
Fired when the user agent can play the media, but estimates that **not enough** data has been
loaded to play the media up to its end without having to stop for further buffering of content.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
*/
  "on:can-play"?: EventHandler<MediaPlayerEvents['can-play']>;
  /**
Fired when controls visibility changes. The controls are idle/hidden when playback is
progressing (playing), and there is no user activity for a set period of time
(default is 2.5s). The event detail contains whether the controls are visible or not.
@detail isVisible
*/
  "on:controls-change"?: EventHandler<MediaPlayerEvents['controls-change']>;
  /**
Fired when the `duration` property changes.
@detail duration
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event
*/
  "on:duration-change"?: EventHandler<MediaPlayerEvents['duration-change']>;
  /**
Fired when media enters/exits fullscreen. The event detail is a `boolean` indicating
if fullscreen was entered (`true`) or exited (`false`).
@detail isFullscreen
*/
  "on:fullscreen-change"?: EventHandler<MediaPlayerEvents['fullscreen-change']>;
  /**
Fired when an error occurs either entering or exiting fullscreen. This will generally occur
if fullscreen is not supported or the user has not interacted with the page yet.
@detail error
*/
  "on:fullscreen-error"?: EventHandler<MediaPlayerEvents['fullscreen-error']>;
  /**
Fired when the `live` state changes. The event detail indicates whether the current stream
is live or not.
@detail isLive
*/
  "on:live-change"?: EventHandler<MediaPlayerEvents['live-change']>;
  /**
Fired when the `liveEdge` state changes. The event detail indicates whether the user is viewing
at the live edge or not.
@detail isLiveEdge
*/
  "on:live-edge-change"?: EventHandler<MediaPlayerEvents['live-edge-change']>;
  /**
Fired when the browser has started to load a resource.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event
*/
  "on:load-start"?: EventHandler<MediaPlayerEvents['load-start']>;
  /**
Fired when the frame at the current playback position of the media has finished loading; often
the first frame.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event
*/
  "on:loaded-data"?: EventHandler<MediaPlayerEvents['loaded-data']>;
  /**
Fired when the metadata has been loaded.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event
*/
  "on:loaded-metadata"?: EventHandler<MediaPlayerEvents['loaded-metadata']>;
  /**
Fired when the `loop` property has changed value.
@detail isLooping
*/
  "on:loop-change"?: EventHandler<MediaPlayerEvents['loop-change']>;
  /**
Fired when the `media` property changes value.
@detail mediaType
*/
  "on:media-type-change"?: EventHandler<MediaPlayerEvents['media-type-change']>;
  /**
Fired when a screen orientation change is requested on or by the media.
undefined
*/
  "on:orientation-change"?: EventHandler<MediaPlayerEvents['orientation-change']>;
  /**
Fired when an attempt to start media playback results in an error.
@detail error
*/
  "on:play-fail"?: EventHandler<MediaPlayerEvents['play-fail']>;
  /**
Fired when the `playsinline` property has changed value.
@detail isPlaysinline
*/
  "on:playsinline-change"?: EventHandler<MediaPlayerEvents['playsinline-change']>;
  /**
Fired when the `currentPoster` property has changed value.
@detail poster
*/
  "on:poster-change"?: EventHandler<MediaPlayerEvents['poster-change']>;
  /**
Fired when the new media provider has been selected. This will be `null` if no provider is
able to play one of the current sources.

This event is ideal for initially configuring any provider-specific settings.
@detail adapter
*/
  "on:provider-change"?: EventHandler<MediaPlayerEvents['provider-change']>;
  /**
Fired when the new media provider loader has been selected and rendered. This will be `null` if
no loader is able to play one of the current sources.
@detail loader
*/
  "on:provider-loader-change"?: EventHandler<MediaPlayerEvents['provider-loader-change']>;
  /**
Fired immediately after the provider has been set up. Do not try and configure the provider
here as it'll be too late - prefer the `provider-change` event.
@detail adapter
*/
  "on:provider-setup"?: EventHandler<MediaPlayerEvents['provider-setup']>;
  /**
Fired when media enters/exits picture-in-picture (PIP) mode. The event detail is a `boolean`
indicating if PIP was entered (`true`) or exited (`false`).
@detail isPictureInPictureMode
*/
  "on:picture-in-picture-change"?: EventHandler<MediaPlayerEvents['picture-in-picture-change']>;
  /**
Fired when an error occurs either entering or exiting picture-in-picture (PIP) mode. This will
generally occur if PIP is not supported or the user has not interacted with the page yet.
@detail error
*/
  "on:picture-in-picture-error"?: EventHandler<MediaPlayerEvents['picture-in-picture-error']>;
  /**
Fired when the list of available video qualities/renditions has changed.
@detail renditions
*/
  "on:qualities-change"?: EventHandler<MediaPlayerEvents['qualities-change']>;
  /**
Fired when the current video quality/rendition has changed. The event detail will be null if
video quality information is not available.
@detail quality
*/
  "on:quality-change"?: EventHandler<MediaPlayerEvents['quality-change']>;
  /**
Fired when the playback rate has changed. The event `detail` contains the new rate.
@detail rate
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event
*/
  "on:rate-change"?: EventHandler<MediaPlayerEvents['rate-change']>;
  /**
Fired when the `source` property has changed value.
@detail src
*/
  "on:source-change"?: EventHandler<MediaPlayerEvents['source-change']>;
  /**
Fired when the current media sources has changed.
@detail src
*/
  "on:sources-change"?: EventHandler<MediaPlayerEvents['sources-change']>;
  /**
Fired when the `currentTime` property value changes due to media playback or the
user seeking.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
*/
  "on:time-update"?: EventHandler<MediaPlayerEvents['time-update']>;
  /**
Fired when the `streamType` property changes value. The event detail contains the type of
stream (e.g., `on-demand`, `live`, `live:dvr`, etc.).
@detail streamType
*/
  "on:stream-type-change"?: EventHandler<MediaPlayerEvents['stream-type-change']>;
  /**
Fired when an audio track has been added or removed.
@detail textTracks
*/
  "on:text-tracks-change"?: EventHandler<MediaPlayerEvents['text-tracks-change']>;
  /**
Fired when the current captions/subtitles text track changes.
@detail textTrack
*/
  "on:text-track-change"?: EventHandler<MediaPlayerEvents['text-track-change']>;
  /**
Fired when the `viewType` property changes value. This will generally fire when the
new provider has mounted and determined what type of player view is appropriate given
the type of media it can play.
@detail viewType
*/
  "on:view-type-change"?: EventHandler<MediaPlayerEvents['view-type-change']>;
  /**
Fired when the `volume` or `muted` properties change value.
@detail volume
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event
*/
  "on:volume-change"?: EventHandler<MediaPlayerEvents['volume-change']>;
  /**
Fired when the resource was not fully loaded, but not as the result of an error.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event
*/
  "on:abort"?: EventHandler<MediaPlayerEvents['abort']>;
  /**
Fired when an autoplay attempt has successfully been made (ie: media playback has automatically
started). The event detail whether media is `muted` before any attempts are made.
undefined
*/
  "on:autoplay"?: EventHandler<MediaPlayerEvents['autoplay']>;
  /**
Fired when the player is manually destroyed by calling the `destroy()` method.
undefined
*/
  "on:destroy"?: EventHandler<MediaPlayerEvents['destroy']>;
  /**
Fired when the media has become empty.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event
*/
  "on:emptied"?: EventHandler<MediaPlayerEvents['emptied']>;
  /**
Fired each time media playback has reached the end. This is fired even if the
`loop` property is `true`, which is generally when you'd reach for this event over the
`MediaEndedEvent` if you want to be notified of media looping.
undefined
*/
  "on:end"?: EventHandler<MediaPlayerEvents['end']>;
  /**
Fired when playback or streaming has stopped because the end of the media was reached or
because no further data is available. This is not fired if playback will start from the
beginning again due to the `loop` property being `true` (see `MediaReplayEvent`
and `MediaEndEvent`).
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
*/
  "on:ended"?: EventHandler<MediaPlayerEvents['ended']>;
  /**
Fired when media loading or playback has encountered any issues (for example, a network
connectivity problem). The event detail contains a potential message containing more
information about the error (empty string if nothing available), and a code that identifies
the general type of error that occurred.
@see https://html.spec.whatwg.org/multipage/media.html#error-codes
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event
*/
  "on:error"?: EventHandler<MediaPlayerEvents['error']>;
  /**
Fired when a request to `pause` an activity is handled and the activity has entered its
`paused` state, most commonly after the media has been paused through a call to the
`pause()` method.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event
*/
  "on:pause"?: EventHandler<MediaPlayerEvents['pause']>;
  /**
Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
method, or the `autoplay` attribute.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event
*/
  "on:play"?: EventHandler<MediaPlayerEvents['play']>;
  /**
Fired when playback is ready to start after having been paused or delayed due to lack of data.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event
*/
  "on:playing"?: EventHandler<MediaPlayerEvents['playing']>;
  /**
Fired periodically as the browser loads a resource.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event
@detail progress
*/
  "on:progress"?: EventHandler<MediaPlayerEvents['progress']>;
  /**
Fired when media playback starts again after being in an `ended` state. This is fired
when the `loop` property is `true` and media loops, whereas the `play` event is not.
undefined
*/
  "on:replay"?: EventHandler<MediaPlayerEvents['replay']>;
  /**
Fired when a seek operation completed, the current playback position has changed, and the
`seeking` property is changed to `false`.
@detail currentTime
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event
*/
  "on:seeked"?: EventHandler<MediaPlayerEvents['seeked']>;
  /**
Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
media is seeking to a new position.
@detail currentTime
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event
*/
  "on:seeking"?: EventHandler<MediaPlayerEvents['seeking']>;
  /**
Fired when the user agent is trying to fetch media data, but data is unexpectedly not
forthcoming.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event
*/
  "on:stalled"?: EventHandler<MediaPlayerEvents['stalled']>;
  /**
Fired when media playback has just started, in other words the at the moment the following
happens: `currentTime > 0`.
undefined
*/
  "on:started"?: EventHandler<MediaPlayerEvents['started']>;
  /**
Fired when media data loading has been suspended.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event
*/
  "on:suspend"?: EventHandler<MediaPlayerEvents['suspend']>;
  /**
Fired when playback has stopped because of a temporary lack of data.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event
*/
  "on:waiting"?: EventHandler<MediaPlayerEvents['waiting']>;
  /**
Fired when requesting to change the current audio track to the given index in the
`AudioTrackList` on the player.
undefined
*/
  "on:media-audio-track-change-request"?: EventHandler<MediaPlayerEvents['media-audio-track-change-request']>;
  /**
Fired when requesting media to enter fullscreen. The event `detail` can specify the
fullscreen target, which can be the media or provider (defaults to `prefer-media`).
undefined
*/
  "on:media-enter-fullscreen-request"?: EventHandler<MediaPlayerEvents['media-enter-fullscreen-request']>;
  /**
Fired when requesting media to exit fullscreen. The event `detail` can specify the fullscreen
target, which can be the media or provider (defaults to `prefer-media`).
undefined
*/
  "on:media-exit-fullscreen-request"?: EventHandler<MediaPlayerEvents['media-exit-fullscreen-request']>;
  /**
Fired when requesting media to enter picture-in-picture mode.
undefined
*/
  "on:media-enter-pip-request"?: EventHandler<MediaPlayerEvents['media-enter-pip-request']>;
  /**
Fired when requesting media to exit picture-in-picture mode.
undefined
*/
  "on:media-exit-pip-request"?: EventHandler<MediaPlayerEvents['media-exit-pip-request']>;
  /**
Fired when requesting media to seek to the live edge (i.e., set the current time to the current
live time).
undefined
*/
  "on:media-live-edge-request"?: EventHandler<MediaPlayerEvents['media-live-edge-request']>;
  /**
Internal event that is fired by a media provider when requesting media playback to restart after
reaching the end. This event also helps notify the player that media will be looping.
undefined
*/
  "on:media-loop-request"?: EventHandler<MediaPlayerEvents['media-loop-request']>;
  /**
Fired when requesting the media to be muted.
undefined
*/
  "on:media-mute-request"?: EventHandler<MediaPlayerEvents['media-mute-request']>;
  /**
Fired when requesting media playback to temporarily stop.
undefined
*/
  "on:media-pause-request"?: EventHandler<MediaPlayerEvents['media-pause-request']>;
  /**
Fired when controls visibility tracking should pause. This is typically used when a control
is being actively interacted with, and we don't want the controls to be hidden before
the interaction is complete (eg: scrubbing, or settings is open).
undefined
*/
  "on:media-pause-controls-request"?: EventHandler<MediaPlayerEvents['media-pause-controls-request']>;
  /**
Fired when requesting media playback to begin/resume.
undefined
*/
  "on:media-play-request"?: EventHandler<MediaPlayerEvents['media-play-request']>;
  /**
Fired when requesting to change the current video quality to the given index in the
`VideoQualityList` on the player.
@detail qualityIndex
*/
  "on:media-quality-change-request"?: EventHandler<MediaPlayerEvents['media-quality-change-request']>;
  /**
Fired when requesting to change the current playback rate.
@detail rate
*/
  "on:media-rate-change-request"?: EventHandler<MediaPlayerEvents['media-rate-change-request']>;
  /**
Fired when controls visibility tracking may resume. This is typically called after requesting
tracking to pause via `media-pause-controls-request`.
undefined
*/
  "on:media-resume-controls-request"?: EventHandler<MediaPlayerEvents['media-resume-controls-request']>;
  /**
Fired when requesting a time change. In other words, moving the play head to a new position.
@detail seekTo
*/
  "on:media-seek-request"?: EventHandler<MediaPlayerEvents['media-seek-request']>;
  /**
Fired when seeking/scrubbing to a new playback position.
@detail time
*/
  "on:media-seeking-request"?: EventHandler<MediaPlayerEvents['media-seeking-request']>;
  /**
Fired when requesting media to begin loading. This will only take effect if the `loading`
strategy on the provider is set to `custom`.
undefined
*/
  "on:media-start-loading"?: EventHandler<MediaPlayerEvents['media-start-loading']>;
  /**
Fired when requesting to change the `mode` on a text track at the given index in the
`TextTrackList` on the player.
undefined
*/
  "on:media-text-track-change-request"?: EventHandler<MediaPlayerEvents['media-text-track-change-request']>;
  /**
Fired when requesting the media to be unmuted.
undefined
*/
  "on:media-unmute-request"?: EventHandler<MediaPlayerEvents['media-unmute-request']>;
  /**
Fired when requesting the media volume to be set to a new level.
@detail volume
*/
  "on:media-volume-change-request"?: EventHandler<MediaPlayerEvents['media-volume-change-request']>;
  "on:vds-log"?: EventHandler<MediaPlayerEvents['vds-log']>;
  /**
Fired when the video presentation mode changes. Only available in Safari.
@detail mode
*/
  "on:video-presentation-change"?: EventHandler<MediaPlayerEvents['video-presentation-change']>;
  /**
Fired when the browser begins downloading the `hls.js` library.
undefined
*/
  "on:hls-lib-load-start"?: EventHandler<MediaPlayerEvents['hls-lib-load-start']>;
  /**
Fired when the `hls.js` library has been loaded.
@detail constructor
*/
  "on:hls-lib-loaded"?: EventHandler<MediaPlayerEvents['hls-lib-loaded']>;
  /**
Fired when the `hls.js` library fails during the download process.
@detail error
*/
  "on:hls-lib-load-error"?: EventHandler<MediaPlayerEvents['hls-lib-load-error']>;
  /**
Fired when the `hls.js` instance is built. This will not fire if the browser does not
support `hls.js`.
@detail instance
*/
  "on:hls-instance"?: EventHandler<MediaPlayerEvents['hls-instance']>;
  /**
Fired when the browser doesn't support HLS natively, _and_ `hls.js` doesn't support
this environment either, most likely due to missing Media Extensions or video codecs.
undefined
*/
  "on:hls-unsupported"?: EventHandler<MediaPlayerEvents['hls-unsupported']>;
  /**
Fired before `MediaSource` begins attaching to the media element.
@detail data
*/
  "on:hls-media-attaching"?: EventHandler<MediaPlayerEvents['hls-media-attaching']>;
  /**
Fired when `MediaSource` has been successfully attached to the media element.
@detail data
*/
  "on:hls-media-attached"?: EventHandler<MediaPlayerEvents['hls-media-attached']>;
  /**
Fired before detaching `MediaSource` from the media element.
undefined
*/
  "on:hls-media-detaching"?: EventHandler<MediaPlayerEvents['hls-media-detaching']>;
  /**
Fired when `MediaSource` has been detached from media element.
undefined
*/
  "on:hls-media-detached"?: EventHandler<MediaPlayerEvents['hls-media-detached']>;
  /**
Fired when we buffer is going to be reset.
undefined
*/
  "on:hls-buffer-reset"?: EventHandler<MediaPlayerEvents['hls-buffer-reset']>;
  /**
Fired when we know about the codecs that we need buffers for to push into.
@detail data
*/
  "on:hls-buffer-codecs"?: EventHandler<MediaPlayerEvents['hls-buffer-codecs']>;
  /**
Fired when `SourceBuffer`'s have been created.
@detail data
*/
  "on:hls-buffer-created"?: EventHandler<MediaPlayerEvents['hls-buffer-created']>;
  /**
Fired when we begin appending a media segment to the buffer.
@detail data
*/
  "on:hls-buffer-appending"?: EventHandler<MediaPlayerEvents['hls-buffer-appending']>;
  /**
Fired when we are done with appending a media segment to the buffer.
@detail data
*/
  "on:hls-buffer-appended"?: EventHandler<MediaPlayerEvents['hls-buffer-appended']>;
  /**
Fired when the stream is finished and we want to notify the media buffer that there will be no
more data.
@detail data
*/
  "on:hls-buffer-eos"?: EventHandler<MediaPlayerEvents['hls-buffer-eos']>;
  /**
Fired when the media buffer should be flushed.
@detail data
*/
  "on:hls-buffer-flushing"?: EventHandler<MediaPlayerEvents['hls-buffer-flushing']>;
  /**
Fired when the media buffer has been flushed.
@detail data
*/
  "on:hls-buffer-flushed"?: EventHandler<MediaPlayerEvents['hls-buffer-flushed']>;
  /**
Fired to signal that manifest loading is starting.
@detail data
*/
  "on:hls-manifest-loading"?: EventHandler<MediaPlayerEvents['hls-manifest-loading']>;
  /**
Fired after the manifest has been loaded.
@detail data
*/
  "on:hls-manifest-loaded"?: EventHandler<MediaPlayerEvents['hls-manifest-loaded']>;
  /**
Fired after manifest has been parsed.
@detail data
*/
  "on:hls-manifest-parsed"?: EventHandler<MediaPlayerEvents['hls-manifest-parsed']>;
  /**
Fired when a level switch is requested.
@detail data
*/
  "on:hls-level-switching"?: EventHandler<MediaPlayerEvents['hls-level-switching']>;
  /**
Fired when a level switch is effective.
@detail data
*/
  "on:hls-level-switched"?: EventHandler<MediaPlayerEvents['hls-level-switched']>;
  /**
Fired when a level playlist loading starts.
@detail data
*/
  "on:hls-level-loading"?: EventHandler<MediaPlayerEvents['hls-level-loading']>;
  /**
Fired when a level playlist loading finishes.
@detail data
*/
  "on:hls-level-loaded"?: EventHandler<MediaPlayerEvents['hls-level-loaded']>;
  /**
Fired when a level's details have been updated based on previous details, after it has been
loaded.
@detail data
*/
  "on:hls-level-updated"?: EventHandler<MediaPlayerEvents['hls-level-updated']>;
  /**
Fired when a level's PTS information has been updated after parsing a fragment.
@detail data
*/
  "on:hls-level-pts-updated"?: EventHandler<MediaPlayerEvents['hls-level-pts-updated']>;
  /**
Fired when a level is removed after calling `removeLevel()`.
@detail data
*/
  "on:hls-levels-updated"?: EventHandler<MediaPlayerEvents['hls-levels-updated']>;
  /**
Fired to notify that the audio track list has been updated.
@detail data
*/
  "on:hls-audio-tracks-updated"?: EventHandler<MediaPlayerEvents['hls-audio-tracks-updated']>;
  /**
Fired when an audio track switching is requested.
@detail data
*/
  "on:hls-audio-track-switching"?: EventHandler<MediaPlayerEvents['hls-audio-track-switching']>;
  /**
Fired when an audio track switch actually occurs.
@detail data
*/
  "on:hls-audio-track-switched"?: EventHandler<MediaPlayerEvents['hls-audio-track-switched']>;
  /**
Fired when loading an audio track starts.
@detail data
*/
  "on:hls-audio-track-loading"?: EventHandler<MediaPlayerEvents['hls-audio-track-loading']>;
  /**
Fired when loading an audio track finishes.
@detail data
*/
  "on:hls-audio-track-loaded"?: EventHandler<MediaPlayerEvents['hls-audio-track-loaded']>;
  /**
Fired to notify that the subtitle track list has been updated.
@detail data
*/
  "on:hls-subtitle-tracks-updated"?: EventHandler<MediaPlayerEvents['hls-subtitle-tracks-updated']>;
  /**
Fired to notify that subtitle tracks were cleared as a result of stopping the media.
undefined
*/
  "on:hls-subtitle-tracks-cleared"?: EventHandler<MediaPlayerEvents['hls-subtitle-tracks-cleared']>;
  /**
Fired when a subtitle track switch occurs.
@detail data
*/
  "on:hls-subtitle-track-switch"?: EventHandler<MediaPlayerEvents['hls-subtitle-track-switch']>;
  /**
Fired when loading a subtitle track starts.
@detail data
*/
  "on:hls-subtitle-track-loading"?: EventHandler<MediaPlayerEvents['hls-subtitle-track-loading']>;
  /**
Fired when loading a subtitle track finishes.
@detail data
*/
  "on:hls-subtitle-track-loaded"?: EventHandler<MediaPlayerEvents['hls-subtitle-track-loaded']>;
  /**
Fired when a subtitle fragment has been processed.
@detail data
*/
  "on:hls-subtitle-frag-processed"?: EventHandler<MediaPlayerEvents['hls-subtitle-frag-processed']>;
  /**
Fired when a set of `VTTCue`'s to be managed externally has been parsed.
@detail data
*/
  "on:hls-cues-parsed"?: EventHandler<MediaPlayerEvents['hls-cues-parsed']>;
  /**
Fired when a text track to be managed externally is found.
@detail data
*/
  "on:hls-non-native-text-tracks-found"?: EventHandler<MediaPlayerEvents['hls-non-native-text-tracks-found']>;
  /**
Fired when the first timestamp is found.
@detail data
*/
  "on:hls-init-pts-found"?: EventHandler<MediaPlayerEvents['hls-init-pts-found']>;
  /**
Fired when loading a fragment starts.
@detail data
*/
  "on:hls-frag-loading"?: EventHandler<MediaPlayerEvents['hls-frag-loading']>;
  /**
Fired when fragment loading is aborted for emergency switch down.
@detail data
*/
  "on:hls-frag-load-emergency-aborted"?: EventHandler<MediaPlayerEvents['hls-frag-load-emergency-aborted']>;
  /**
Fired when fragment loading is completed.
@detail data
*/
  "on:hls-frag-loaded"?: EventHandler<MediaPlayerEvents['hls-frag-loaded']>;
  /**
Fired when a fragment has finished decrypting.
@detail data
*/
  "on:hls-frag-decrypted"?: EventHandler<MediaPlayerEvents['hls-frag-decrypted']>;
  /**
Fired when `InitSegment` has been extracted from a fragment.
@detail data
*/
  "on:hls-frag-parsing-init-segment"?: EventHandler<MediaPlayerEvents['hls-frag-parsing-init-segment']>;
  /**
Fired when parsing sei text is completed.
@detail data
*/
  "on:hls-frag-parsing-userdata"?: EventHandler<MediaPlayerEvents['hls-frag-parsing-userdata']>;
  /**
Fired when parsing id3 is completed.
@detail data
*/
  "on:hls-frag-parsing-metadata"?: EventHandler<MediaPlayerEvents['hls-frag-parsing-metadata']>;
  /**
Fired when fragment parsing is completed.
@detail data
*/
  "on:hls-frag-parsed"?: EventHandler<MediaPlayerEvents['hls-frag-parsed']>;
  /**
Fired when fragment remuxed MP4 boxes have all been appended into `SourceBuffer`.
@detail data
*/
  "on:hls-frag-buffered-data"?: EventHandler<MediaPlayerEvents['hls-frag-buffered-data']>;
  /**
Fired when fragment matching with current media position is changing.
@detail data
*/
  "on:hls-frag-changed"?: EventHandler<MediaPlayerEvents['hls-frag-changed']>;
  /**
Fired when a FPS drop is identified.
@detail data
*/
  "on:hls-fps-drop"?: EventHandler<MediaPlayerEvents['hls-fps-drop']>;
  /**
Fired when FPS drop triggers auto level capping.
@detail data
*/
  "on:hls-fps-drop-level-capping"?: EventHandler<MediaPlayerEvents['hls-fps-drop-level-capping']>;
  /**
Fired when an error has occurred during loading or playback.
@detail data
*/
  "on:hls-error"?: EventHandler<MediaPlayerEvents['hls-error']>;
  /**
Fired when the `hls.js` instance is being destroyed. Different from `hls-media-detached` as
one could want to detach, and reattach media to the `hls.js` instance to handle mid-rolls.
undefined
*/
  "on:hls-destroying"?: EventHandler<MediaPlayerEvents['hls-destroying']>;
  /**
Fired when a decrypt key loading starts.
@detail data
*/
  "on:hls-key-loading"?: EventHandler<MediaPlayerEvents['hls-key-loading']>;
  /**
Fired when a decrypt key has been loaded.
@detail data
*/
  "on:hls-key-loaded"?: EventHandler<MediaPlayerEvents['hls-key-loaded']>;
  /**
Fired when the back buffer is reached as defined by the `backBufferLength` config option.
@detail data
*/
  "on:hls-back-buffer-reached"?: EventHandler<MediaPlayerEvents['hls-back-buffer-reached']>;
}

/**********************************************************************************************
* MediaPoster
/**********************************************************************************************/


export interface MediaPosterAttributes extends Partial<PosterProps>, Omit<JSX.HTMLAttributes<MediaPosterElement>, keyof PosterProps | "is"> {
}


/**********************************************************************************************
* MediaProvider
/**********************************************************************************************/


export interface MediaProviderAttributes extends Partial<MediaProviderProps>, Omit<JSX.HTMLAttributes<MediaProviderElement>, keyof MediaProviderProps | "is"> {
}


/**********************************************************************************************
* MediaSliderChapters
/**********************************************************************************************/


export interface MediaSliderChaptersAttributes extends Partial<SliderChaptersProps>, Omit<JSX.HTMLAttributes<MediaSliderChaptersElement>, keyof SliderChaptersProps | "is"> {
}


/**********************************************************************************************
* MediaSlider
/**********************************************************************************************/


export interface MediaSliderAttributes extends Partial<SliderProps>, MediaSliderEventAttributes, Omit<JSX.HTMLAttributes<MediaSliderElement>, keyof SliderProps | keyof MediaSliderEventAttributes | "is"> {
}

export interface MediaSliderEventAttributes {
  /**
Fired when the user begins interacting with the slider and dragging the thumb. The event
detail contains the current value the drag is starting at.
@detail value
*/
  "on:drag-start"?: EventHandler<SliderEvents['drag-start']>;
  /**
Fired when the user stops dragging the slider thumb. The event detail contains the value
the drag is ending at.
@detail value
*/
  "on:drag-end"?: EventHandler<SliderEvents['drag-end']>;
  /**
Fired when the slider value changes. The event detail contains the current value.
@detail value
*/
  "on:value-change"?: EventHandler<SliderEvents['value-change']>;
  /**
Fired when the slider drag value changes. The drag value indicates the last slider value that
the user has dragged to. The event detail contains the value.
@detail value
*/
  "on:drag-value-change"?: EventHandler<SliderEvents['drag-value-change']>;
  /**
Fired when the device pointer is inside the slider region and it's position changes. The
event detail contains the preview value. Do note, this includes touch, mouse, and keyboard
devices.
@detail pointerValue
*/
  "on:pointer-value-change"?: EventHandler<SliderEvents['pointer-value-change']>;
}

/**********************************************************************************************
* MediaSliderPreview
/**********************************************************************************************/


export interface MediaSliderPreviewAttributes extends Partial<SliderPreviewProps>, Omit<JSX.HTMLAttributes<MediaSliderPreviewElement>, keyof SliderPreviewProps | "is"> {
}


/**********************************************************************************************
* MediaSliderThumbnail
/**********************************************************************************************/


export interface MediaSliderThumbnailAttributes extends Partial<ThumbnailProps>, Omit<JSX.HTMLAttributes<MediaSliderThumbnailElement>, keyof ThumbnailProps | "is"> {
}


/**********************************************************************************************
* MediaSliderValue
/**********************************************************************************************/


export interface MediaSliderValueAttributes extends Partial<SliderValueProps>, Omit<JSX.HTMLAttributes<MediaSliderValueElement>, keyof SliderValueProps | "is"> {
}


/**********************************************************************************************
* MediaSliderVideo
/**********************************************************************************************/


export interface MediaSliderVideoAttributes extends Partial<SliderVideoProps>, MediaSliderVideoEventAttributes, Omit<JSX.HTMLAttributes<MediaSliderVideoElement>, keyof SliderVideoProps | keyof MediaSliderVideoEventAttributes | "is"> {
}

export interface MediaSliderVideoEventAttributes {
  /**
Fired when the user agent can play the media, but estimates that **not enough** data has been
loaded to play the media up to its end without having to stop for further buffering of content.
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
*/
  "on:can-play"?: EventHandler<SliderVideoEvents['can-play']>;
  /**
Fired when media loading or playback has encountered any issues (for example, a network
connectivity problem). The event detail contains a potential message containing more
information about the error (empty string if nothing available), and a code that identifies
the general type of error that occurred.
@see https://html.spec.whatwg.org/multipage/media.html#error-codes
@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event
*/
  "on:error"?: EventHandler<SliderVideoEvents['error']>;
}

/**********************************************************************************************
* MediaTimeSlider
/**********************************************************************************************/


export interface MediaTimeSliderAttributes extends Partial<TimeSliderProps>, MediaTimeSliderEventAttributes, Omit<JSX.HTMLAttributes<MediaTimeSliderElement>, keyof TimeSliderProps | keyof MediaTimeSliderEventAttributes | "is"> {
}

export interface MediaTimeSliderEventAttributes {
  /**
Fired when the user begins interacting with the slider and dragging the thumb. The event
detail contains the current value the drag is starting at.
@detail value
*/
  "on:drag-start"?: EventHandler<SliderEvents['drag-start']>;
  /**
Fired when the user stops dragging the slider thumb. The event detail contains the value
the drag is ending at.
@detail value
*/
  "on:drag-end"?: EventHandler<SliderEvents['drag-end']>;
  /**
Fired when the slider value changes. The event detail contains the current value.
@detail value
*/
  "on:value-change"?: EventHandler<SliderEvents['value-change']>;
  /**
Fired when the slider drag value changes. The drag value indicates the last slider value that
the user has dragged to. The event detail contains the value.
@detail value
*/
  "on:drag-value-change"?: EventHandler<SliderEvents['drag-value-change']>;
  /**
Fired when the device pointer is inside the slider region and it's position changes. The
event detail contains the preview value. Do note, this includes touch, mouse, and keyboard
devices.
@detail pointerValue
*/
  "on:pointer-value-change"?: EventHandler<SliderEvents['pointer-value-change']>;
}

/**********************************************************************************************
* MediaVolumeSlider
/**********************************************************************************************/


export interface MediaVolumeSliderAttributes extends Partial<VolumeSliderProps>, MediaVolumeSliderEventAttributes, Omit<JSX.HTMLAttributes<MediaVolumeSliderElement>, keyof VolumeSliderProps | keyof MediaVolumeSliderEventAttributes | "is"> {
}

export interface MediaVolumeSliderEventAttributes {
  /**
Fired when the user begins interacting with the slider and dragging the thumb. The event
detail contains the current value the drag is starting at.
@detail value
*/
  "on:drag-start"?: EventHandler<SliderEvents['drag-start']>;
  /**
Fired when the user stops dragging the slider thumb. The event detail contains the value
the drag is ending at.
@detail value
*/
  "on:drag-end"?: EventHandler<SliderEvents['drag-end']>;
  /**
Fired when the slider value changes. The event detail contains the current value.
@detail value
*/
  "on:value-change"?: EventHandler<SliderEvents['value-change']>;
  /**
Fired when the slider drag value changes. The drag value indicates the last slider value that
the user has dragged to. The event detail contains the value.
@detail value
*/
  "on:drag-value-change"?: EventHandler<SliderEvents['drag-value-change']>;
  /**
Fired when the device pointer is inside the slider region and it's position changes. The
event detail contains the preview value. Do note, this includes touch, mouse, and keyboard
devices.
@detail pointerValue
*/
  "on:pointer-value-change"?: EventHandler<SliderEvents['pointer-value-change']>;
}

/**********************************************************************************************
* MediaThumbnail
/**********************************************************************************************/


export interface MediaThumbnailAttributes extends Partial<ThumbnailProps>, Omit<JSX.HTMLAttributes<MediaThumbnailElement>, keyof ThumbnailProps | "is"> {
}


/**********************************************************************************************
* MediaTime
/**********************************************************************************************/


export interface MediaTimeAttributes extends Partial<TimeProps>, Omit<JSX.HTMLAttributes<MediaTimeElement>, keyof TimeProps | "is"> {
}


/**********************************************************************************************
* MediaTooltipContent
/**********************************************************************************************/


export interface MediaTooltipContentAttributes extends Partial<TooltipContentProps>, Omit<JSX.HTMLAttributes<MediaTooltipContentElement>, keyof TooltipContentProps | "is"> {
}


/**********************************************************************************************
* MediaTooltip
/**********************************************************************************************/


export interface MediaTooltipAttributes extends Partial<TooltipProps>, Omit<JSX.HTMLAttributes<MediaTooltipElement>, keyof TooltipProps | "is"> {
}


/**********************************************************************************************
* MediaTooltipTrigger
/**********************************************************************************************/


export interface MediaTooltipTriggerAttributes extends Omit<JSX.HTMLAttributes<MediaTooltipTriggerElement>, "is"> {
}

