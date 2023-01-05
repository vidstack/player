export interface SliderCSSVars {
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
