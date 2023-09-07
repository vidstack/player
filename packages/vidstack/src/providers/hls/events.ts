import type * as HLS from 'hls.js';
import type { DOMEvent } from 'maverick.js/std';

import type { MediaPlayer } from '../../components/player';

export interface HLSProviderEvents {
  'hls-lib-load-start': HLSLibLoadStartEvent;
  'hls-lib-loaded': HLSLibLoadedEvent;
  'hls-lib-load-error': HLSLibLoadErrorEvent;
  'hls-instance': HLSInstanceEvent;
  'hls-unsupported': HLSUnsupportedEvent;
  // re-dispatched `hls.js` events below
  'hls-media-attaching': HLSMediaAttachingEvent;
  'hls-media-attached': HLSMediaAttachedEvent;
  'hls-media-detaching': HLSMediaDetachingEvent;
  'hls-media-detached': HLSMediaDetachedEvent;
  'hls-buffer-reset': HLSBufferResetEvent;
  'hls-buffer-codecs': HLSBufferCodecsEvent;
  'hls-buffer-created': HLSBufferCreatedEvent;
  'hls-buffer-appending': HLSBufferAppendingEvent;
  'hls-buffer-appended': HLSBufferAppendedEvent;
  'hls-buffer-eos': HLSBufferEosEvent;
  'hls-buffer-flushing': HLSBufferFlushingEvent;
  'hls-buffer-flushed': HLSBufferFlushedEvent;
  'hls-manifest-loading': HLSManifestLoadingEvent;
  'hls-manifest-loaded': HLSManifestLoadedEvent;
  'hls-manifest-parsed': HLSManifestParsedEvent;
  'hls-level-switching': HLSLevelSwitchingEvent;
  'hls-level-switched': HLSLevelSwitchedEvent;
  'hls-level-loading': HLSLevelLoadingEvent;
  'hls-level-loaded': HLSLevelLoadedEvent;
  'hls-level-updated': HLSLevelUpdatedEvent;
  'hls-level-pts-updated': HLSLevelPtsUpdatedEvent;
  'hls-levels-updated': HLSLevelsUpdatedEvent;
  'hls-audio-tracks-updated': HLSAudioTracksUpdatedEvent;
  'hls-audio-track-switching': HLSAudioTrackSwitchingEvent;
  'hls-audio-track-switched': HLSAudioTrackSwitchedEvent;
  'hls-audio-track-loading': HLSAudioTrackLoadingEvent;
  'hls-audio-track-loaded': HLSAudioTrackLoadedEvent;
  'hls-subtitle-tracks-updated': HLSSubtitleTracksUpdatedEvent;
  'hls-subtitle-tracks-cleared': HLSSubtitleTracksClearedEvent;
  'hls-subtitle-track-switch': HLSSubtitleTrackSwitchEvent;
  'hls-subtitle-track-loading': HLSSubtitleTrackLoadingEvent;
  'hls-subtitle-track-loaded': HLSSubtitleTrackLoadedEvent;
  'hls-subtitle-frag-processed': HLSSubtitleFragProcessedEvent;
  'hls-cues-parsed': HLSCuesParsedEvent;
  'hls-non-native-text-tracks-found': HLSNonNativeTextTracksFoundEvent;
  'hls-init-pts-found': HLSInitPtsFoundEvent;
  'hls-frag-loading': HLSFragLoadingEvent;
  'hls-frag-load-emergency-aborted': HLSFragLoadEmergencyAbortedEvent;
  'hls-frag-loaded': HLSFragLoadedEvent;
  'hls-frag-decrypted': HLSFragDecryptedEvent;
  'hls-frag-parsing-init-segment': HLSFragParsingInitSegmentEvent;
  'hls-frag-parsing-userdata': HLSFragParsingUserdataEvent;
  'hls-frag-parsing-metadata': HLSFragParsingMetadataEvent;
  'hls-frag-parsed': HLSFragParsedEvent;
  'hls-frag-buffered-data': HLSFragBufferedDataEvent;
  'hls-frag-changed': HLSFragChangedEvent;
  'hls-fps-drop': HLSFpsDropEvent;
  'hls-fps-drop-level-capping': HLSFpsDropLevelCappingEvent;
  'hls-error': HLSErrorEvent;
  'hls-destroying': HLSDestroyingEvent;
  'hls-key-loading': HLSKeyLoadingEvent;
  'hls-key-loaded': HLSKeyLoadedEvent;
  'hls-back-buffer-reached': HLSBackBufferReachedEvent;
}

export interface HLSMediaEvent<DetailType = unknown> extends DOMEvent<DetailType> {
  target: MediaPlayer;
}

/**
 * Fired when the browser begins downloading the `hls.js` library.
 */
export interface HLSLibLoadStartEvent extends HLSMediaEvent<void> {}

/**
 * Fired when the `hls.js` library has been loaded.
 *
 * @detail constructor
 */
export interface HLSLibLoadedEvent extends HLSMediaEvent<typeof HLS.default> {}

/**
 * Fired when the `hls.js` library fails during the download process.
 *
 * @detail error
 */
export interface HLSLibLoadErrorEvent extends HLSMediaEvent<Error> {}

/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser does not
 * support `hls.js`.
 *
 * @detail instance
 */
export interface HLSInstanceEvent extends HLSMediaEvent<HLS.default> {}

/**
 * Fired when the browser doesn't support HLS natively, _and_ `hls.js` doesn't support
 * this environment either, most likely due to missing Media Extensions or video codecs.
 */
export interface HLSUnsupportedEvent extends HLSMediaEvent<void> {}

/**
 * Fired before `MediaSource` begins attaching to the media element.
 *
 * @detail data
 */
export interface HLSMediaAttachingEvent extends HLSMediaEvent<HLS.MediaAttachingData> {}

/**
 * Fired when `MediaSource` has been successfully attached to the media element.
 *
 * @detail data
 */
export interface HLSMediaAttachedEvent extends HLSMediaEvent<HLS.MediaAttachedData> {}

/**
 * Fired before detaching `MediaSource` from the media element.
 */
export interface HLSMediaDetachingEvent extends HLSMediaEvent<void> {}

/**
 * Fired when `MediaSource` has been detached from media element.
 */
export interface HLSMediaDetachedEvent extends HLSMediaEvent<void> {}

/**
 * Fired when we buffer is going to be reset.
 */
export interface HLSBufferResetEvent extends HLSMediaEvent<void> {}

/**
 * Fired when we know about the codecs that we need buffers for to push into.
 *
 * @detail data
 */
export interface HLSBufferCodecsEvent extends HLSMediaEvent<HLS.BufferCodecsData> {}

/**
 * Fired when `SourceBuffer`'s have been created.
 *
 * @detail data
 */
export interface HLSBufferCreatedEvent extends HLSMediaEvent<HLS.BufferCreatedData> {}

/**
 * Fired when we begin appending a media segment to the buffer.
 *
 * @detail data
 */
export interface HLSBufferAppendingEvent extends HLSMediaEvent<HLS.BufferAppendingData> {}

/**
 * Fired when we are done with appending a media segment to the buffer.
 *
 * @detail data
 */
export interface HLSBufferAppendedEvent extends HLSMediaEvent<HLS.BufferAppendedData> {}

/**
 * Fired when the stream is finished and we want to notify the media buffer that there will be no
 * more data.
 *
 * @detail data
 */
export interface HLSBufferEosEvent extends HLSMediaEvent<HLS.BufferEOSData> {}

/**
 * Fired when the media buffer should be flushed.
 *
 * @detail data
 */
export interface HLSBufferFlushingEvent extends HLSMediaEvent<HLS.BufferFlushingData> {}

/**
 * Fired when the media buffer has been flushed.
 *
 * @detail data
 */
export interface HLSBufferFlushedEvent extends HLSMediaEvent<HLS.BufferFlushedData> {}

/**
 * Fired to signal that manifest loading is starting.
 *
 * @detail data
 */
export interface HLSManifestLoadingEvent extends HLSMediaEvent<HLS.ManifestLoadingData> {}

/**
 * Fired after the manifest has been loaded.
 *
 * @detail data
 */
export interface HLSManifestLoadedEvent extends HLSMediaEvent<HLS.ManifestLoadedData> {}

/**
 * Fired after manifest has been parsed.
 *
 * @detail data
 */
export interface HLSManifestParsedEvent extends HLSMediaEvent<HLS.ManifestParsedData> {}

/**
 * Fired when a level switch is requested.
 *
 * @detail data
 */
export interface HLSLevelSwitchingEvent extends HLSMediaEvent<HLS.LevelSwitchingData> {}

/**
 * Fired when a level switch is effective.
 *
 * @detail data
 */
export interface HLSLevelSwitchedEvent extends HLSMediaEvent<HLS.LevelSwitchedData> {}

/**
 * Fired when a level playlist loading starts.
 *
 * @detail data
 */
export interface HLSLevelLoadingEvent extends HLSMediaEvent<HLS.LevelLoadingData> {}

/**
 * Fired when a level playlist loading finishes.
 *
 * @detail data
 */
export interface HLSLevelLoadedEvent extends HLSMediaEvent<HLS.LevelLoadedData> {}

/**
 * Fired when a level's details have been updated based on previous details, after it has been
 * loaded.
 *
 * @detail data
 */
export interface HLSLevelUpdatedEvent extends HLSMediaEvent<HLS.LevelUpdatedData> {}

/**
 * Fired when a level's PTS information has been updated after parsing a fragment.
 *
 * @detail data
 */
export interface HLSLevelPtsUpdatedEvent extends HLSMediaEvent<HLS.LevelPTSUpdatedData> {}

/**
 * Fired when a level is removed after calling `removeLevel()`.
 *
 * @detail data
 */
export interface HLSLevelsUpdatedEvent extends HLSMediaEvent<HLS.LevelsUpdatedData> {}

/**
 * Fired to notify that the audio track list has been updated.
 *
 * @detail data
 */
export interface HLSAudioTracksUpdatedEvent extends HLSMediaEvent<HLS.AudioTracksUpdatedData> {}

/**
 * Fired when an audio track switching is requested.
 *
 * @detail data
 */
export interface HLSAudioTrackSwitchingEvent extends HLSMediaEvent<HLS.AudioTrackSwitchingData> {}

/**
 * Fired when an audio track switch actually occurs.
 *
 * @detail data
 */
export interface HLSAudioTrackSwitchedEvent extends HLSMediaEvent<HLS.AudioTrackSwitchedData> {}

/**
 * Fired when loading an audio track starts.
 *
 * @detail data
 */
export interface HLSAudioTrackLoadingEvent extends HLSMediaEvent<HLS.TrackLoadingData> {}

/**
 * Fired when loading an audio track finishes.
 *
 * @detail data
 */
export interface HLSAudioTrackLoadedEvent extends HLSMediaEvent<HLS.AudioTrackLoadedData> {}

/**
 * Fired to notify that the subtitle track list has been updated.
 *
 * @detail data
 */
export interface HLSSubtitleTracksUpdatedEvent
  extends HLSMediaEvent<HLS.SubtitleTracksUpdatedData> {}

/**
 * Fired to notify that subtitle tracks were cleared as a result of stopping the media.
 */
export interface HLSSubtitleTracksClearedEvent extends HLSMediaEvent<void> {}

/**
 * Fired when a subtitle track switch occurs.
 *
 * @detail data
 */
export interface HLSSubtitleTrackSwitchEvent extends HLSMediaEvent<HLS.SubtitleTrackSwitchData> {}

/**
 * Fired when loading a subtitle track starts.
 *
 * @detail data
 */
export interface HLSSubtitleTrackLoadingEvent extends HLSMediaEvent<HLS.TrackLoadingData> {}

/**
 * Fired when loading a subtitle track finishes.
 *
 * @detail data
 */
export interface HLSSubtitleTrackLoadedEvent extends HLSMediaEvent<HLS.SubtitleTrackLoadedData> {}

/**
 * Fired when a subtitle fragment has been processed.
 *
 * @detail data
 */
export interface HLSSubtitleFragProcessedEvent
  extends HLSMediaEvent<HLS.SubtitleFragProcessedData> {}

/**
 * Fired when a set of `VTTCue`'s to be managed externally has been parsed.
 *
 * @detail data
 */
export interface HLSCuesParsedEvent extends HLSMediaEvent<HLS.CuesParsedData> {}

/**
 * Fired when a text track to be managed externally is found.
 *
 * @detail data
 */
export interface HLSNonNativeTextTracksFoundEvent
  extends HLSMediaEvent<HLS.NonNativeTextTracksData> {}

/**
 * Fired when the first timestamp is found.
 *
 * @detail data
 */
export interface HLSInitPtsFoundEvent extends HLSMediaEvent<HLS.InitPTSFoundData> {}

/**
 * Fired when loading a fragment starts.
 *
 * @detail data
 */
export interface HLSFragLoadingEvent extends HLSMediaEvent<HLS.FragLoadingData> {}

/**
 * Fired when fragment loading is aborted for emergency switch down.
 *
 * @detail data
 */
export interface HLSFragLoadEmergencyAbortedEvent
  extends HLSMediaEvent<HLS.FragLoadEmergencyAbortedData> {}

/**
 * Fired when fragment loading is completed.
 *
 * @detail data
 */
export interface HLSFragLoadedEvent extends HLSMediaEvent<HLS.FragLoadedData> {}

/**
 * Fired when a fragment has finished decrypting.
 *
 * @detail data
 */
export interface HLSFragDecryptedEvent extends HLSMediaEvent<HLS.FragDecryptedData> {}

/**
 * Fired when `InitSegment` has been extracted from a fragment.
 *
 * @detail data
 */
export interface HLSFragParsingInitSegmentEvent
  extends HLSMediaEvent<HLS.FragParsingInitSegmentData> {}

/**
 * Fired when parsing sei text is completed.
 *
 * @detail data
 */
export interface HLSFragParsingUserdataEvent extends HLSMediaEvent<HLS.FragParsingUserdataData> {}

/**
 * Fired when parsing id3 is completed.
 *
 * @detail data
 */
export interface HLSFragParsingMetadataEvent extends HLSMediaEvent<HLS.FragParsingMetadataData> {}

/**
 * Fired when fragment parsing is completed.
 *
 * @detail data
 */
export interface HLSFragParsedEvent extends HLSMediaEvent<HLS.FragParsedData> {}

/**
 * Fired when fragment remuxed MP4 boxes have all been appended into `SourceBuffer`.
 *
 * @detail data
 */
export interface HLSFragBufferedDataEvent extends HLSMediaEvent<HLS.FragBufferedData> {}

/**
 * Fired when fragment matching with current media position is changing.
 *
 * @detail data
 */
export interface HLSFragChangedEvent extends HLSMediaEvent<HLS.FragChangedData> {}

/**
 * Fired when a FPS drop is identified.
 *
 * @detail data
 */
export interface HLSFpsDropEvent extends HLSMediaEvent<HLS.FPSDropData> {}

/**
 * Fired when FPS drop triggers auto level capping.
 *
 * @detail data
 */
export interface HLSFpsDropLevelCappingEvent extends HLSMediaEvent<HLS.FPSDropLevelCappingData> {}

/**
 * Fired when an error has occurred during loading or playback.
 *
 * @detail data
 */
export interface HLSErrorEvent extends HLSMediaEvent<HLS.ErrorData> {}

/**
 * Fired when the `hls.js` instance is being destroyed. Different from `hls-media-detached` as
 * one could want to detach, and reattach media to the `hls.js` instance to handle mid-rolls.
 */
export interface HLSDestroyingEvent extends HLSMediaEvent<void> {}

/**
 * Fired when a decrypt key loading starts.
 *
 * @detail data
 */
export interface HLSKeyLoadingEvent extends HLSMediaEvent<HLS.KeyLoadingData> {}

/**
 * Fired when a decrypt key has been loaded.
 *
 * @detail data
 */
export interface HLSKeyLoadedEvent extends HLSMediaEvent<HLS.KeyLoadedData> {}

/**
 * Fired when the back buffer is reached as defined by the `backBufferLength` config option.
 *
 * @detail data
 */
export interface HLSBackBufferReachedEvent extends HLSMediaEvent<HLS.BackBufferData> {}
