export interface PlayerCSSVars {
  /**
   * The minimum height of the player when an aspect ratio is applied.
   */
  'media-min-height'?: number;
  /**
   * The maximum height of the player when an aspect ratio is applied.
   */
  'media-max-height'?: number;
  /**
   * The current aspect ratio of the player media.
   */
  readonly 'media-aspect-ratio': number | null;
  /**
   * The latest time in seconds for which media has been buffered (i.e., downloaded by the
   * browser).
   */
  readonly 'media-buffered': number;
  /**
   * The current playback time in seconds (0 -> duration).
   */
  readonly 'media-current-time': number;
  /**
   * The total length of media in seconds.
   */
  readonly 'media-duration': number;
}
