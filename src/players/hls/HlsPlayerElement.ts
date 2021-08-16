import { TemplateResult } from 'lit';

import { WithMediaPlayer } from '../../media';
import { HlsElement } from '../../providers/hls';

export const HLS_PLAYER_ELEMENT_TAG_NAME = 'vds-hls-player';

/**
 * Embeds video content into documents via the native `<video>` element. It may contain
 * one or more video sources, represented using the `src` attribute or the `<source>` element: the
 * browser will choose the most suitable one.
 *
 * In addition, this element introduces support for HLS streaming via the popular `hls.js` library.
 * HLS streaming is either [supported natively](https://caniuse.com/?search=hls) (generally
 * on iOS), or in environments that [support the Media Stream API](https://caniuse.com/?search=mediastream).
 *
 * You can decide whether you'd like to bundle `hls.js` into your application (not recommended), or
 * load it dynamically from your own server or a CDN. We recommended dynamically loading it to
 * prevent blocking the main thread when rendering this element, and to ensure `hls.js` is cached
 * separately. Refer to `HlsElement` for more information.
 *
 * 💡 This element contains the exact same interface as the `<video>` element. It redispatches
 * all the native events if needed, but prefer the `vds-*` variants (eg: `vds-play`) as they
 * iron out any browser issues. It also dispatches all the `hls.js` events.
 *
 * @tagname vds-hls-player
 * @provider HlsElement
 * @engine [hls.js](https://github.com/video-dev/hls.js)
 * @slot Used to pass in media resources such as `<source>` and `<track>` elements.
 * @slot ui - Used to pass in the player user interface.
 * @csspart media - The video element (`<video>`).
 * @csspart video - Alias for `media` part.
 * @example
 * ```html
 * <vds-hls-player src="/media/index.m3u8" poster="/media/poster.png">
 *   <vds-media-ui slot="ui">
 *     <!-- UI components here. -->
 *   </vds-media-ui>
 * </vds-hls-player>
 * ```
 * @example
 * ```html
 * <vds-hls src="/media/index.m3u8" poster="/media/poster.png">
 *   <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" label="English" />
 *   <vds-media-ui slot="ui">
 *     <!-- UI components here. -->
 *   </vds-media-ui>
 * </vds-hls>
 * ```
 */
export class HlsPlayerElement extends WithMediaPlayer(HlsElement) {
  override renderProvider(): TemplateResult {
    return this._renderVideo();
  }
}
