import type { HTMLCustomElement } from 'maverick.js/element';

export interface PosterProps {
  /**
   * ♿ **ARIA:** Provides alternative information for a poster image if a user for some reason
   * cannot view it.
   */
  alt: string | undefined;
}

/**
 * Loads and displays the current media poster image. By default, the media provider's
 * loading strategy is respected meaning the poster won't load until the media can.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/layout/poster}
 * @example
 * ```html
 * <media-player>
 *   <media-poster alt="Large alien ship hovering over New York."></media-poster>
 * </media-player>
 * ```
 */
export interface MediaPosterElement extends HTMLCustomElement<PosterProps> {}
