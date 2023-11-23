import { HTMLMediaProvider } from '../html/provider';
import type { MediaProviderAdapter, MediaSetupContext } from '../types';

/**
 * The audio provider adapts the `<audio>` element to enable loading audio via the HTML Media
 * Element API.
 *
 * @docs {@link https://www.vidstack.io/docs/player/providers/audio}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}
 * @example
 * ```html
 * <media-player src="https://media-files.vidstack.io/audio.mp3">
 *   <media-provider></media-provider>
 * </media-player>
 * ```
 */
export class AudioProvider extends HTMLMediaProvider implements MediaProviderAdapter {
  protected $$PROVIDER_TYPE = 'AUDIO';

  override get type() {
    return 'audio';
  }

  override setup(ctx: MediaSetupContext): void {
    super.setup(ctx);
    if (this.type === 'audio') ctx.delegate._notify('provider-setup', this);
  }

  /**
   * The native HTML `<audio>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement}
   */
  get audio() {
    return this._media as HTMLAudioElement;
  }
}
