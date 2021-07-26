import { ContextProviderRecord } from '@base/context';
import type { DisposalBin } from '@base/events';
import type { FullscreenController } from '@base/fullscreen';
import type { RequestQueue } from '@base/queue';
import type { VideoElement } from '@providers/video';

import type { CanPlay } from '../CanPlay';
import { mediaContext } from '../context';
import type { MediaProviderElement } from '../provider';

export interface MediaProviderBridge
  extends MediaProviderBridgedProperties,
    MediaProviderBridgedMethods {
  /**
   * The media context record. Any property updated inside this object will trigger a context
   * update that will flow down to all consumer components. This record is injected into a
   * a media provider element (see `handleMediaProviderConnect`) as it's responsible for managing
   * it (ie: updating context properties).
   *
   * @internal
   */
  readonly ctx: ContextProviderRecord<typeof mediaContext>;

  /**
   * The current media provider that belongs to this controller. Defaults to `undefined` if there
   * is none.
   */
  readonly mediaProvider: MediaProviderElement | undefined;

  readonly fullscreenController: FullscreenController;

  readonly mediaProviderConnectedQueue: RequestQueue<
    string | symbol,
    () => void | Promise<void>
  >;

  readonly mediaProviderDisconnectDisposal: DisposalBin;
}

export type MediaProviderBridgedProperties = Pick<
  VideoElement,
  | 'autoPiP'
  | 'autoplay'
  | 'buffered'
  | 'canPlay'
  | 'canPlayThrough'
  | 'canRequestFullscreen'
  | 'controls'
  | 'controlsList'
  | 'crossOrigin'
  | 'currentPoster'
  | 'currentSrc'
  | 'currentTime'
  | 'defaultMuted'
  | 'defaultPlaybackRate'
  | 'disablePiP'
  | 'disableRemotePlayback'
  | 'duration'
  | 'ended'
  | 'error'
  | 'fullscreen'
  | 'fullscreenOrientation'
  | 'height'
  | 'live'
  | 'loop'
  | 'mediaType'
  | 'muted'
  | 'networkState'
  | 'paused'
  | 'played'
  | 'playing'
  | 'playsinline'
  | 'poster'
  | 'preload'
  | 'readyState'
  | 'seekable'
  | 'seeking'
  | 'src'
  | 'srcObject'
  | 'started'
  | 'viewType'
  | 'volume'
  | 'waiting'
  | 'width'
>;

export interface MediaProviderBridgedMethods {
  /**
   * Begins/resumes playback of the media. If this method is called programmatically before the
   * user has interacted with the player, the promise may be rejected subject to the browser's
   * autoplay policies.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
   */
  play(): Promise<void>;

  /**
   * Pauses playback of the media.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause
   */
  pause(): Promise<void>;

  /**
   * Determines if the media provider can play the given `type`. The `type` is
   * generally the media resource identifier, URL or MIME type (optional Codecs parameter).
   *
   * @example `audio/mp3`
   * @example `video/mp4`
   * @example `video/webm; codecs="vp8, vorbis"`
   * @example `/my-audio-file.mp3`
   * @example `youtube/RO7VcUAsf-I`
   * @example `vimeo.com/411652396`
   * @example `https://www.youtube.com/watch?v=OQoz7FCWkfU`
   * @example `https://media.vidstack.io/hls/index.m3u8`
   * @example `https://media.vidstack.io/dash/index.mpd`
   * @link https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter
   */
  canPlayType(type: string): CanPlay;

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Returns a `MediaStream` object which is streaming a real-time capture
   * of the content being rendered in the media element. This method will return `undefined`
   * if this API is not available.
   *
   * 💡 Only available with `Html5MediaElement` or a descendant of it.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream
   */
  captureStream?(): MediaStream | undefined;

  /**
   * Issues an asynchronous request to exit fullscreen mode.
   */
  exitFullscreen(): Promise<void>;

  /**
   * Resets the media element to its initial state and begins the process of selecting a media
   * source and loading the media in preparation for playback to begin at the beginning. The
   * amount of media data that is prefetched is determined by the value of the element's
   * `preload` attribute.
   *
   * 💡 You should generally not need to call this method as it's handled by the library.
   *
   * 💡 Only available with `Html5MediaElement` or a descendant of it.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/load
   */
  load?(): void;

  /**
   * Determines if the media provider "should" play the given type. "Should" in this
   * context refers to the `canPlayType()` method returning `Maybe` or `Probably`.
   */
  shouldPlayType(type: string): boolean;

  /**
   * Issues an asynchronous request to display the video in picture-in-picture mode.
   *
   * It's not guaranteed that the video will be put into picture-in-picture. If permission to enter
   * that mode is granted, the returned `Promise` will resolve and the video will receive a
   * `enterpictureinpicture` event to let it know that it's now in picture-in-picture.
   *
   * 💡 Only available with `VideoElement` or a descendant of it.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture
   */
  // eslint-disable-next-line
  requestPictureInPicture?(): Promise<PictureInPictureWindow>;
}
