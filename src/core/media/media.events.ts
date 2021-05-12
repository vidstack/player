import { VdsCustomEvent, VdsEventInit, VdsEvents } from '../../shared/events';
import { MediaType } from './MediaType';
import { ViewType } from './ViewType';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsMediaEvents {}
}

export interface VolumeChange {
  volume: number;
  muted: boolean;
}

export interface MediaEvents {
  abort: VdsCustomEvent<void>;
  'can-play': VdsCustomEvent<void>;
  'can-play-through': VdsCustomEvent<void>;
  'duration-change': VdsCustomEvent<number>;
  emptied: VdsCustomEvent<void>;
  ended: VdsCustomEvent<void>;
  error: VdsCustomEvent<unknown>;
  'fullscreen-change': VdsCustomEvent<boolean>;
  'loaded-data': VdsCustomEvent<void>;
  'loaded-metadata': VdsCustomEvent<void>;
  'load-start': VdsCustomEvent<void>;
  'media-type-change': VdsCustomEvent<MediaType>;
  pause: VdsCustomEvent<void>;
  play: VdsCustomEvent<void>;
  playing: VdsCustomEvent<void>;
  progress: VdsCustomEvent<void>;
  seeked: VdsCustomEvent<number>;
  seeking: VdsCustomEvent<number>;
  stalled: VdsCustomEvent<void>;
  started: VdsCustomEvent<void>;
  suspend: VdsCustomEvent<void>;
  replay: VdsCustomEvent<void>;
  'time-update': VdsCustomEvent<number>;
  'view-type-change': VdsCustomEvent<ViewType>;
  'volume-change': VdsCustomEvent<VolumeChange>;
  waiting: VdsCustomEvent<void>;
}

export type VdsMediaEvents = VdsEvents<MediaEvents>;

export class VdsMediaEvent<DetailType> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof VdsMediaEvents;
}

/**
 * Fired when the resource was not fully loaded, but not as the result of an error.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event
 */
export class VdsAbortEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-abort';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsAbortEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the user agent can play the media, but estimates that **not enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
 */
export class VdsCanPlayEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-can-play';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsCanPlayEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the user agent can play the media, and estimates that **enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
 */
export class VdsCanPlayThroughEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-can-play-through';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsCanPlayThroughEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `duration` property changes.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event
 */
export class VdsDurationChangeEvent extends VdsMediaEvent<number> {
  static readonly TYPE = 'vds-duration-change';
  constructor(eventInit: VdsEventInit<number>) {
    super(VdsDurationChangeEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the media has become empty.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event
 */
export class VdsEmptiedEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-emptied';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsEmptiedEvent.TYPE, eventInit);
  }
}

/**
 * Fired when playback or streaming has stopped because the end of the media was reached or
 * because no further data is available. This is not fired if playback will start from the
 * beginning again due to the `loop` property being `true` (see `MediaReplayEvent`).
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
 */
export class VdsEndedEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-ended';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsEndedEvent.TYPE, eventInit);
  }
}

/**
 * Fired when any error has occurred within the player such as a media error, or
 * potentially a request that cannot be fulfilled such as calling `requestFullscreen()`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event
 */
export class VdsErrorEvent extends VdsMediaEvent<unknown> {
  static readonly TYPE = 'vds-error';
  constructor(eventInit: VdsEventInit<unknown>) {
    super(VdsErrorEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the player enters/exits fullscreen mode. When the detail is `true` it means
 * the player has entered fullscreen, `false` represents the opposite.
 */
export class VdsFullscreenChangeEvent extends VdsMediaEvent<boolean> {
  static readonly TYPE = 'vds-fullscreen-change';
  constructor(eventInit: VdsEventInit<boolean>) {
    super(VdsFullscreenChangeEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the frame at the current playback position of the media has finished loading; often
 * the first frame.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event
 */
export class VdsLoadedDataEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-loaded-data';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsLoadedDataEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the metadata has been loaded.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event
 */
export class VdsLoadedMetadataEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-loaded-metadata';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsLoadedMetadataEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the browser has started to load a resource.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event
 */
export class VdsLoadStartEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-load-start';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsLoadStartEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `mediaType` property changes value.
 */
export class VdsMediaTypeChangeEvent extends VdsMediaEvent<MediaType> {
  static readonly TYPE = 'vds-media-type-change';
  constructor(eventInit: VdsEventInit<MediaType>) {
    super(VdsMediaTypeChangeEvent.TYPE, eventInit);
  }
}

/**
 * Fired when a request to `pause` an activity is handled and the activity has entered its
 * `paused` state, most commonly after the media has been paused through a call to the
 * `pause()` method.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event
 */
export class VdsPauseEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-pause';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsPauseEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
 * method, or the `autoplay` attribute.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event
 */
export class VdsPlayEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-play';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsPlayEvent.TYPE, eventInit);
  }
}

/**
 * Fired when playback is ready to start after having been paused or delayed due to lack of data.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event
 */
export class VdsPlayingEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-playing';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsPlayingEvent.TYPE, eventInit);
  }
}

/**
 * Fired periodically as the browser loads a resource.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event
 */
export class VdsProgressEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-progress';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsProgressEvent.TYPE, eventInit);
  }
}

/**
 * Fired when a seek operation completed, the current playback position has changed, and the
 * `seeking` property is changed to `false`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event
 */
export class VdsSeekedEvent extends VdsMediaEvent<number> {
  static readonly TYPE = 'vds-seeked';
  constructor(eventInit: VdsEventInit<number>) {
    super(VdsSeekedEvent.TYPE, eventInit);
  }
}

/**
 * Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
 * media is seeking to a new position.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event
 */
export class VdsSeekingEvent extends VdsMediaEvent<number> {
  static readonly TYPE = 'vds-seeking';
  constructor(eventInit: VdsEventInit<number>) {
    super(VdsSeekingEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the user agent is trying to fetch media data, but data is unexpectedly not
 * forthcoming.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event
 */
export class VdsStalledEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-stalled';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsStalledEvent.TYPE, eventInit);
  }
}

/**
 * Fired when media playback has just started, in other words the at the moment the following
 * happens: `currentTime > 0`.
 */
export class VdsStartedEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-started';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsStartedEvent.TYPE, eventInit);
  }
}

/**
 * Fired when media data loading has been suspended.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event
 */
export class VdsSuspendEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-suspend';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsSuspendEvent.TYPE, eventInit);
  }
}

/**
 * Fired when media playback starts from the beginning again due to the `loop` property being
 * set to `true`.
 */
export class VdsReplayEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-replay';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsReplayEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `currentTime` property value changes due to media playback or the
 * user seeking.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
 */
export class VdsTimeUpdateEvent extends VdsMediaEvent<number> {
  static readonly TYPE = 'vds-time-update';
  constructor(eventInit: VdsEventInit<number>) {
    super(VdsTimeUpdateEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `viewType` property changes `value`. This will generally fire when the
 * new provider has mounted and determined what type of player view is appropriate given
 * the type of media it can play.
 */
export class VdsViewTypeChangeEvent extends VdsMediaEvent<ViewType> {
  static readonly TYPE = 'vds-view-type-change';
  constructor(eventInit: VdsEventInit<ViewType>) {
    super(VdsViewTypeChangeEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `volume` or `muted` properties change value.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event
 */
export class VdsVolumeChangeEvent extends VdsMediaEvent<VolumeChange> {
  static readonly TYPE = 'vds-volume-change';
  constructor(eventInit: VdsEventInit<VolumeChange>) {
    super(VdsVolumeChangeEvent.TYPE, eventInit);
  }
}

/**
 * Fired when playback has stopped because of a temporary lack of data.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event
 */
export class VdsWaitingEvent extends VdsMediaEvent<void> {
  static readonly TYPE = 'vds-waiting';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsWaitingEvent.TYPE, eventInit);
  }
}
