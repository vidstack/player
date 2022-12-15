import type { HTMLCustomElement } from 'maverick.js/element';

import type { HTMLProviderEvents, HTMLProviderMembers, HTMLProviderProps } from '../html/types';
import type { VideoPresentationEvents } from './presentation/events';
import type { UseVideoFullscreen } from './use-video-fullscreen';

export interface VideoProviderProps extends HTMLProviderProps {}

export interface VideoProviderEvents extends HTMLProviderEvents, VideoPresentationEvents {}

export interface VideoProviderMembers extends HTMLProviderMembers {
  readonly fullscreen: UseVideoFullscreen;
}

/**
 * The `<vds-video>` element adapts the underlying `<video>` element to satisfy the media provider
 * contract, which generally involves providing a consistent API for loading, managing, and
 * tracking media state.
 *
 * @tagname vds-video
 * @slot - Used to pass in the `<video>` element.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @cssprop --vds-video-width - The width of the video element.
 * @cssprop --vds-video-height - The height of the video element.
 * @cssprop --vds-video-bg-color - The background color of the video content.
 * @example
 * ```html
 * <vds-video poster="https://media-files.vidstack.io/poster.png">
 *   <video
 *     controls
 *     preload="none"
 *     src="https://media-files.vidstack.io/720p.mp4"
 *     poster="https://media-files.vidstack.io/poster-seo.png"
 *   ></video>
 * </vds-video>
 * ```
 * @example
 * ```html
 * <vds-video poster="https://media-files.vidstack.io/poster.png">
 *   <video
 *     controls
 *     preload="none"
 *     poster="https://media-files.vidstack.io/poster-seo.png"
 *   >
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
  extends HTMLCustomElement<VideoProviderProps, VideoProviderEvents>,
    VideoProviderMembers {}
