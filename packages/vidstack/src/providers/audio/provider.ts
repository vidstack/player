import { scoped } from 'maverick.js';

import type { MediaContext } from '../../core/api/media-context';
import { HTMLMediaProvider } from '../html/provider';
import { HTMLAirPlayAdapter } from '../html/remote-playback';
import type { MediaProviderAdapter, MediaRemotePlaybackAdapter } from '../types';

/**
 * The audio provider adapts the `<audio>` element to enable loading audio via the HTML Media
 * Element API.
 *
 * @docs {@link https://www.vidstack.io/docs/player/providers/audio}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}
 * @example
 * ```html
 * <media-player src="https://files.vidstack.io/audio.mp3">
 *   <media-provider></media-provider>
 * </media-player>
 * ```
 */
export class AudioProvider extends HTMLMediaProvider implements MediaProviderAdapter {
  protected $$PROVIDER_TYPE = 'AUDIO';

  override get type() {
    return 'audio';
  }

  airPlay?: MediaRemotePlaybackAdapter;

  constructor(audio: HTMLAudioElement, ctx: MediaContext) {
    super(audio, ctx);
    scoped(() => {
      this.airPlay = new HTMLAirPlayAdapter(this.media, ctx);
    }, this.scope);
  }

  override setup() {
    super.setup();
    if (this.type === 'audio') this.ctx.notify('provider-setup', this);
  }

  /**
   * The native HTML `<audio>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement}
   */
  get audio() {
    return this.media as HTMLAudioElement;
  }
}
