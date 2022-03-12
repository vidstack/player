import { TemplateResult } from 'lit';

import { WithMediaPlayer } from '../../media/index.js';
import { VideoElement } from '../../providers/video/index.js';

/**
 * Embeds video content into documents via the native `<video>` element. It may contain
 * one or more video sources, represented using the `src` attribute or the `<source>` element: the
 * browser will choose the most suitable one.
 *
 * The list of [supported media formats](https://developer.mozilla.org/en-US/docs/Web/Media/Formats)
 * varies from one browser to the other. You should either provide your video in a single format
 * that all the relevant browsers support, or provide multiple video sources in enough different
 * formats that all the browsers you need to support are covered.
 *
 * 💡 This element contains the exact same interface as the `<video>` element. It redispatches
 * all the native events if needed, but prefer the `vds-*` variants (eg: `vds-play`) as they
 * iron out any browser issues.
 *
 * @tagname vds-video-player
 * @provider VideoElement
 * @engine [HTMLVideoElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement)
 * @slot - Used to pass in media resources such as `<source>` and `<track>` elements.
 * @slot ui - Used to pass in the player user interface.
 * @csspart media - The video element (`<video>`).
 * @csspart video - Alias for `media` part.
 * @example
 * ```html
 * <vds-video-player src="/media/video.mp4">
 *   <vds-media-ui slot="ui">
 *     <!-- UI components here. -->
 *   </vds-media-ui>
 * </vds-video-player>
 * ```
 * @example
 * ```html
 * <vds-video-player>
 *   <source src="/video/video.mp4" type="video/mp4" />
 *   <vds-media-ui slot="ui">
 *     <!-- UI components here. -->
 *   </vds-media-ui>
 * </vds-video-player>
 * ```
 */
export class VideoPlayerElement extends WithMediaPlayer(VideoElement) {
  override renderProvider(): TemplateResult {
    return this._renderVideo();
  }
}
