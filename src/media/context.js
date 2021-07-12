import { createContext, derivedContext } from '../foundation/context/index.js';
import { MediaType } from './MediaType.js';
import { createTimeRanges } from './time-ranges.js';
import { ViewType } from './ViewType.js';

// Decalred here as they are used within derived contexts below.
const buffered = createContext(createTimeRanges());
const duration = createContext(NaN);
const mediaType = createContext(MediaType.Unknown);
const seekable = createContext(createTimeRanges());
const viewType = createContext(ViewType.Unknown);
const isLiveVideo = derivedContext(
  [mediaType],
  ([m]) => m === MediaType.LiveVideo
);

/**
 * The media context record contains a collection of contexts that map 1:1 with media
 * state. This context enables state to be passed down to elements lower in the media
 * subtree. It's updated by the media controller. If you're creating your own elements to place
 * inside the media container you can use it like so...
 *
 * ```js
 * import { mediaContext, VdsElement } from "@vidstack/elements";
 *
 * class MyElement extends VdsElement {
 *  constructor() {
 *    this.mediaPaused = mediaContext.paused.initialValue;
 *  }
 *
 *  static get contextConsumers() {
 *    return {
 *      mediaPaused: mediaContext.paused
 *    }
 *  }
 * }
 * ```
 */
export const mediaContext = {
  autoplay: createContext(false),
  buffered,
  duration,
  bufferedAmount: derivedContext(
    [buffered, duration],
    ([buffered, duration]) => {
      const end = buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
      return end > duration ? duration : end;
    }
  ),
  canRequestFullscreen: createContext(false),
  canPlay: createContext(false),
  canPlayThrough: createContext(false),
  controls: createContext(false),
  currentPoster: createContext(''),
  currentSrc: createContext(''),
  currentTime: createContext(0),
  ended: createContext(false),
  error:
    /** @type {import('../foundation/context').Context<unknown | undefined>} */ (
      createContext(undefined)
    ),
  fullscreen: createContext(false),
  loop: createContext(false),
  live: derivedContext([isLiveVideo], ([d]) => d),
  mediaType,
  isAudio: derivedContext([mediaType], ([m]) => m === MediaType.Audio),
  isVideo: derivedContext([mediaType], ([m]) => m === MediaType.Video),
  isLiveVideo,
  muted: createContext(false),
  paused: createContext(true),
  played: createContext(createTimeRanges()),
  playing: createContext(false),
  playsinline: createContext(false),
  seekable,
  seekableAmount: derivedContext(
    [seekable, duration],
    ([seekable, duration]) => {
      const end = seekable.length === 0 ? 0 : seekable.end(seekable.length - 1);
      return end > duration ? duration : end;
    }
  ),
  seeking: createContext(false),
  started: createContext(false),
  viewType,
  isAudioView: derivedContext([viewType], ([v]) => v === ViewType.Audio),
  isVideoView: derivedContext([viewType], ([v]) => v === ViewType.Video),
  volume: createContext(1),
  waiting: createContext(false)
};

/**
 * @returns {import('../foundation/context').ContextProviderRecord<typeof mediaContext>}
 */
export function createMediaContextRecord() {
  return Object.keys(mediaContext).reduce(
    (state, contextProp) => ({
      ...state,
      [contextProp]: mediaContext[contextProp].initialValue
    }),
    /** @type {any} */ ({})
  );
}
