import type { HTMLCustomElement } from 'maverick.js/element';

import type { HTMLProviderEvents, HTMLProviderMembers, HTMLProviderProps } from '../html/types';
import type { VideoPresentationEvents } from './presentation/events';
import type { UseVideoFullscreen } from './use-video-fullscreen';

export interface VideoProviderProps extends HTMLProviderProps {}

export interface VideoProviderEvents extends HTMLProviderEvents, VideoPresentationEvents {}

export interface VideoProviderMembers extends HTMLProviderMembers {
  readonly fullscreen: UseVideoFullscreen;
}

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
 * The `<vds-video>` component adapts the slotted `<video>` element to satisfy the media provider
 * contract, which generally involves providing a consistent API for loading, managing, and
 * tracking media state.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/providers/video}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @slot - Used to pass in the `<video>` element.
 * @example
 * ```html
 * <vds-video poster="https://media-files.vidstack.io/poster.png">
 *   <video
 *     preload="none"
 *     src="https://media-files.vidstack.io/720p.mp4"
 *   ></video>
 * </vds-video>
 * ```
 * @example
 * ```html
 * <vds-video poster="https://media-files.vidstack.io/poster.png">
 *   <video preload="none">
 *     <source
 *       src="https://media-files.vidstack.io/720p.mp4"
 *       type="video/mp4"
 *     />
 *     <track
 *       default
 *       kind="subtitles"
 *       srclang="en"
 *       label="English"
 *       src="https://media-files.vidstack.io/subs/english.vtt"
 *     />
 *   </video>
 * </vds-video>
 * ```
 */
export interface VideoElement
  extends HTMLCustomElement<VideoProviderProps, VideoProviderEvents, VideoProviderCSSVars>,
    VideoProviderMembers {}
