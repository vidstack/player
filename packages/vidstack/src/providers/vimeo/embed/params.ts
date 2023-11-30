/**
 * Vimeo Player Parameters.
 *
 * @see {@link https://developer.vimeo.com/player/sdk/embed}
 */
export interface VimeoParams {
  /**
   * The ID or the URL of the video on Vimeo. You must supply one of these values to identify the
   * video.
   *
   * @default undefined
   */
  id?: string;

  /**
   * Whether to pause the current video when another Vimeo video on the same page starts to play.
   * Set this value to false to permit simultaneous playback of all the videos on the page.
   *
   * @default true
   */
  autopause?: boolean;

  /**
   * Whether to start playback of the video automatically. This feature might not work on all
   * devices.
   *
   * @default false
   */
  autoplay?: boolean;

  /**
   * Whether the player is in background mode, which hides the playback controls, enables autoplay,
   * and loops the video.
   *
   * @default false
   */
  background?: boolean;

  /**
   * Whether to display the video owner's name.
   *
   * @default true
   */
  byline?: boolean;

  /**
   * The hexadecimal color value of the playback controls. The embed settings of the video
   * might override this value.
   *
   * @default '00ADEF'
   */
  color?: string;

  /**
   * This parameter will hide all elements in the player (play bar, sharing buttons, etc) for a
   * chromeless experience. When using this parameter, the play/pause button will be hidden. To
   * start playback for your viewers, you'll need to either enable autoplay, use keyboard controls,
   * or implement our player SDK to start and control playback.
   *
   * Note: setting this parameter will not disable keyboard controls.
   *
   * @default true
   */
  controls?: boolean;

  /**
   * Whether to enable keyboard input to trigger player events. This setting doesn't affect tab
   * control.
   *
   * @default true
   */
  keyboard?: boolean;

  /**
   * Hash for private videos.
   */
  h: string | null;

  /**
   * The height of the video in pixels.
   *
   * @default undefined
   */
  height?: number;

  /**
   * Whether to restart the video automatically after reaching the end.
   *
   * @default false
   */
  loop?: boolean;

  /**
   * The height of the video in pixels, where the video won't exceed its native height, no matter
   * the value of this field.
   *
   * @default undefined
   */
  maxheight?: number;

  /**
   * The width of the video in pixels, where the video won't exceed its native width, no matter the
   * value of this field.
   *
   * @default undefined
   */
  maxwidth?: number;

  /**
   * Whether the video is muted upon loading. The true value is required for the autoplay behavior
   * in some browsers.
   *
   * @default false
   */
  muted?: boolean;

  /**
   * Whether the video plays inline on supported mobile devices. To force the device to play the
   * video in fullscreen mode instead, set this value to false.
   *
   * @default true
   */
  playsinline?: boolean;

  /**
   * Whether to display the video owner's portrait.
   *
   * @default true
   */
  portrait?: boolean;

  /**
   * Whether the player displays speed controls in the preferences menu and enables the playback
   * rate API.
   *
   * @default false
   */
  speed?: boolean;

  /**
   * Whether the player displays the title overlay.
   *
   * @default true
   */
  title?: boolean;

  /**
   * Whether the responsive player and transparent background are enabled.
   *
   * @default true
   */
  transparent?: boolean;

  /**
   * The width of the video in pixels.
   *
   * @default undefined
   */
  width?: number;

  /**
   * Setting this parameter to "true" will block the player from tracking any session data,
   * including all cookies and analytics.
   *
   * @default false
   */
  dnt?: boolean;
}
