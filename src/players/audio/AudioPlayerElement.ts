import { TemplateResult } from 'lit';

import { WithMediaPlayer } from '../../media';
import { AudioElement } from '../../providers/audio';

export const AUDIO_PLAYER_ELEMENT_TAG_NAME = 'vds-audio-player';

/**
 * Used to embed sound content into documents via the native `<audio>` element. It may contain
 * one or more audio sources, represented using the `src` attribute or the `<source>` element: the
 * browser will choose the most suitable one.
 *
 * 💡 This element contains the exact same interface as the `<audio>` element. It redispatches
 * all the native events if needed, but prefer the `vds-*` variants (eg: `vds-play`) as they
 * iron out any browser issues.
 *
 * @tagname vds-audio-player
 * @provider AudioElement
 * @engine [HTMLAudioElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
 * @slot Used to pass in media resources such as `<source>` and `<track>` elements.
 * @slot ui - Used to pass in the player user interface.
 * @csspart media - The audio element (`<audio>`).
 * @csspart audio - Alias for `media` part.
 * @example
 * ```html
 * <vds-audio-player src="/media/audio.mp3">
 *   <vds-media-ui slot="ui">
 *     <!-- UI components here. -->
 *   </vds-media-ui>
 * </vds-audio-player>
 * ```
 * @example
 * ```html
 * <vds-audio-player>
 *   <source src="/media/audio.mp3" type="audio/mp3" />
 *   <vds-media-ui slot="ui">
 *     <!-- UI components here. -->
 *   </vds-media-ui>
 * </vds-audio-player>
 * ```
 */
export class AudioPlayerElement extends WithMediaPlayer(AudioElement) {
  override renderProvider(): TemplateResult {
    return this._renderAudio();
  }
}
