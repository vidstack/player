export interface SliderCSSVars {
  // TODO: add the following after writable CSS vars are optional in Maverick
  // --media-slider-height, 48px
  // --media-slider-thumb-size, 14px
  // --media-slider-focused-thumb-size, calc(var(--thumb-size) * 1.1)
  // --media-slider-track-height, 4px
  // --media-slider-focused-track-height, calc(var(--track-height) * 1.25)
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
