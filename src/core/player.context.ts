import createContext from '@wcom/context';

import { MediaType, PlayerContext, ViewType } from './player.types';
import { uuidContext } from './uuid/uuid.context';

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
export const playerContext: PlayerContext = Object.freeze({
  uuid: uuidContext,
  currentSrc: createContext(''),
  volume: createContext(1),
  currentTime: createContext(0),
  paused: createContext(true),
  controls: createContext(false),
  currentPoster: createContext(''),
  muted: createContext(false),
  aspectRatio: createContext(undefined),
  duration: createContext(-1),
  buffered: createContext(0),
  isBuffering: createContext(false),
  isPlaying: createContext(false),
  hasPlaybackStarted: createContext(false),
  hasPlaybackEnded: createContext(false),
  isPlaybackReady: createContext(false),
  viewType: createContext(ViewType.Unknown),
  isAudioView: createContext(false),
  isVideoView: createContext(false),
  mediaType: createContext(MediaType.Unknown),
  isAudio: createContext(false),
  isVideo: createContext(false),
});
