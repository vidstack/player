import { Store, StoreFactory } from "maverick.js";

export const AdsStoreFactory = new StoreFactory<AdsState>({
  loaded: false,
  canPlay: false,
  started: false,
  playing: false,
  buffering: false,
  cuePoints: [],
});

export interface AdsStore extends Store<AdsState> {}

export interface AdsState {
  /**
   * Whether the ads have been loaded.
   */
  loaded: boolean;
  /**
   * Wether the ad is ready to play without buffering.
   */
  canPlay: boolean;
  /**
   * Whether an ad is currently playing.
   */
  started: boolean;
  /**
   * Whether an ad is currently playing.
   */
  playing: boolean;
  /**
  * Whether an ad is being buffered.
  */
  buffering: boolean;
  /**
   * The cue point list represents a time-schedule of ad breaks.
   * Note that individual ads in the ad break are not included in the schedule.
   */
  cuePoints: Number[];
}