import createContext, {
  ContextRecord,
  ContextRecordProvider,
  derivedContext,
} from '@wcom/context';

import { canOrientScreen, IS_CLIENT } from '../../utils/support';
import { MediaType } from '../MediaType';
import { MediaProviderElementProps } from '../provider/media-provider.types';
import { ScreenOrientation } from '../ScreenOrientation';
import { createTimeRanges } from '../time-ranges';
import { ViewType } from '../ViewType';

export type MediaContext = ContextRecord<MediaContextProps>;
export type MediaContextProvider = ContextRecordProvider<MediaContextProps>;

/**
 * Avoid declaring context properties with the same name as class properties.
 */
export const transformContextName = (propName: string): string =>
  `${propName}Ctx`;

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
 * import { internalProperty, LitElement } from "lit-element";
 * import { mediaContext } from "@vidstack/elements";
 *
 * class MyElement extends LitElement {
 *  \@internalProperty()
 *  \@mediaContext.paused.consume()
 *  paused = mediaContext.paused.defaultValue;
 * }
 * ```
 */
export const mediaContext: MediaContext = {
  aspectRatio: createContext<string | undefined>(undefined),
  autoplay: createContext<boolean>(false),
  buffered,
  bufferedAmount: derivedContext(
    [buffered, duration] as const,
    (buffered, duration) => {
      const end = buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
      return end > duration ? duration : end;
    },
  ),
  canOrientScreen: createContext<boolean>(canOrientScreen()),
  canPlay: createContext<boolean>(false),
  canPlayThrough: createContext<boolean>(false),
  canRequestFullscreen: createContext<boolean>(false),
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
  live: createContext<boolean>(false),
  loop: createContext<boolean>(false),
  mediaType,
  muted: createContext<boolean>(false),
  paused: createContext<boolean>(true),
  played: createContext(createTimeRanges()),
  playing: createContext<boolean>(false),
  playsinline: createContext<boolean>(false),
  screenOrientation: createContext<ScreenOrientation | undefined>(
    IS_CLIENT ? (screen?.orientation?.type as ScreenOrientation) : undefined,
  ),
  screenOrientationLocked: createContext<boolean>(false),
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
   * The end point of the last time range that is seekable.
   */
  readonly seekableAmount: number;
}
