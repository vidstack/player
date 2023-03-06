import type { HTMLCustomElement } from 'maverick.js/element';

export interface SliderThumbnailProps {
  /**
   * The absolute or relative URL to a [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
   * file resource.
   */
  src: string;
}

/**
 * Used to load/parse WebVTT files and display preview thumbnails when the user is hovering hover
 * or dragging the time slider. The time ranges in the WebVTT file will automatically be matched
 * based on the current pointer position.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-thumbnail}
 * @example
 * ```html
 * <media-time-slider>
 *   <media-slider-thumbnail
 *     src="https://media-files.vidstack.io/thumbnails.vtt"
 *     slot="preview"
 *   ></media-slider-thumbnail>
 * </media-time-slider>
 * ```
 */
export interface MediaSliderThumbnailElement extends HTMLCustomElement<SliderThumbnailProps> {}
