import type { HTMLCustomElement } from 'maverick.js/element';

export interface CaptionsProps {
  /*
   * Text direction:
   * - left-to-right (ltr)
   * - right-to-left (rtl)
   */
  textDir: 'ltr' | 'rtl';
}

/**
 * Renders and displays captions/subtitles. This will be an overlay for video and a simple
 * captions box for audio.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/captions}
 * @example
 * ```html
 * <media-captions></media-captions>
 * ```
 */
export interface MediaCaptionsElement extends HTMLCustomElement<CaptionsProps> {}
