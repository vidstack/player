import type { HTMLCustomElement } from 'maverick.js/element';

export interface AspectRatioProps {
  /**
   * The minimum height of the container.
   */
  minHeight: string;
  /**
   * The maximum height of the container.
   */
  maxHeight: string;
  /**
   * The desired aspect ratio setting given as `'width/height'` (eg: `'16/9'`).
   *
   * @defaultValue '2/1'
   */
  ratio: string;
}

/**
 * The `<vds-aspect-ratio>` component creates a container that will hold the dimensions of the
 * desired aspect ratio. This container is useful for reserving space for media as it loads over
 * the network.
 *
 * 💡  If your browser matrix supports the
 * [`aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) CSS property
 * then you can skip using this component, and set the desired aspect ratio directly on the
 * provider element.
 *
 * 💡 By default it respects the browser's default aspect-ratio for media. This is not specific
 * to the loaded media but instead a general setting of `2/1`.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/layout/aspect-ratio}
 * @slot - Used to pass in a media provider element.
 * @example
 * ```html
 * <vds-aspect-ratio ratio="16/9">
 *   <vds-video>
 *     <!-- ... -->
 *   </vds-video>
 * </vds-aspect-ratio>
 * ```
 */
export interface AspectRatioElement extends HTMLCustomElement<AspectRatioProps> {}
