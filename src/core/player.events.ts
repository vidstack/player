import {
  buildVdsEvent,
  ExtractEventDetailType,
  VdsCustomEvent,
  VdsCustomEventConstructor,
  VdsEventInit,
  VdsEvents,
} from '../shared/events';
import { MediaType } from './MediaType';
import { MediaProvider } from './provider/MediaProvider';
import { ViewType } from './ViewType';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsPlayerEvents {}
}

export interface PlayerEvents {
  abort: VdsCustomEvent<void>;
  'can-play': VdsCustomEvent<void>;
  'can-play-through': VdsCustomEvent<void>;
  connect: VdsCustomEvent<MediaProvider>;
  disconnect: VdsCustomEvent<MediaProvider>;
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
  'volume-change': VdsCustomEvent<{ volume: number; muted: boolean }>;
  waiting: VdsCustomEvent<void>;
}

export type VdsPlayerEvents = VdsEvents<PlayerEvents>;

export function buildVdsPlayerEvent<
  P extends keyof PlayerEvents,
  DetailType = ExtractEventDetailType<PlayerEvents[P]>
>(type: P): VdsCustomEventConstructor<DetailType> {
  return class VdsPlayerEvent extends buildVdsEvent<DetailType>(type) {
    constructor(eventInit?: VdsEventInit<DetailType>) {
      super({
        bubbles: false,
        ...(eventInit ?? {}),
      });
    }
  };
}

/**
 * Fired when the resource was not fully loaded, but not as the result of an error.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event
 */
export class VdsAbortEvent extends buildVdsPlayerEvent('abort') {}

/**
 * Fired when the user agent can play the media, but estimates that **not enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
 */
export class VdsCanPlayEvent extends buildVdsPlayerEvent('can-play') {}

/**
 * Fired when the user agent can play the media, and estimates that **enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
 */
export class VdsCanPlayThroughEvent extends buildVdsPlayerEvent(
  'can-play-through',
) {}

/**
 * Fired when the provider connects to the DOM.
 */
export class VdsConnectEvent extends buildVdsPlayerEvent('connect') {}

/**
 * Fired when the provider disconnects from the DOM.
 */
export class VdsDisconnectEvent extends buildVdsPlayerEvent('disconnect') {}

/**
 * Fired when the `duration` property changes.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event
 */
export class VdsDurationChangeEvent extends buildVdsPlayerEvent(
  'duration-change',
) {}

/**
 * Fired when the media has become empty.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event
 */
export class VdsEmpitedEvent extends buildVdsPlayerEvent('emptied') {}

/**
 * Fired when playback or streaming has stopped because the end of the media was reached or
 * because no further data is available. This is not fired if playback will start from the
 * beginning again due to the `loop` property being `true` (see `VdsReplayEvent`).
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
 */
export class VdsEndedEvent extends buildVdsPlayerEvent('ended') {}

/**
 * Fired when any error has occurred within the player such as a media error, or
 * potentially a request that cannot be fulfilled such as calling `requestFullscreen()`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event
 */
export class VdsErrorEvent extends buildVdsPlayerEvent('error') {}

/**
 * Fired when the player enters/exits fullscreen mode. When the detail is `true` it means
 * the player has entered fullscreen, `false` represents the opposite.
 */
export class VdsFullscreenChangeEvent extends buildVdsPlayerEvent(
  'fullscreen-change',
) {}

/**
 * Fired when the frame at the current playback position of the media has finished loading; often
 * the first frame.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event
 */
export class VdsLoadedDataEvent extends buildVdsPlayerEvent('loaded-data') {}

/**
 * Fired when the metadata has been loaded.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event
 */
export class VdsLoadedMetadataEvent extends buildVdsPlayerEvent(
  'loaded-metadata',
) {}

/**
 * Fired when the browser has started to load a resource.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event
 */
export class VdsLoadStartEvent extends buildVdsPlayerEvent('load-start') {}

/**
 * Fired when the `mediaType` property changes value.
 */
export class VdsMediaTypeChangeEvent extends buildVdsPlayerEvent(
  'media-type-change',
) {}

/**
 * Fired when a request to `pause` an activity is handled and the activity has entered its
 * `paused` state, most commonly after the media has been paused through a call to the
 * `pause()` method.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event
 */
export class VdsPauseEvent extends buildVdsPlayerEvent('pause') {}

/**
 * Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
 * method, or the `autoplay` attribute.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event
 */
export class VdsPlayEvent extends buildVdsPlayerEvent('play') {}

/**
 * Fired when playback is ready to start after having been paused or delayed due to lack of data.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event
 */
export class VdsPlayingEvent extends buildVdsPlayerEvent('playing') {}

/**
 * Fired periodically as the browser loads a resource.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event
 */
export class VdsProgressEvent extends buildVdsPlayerEvent('progress') {}

/**
 * Fired when a seek operation completed, the current playback position has changed, and the
 * `seeking` property is changed to `false`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event
 */
export class VdsSeekedEvent extends buildVdsPlayerEvent('seeked') {}

/**
 * Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
 * media is seeking to a new position.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event
 */
export class VdsSeekingEvent extends buildVdsPlayerEvent('seeking') {}

/**
 * Fired when the user agent is trying to fetch media data, but data is unexpectedly not
 * forthcoming.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event
 */
export class VdsStalledEvent extends buildVdsPlayerEvent('stalled') {}

/**
 * Fired when media playback has just started, in other words the at the moment the following
 * happens: `currentTime > 0`.
 */
export class VdsStartedEvent extends buildVdsPlayerEvent('started') {}

/**
 * Fired when media data loading has been suspended.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event
 */
export class VdsSuspendEvent extends buildVdsPlayerEvent('suspend') {}

/**
 * Fired when media playback starts from the beginning again due to the `loop` property being
 * set to `true`.
 */
export class VdsReplayEvent extends buildVdsPlayerEvent('replay') {}

/**
 * Fired when the `currentTime` property value changes due to media playback or the
 * user seeking.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
 */
export class VdsTimeUpdateEvent extends buildVdsPlayerEvent('time-update') {}

/**
 * Fired when the `viewType` property changes `value`. This will generally fire when the
 * new provider has mounted and determined what type of player view is appropriate given
 * the type of media it can play.
 */
export class VdsViewTypeChangeEvent extends buildVdsPlayerEvent(
  'view-type-change',
) {}

/**
 * Fired when the `volume` or `muted` properties change value.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event
 */
export class VdsVolumeChangeEvent extends buildVdsPlayerEvent(
  'volume-change',
) {}

/**
 * Fired when playback has stopped because of a temporary lack of data.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event
 */
export class VdsWaitingEvent extends buildVdsPlayerEvent('waiting') {}
