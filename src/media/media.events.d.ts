import { VdsCustomEvent } from '../foundation/events/index.js';
import { VdsEventInit } from '../foundation/events/index.js';
import { MediaType } from './MediaType.js';
import { ViewType } from './ViewType.js';

declare global {
  interface GlobalEventHandlersEventMap extends MediaEvents {}
}

export interface VolumeChange {
  volume: number;
  muted: boolean;
}

export interface MediaEvents {
  'vds-abort': VdsCustomEvent<void>;
  'vds-can-play': VdsCustomEvent<void>;
  'vds-can-play-through': VdsCustomEvent<void>;
  'vds-duration-change': VdsCustomEvent<number>;
  'vds-emptied': VdsCustomEvent<void>;
  'vds-ended': VdsCustomEvent<void>;
  'vds-error': VdsCustomEvent<unknown>;
  'vds-fullscreen-change': VdsCustomEvent<boolean>;
  'vds-loaded-data': VdsCustomEvent<void>;
  'vds-loaded-metadata': VdsCustomEvent<void>;
  'vds-load-start': VdsCustomEvent<void>;
  'vds-media-type-change': VdsCustomEvent<MediaType>;
  'vds-pause': VdsCustomEvent<void>;
  'vds-play': VdsCustomEvent<void>;
  'vds-playing': VdsCustomEvent<void>;
  'vds-progress': VdsCustomEvent<void>;
  'vds-seeked': VdsCustomEvent<number>;
  'vds-seeking': VdsCustomEvent<number>;
  'vds-stalled': VdsCustomEvent<void>;
  'vds-started': VdsCustomEvent<void>;
  'vds-suspend': VdsCustomEvent<void>;
  'vds-replay': VdsCustomEvent<void>;
  'vds-time-update': VdsCustomEvent<number>;
  'vds-view-type-change': VdsCustomEvent<ViewType>;
  'vds-volume-change': VdsCustomEvent<VolumeChange>;
  'vds-waiting': VdsCustomEvent<void>;
}

export class MediaEvent<DetailType> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof MediaEvents;
}

/**
 * Fired when the resource was not fully loaded, but not as the result of an error.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event
 */
export class AbortEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-abort';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when the user agent can play the media, but estimates that **not enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
 */
export class CanPlayEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-can-play';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when the user agent can play the media, and estimates that **enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
 */
export class CanPlayThroughEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-can-play-through';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when the `duration` property changes.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event
 */
export class DurationChangeEvent extends MediaEvent<number> {
  static readonly TYPE: 'vds-duration-change';
  constructor(eventInit: VdsEventInit<number>);
}

/**
 * Fired when the media has become empty.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event
 */
export class EmptiedEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-emptied';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when playback or streaming has stopped because the end of the media was reached or
 * because no further data is available. This is not fired if playback will start from the
 * beginning again due to the `loop` property being `true` (see `MediaReplayEvent`).
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
 */
export class EndedEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-ended';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when any error has occurred within the player such as a media error, or
 * potentially a request that cannot be fulfilled such as calling `requestFullscreen()`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event
 */
export class ErrorEvent extends MediaEvent<unknown> {
  static readonly TYPE: 'vds-error';
  constructor(eventInit: VdsEventInit<unknown>);
}

/**
 * Fired when the player enters/exits fullscreen mode. When the detail is `true` it means
 * the player has entered fullscreen, `false` represents the opposite.
 */
export class FullscreenChangeEvent extends MediaEvent<boolean> {
  static readonly TYPE: 'vds-fullscreen-change';
  constructor(eventInit: VdsEventInit<boolean>);
}

/**
 * Fired when the frame at the current playback position of the media has finished loading; often
 * the first frame.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event
 */
export class LoadedDataEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-loaded-data';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when the metadata has been loaded.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event
 */
export class LoadedMetadataEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-loaded-metadata';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when the browser has started to load a resource.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event
 */
export class LoadStartEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-load-start';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when the `mediaType` property changes value.
 */
export class MediaTypeChangeEvent extends MediaEvent<MediaType> {
  static readonly TYPE: 'vds-media-type-change';
  constructor(eventInit: VdsEventInit<MediaType>);
}

/**
 * Fired when a request to `pause` an activity is handled and the activity has entered its
 * `paused` state, most commonly after the media has been paused through a call to the
 * `pause()` method.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event
 */
export class PauseEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-pause';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
 * method, or the `autoplay` attribute.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event
 */
export class PlayEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-play';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when playback is ready to start after having been paused or delayed due to lack of data.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event
 */
export class PlayingEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-playing';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired periodically as the browser loads a resource.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event
 */
export class ProgressEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-progress';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when a seek operation completed, the current playback position has changed, and the
 * `seeking` property is changed to `false`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event
 */
export class SeekedEvent extends MediaEvent<number> {
  static readonly TYPE: 'vds-seeked';
  constructor(eventInit: VdsEventInit<number>);
}

/**
 * Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
 * media is seeking to a new position.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event
 */
export class SeekingEvent extends MediaEvent<number> {
  static readonly TYPE: 'vds-seeking';
  constructor(eventInit: VdsEventInit<number>);
}

/**
 * Fired when the user agent is trying to fetch media data, but data is unexpectedly not
 * forthcoming.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event
 */
export class StalledEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-stalled';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when media playback has just started, in other words the at the moment the following
 * happens: `currentTime > 0`.
 */
export class StartedEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-started';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when media data loading has been suspended.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event
 */
export class SuspendEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-suspend';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when media playback starts from the beginning again due to the `loop` property being
 * set to `true`.
 */
export class ReplayEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-replay';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when the `currentTime` property value changes due to media playback or the
 * user seeking.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
 */
export class TimeUpdateEvent extends MediaEvent<number> {
  static readonly TYPE: 'vds-time-update';
  constructor(eventInit: VdsEventInit<number>);
}

/**
 * Fired when the `viewType` property changes `value`. This will generally fire when the
 * new provider has mounted and determined what type of player view is appropriate given
 * the type of media it can play.
 */
export class ViewTypeChangeEvent extends MediaEvent<ViewType> {
  static readonly TYPE: 'vds-view-type-change';
  constructor(eventInit: VdsEventInit<ViewType>);
}

/**
 * Fired when the `volume` or `muted` properties change value.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event
 */
export class VolumeChangeEvent extends MediaEvent<VolumeChange> {
  static readonly TYPE: 'vds-volume-change';
  constructor(eventInit: VdsEventInit<VolumeChange>);
}

/**
 * Fired when playback has stopped because of a temporary lack of data.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event
 */
export class WaitingEvent extends MediaEvent<void> {
  static readonly TYPE: 'vds-waiting';
  constructor(eventInit?: VdsEventInit<void>);
}
