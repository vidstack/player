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
 * 💡 The following img attributes are applied:
 *
 * - `img-loading`: When the poster image is in the process of being downloaded by the browser.
 * - `img-loaded`: When the poster image has successfully loaded.
 * - `img-error`: When the poster image has failed to load.
 *
 * @example
 * ```html
 * <vds-media>
 *   <vds-poster alt="Large alien ship hovering over New York."></vds-poster>
 * </vds-media>
 * ```
 */
export interface PosterElement extends HTMLCustomElement<PosterProps> {}
