import createContext, {
  ContextRecord,
  ContextRecordProvider,
  derivedContext,
} from '@wcom/context';

import { MediaType } from './MediaType';
import { PlayerProps } from './player.types';
import { ViewType } from './ViewType';

export type PlayerContext = ContextRecord<PlayerProps>;
export type PlayerContextProvider = ContextRecordProvider<PlayerProps>;

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
const viewType = createContext<ViewType>(ViewType.Unknown);
const mediaType = createContext<MediaType>(MediaType.Unknown);
export const playerContext: PlayerContext = {
  currentSrc: createContext(''),
  volume: createContext(1),
  currentTime: createContext(0),
  paused: createContext<boolean>(true),
  controls: createContext<boolean>(false),
  currentPoster: createContext(''),
  muted: createContext<boolean>(false),
  playsinline: createContext<boolean>(false),
  loop: createContext<boolean>(false),
  aspectRatio: createContext<string | undefined>(undefined),
  duration: createContext<number>(-1),
  buffered: createContext<number>(0),
  isBuffering: createContext<boolean>(false),
  isPlaying: createContext<boolean>(false),
  hasPlaybackStarted: createContext<boolean>(false),
  hasPlaybackEnded: createContext<boolean>(false),
  isPlaybackReady: createContext<boolean>(false),
  viewType,
  isAudioView: derivedContext(viewType, v => v === ViewType.Audio),
  isVideoView: derivedContext(viewType, v => v === ViewType.Video),
  mediaType,
  isAudio: derivedContext(mediaType, m => m === MediaType.Audio),
  isVideo: derivedContext(mediaType, m => m === MediaType.Video),
};
