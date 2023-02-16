import type { HTMLCustomElement } from 'maverick.js/element';
import type { IconType } from 'media-icons';

export interface MediaIconProps {
  /**
   * The type of icon. You can find a complete and searchable list on our website - see our
   * [media icons catalog](https://vidstack.io/media-icons).
   */
  type: IconType | undefined;
}

export interface MediaIconMembers extends MediaIconProps {}

export { type IconType };

/**
 * The `<media-icon>` component dynamically loads and renders our custom Vidstack icons. See our
 * [media icons catalog](https://www.vidstack.io/media-icons) to preview them all. Do note, the icon `type` can
 * be dynamically changed.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/icons}
 * @example
 * ```html
 * <media-icon type="play"></media-icon>
 * <media-icon type="pause"></media-icon>
 * ```
 */
export interface MediaIconElement extends HTMLCustomElement<MediaIconProps>, MediaIconMembers {}
