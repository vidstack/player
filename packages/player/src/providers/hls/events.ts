import { VdsEvent } from '@vidstack/foundation';
import type {
  AudioTrackLoadedData,
  AudioTracksUpdatedData,
  AudioTrackSwitchedData,
  AudioTrackSwitchingData,
  BackBufferData,
  BufferAppendedData,
  BufferAppendingData,
  BufferCodecsData,
  BufferCreatedData,
  BufferEOSData,
  BufferFlushedData,
  BufferFlushingData,
  CuesParsedData,
  ErrorData,
  FPSDropData,
  FPSDropLevelCappingData,
  FragBufferedData,
  FragChangedData,
  FragDecryptedData,
  FragLoadedData,
  FragLoadEmergencyAbortedData,
  FragLoadingData,
  FragParsedData,
  FragParsingInitSegmentData,
  FragParsingMetadataData,
  FragParsingUserdataData,
  InitPTSFoundData,
  KeyLoadedData,
  KeyLoadingData,
  LevelLoadedData,
  LevelLoadingData,
  LevelPTSUpdatedData,
  LevelsUpdatedData,
  LevelSwitchedData,
  LevelSwitchingData,
  LevelUpdatedData,
  LiveBackBufferData,
  ManifestLoadedData,
  ManifestLoadingData,
  ManifestParsedData,
  MediaAttachedData,
  MediaAttachingData,
  NonNativeTextTracksData,
  SubtitleFragProcessedData,
  SubtitleTrackLoadedData,
  SubtitleTracksUpdatedData,
  SubtitleTrackSwitchData,
  TrackLoadingData,
} from 'hls.js';
import type Hls from 'hls.js';

import type { HlsElement } from './HlsElement';

export type HlsEvents = {
  'vds-hls-lib-load-start': HlsLibLoadStartEvent;
  'vds-hls-lib-loaded': HlsLibLoadedEvent;
  'vds-hls-lib-load-error': HlsLibLoadErrorEvent;
  'vds-hls-instance': HlsInstanceEvent;
  'vds-hls-unsupported': HlsUnsupportedEvent;
  // `hls.js` events
  'vds-hls-media-attaching': HlsMediaAttachingEvent;
  'vds-hls-media-attached': HlsMediaAttachedEvent;
  'vds-hls-media-detaching': HlsMediaDetachingEvent;
  'vds-hls-media-detached': HlsMediaDetachedEvent;
  'vds-hls-buffer-reset': HlsBufferResetEvent;
  'vds-hls-buffer-codecs': HlsBufferCodecsEvent;
  'vds-hls-buffer-created': HlsBufferCreatedEvent;
  'vds-hls-buffer-appending': HlsBufferAppendingEvent;
  'vds-hls-buffer-appended': HlsBufferAppendedEvent;
  'vds-hls-buffer-eos': HlsBufferEosEvent;
  'vds-hls-buffer-flushing': HlsBufferFlushingEvent;
  'vds-hls-buffer-flushed': HlsBufferFlushedEvent;
  'vds-hls-manifest-loading': HlsManifestLoadingEvent;
  'vds-hls-manifest-loaded': HlsManifestLoadedEvent;
  'vds-hls-manifest-parsed': HlsManifestParsedEvent;
  'vds-hls-level-switching': HlsLevelSwitchingEvent;
  'vds-hls-level-switched': HlsLevelSwitchedEvent;
  'vds-hls-level-loading': HlsLevelLoadingEvent;
  'vds-hls-level-loaded': HlsLevelLoadedEvent;
  'vds-hls-level-updated': HlsLevelUpdatedEvent;
  'vds-hls-level-pts-updated': HlsLevelPtsUpdatedEvent;
  'vds-hls-levels-updated': HlsLevelsUpdatedEvent;
  'vds-hls-audio-tracks-updated': HlsAudioTracksUpdatedEvent;
  'vds-hls-audio-track-switching': HlsAudioTrackSwitchingEvent;
  'vds-hls-audio-track-switched': HlsAudioTrackSwitchedEvent;
  'vds-hls-audio-track-loading': HlsAudioTrackLoadingEvent;
  'vds-hls-audio-track-loaded': HlsAudioTrackLoadedEvent;
  'vds-hls-subtitle-tracks-updated': HlsSubtitleTracksUpdatedEvent;
  'vds-hls-subtitle-tracks-cleared': HlsSubtitleTracksClearedEvent;
  'vds-hls-subtitle-track-switch': HlsSubtitleTrackSwitchEvent;
  'vds-hls-subtitle-track-loading': HlsSubtitleTrackLoadingEvent;
  'vds-hls-subtitle-track-loaded': HlsSubtitleTrackLoadedEvent;
  'vds-hls-subtitle-frag-processed': HlsSubtitleFragProcessedEvent;
  'vds-hls-cues-parsed': HlsCuesParsedEvent;
  'vds-hls-non-native-text-tracks-found': HlsNonNativeTextTracksFoundEvent;
  'vds-hls-init-pts-found': HlsInitPtsFoundEvent;
  'vds-hls-frag-loading': HlsFragLoadingEvent;
  'vds-hls-frag-load-emergency-aborted': HlsFragLoadEmergencyAbortedEvent;
  'vds-hls-frag-loaded': HlsFragLoadedEvent;
  'vds-hls-frag-decrypted': HlsFragDecryptedEvent;
  'vds-hls-frag-parsing-init-segment': HlsFragParsingInitSegmentEvent;
  'vds-hls-frag-parsing-userdata': HlsFragParsingUserdataEvent;
  'vds-hls-frag-parsing-metadata': HlsFragParsingMetadataEvent;
  'vds-hls-frag-parsed': HlsFragParsedEvent;
  'vds-hls-frag-buffered-data': HlsFragBufferedDataEvent;
  'vds-hls-frag-changed': HlsFragChangedEvent;
  'vds-hls-fps-drop': HlsFpsDropEvent;
  'vds-hls-fps-drop-level-capping': HlsFpsDropLevelCappingEvent;
  'vds-hls-error': HlsErrorEvent;
  'vds-hls-destroying': HlsDestroyingEvent;
  'vds-hls-key-loading': HlsKeyLoadingEvent;
  'vds-hls-key-loaded': HlsKeyLoadedEvent;
  'vds-hls-back-buffer-reached': HlsBackBufferReachedEvent;
};

export type VdsHlsEvent<DetailType = unknown> = VdsEvent<DetailType> & {
  target: HlsElement;
};

/**
 * Fired when the browser begins downloading the `hls.js` library.
 *
 * @event
 */
export type HlsLibLoadStartEvent = VdsHlsEvent<void>;

/**
 * Fired when the `hls.js` library has been loaded.
 *
 * @event
 */
export type HlsLibLoadedEvent = VdsHlsEvent<typeof Hls>;

/**
 * Fired when the `hls.js` library fails during the download process.
 *
 * @event
 */
export type HlsLibLoadErrorEvent = VdsHlsEvent<Error>;

/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser does not
 * support `hls.js`.
 *
 * @event
 */
export type HlsInstanceEvent = VdsHlsEvent<Hls>;

/**
 * Fired when the browser doesn't support HLS natively, _and_ `hls.js` doesn't support
 * this environment either, most likely due to missing Media Extensions or video codecs.
 *
 * @event
 */
export type HlsUnsupportedEvent = VdsHlsEvent<void>;

/**
 * Fired before `MediaSource` begins attaching to the media element.
 *
 * @event
 */
export type HlsMediaAttachingEvent = VdsHlsEvent<MediaAttachingData>;

/**
 * Fired when `MediaSource` has been successfully attached to the media element.
 *
 * @event
 */
export type HlsMediaAttachedEvent = VdsHlsEvent<MediaAttachedData>;

/**
 * Fired before detaching `MediaSource` from the media element.
 *
 * @event
 */
export type HlsMediaDetachingEvent = VdsHlsEvent<void>;

/**
 * Fired when `MediaSource` has been detached from media element.
 *
 * @event
 */
export type HlsMediaDetachedEvent = VdsHlsEvent<void>;

/**
 * Fired when we buffer is going to be reset.
 *
 * @event
 */
export type HlsBufferResetEvent = VdsHlsEvent<void>;

/**
 * Fired when we know about the codecs that we need buffers for to push into.
 *
 * @event
 */
export type HlsBufferCodecsEvent = VdsHlsEvent<BufferCodecsData>;

/**
 * Fired when `SourceBuffer`'s have been created.
 *
 * @event
 */
export type HlsBufferCreatedEvent = VdsHlsEvent<BufferCreatedData>;

/**
 * Fired when we begin appending a media segment to the buffer.
 *
 * @event
 */
export type HlsBufferAppendingEvent = VdsHlsEvent<BufferAppendingData>;

/**
 * Fired when we are done with appending a media segment to the buffer.
 *
 * @event
 */
export type HlsBufferAppendedEvent = VdsHlsEvent<BufferAppendedData>;

/**
 * Fired when the stream is finished and we want to notify the media buffer that there will be no
 * more data.
 *
 * @event
 */
export type HlsBufferEosEvent = VdsHlsEvent<BufferEOSData>;

/**
 * Fired when the media buffer should be flushed.
 *
 * @event
 */
export type HlsBufferFlushingEvent = VdsHlsEvent<BufferFlushingData>;

/**
 * Fired when the media buffer has been flushed.
 *
 * @event
 */
export type HlsBufferFlushedEvent = VdsHlsEvent<BufferFlushedData>;

/**
 * Fired to signal that manifest loading is starting.
 *
 * @event
 */
export type HlsManifestLoadingEvent = VdsHlsEvent<ManifestLoadingData>;

/**
 * Fired after the manifest has been loaded.
 *
 * @event
 */
export type HlsManifestLoadedEvent = VdsHlsEvent<ManifestLoadedData>;

/**
 * Fired after manifest has been parsed.
 *
 * @event
 */
export type HlsManifestParsedEvent = VdsHlsEvent<ManifestParsedData>;

/**
 * Fired when a level switch is requested.
 *
 * @event
 */
export type HlsLevelSwitchingEvent = VdsHlsEvent<LevelSwitchingData>;

/**
 * Fired when a level switch is effective.
 *
 * @event
 */
export type HlsLevelSwitchedEvent = VdsHlsEvent<LevelSwitchedData>;

/**
 * Fired when a level playlist loading starts.
 *
 * @event
 */
export type HlsLevelLoadingEvent = VdsHlsEvent<LevelLoadingData>;

/**
 * Fired when a level playlist loading finishes.
 *
 * @event
 */
export type HlsLevelLoadedEvent = VdsHlsEvent<LevelLoadedData>;

/**
 * Fired when a level's details have been updated based on previous details, after it has been
 * loaded.
 *
 * @event
 */
export type HlsLevelUpdatedEvent = VdsHlsEvent<LevelUpdatedData>;

/**
 * Fired when a level's PTS information has been updated after parsing a fragment.
 *
 * @event
 */
export type HlsLevelPtsUpdatedEvent = VdsHlsEvent<LevelPTSUpdatedData>;

/**
 * Fired when a level is removed after calling `removeLevel()`.
 *
 * @event
 */
export type HlsLevelsUpdatedEvent = VdsHlsEvent<LevelsUpdatedData>;

/**
 * Fired to notify that the audio track list has been updated.
 *
 * @event
 */
export type HlsAudioTracksUpdatedEvent = VdsHlsEvent<AudioTracksUpdatedData>;

/**
 * Fired when an audio track switching is requested.
 *
 * @event
 */
export type HlsAudioTrackSwitchingEvent = VdsHlsEvent<AudioTrackSwitchingData>;

/**
 * Fired when an audio track switch actually occurs.
 *
 * @event
 */
export type HlsAudioTrackSwitchedEvent = VdsHlsEvent<AudioTrackSwitchedData>;

/**
 * Fired when loading an audio track starts.
 *
 * @event
 */
export type HlsAudioTrackLoadingEvent = VdsHlsEvent<TrackLoadingData>;

/**
 * Fired when loading an audio track finishes.
 *
 * @event
 */
export type HlsAudioTrackLoadedEvent = VdsHlsEvent<AudioTrackLoadedData>;

/**
 * Fired to notify that the subtitle track list has been updated.
 *
 * @event
 */
export type HlsSubtitleTracksUpdatedEvent = VdsHlsEvent<SubtitleTracksUpdatedData>;

/**
 * Fired to notify that subtitle tracks were cleared as a result of stopping the media.
 *
 * @event
 */
export type HlsSubtitleTracksClearedEvent = VdsHlsEvent<void>;

/**
 * Fired when a subtitle track switch occurs.
 *
 * @event
 */
export type HlsSubtitleTrackSwitchEvent = VdsHlsEvent<SubtitleTrackSwitchData>;

/**
 * Fired when loading a subtitle track starts.
 *
 * @event
 */
export type HlsSubtitleTrackLoadingEvent = VdsHlsEvent<TrackLoadingData>;

/**
 * Fired when loading a subtitle track finishes.
 *
 * @event
 */
export type HlsSubtitleTrackLoadedEvent = VdsHlsEvent<SubtitleTrackLoadedData>;

/**
 * Fired when a subtitle fragment has been processed.
 *
 * @event
 */
export type HlsSubtitleFragProcessedEvent = VdsHlsEvent<SubtitleFragProcessedData>;

/**
 * Fired when a set of `VTTCue`'s to be managed externally has been parsed.
 *
 * @event
 */
export type HlsCuesParsedEvent = VdsHlsEvent<CuesParsedData>;

/**
 * Fired when a text track to be managed externally is found.
 *
 * @event
 */
export type HlsNonNativeTextTracksFoundEvent = VdsHlsEvent<NonNativeTextTracksData>;

/**
 * Fired when the first timestamp is found.
 *
 * @event
 */
export type HlsInitPtsFoundEvent = VdsHlsEvent<InitPTSFoundData>;

/**
 * Fired when loading a fragment starts.
 *
 * @event
 */
export type HlsFragLoadingEvent = VdsHlsEvent<FragLoadingData>;

/**
 * Fired when fragment loading is aborted for emergency switch down.
 *
 * @event
 */
export type HlsFragLoadEmergencyAbortedEvent = VdsHlsEvent<FragLoadEmergencyAbortedData>;

/**
 * Fired when fragment loading is completed.
 *
 * @event
 */
export type HlsFragLoadedEvent = VdsHlsEvent<FragLoadedData>;

/**
 * Fired when a fragment has finished decrypting.
 *
 * @event
 */
export type HlsFragDecryptedEvent = VdsHlsEvent<FragDecryptedData>;

/**
 * Fired when `InitSegment` has been extracted from a fragment.
 *
 * @event
 */
export type HlsFragParsingInitSegmentEvent = VdsHlsEvent<FragParsingInitSegmentData>;

/**
 * Fired when parsing sei text is completed.
 *
 * @event
 */
export type HlsFragParsingUserdataEvent = VdsHlsEvent<FragParsingUserdataData>;

/**
 * Fired when parsing id3 is completed.
 *
 * @event
 */
export type HlsFragParsingMetadataEvent = VdsHlsEvent<FragParsingMetadataData>;

/**
 * Fired when fragment parsing is completed.
 *
 * @event
 */
export type HlsFragParsedEvent = VdsHlsEvent<FragParsedData>;

/**
 * Fired when fragment remuxed MP4 boxes have all been appended into `SourceBuffer`.
 *
 * @event
 */
export type HlsFragBufferedDataEvent = VdsHlsEvent<FragBufferedData>;

/**
 * Fired when fragment matching with current media position is changing.
 *
 * @event
 */
export type HlsFragChangedEvent = VdsHlsEvent<FragChangedData>;

/**
 * Fired when a FPS drop is identified.
 *
 * @event
 */
export type HlsFpsDropEvent = VdsHlsEvent<FPSDropData>;

/**
 * Fired when FPS drop triggers auto level capping.
 *
 * @event
 */
export type HlsFpsDropLevelCappingEvent = VdsHlsEvent<FPSDropLevelCappingData>;

/**
 * Fired when an error has occurred during loading or playback.
 *
 * @event
 */
export type HlsErrorEvent = VdsHlsEvent<ErrorData>;

/**
 * Fired when the `hls.js` instance is being destroyed. Different from `vds-hls-media-detached` as
 * one could want to detach, and reattach media to the `hls.js` instance to handle mid-rolls.
 *
 * @event
 */
export type HlsDestroyingEvent = VdsHlsEvent<void>;

/**
 * Fired when a decrypt key loading starts.
 *
 * @event
 */
export type HlsKeyLoadingEvent = VdsHlsEvent<KeyLoadingData>;

/**
 * Fired when a decrypt key has been loaded.
 *
 * @event
 */
export type HlsKeyLoadedEvent = VdsHlsEvent<KeyLoadedData>;

/**
 * Fired when the back buffer is reached as defined by the `backBufferLength` config option.
 *
 * @event
 */
export type HlsBackBufferReachedEvent = VdsHlsEvent<BackBufferData>;
