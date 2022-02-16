// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-hls-player.ts';
import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import { HlsPlayerElement } from '../../players/hls';

const EVENTS = {
  /**
Fired when the resource was not fully loaded, but not as the result of an error.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event
*/
  onAbort: 'vds-abort',
  /**
Fired when autoplay attempts are about to start. The event detail whether media is `muted`
before any attempts are made.
*/
  onAutoplay: 'vds-autoplay',
  /**
Fired when an autoplay attempt is about to be made. The event detail contains the
attempt count, and whether media is `muted` for this attempt.
*/
  onAutoplayAttempt: 'vds-autoplay-attempt',
  /**
Fired when the `autoplay` property has changed value.
*/
  onAutoplayChange: 'vds-autoplay-change',
  /**
Fired when an autoplay attempt has failed. The event detail contains the error that
had occurred on the last autoplay attempt which caused it to fail.
*/
  onAutoplayFail: 'vds-autoplay-fail',
  /**
Fired when the provider can begin loading media. This depends on the type of `loading`
that has been configured. The `eager` strategy will be immediate, and `lazy` once the provider
has entered the viewport.
*/
  onCanLoad: 'vds-can-load',
  /**
Fired when the user agent can play the media, but estimates that **not enough** data has been
loaded to play the media up to its end without having to stop for further buffering of content.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
*/
  onCanPlay: 'vds-can-play',
  /**
Fired when the user agent can play the media, and estimates that **enough** data has been
loaded to play the media up to its end without having to stop for further buffering of content.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
*/
  onCanPlayThrough: 'vds-can-play-through',
  /**
Fired when the `controls` property has changed value.
*/
  onControlsChange: 'vds-controls-change',
  /**
Fired when the `duration` property changes.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event
*/
  onDurationChange: 'vds-duration-change',
  /**
Fired when the media has become empty.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event
*/
  onEmptied: 'vds-emptied',
  /**
Fired each time media playback has reached the end. This is fired even if the
`loop` property is `true`, which is generally when you'd reach for this event over the
`MediaEndedEvent` if you want to be notified of media looping.
*/
  onEnd: 'vds-end',
  /**
Fired when playback or streaming has stopped because the end of the media was reached or
because no further data is available. This is not fired if playback will start from the
beginning again due to the `loop` property being `true` (see `MediaReplayEvent`
and `MediaEndEvent`).

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
*/
  onEnded: 'vds-ended',
  /**
Fired when requesting media to enter fullscreen.
*/
  onEnterFullscreenRequest: 'vds-enter-fullscreen-request',
  /**
Fired when media loading or playback has encountered any issues (for example, a network
connectivity problem). The event detail contains a potential message containing more
information about the error (empty string if nothing available), and a code that identifies
the general type of error that occurred.

@link https://html.spec.whatwg.org/multipage/media.html#error-codes
@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event
*/
  onError: 'vds-error',
  /**
Fired when requesting media to exit fullscreen.
*/
  onExitFullscreenRequest: 'vds-exit-fullscreen-request',
  /**
Fired when an element enters/exits fullscreen. The event detail is a `boolean` indicating
if fullscreen was entered (`true`) or exited (`false`).
*/
  onFullscreenChange: 'vds-fullscreen-change',
  /**
Fired when an error occurs either entering or exiting fullscreen. This will generally occur
if the user has not interacted with the page yet.
*/
  onFullscreenError: 'vds-fullscreen-error',
  /**
Fired when fullscreen support has changed. To be clear, support does not guarantee the
fullscreen request happening, as the browser might still reject the request if it's attempted
without user interaction. The event detail is a `boolean` that indicates whether it's
supported (`true`), or not (`false`).
*/
  onFullscreenSupportChange: 'vds-fullscreen-support-change',
  /**
Fired when requesting the poster should _not_ be rendered by the media provider element. This
should be fired if a custom poster element is being used (eg: `vds-poster`).
*/
  onHidePosterRequest: 'vds-hide-poster-request',
  /**
Fired when loading an audio track finishes.
*/
  onHlsAudioTrackLoaded: 'vds-hls-audio-track-loaded',
  /**
Fired when loading an audio track starts.
*/
  onHlsAudioTrackLoading: 'vds-hls-audio-track-loading',
  /**
Fired when an audio track switch actually occurs.
*/
  onHlsAudioTrackSwitched: 'vds-hls-audio-track-switched',
  /**
Fired when an audio track switching is requested.
*/
  onHlsAudioTrackSwitching: 'vds-hls-audio-track-switching',
  /**
Fired to notify that the audio track list has been updated.
*/
  onHlsAudioTracksUpdated: 'vds-hls-audio-tracks-updated',
  /**
Fired when the back buffer is reached as defined by the `backBufferLength` config option.
*/
  onHlsBackBufferReached: 'vds-hls-back-buffer-reached',
  /**
Fired when we are done with appending a media segment to the buffer.
*/
  onHlsBufferAppended: 'vds-hls-buffer-appended',
  /**
Fired when we begin appending a media segment to the buffer.
*/
  onHlsBufferAppending: 'vds-hls-buffer-appending',
  /**
Fired when we know about the codecs that we need buffers for to push into.
*/
  onHlsBufferCodecs: 'vds-hls-buffer-codecs',
  /**
Fired when `SourceBuffer`'s have been created.
*/
  onHlsBufferCreated: 'vds-hls-buffer-created',
  /**
Fired when the stream is finished and we want to notify the media buffer that there will be no
more data.
*/
  onHlsBufferEos: 'vds-hls-buffer-eos',
  /**
Fired when the media buffer has been flushed.
*/
  onHlsBufferFlushed: 'vds-hls-buffer-flushed',
  /**
Fired when the media buffer should be flushed.
*/
  onHlsBufferFlushing: 'vds-hls-buffer-flushing',
  /**
Fired when we buffer is going to be reset.
*/
  onHlsBufferReset: 'vds-hls-buffer-reset',
  /**
Fired when a set of `VTTCue`'s to be managed externally has been parsed.
*/
  onHlsCuesParsed: 'vds-hls-cues-parsed',
  /**
Fired when the `hls.js` instance is being destroyed. Different from `vds-hls-media-detached` as
one could want to detach, and reattach media to the `hls.js` instance to handle mid-rolls.
*/
  onHlsDestroying: 'vds-hls-destroying',
  /**
Fired when an error has occured during loading or playback.
*/
  onHlsError: 'vds-hls-error',
  /**
Fired when a FPS drop is identified.
*/
  onHlsFpsDrop: 'vds-hls-fps-drop',
  /**
Fired when FPS drop triggers auto level capping.
*/
  onHlsFpsDropLevelCapping: 'vds-hls-fps-drop-level-capping',
  /**
Fired when fragment remuxed MP4 boxes have all been appended into `SourceBuffer`.
*/
  onHlsFragBufferedData: 'vds-hls-frag-buffered-data',
  /**
Fired when fragment matching with current media position is changing.
*/
  onHlsFragChanged: 'vds-hls-frag-changed',
  /**
Fired when a fragment has finished decrypting.
*/
  onHlsFragDecrypted: 'vds-hls-frag-decrypted',
  /**
Fired when fragment loading is aborted for emergency switch down.
*/
  onHlsFragLoadEmergencyAborted: 'vds-hls-frag-load-emergency-aborted',
  /**
Fired when fragment loading is completed.
*/
  onHlsFragLoaded: 'vds-hls-frag-loaded',
  /**
Fired when loading a fragment starts.
*/
  onHlsFragLoading: 'vds-hls-frag-loading',
  /**
Fired when fragment parsing is completed.
*/
  onHlsFragParsed: 'vds-hls-frag-parsed',
  /**
Fired when `InitSegment` has been extracted from a fragment.
*/
  onHlsFragParsingInitSegment: 'vds-hls-frag-parsing-init-segment',
  /**
Fired when parsing id3 is completed.
*/
  onHlsFragParsingMetadata: 'vds-hls-frag-parsing-metadata',
  /**
Fired when parsing sei text is completed.
*/
  onHlsFragParsingUserdata: 'vds-hls-frag-parsing-userdata',
  /**
Fired when the first timestamp is found.
*/
  onHlsInitPtsFound: 'vds-hls-init-pts-found',
  /**
Fired when the `hls.js` instance is built. This will not fire if the browser does not
support `hls.js`.
*/
  onHlsInstance: 'vds-hls-instance',
  /**
Fired when a decrypt key has been loaded.
*/
  onHlsKeyLoaded: 'vds-hls-key-loaded',
  /**
Fired when a decrypt key loading starts.
*/
  onHlsKeyLoading: 'vds-hls-key-loading',
  /**
Fired when a level playlist loading finishes.
*/
  onHlsLevelLoaded: 'vds-hls-level-loaded',
  /**
Fired when a level playlist loading starts.
*/
  onHlsLevelLoading: 'vds-hls-level-loading',
  /**
Fired when a level's PTS information has been updated after parsing a fragment.
*/
  onHlsLevelPtsUpdated: 'vds-hls-level-pts-updated',
  /**
Fired when a level switch is effective.
*/
  onHlsLevelSwitched: 'vds-hls-level-switched',
  /**
Fired when a level switch is requested.
*/
  onHlsLevelSwitching: 'vds-hls-level-switching',
  /**
Fired when a level's details have been updated based on previous details, after it has been
loaded.
*/
  onHlsLevelUpdated: 'vds-hls-level-updated',
  /**
Fired when a level is removed after calling `removeLevel()`.
*/
  onHlsLevelsUpdated: 'vds-hls-levels-updated',
  /**
Fired when the `hls.js` library fails during the download process.
*/
  onHlsLibLoadError: 'vds-hls-lib-load-error',
  /**
Fired when the browser begins downloading the `hls.js` library.
*/
  onHlsLibLoadStart: 'vds-hls-lib-load-start',
  /**
Fired when the `hls.js` library has been loaded.
*/
  onHlsLibLoaded: 'vds-hls-lib-loaded',
  /**
Fired after the manifest has been loaded.
*/
  onHlsManifestLoaded: 'vds-hls-manifest-loaded',
  /**
Fired to signal that manifest loading is starting.
*/
  onHlsManifestLoading: 'vds-hls-manifest-loading',
  /**
Fired after manifest has been parsed.
*/
  onHlsManifestParsed: 'vds-hls-manifest-parsed',
  /**
Fired when `MediaSource` has been successfully attached to the media element.
*/
  onHlsMediaAttached: 'vds-hls-media-attached',
  /**
Fired before `MediaSource` begins attaching to the media element.
*/
  onHlsMediaAttaching: 'vds-hls-media-attaching',
  /**
Fired when `MediaSource` has been detached from media element.
*/
  onHlsMediaDetached: 'vds-hls-media-detached',
  /**
Fired before detaching `MediaSource` from the media element.
*/
  onHlsMediaDetaching: 'vds-hls-media-detaching',
  /**
Fired when a text track to be managed externally is found.
*/
  onHlsNonNativeTextTracksFound: 'vds-hls-non-native-text-tracks-found',
  /**
Fired when a subtitle fragment has been processed.
*/
  onHlsSubtitleFragProcessed: 'vds-hls-subtitle-frag-processed',
  /**
Fired when loading a subtitle track finishes.
*/
  onHlsSubtitleTrackLoaded: 'vds-hls-subtitle-track-loaded',
  /**
Fired when loading a subtitle track starts.
*/
  onHlsSubtitleTrackLoading: 'vds-hls-subtitle-track-loading',
  /**
Fired when a subtitle track switch occurs.
*/
  onHlsSubtitleTrackSwitch: 'vds-hls-subtitle-track-switch',
  /**
Fired to notify that subtitle tracks were cleared as a result of stopping the media.
*/
  onHlsSubtitleTracksCleared: 'vds-hls-subtitle-tracks-cleared',
  /**
Fired to notify that the subtitle track list has been updated.
*/
  onHlsSubtitleTracksUpdated: 'vds-hls-subtitle-tracks-updated',
  /**
Fired when the browser doesn't support HLS natively, _and_ `hls.js` doesn't support
this environment either, most likely due to missing Media Extensions or video codecs.
*/
  onHlsUnsupported: 'vds-hls-unsupported',
  /**
Fired when the media idle state changes. Media is idle when playback is progressing (playing),
and there is no user activity for a set period of time (default is 2.5s). The event
detail contains whether media is idle (`true`), or not (`false`).
*/
  onIdleChange: 'vds-idle-change',
  /**
Fired when the browser has started to load a resource.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event
*/
  onLoadStart: 'vds-load-start',
  /**
Fired when the frame at the current playback position of the media has finished loading; often
the first frame.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event
*/
  onLoadedData: 'vds-loaded-data',
  /**
Fired when the metadata has been loaded.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event
*/
  onLoadedMetadata: 'vds-loaded-metadata',
  /**
Fired when the `loop` property has changed value.
*/
  onLoopChange: 'vds-loop-change',
  /**
Internal event that is fired by a media provider when requesting media playback to restart after
reaching the end. This event also helps notify the media controller that media will be looping.
*/
  onLoopRequest: 'vds-loop-request',
  /**
Fired when the `mediaType` property changes value.
*/
  onMediaTypeChange: 'vds-media-type-change',
  /**
Fired when requesting the media to be muted.
*/
  onMuteRequest: 'vds-mute-request',
  /**
Fired when a request to `pause` an activity is handled and the activity has entered its
`paused` state, most commonly after the media has been paused through a call to the
`pause()` method.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event
*/
  onPause: 'vds-pause',
  /**
Fired when media idle state tracking should pause. This is typically used when a control
is being actively interacted with, and we don't want the media `idle` state changing until
the interaction is complete (eg: scrubbing, or settings is open).
*/
  onPauseIdlingRequest: 'vds-pause-idling-request',
  /**
Fired when requesting media playback to temporarily stop.
*/
  onPauseRequest: 'vds-pause-request',
  /**
Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
method, or the `autoplay` attribute.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event
*/
  onPlay: 'vds-play',
  /**
Fired when an attempt to start media playback results in an error.
*/
  onPlayFail: 'vds-play-fail',
  /**
Fired when requesting media playback to begin/resume.
*/
  onPlayRequest: 'vds-play-request',
  /**
Fired when playback is ready to start after having been paused or delayed due to lack of data.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event
*/
  onPlaying: 'vds-playing',
  /**
Fired when the `playsinline` property has changed value.
*/
  onPlaysinlineChange: 'vds-playsinline-change',
  /**
Fired when the `currentPoster` property has changed value.
*/
  onPosterChange: 'vds-poster-change',
  /**
Fired periodically as the browser loads a resource.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event
*/
  onProgress: 'vds-progress',
  /**
Fired when media playback starts again after being in an `ended` state. This is fired
when the `loop` property is `true` and media loops, whereas the `vds-play` event is not.
*/
  onReplay: 'vds-replay',
  /**
Fired when media idle state tracking may resume.
*/
  onResumeIdlingRequest: 'vds-resume-idling-request',
  /**
Fired when the current screen orientation changes.
*/
  onScreenOrientationChange: 'vds-screen-orientation-change',
  /**
Fired when the current screen orientation lock changes.
*/
  onScreenOrientationLockChange: 'vds-screen-orientation-lock-change',
  /**
Fired when requesting a time change. In other words, moving the playhead to a new position.
*/
  onSeekRequest: 'vds-seek-request',
  /**
Fired when a seek operation completed, the current playback position has changed, and the
`seeking` property is changed to `false`.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event
*/
  onSeeked: 'vds-seeked',
  /**
Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
media is seeking to a new position.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event
*/
  onSeeking: 'vds-seeking',
  /**
Fired when seeking/scrubbing to a new playback position.
*/
  onSeekingRequest: 'vds-seeking-request',
  /**
Fired when requesting the poster _should_ be rendered by the media provider element. This
should be fired if a custom poster element is _not_ being used.
*/
  onShowPosterRequest: 'vds-show-poster-request',
  /**
Fired when the `currentSrc` property has changed value.
*/
  onSrcChange: 'vds-src-change',
  /**
Fired when the user agent is trying to fetch media data, but data is unexpectedly not
forthcoming.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event
*/
  onStalled: 'vds-stalled',
  /**
Fired when media playback has just started, in other words the at the moment the following
happens: `currentTime > 0`.
*/
  onStarted: 'vds-started',
  /**
Fired when media data loading has been suspended.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event
*/
  onSuspend: 'vds-suspend',
  /**
Fired when the `currentTime` property value changes due to media playback or the
user seeking.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
*/
  onTimeUpdate: 'vds-time-update',
  /**
Fired when requesting the media to be unmuted.
*/
  onUnmuteRequest: 'vds-unmute-request',
  /**
Fired when the video presentation mode changes. Only available in Safari.
*/
  onVideoPresentationChange: 'vds-video-presentation-change',
  /**
Fired when the `viewType` property changes `value`. This will generally fire when the
new provider has mounted and determined what type of player view is appropriate given
the type of media it can play.
*/
  onViewTypeChange: 'vds-view-type-change',
  /**
Fired when the `volume` or `muted` properties change value.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event
*/
  onVolumeChange: 'vds-volume-change',
  /**
Fired when requesting the media volume to be set to a new level.
*/
  onVolumeChangeRequest: 'vds-volume-change-request',
  /**
Fired when playback has stopped because of a temporary lack of data.

@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event
*/
  onWaiting: 'vds-waiting'
} as const;

export default createComponent(
  React,
  'vds-hls-player',
  HlsPlayerElement,
  EVENTS,
  'HlsPlayer'
);
