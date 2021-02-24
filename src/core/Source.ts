import { LitElement, property } from 'lit-element';
import { Src, SrcType } from './player.types';

/**
 * A source represents one or many media resources for the `Player` component to attempt to load.
 *
 * @examples
 * ```html
 * <!-- 1. -->
 * <vds-source src="my-audio-file.mp3"></vds-source>
 *
 * <!-- 2. -->
 * <vds-source src="my-video-file.mp4"></vds-source>
 *
 * <!-- 3. -->
 * <vds-source src="my-video-file.webm" type="video/webm"></vds-source>
 * <vds-source src="my-video-file.ogg" type="video/ogg"></vds-source>
 * <vds-source src="my-video-file.mov" type="video/quicktime"></vds-source>
 *
 * <!-- 4. -->
 * <vds-source src="RO7VcUAsf-I" type="youtube"></vds-source>
 *
 * <!-- 5. -->
 * <vds-source src="www.youtube.com/watch?v=OQoz7FCWkfU"></vds-source>
 *
 * <!-- 6. -->
 * <vds-source src="https://media.vidstack.io/hls/index.m3u8"></vds-source>
 *
 * <!-- 7. -->
 * <vds-source src="https://media.vidstack.io/dash/index.mpd"></vds-source>
 * ```
 */
export class Source extends LitElement {
  /**
   * The identifier or URL of a media resource to use. This might be an aboslute/relative URL
   * when loading a file, or it might be a media identifier on any valid platform (eg: YouTube).
   */
  @property()
  src: Src = '';

  /**
   * Generally the platform identifier (optional stream type) _or_ media resource
   * MIME type (optional codecs parameter) _or_ streaming protocol (optional container format).
   *
   * **If the `type` attribute isn't specified**, the media's type is determined by either parsing
   * the `src` string or retreiving it from the server and checking to see if any provider can
   * handle it; if it can't be rendered, the next `<source>` is checked.
   *
   * **If the `type` attribute is specified**, it's compared against the types the player
   * can present, and if it's not recognized, the server doesn't even get queried; instead,
   * the next `<source>` element is checked at once.
   *
   * @examples
   * - `{platform}`
   * - `{platform}/{streamType}`
   * - `{mediaType}/{container format}`
   * - `{mediaType}/{container format}; codecs={audio codec}`
   * - `{mediaType}/{container format}; codecs="{video codec}, {audio codec}"`
   * - `{streamingProtocol}/{container format}`
   *
   * @examples
   * - `audio/mp3`
   * - `video/mp4`
   * - `video/webm; codecs="vp8, vorbis"`
   * - `youtube`
   * - `youtube/live`
   * - `vimeo`
   * - `vimeo/live`
   * - `dailymotion`
   * - `hls/mts`
   * - `dash/fmp4`
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter
   * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
   */
  @property()
  type: SrcType = '';
}
