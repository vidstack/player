import type { HTMLCustomElement } from 'maverick.js/element';

import type { HTMLProviderEvents, HTMLProviderMembers, HTMLProviderProps } from '../html/types';
import type { VideoPresentationEvents } from './presentation/events';

export interface VideoProviderProps extends HTMLProviderProps {}

export interface VideoProviderEvents extends HTMLProviderEvents, VideoPresentationEvents {}

export interface VideoProviderMembers extends HTMLProviderMembers {}

export interface VideoProviderCSSVars {
  /**
   * The width of the video element.
   */
  'video-width': number;
  /**
   * The height of the video element.
   */
  'video-height': number;
  /**
   * The background color of the video content.
   */
  'video-bg-color': string;
}

/**
 * The `<vds-video>` component adapts the slotted `<video>` element to enable loading videos
 * via the HTML Media Element API.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/providers/video}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @slot - Used to pass in the `<video>` element.
 * @example
 * ```html
 * <vds-media poster="https://media-files.vidstack.io/poster.png">
 *   <vds-video>
 *     <video
 *       preload="none"
 *       src="https://media-files.vidstack.io/720p.mp4"
 *     ></video>
 *   </vds-video>
 * </vds-media>
 * ```
 * @example
 * ```html
 * <vds-media poster="https://media-files.vidstack.io/poster.png">
 *   <vds-video>
 *     <video preload="none">
 *       <source
 *         src="https://media-files.vidstack.io/720p.mp4"
 *         type="video/mp4"
 *       />
 *       <track
 *         default
 *         kind="subtitles"
 *         srclang="en"
 *         label="English"
 *         src="https://media-files.vidstack.io/subs/english.vtt"
 *       />
 *     </video>
 *   </vds-video>
 * </vds-media>
 * ```
 */
export interface VideoElement
  extends HTMLCustomElement<VideoProviderProps, VideoProviderEvents, VideoProviderCSSVars>,
    VideoProviderMembers {}
