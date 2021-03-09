export type MediaFileProviderEngine = HTMLMediaElement | undefined;

/**
 * A DOMString` indicating the `CORS` setting for this media element.
 */
export type MediaCrossOriginOption = 'anonymous' | 'use-credentials';

/**
 * Is a `DOMString` that reflects the `preload` HTML attribute, indicating what data should be
 * preloaded, if any.
 */
export type MediaPreloadOption = 'none' | 'metadata' | 'auto';

/**
 * The `HTMLMediaElement.readyState` property indicates the readiness state of the media.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
 */
export enum ReadyState {
  /**
   * No information is available about the media resource.
   */
  HaveNothing = 0,

  /**
   * Enough of the media resource has been retrieved that the metadata attributes are initialized.
   * Seeking will no longer raise an exception.
   */
  HaveMetaData = 1,

  /**
   * Data is available for the current playback position, but not enough to actually play more
   * than one frame.
   */
  HaveCurrentData = 2,

  /**
   * Data for the current playback position as well as for at least a little bit of time into the
   * future is available (in other words, at least two frames of video, for example).
   */
  HaveFutureData = 3,

  /**
   * Enough data is available—and the download rate is high enough—that the media can be played
   * through to the end without interruption.
   */
  HaveEnoughData = 4,
}

// V8ToIstanbul fails when no value is exported.
export default class {}
