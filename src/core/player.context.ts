import createContext, {
  ContextRecord,
  ContextRecordProvider,
  derivedContext,
} from '@wcom/context';

import { MediaType } from './MediaType';
import { NetworkState } from './NetworkState';
import { PlayerProps } from './player.types';
import { ReadyState } from './ReadyState';
import { ViewType } from './ViewType';

export interface PlayerContextProps extends PlayerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  /**
   * The end point of the last time range that has buffered.
   */
  readonly bufferedAmount: number;

  /**
   * The percentage of media that has been buffered at the tail-end.
   */
  readonly bufferedPercentage: number;

  /**
   * Whether the current media is of type `audio`, shorthand for `mediaType === MediaType.Audio`.
   */
  readonly isAudio: boolean;

  /**
   * Whether the current view is of type `audio`, shorthand for `viewType === ViewType.Audio`.
   */
  readonly isAudioView: boolean;

  /**
   * Whether the current media is of type `video`, shorthand for `mediaType === MediaType.Video`.
   */
  readonly isVideo: boolean;

  /**
   * Whether the current view is of type `video`, shorthand for `viewType === ViewType.Video`.
   */
  readonly isVideoView: boolean;

  /**
   * The end point of the last time range that is seekable.
   */
  readonly seekableAmount: number;

  /**
   * The percentage of media that is seekable at the tail-end.
   */
  readonly seekablePercentage: number;
}

export type PlayerContext = ContextRecord<PlayerContextProps>;
export type PlayerContextProvider = ContextRecordProvider<PlayerContextProps>;

/**
 * Avoid declaring context properties with the same name as class properties.
 */
export const transformContextName = (propName: string): string =>
  `${propName}Ctx`;

/**
 * The player context object contains a collection of contexts that map 1:1 with player
 * state. This context enables state to be passed down to elements lower in the player
 * subtree. It's updated by the player when it receives updates from the current provider
 * via events. If you're creating your own elements to place inside the player element you can use
 * it like so...
 *
 * ```ts
 * import { internalProperty, LitElement } from "lit-element";
 * import { playerContext } from "@vidstack/player/core";
 *
 * class MyElement extends LitElement {
 *  \@internalProperty()
 *  \@playerContext.paused.consume()
 *  paused = playerContext.paused.defaultValue;
 * }
 * ```
 */
const buffered = createContext<TimeRanges>(new TimeRanges());
const mediaType = createContext<MediaType>(MediaType.Unknown);
const seekable = createContext<TimeRanges>(new TimeRanges());
const viewType = createContext<ViewType>(ViewType.Unknown);
export const playerContext: PlayerContext = {
  aspectRatio: createContext<string | undefined>(undefined),
  buffered,
  bufferedAmount: createContext<number>(0),
  bufferedPercentage: createContext<number>(0),
  waiting: createContext<boolean>(false),
  controls: createContext<boolean>(false),
  currentPoster: createContext(''),
  currentSrc: createContext(''),
  currentTime: createContext(0),
  duration: createContext<number>(NaN),
  ended: createContext<boolean>(false),
  isAudio: derivedContext(mediaType, m => m === MediaType.Audio),
  isAudioView: derivedContext(viewType, v => v === ViewType.Audio),
  isVideo: derivedContext(mediaType, m => m === MediaType.Video),
  isVideoView: derivedContext(viewType, v => v === ViewType.Video),
  loop: createContext<boolean>(false),
  mediaType,
  muted: createContext<boolean>(false),
  networkState: createContext<NetworkState>(NetworkState.NoSource),
  paused: createContext<boolean>(true),
  canPlay: createContext<boolean>(false),
  canPlayThrough: createContext<boolean>(false),
  played: createContext<TimeRanges>(new TimeRanges()),
  playing: createContext<boolean>(false),
  playsinline: createContext<boolean>(false),
  seekable,
  seekableAmount: createContext<number>(0),
  seekablePercentage: createContext<number>(0),
  started: createContext<boolean>(false),
  readyState: createContext<ReadyState>(ReadyState.HaveNothing),
  viewType,
  volume: createContext(1),
};

// Derived context should take multiple props []
// const end =
//   this.buffered.length === 0
//     ? 0
//     : this.buffered.end(this.buffered.length - 1);
// return end > this.duration ? this.duration : end;
