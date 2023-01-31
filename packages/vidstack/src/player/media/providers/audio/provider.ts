import { HTMLMediaProvider } from '../html/provider';
import type { MediaProvider } from '../types';

export const AUDIO_PROVIDER = Symbol(__DEV__ ? 'AUDIO_PROVIDER' : 0);

/**
 * The audio provider adapts the `<audio>` element to enable loading audio via the HTML Media
 * Element API.
 *
 * @docs {@link https://www.vidstack.io/docs/player/providers/audio}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}
 * @example
 * ```html
 * <media-player
 *   src="https://media-files.vidstack.io/audio.mp3"
 *   view="audio"
 * >
 *   <media-outlet></media-outlet>
 * </media-player>
 * ```
 */
export class AudioProvider extends HTMLMediaProvider implements MediaProvider {
  [AUDIO_PROVIDER] = true;
  type = 'audio' as const;

  /**
   * The native HTML `<audio>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement}
   */
  get audio() {
    return this._media as HTMLAudioElement;
  }
}
