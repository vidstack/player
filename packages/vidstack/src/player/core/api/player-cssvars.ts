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
}
