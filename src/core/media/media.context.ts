import createContext, {
  ContextRecord,
  ContextRecordProvider,
  derivedContext,
} from '@wcom/context';

import { MediaType } from './MediaType';
import { MediaProviderElementProps } from './provider/media-provider.types';
import { createTimeRanges } from './time-ranges';
import { ViewType } from './ViewType';

export type MediaContextRecord = ContextRecord<MediaContextProps>;
export type MediaContextRecordProvider = ContextRecordProvider<MediaContextProps>;

const buffered = createContext(createTimeRanges());
const duration = createContext(NaN);
const mediaType = createContext(MediaType.Unknown);
const seekable = createContext(createTimeRanges());
const viewType = createContext(ViewType.Unknown);

/**
 * The media context object contains a collection of contexts that map 1:1 with media
 * state. This context enables state to be passed down to elements lower in the player
 * subtree. It's updated by the media controller. If you're creating your own elements to place
 * inside the media container you can use it like so...
 *
 * ```ts
 * import { state, LitElement } from "lit";
 * import { mediaContext } from "@vidstack/elements";
 *
 * class MyElement extends LitElement {
 *  \@state()
 *  \@mediaContext.paused.consume()
 *  paused = mediaContext.paused.defaultValue;
 * }
 * ```
 */
export const mediaContext: MediaContextRecord = {
  autoplay: createContext<boolean>(false),
  buffered,
  bufferedAmount: derivedContext(
    [buffered, duration] as const,
    (buffered, duration) => {
      const end = buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
      return end > duration ? duration : end;
    },
  ),
  canRequestFullscreen: createContext<boolean>(false),
  canPlay: createContext<boolean>(false),
  canPlayThrough: createContext<boolean>(false),
  controls: createContext<boolean>(false),
  currentPoster: createContext(''),
  currentSrc: createContext(''),
  currentTime: createContext(0),
  duration,
  ended: createContext<boolean>(false),
  error: createContext<unknown | undefined>(undefined),
  fullscreen: createContext<boolean>(false),
  isAudio: derivedContext([mediaType], m => m === MediaType.Audio),
  isAudioView: derivedContext([viewType], v => v === ViewType.Audio),
  isVideo: derivedContext([mediaType], m => m === MediaType.Video),
  isVideoView: derivedContext([viewType], v => v === ViewType.Video),
  isLiveVideo: derivedContext([mediaType], m => m === MediaType.LiveVideo),
  loop: createContext<boolean>(false),
  mediaType,
  muted: createContext<boolean>(false),
  paused: createContext<boolean>(true),
  played: createContext(createTimeRanges()),
  playing: createContext<boolean>(false),
  playsinline: createContext<boolean>(false),
  seekable,
  seekableAmount: derivedContext(
    [seekable, duration] as const,
    (seekable, duration) => {
      const end = seekable.length === 0 ? 0 : seekable.end(seekable.length - 1);
      return end > duration ? duration : end;
    },
  ),
  seeking: createContext<boolean>(false),
  started: createContext<boolean>(false),
  viewType,
  volume: createContext(1),
  waiting: createContext<boolean>(false),
};

export const mediaContextRecord = createContext(initMediaContextProvider());

export function initMediaContextProvider(): MediaContextRecordProvider {
  return Object.keys(mediaContext).reduce(
    (state, prop) => ({
      ...state,
      [prop]: mediaContext[prop].defaultValue,
    }),
    {},
  ) as MediaContextRecordProvider;
}

/**
 * Media context properties that should be reset when media is changed.
 */
export const softResettableMediaContextProps = new Set([
  'buffered',
  'buffering',
  'canPlay',
  'canPlayThrough',
  'currentSrc',
  'currentTime',
  'duration',
  'ended',
  'mediaType',
  'paused',
  'canPlay',
  'played',
  'playing',
  'seekable',
  'seeking',
  'started',
  'waiting',
]);

export interface MediaContextProps extends MediaProviderElementProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  /**
   * The end point of the last time range that has buffered.
   */
  readonly bufferedAmount: number;

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
   * Whether the current media is of type `live-video`, shorthand for `mediaType === MediaType.LiveVideo`.
   */
  readonly isLiveVideo: boolean;

  /**
   * The end point of the last time range that is seekable.
   */
  readonly seekableAmount: number;
}
