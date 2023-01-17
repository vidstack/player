export interface SliderCSSVars {
  /**
   * The height of the slider.
   */
  'media-slider-height'?: number | string;
  /**
   * The size (i.e., width/height) of the slider thumb.
   */
  'media-slider-thumb-size'?: number | string;
  /**
   * The size (i.e., width/height) of the slider thumb when interacting with the slider.
   */
  'media-slider-focused-thumb-size'?: number | string;
  /**
   * The height of the slider tracks.
   */
  'media-slider-track-height'?: number | string;
  /**
   * The height of the slider tracks when interacting with the slider.
   */
  'media-slider-focused-track-height'?: number | string;
  /**
   * The ratio of the slider that is filled (eg: `0.3`).
   */
  readonly 'slider-fill-rate': number;
  /**
   * The current amount of the slider that is filled (eg: `30`).
   */
  readonly 'slider-fill-value': number;
  /**
   * The fill rate expressed as a percentage such as (eg: `30%`).
   */
  readonly 'slider-fill-percent': string;
  /**
   * The ratio of the slider that is filled up to the device pointer.
   */
  readonly 'slider-pointer-rate': number;
  /**
   * The amount of the slider that is filled up to the device pointer.
   */
  readonly 'slider-pointer-value': number;
  /**
   * The pointer rate expressed as a percentage.
   */
  readonly 'slider-pointer-percent': string;
}
