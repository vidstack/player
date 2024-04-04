import type DASH from 'dashjs';
import type { DOMEvent } from 'maverick.js/std';

import type { MediaPlayer } from '../../components/player';

export interface DASHProviderEvents {
  'dash-lib-load-start': DASHLibLoadStartEvent;
  'dash-lib-loaded': DASHLibLoadedEvent;
  'dash-lib-load-error': DASHLibLoadErrorEvent;
  'dash-instance': DASHInstanceEvent;
  'dash-unsupported': DASHUnsupportedEvent;
  // re-dispatched `dash.js` events below
  'dash-ast-in-future': DASHAstInFutureEvent;
  'dash-base-urls-updated': DASHBaseUrlsUpdatedEvent;
  'dash-buffer-empty': DASHBufferStalledEvent;
  'dash-buffer-loaded': DASHBufferLoadedEvent;
  'dash-buffer-level-state-changed': DASHBufferStateChangedEvent;
  'dash-buffer-level-updated': DASHBufferLevelUpdatedEvent;
  'dash-dvb-font-download-added': DASHDvbFontDownloadAddedEvent;
  'dash-dvb-font-download-complete': DASHDvbFontDownloadCompleteEvent;
  'dash-dvb-font-download-failed': DASHDvbFontDownloadFailedEvent;
  'dash-dynamic-to-static': DASHDynamicToStaticEvent;
  'dash-error': DASHErrorEvent;
  'dash-fragment-loading-completed': DASHFragmentLoadingCompletedEvent;
  'dash-fragment-loading-progress': DASHFragmentLoadingProgressEvent;
  'dash-fragment-loading-started': DASHFragmentLoadingStartedEvent;
  'dash-fragment-loading-abandoned': DASHFragmentLoadingAbandonedEvent;
  'dash-log': DASHLogEvent;
  'dash-manifest-loading-started': DASHManifestLoadingStartedEvent;
  'dash-manifest-loading-finished': DASHManifestLoadingFinishedEvent;
  'dash-manifest-loaded': DASHManifestLoadedEvent;
  'dash-metrics-changed': DASHMetricsChangedEvent;
  'dash-metric-changed': DASHMetricChangedEvent;
  'dash-metric-added': DASHMetricAddedEvent;
  'dash-metric-updated': DASHMetricUpdatedEvent;
  'dash-period-switch-started': DASHPeriodSwitchStartedEvent;
  'dash-period-switch-completed': DASHPeriodSwitchCompletedEvent;
  'dash-quality-change-requested': DASHQualityChangeRequestedEvent;
  'dash-quality-change-rendered': DASHQualityChangeRenderedEvent;
  'dash-track-change-rendered': DASHTrackChangeRenderedEvent;
  'dash-stream-initializing': DASHStreamInitializingEvent;
  'dash-stream-updated': DASHStreamUpdatedEvent;
  'dash-stream-activated': DASHStreamActivatedEvent;
  'dash-stream-deactivated': DASHStreamDeactivatedEvent;
  'dash-stream-initialized': DASHStreamInitializedEvent;
  'dash-stream-teardown-complete': DASHStreamTeardownCompleteEvent;
  'dash-text-tracks-added': DASHAllTextTracksAddedEvent;
  'dash-text-track-added': DASHTextTrackAddedEvent;
  'dash-cue-enter': DASHCueEnterEvent;
  'dash-cue-exit': DASHCueExitEvent;
  'dash-throughput-measurement-stored': DASHThroughputMeasurementStoredEvent;
  'dash-ttml-parsed': DASHTtmlParsedEvent;
  'dash-ttml-to-parse': DASHTtmlToParseEvent;
  'dash-caption-rendered': DASHCaptionRenderedEvent;
  'dash-caption-container-resize': DASHCaptionContainerResizeEvent;
  'dash-can-play': DASHCanPlayEvent;
  'dash-can-play-through': DASHCanPlayThroughEvent;
  'dash-playback-ended': DASHPlaybackEndedEvent;
  'dash-playback-error': DASHPlaybackErrorEvent;
  'dash-playback-not-allowed': DASHPlaybackNotAllowedEvent;
  'dash-playback-metadata-loaded': DASHPlaybackMetaDataLoadedEvent;
  'dash-playback-loaded-data': DASHPlaybackLoadedDataEvent;
  'dash-playback-paused': DASHPlaybackPausedEvent;
  'dash-playback-playing': DASHPlaybackPlayingEvent;
  'dash-playback-progress': DASHPlaybackProgressEvent;
  'dash-playback-rate-changed': DASHPlaybackRateChangedEvent;
  'dash-playback-seeked': DASHPlaybackSeekedEvent;
  'dash-playback-seeking': DASHPlaybackSeekingEvent;
  'dash-playback-stalled': DASHPlaybackStalledEvent;
  'dash-playback-started': DASHPlaybackStartedEvent;
  'dash-playback-time-updated': DASHPlaybackTimeUpdatedEvent;
  'dash-playback-volume-changed': DASHPlaybackVolumeChangedEvent;
  'dash-playback-waiting': DASHPlaybackWaitingEvent;
  'dash-manifest-validity-changed': DASHManifestValidityChangedEvent;
  'dash-event-mode-on-start': DASHEventModeOnStartEvent;
  'dash-event-mode-on-receive': DASHEventModeOnReceiveEvent;
  'dash-conformance-violation': DASHConformanceViolationEvent;
  'dash-representation-switch': DASHRepresentationSwitchEvent;
  'dash-adaptation-set-removed-no-capabilities': DASHAdaptationSetRemovedNoCapabilitiesEvent;
  'dash-content-steering-request-completed': DASHContentSteeringRequestCompletedEvent;
  'dash-inband-prft': DASHInbandPrftEvent;
  'dash-managed-media-source-start-streaming': DASHManagedMediaSourceStartStreamingEvent;
  'dash-managed-media-source-end-streaming': DASHManagedMediaSourceEndStreamingEvent;
}

export interface DASHMediaEvent<DetailType = unknown> extends DOMEvent<DetailType> {
  target: MediaPlayer;
}

/**
 * Fired when the browser begins downloading the `dash.js` library.
 */
export interface DASHLibLoadStartEvent extends DASHMediaEvent<void> {}

/**
 * Fired when the `dash.js` library has been loaded.
 *
 * @detail constructor
 */
export interface DASHLibLoadedEvent extends DASHMediaEvent<typeof DASH.MediaPlayer> {}

/**
 * Fired when the `dash.js` library fails during the download process.
 *
 * @detail error
 */
export interface DASHLibLoadErrorEvent extends DASHMediaEvent<Error> {}

/**
 * Fired when the `dash.js` instance is built. This will not fire if the browser does not
 * support `DASH.js`.
 *
 * @detail instance
 */
export interface DASHInstanceEvent extends DASHMediaEvent<DASH.MediaPlayerClass> {}

/**
 * Fired when the browser doesn't support DASH natively, _and_ `dash.js` doesn't support
 * this environment either, most likely due to missing Media Extensions or video codecs.
 */
export interface DASHUnsupportedEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when playback will not start yet as the MPD's `availabilityStartTime` is in the future.
 * Check delay property in payload to determine time before playback will start.
 *
 * @detail data
 */
export interface DASHAstInFutureEvent extends DASHMediaEvent<DASH.AstInFutureEvent> {}

/**
 * Triggered when the `BaseURL` have been updated.
 */
export interface DASHBaseUrlsUpdatedEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when the video element's buffer state changes to `stalled`. Check `mediaType` in
 * payload to determine type (Video, Audio, FragmentedText).
 */
export interface DASHBufferStalledEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when the video element's buffer state changes to `loaded`. Check `mediaType` in payload
 * to determine type (Video, Audio, FragmentedText).
 *
 * @detail data
 */
export interface DASHBufferLoadedEvent extends DASHMediaEvent<DASH.BufferEvent> {}

/**
 * Triggered when the video element's buffer state changes, either stalled or loaded. Check
 * payload for state.
 *
 * @detail data
 */
export interface DASHBufferStateChangedEvent extends DASHMediaEvent<DASH.BufferStateChangedEvent> {}

/**
 * Triggered when the buffer level of a media type has been updated.
 */
export interface DASHBufferLevelUpdatedEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when a font signalled by a DVB Font Download has been added to the document `ntFaceSet`
 * interface.
 *
 * @detail data
 */
export interface DASHDvbFontDownloadAddedEvent extends DASHMediaEvent<DASH.dvbFontDownloadAdded> {}

/**
 * Triggered when a font signalled by a DVB Font Download has successfully downloaded and the
 * `ntFace` can be used.
 *
 * @detail data
 */
export interface DASHDvbFontDownloadCompleteEvent
  extends DASHMediaEvent<DASH.dvbFontDownloadComplete> {}

/**
 * Triggered when a font signalled by a DVB Font Download could not be successfully downloaded, so
 * the `FontFace` will not be used.
 *
 * @detail data
 */
export interface DASHDvbFontDownloadFailedEvent
  extends DASHMediaEvent<DASH.dvbFontDownloadFailed> {}

/**
 * Triggered when a dynamic stream changed to static (transition phase between Live and -Demand).
 *
 * @detail data
 */
export interface DASHDynamicToStaticEvent extends DASHMediaEvent<DASH.DynamicToStaticEvent> {}

/**
 * Triggered when there is an error from the element or MSE source buffer.
 *
 * @detail error
 */
export interface DASHErrorEvent extends DASHMediaEvent<DASH.ErrorEvent> {}

/**
 * Triggered when a fragment download has completed.
 *
 * @detail data
 */
export interface DASHFragmentLoadingCompletedEvent
  extends DASHMediaEvent<DASH.FragmentLoadingCompletedEvent> {}

/**
 * Triggered when a partial fragment download has completed.
 */
export interface DASHFragmentLoadingProgressEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when a fragment download has started.
 */
export interface DASHFragmentLoadingStartedEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when a fragment download is abandoned due to detection of slow download base on e
 * ABR abandon rule.
 *
 * @detail data
 */
export interface DASHFragmentLoadingAbandonedEvent
  extends DASHMediaEvent<DASH.FragmentLoadingAbandonedEvent> {}

/**
 * Triggered when Debug logger methods are called.
 *
 * @detail data
 */
export interface DASHLogEvent extends DASHMediaEvent<DASH.LogEvent> {}

/**
 * Triggered when the manifest load has started.
 */
export interface DASHManifestLoadingStartedEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when the manifest loading is finished, providing the request object information.
 */
export interface DASHManifestLoadingFinishedEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when the manifest load is complete, providing the payload.
 *
 * @detail data
 */
export interface DASHManifestLoadedEvent extends DASHMediaEvent<DASH.ManifestLoadedEvent> {}

/**
 * Triggered anytime there is a change to the overall metrics.
 */
export interface DASHMetricsChangedEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when an individual metric is added, updated or cleared.
 *
 * @detail data
 */
export interface DASHMetricChangedEvent extends DASHMediaEvent<DASH.MetricChangedEvent> {}

/**
 * Triggered every time a new metric is added.
 *
 * @detail data
 */
export interface DASHMetricAddedEvent extends DASHMediaEvent<DASH.MetricEvent> {}

/**
 * Triggered every time a metric is updated.
 *
 * @detail data
 */
export interface DASHMetricUpdatedEvent extends DASHMediaEvent<DASH.MetricEvent> {}

/**
 * Triggered when a new stream (period) starts.
 *
 * @detail data
 */
export interface DASHPeriodSwitchStartedEvent extends DASHMediaEvent<DASH.PeriodSwitchEvent> {}

/**
 * Triggered at the stream end of a period.
 *
 * @detail data
 */
export interface DASHPeriodSwitchCompletedEvent extends DASHMediaEvent<DASH.PeriodSwitchEvent> {}

/**
 * Triggered when an ABR up /down switch is initiated; either by user in manual mode or auto de via
 * ABR rules.
 *
 * @detail data
 */
export interface DASHQualityChangeRequestedEvent
  extends DASHMediaEvent<DASH.QualityChangeRequestedEvent> {}

/**
 * Triggered when the new ABR quality is being rendered on-screen.
 *
 * @detail data
 */
export interface DASHQualityChangeRenderedEvent
  extends DASHMediaEvent<DASH.QualityChangeRenderedEvent> {}

/**
 * Triggered when the new track is being rendered.
 *
 * @detail data
 */
export interface DASHTrackChangeRenderedEvent
  extends DASHMediaEvent<DASH.TrackChangeRenderedEvent> {}

/**
 * Triggered when a stream (period) is being loaded.
 */
export interface DASHStreamInitializingEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when a stream (period) is loaded.
 */
export interface DASHStreamUpdatedEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when a stream (period) is activated.
 */
export interface DASHStreamActivatedEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when a stream (period) is deactivated
 */
export interface DASHStreamDeactivatedEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when a stream (period) is activated.
 *
 * @detail data
 */
export interface DASHStreamInitializedEvent extends DASHMediaEvent<DASH.StreamInitializedEvent> {}

/**
 * Triggered when the player has been reset.
 */
export interface DASHStreamTeardownCompleteEvent extends DASHMediaEvent<void> {}

/**
 * Triggered once all text tracks detected in the MPD are added to the video element.
 *
 * @detail data
 */
export interface DASHAllTextTracksAddedEvent extends DASHMediaEvent<DASH.TextTracksAddedEvent> {}

/**
 * Triggered when a text track is added to the video element's `TextTrackList`.
 *
 * @detail data
 */
export interface DASHTextTrackAddedEvent extends DASHMediaEvent<DASH.TextTracksAddedEvent> {}

/**
 * Triggered when a text track should be shown.
 *
 * @detail data
 */
export interface DASHCueEnterEvent extends DASHMediaEvent<DASH.CueEnterEvent> {}

/**
 * Triggered when a text track should be hidden.
 *
 * @detail data
 */
export interface DASHCueExitEvent extends DASHMediaEvent<DASH.CueExitEvent> {}

/**
 * Triggered when a throughput measurement based on the last segment request has been stored.
 *
 * @detail data
 */
export interface DASHThroughputMeasurementStoredEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when a `ttml` chunk is parsed.
 *
 * @detail data
 */
export interface DASHTtmlParsedEvent extends DASHMediaEvent<DASH.TtmlParsedEvent> {}

/**
 * Triggered when a `ttml` chunk has to be parsed.
 *
 * @detail data
 */
export interface DASHTtmlToParseEvent extends DASHMediaEvent<DASH.TtmlToParseEvent> {}

/**
 * Triggered when a caption is rendered.
 *
 * @detail data
 */
export interface DASHCaptionRenderedEvent extends DASHMediaEvent<DASH.CaptionRenderedEvent> {}

/**
 * Triggered when the caption container is resized.
 *
 * @detail data
 */
export interface DASHCaptionContainerResizeEvent
  extends DASHMediaEvent<DASH.CaptionContainerResizeEvent> {}

/**
 * Sent when enough data is available that the media can be played, at least for a couple of
 * frames. This corresponds to the `HAVE_ENOUGH_DATA` `readyState`.
 */
export interface DASHCanPlayEvent extends DASHMediaEvent<void> {}

/**
 * This corresponds to the `CAN_PLAY_THROUGH` `readyState`.
 */
export interface DASHCanPlayThroughEvent extends DASHMediaEvent<void> {}

/**
 * Sent when playback completes.
 */
export interface DASHPlaybackEndedEvent extends DASHMediaEvent<void> {}

/**
 * Sent when an error occurs.  The element's error attribute contains more information.
 *
 * @detail data
 */
export interface DASHPlaybackErrorEvent extends DASHMediaEvent<DASH.PlaybackErrorEvent> {}

/**
 * Sent when playback is not allowed (for example if user gesture is needed).
 */
export interface DASHPlaybackNotAllowedEvent extends DASHMediaEvent<void> {}

/**
 * The media's metadata has finished loading; all attributes now contain as much useful
 * information as they're going to.
 */
export interface DASHPlaybackMetaDataLoadedEvent extends DASHMediaEvent<void> {}

/**
 * The event is fired when the frame at the current playback position of the media has finished
 * loading; often the first frame.
 */
export interface DASHPlaybackLoadedDataEvent extends DASHMediaEvent<void> {}

/**
 * Sent when playback is paused.
 *
 * @detail data
 */
export interface DASHPlaybackPausedEvent extends DASHMediaEvent<DASH.PlaybackPausedEvent> {}

/**
 * Sent when the media begins to play (either for the first time, after having been paused,
 * or after ending and then restarting).
 *
 * @detail data
 */
export interface DASHPlaybackPlayingEvent extends DASHMediaEvent<DASH.PlaybackPlayingEvent> {}

/**
 * Sent periodically to inform interested parties of progress downloading the media. Information
 * about the current amount of the media that has been downloaded is available in the media
 * element's buffered attribute.
 */
export interface DASHPlaybackProgressEvent extends DASHMediaEvent<void> {}

/**
 * Sent when the playback speed changes.
 *
 * @detail data
 */
export interface DASHPlaybackRateChangedEvent
  extends DASHMediaEvent<DASH.PlaybackRateChangedEvent> {}

/**
 * Sent when a seek operation completes.
 */
export interface DASHPlaybackSeekedEvent extends DASHMediaEvent<void> {}

/**
 * Sent when a seek operation begins.
 *
 * @detail data
 */
export interface DASHPlaybackSeekingEvent extends DASHMediaEvent<DASH.PlaybackSeekingEvent> {}

/**
 * Sent when the video element reports stalled.
 */
export interface DASHPlaybackStalledEvent extends DASHMediaEvent<void> {}

/**
 * Sent when playback of the media starts after having been paused; that is, when playback is
 * resumed after a prior pause event.
 *
 * @detail data
 */
export interface DASHPlaybackStartedEvent extends DASHMediaEvent<DASH.PlaybackStartedEvent> {}

/**
 * The time indicated by the element's currentTime attribute has changed.
 *
 * @detail data
 */
export interface DASHPlaybackTimeUpdatedEvent
  extends DASHMediaEvent<DASH.PlaybackTimeUpdatedEvent> {}

/**
 * Sent when the video element reports that the volume has changed.
 */
export interface DASHPlaybackVolumeChangedEvent extends DASHMediaEvent<void> {}

/**
 * Sent when the media playback has stopped because of a temporary lack of data.
 *
 * @detail data
 */
export interface DASHPlaybackWaitingEvent extends DASHMediaEvent<DASH.PlaybackWaitingEvent> {}

/**
 * Manifest validity changed - As a result of an MPD validity expiration event.
 */
export interface DASHManifestValidityChangedEvent extends DASHMediaEvent<void> {}

/**
 * Dash events are triggered at their respective start points on the timeline.
 */
export interface DASHEventModeOnStartEvent extends DASHMediaEvent<void> {}

/**
 * Dash events are triggered as soon as they were parsed.
 */
export interface DASHEventModeOnReceiveEvent extends DASHMediaEvent<void> {}

/**
 * Event that is dispatched whenever the player encounters a potential conformance validation at
 * might lead to unexpected/not optimal behavior.
 */
export interface DASHConformanceViolationEvent extends DASHMediaEvent<void> {}

/**
 * Event that is dispatched whenever the player switches to a different representation.
 */
export interface DASHRepresentationSwitchEvent extends DASHMediaEvent<void> {}

/**
 * Event that is dispatched whenever an adaptation set is removed due to all representations to
 * being supported.
 *
 * @detail data
 */
export interface DASHAdaptationSetRemovedNoCapabilitiesEvent
  extends DASHMediaEvent<DASH.AdaptationSetRemovedNoCapabilitiesEvent> {}

/**
 * Triggered when a content steering request has completed.
 */
export interface DASHContentSteeringRequestCompletedEvent extends DASHMediaEvent<void> {}

/**
 * Triggered when an inband prft (ProducerReferenceTime) boxes has been received.
 *
 * @detail data
 */
export interface DASHInbandPrftEvent extends DASHMediaEvent<DASH.InbandPrftReceivedEvent> {}

/**
 * The streaming attribute of the Managed Media Source is `true`.
 */
export interface DASHManagedMediaSourceStartStreamingEvent extends DASHMediaEvent<void> {}

/**
 * The streaming attribute of the Managed Media Source is `false`.
 */
export interface DASHManagedMediaSourceEndStreamingEvent extends DASHMediaEvent<void> {}
