import type { HTMLCustomElement } from 'maverick.js/element';
import type { IconType } from 'media-icons';

export interface MediaIconProps {
  /**
   * The type of icon. You can find a complete and searchable list on our website - see our
   * [media icons catalog](https://vidstack.io/media-icons).
   */
  type: IconType | undefined;
  /**
   * The color attribute is used to set the `currentColor` property of the SVG element which
   * indirectly sets all path fill and stroke values.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color}
   */
  color: string | undefined;
  /**
   * The horizontal (width) and vertical (height) length of the underlying `<svg>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/width}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/height}
   */
  size: number;
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
 * <media-icon type="play" size="32"></media-icon>
 * <media-icon type="pause" size="32"></media-icon>
 * ```
 */
export interface MediaIconElement extends HTMLCustomElement<MediaIconProps>, MediaIconMembers {}
