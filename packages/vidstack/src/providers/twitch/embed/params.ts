/**
 * Twitch Player Parameters.
 *
 * @see {@link https://dev.twitch.tv/docs/embed/video-and-clips}
 */
export interface TwitchParams {
  /**
   * Channel name (for a live stream).
   */
  channel?: string;

  /**
   * ID of the video.
   */
  video?: string;

  /**
   * List of parent domains, only required if the site is embedded on any domain(s) other than the one that instantiates the Twitch embed.
   */
  parent?: string[];

  /**
   * If true, the video starts playing automatically, without the user clicking play. The exception is mobile devices, on which video cannot be played without user interaction.
   *
   * @default false
   */
  autoplay?: boolean;

  /**
   * Specifies whether the initial state of the video is muted.
   *
   * @default false
   */
  muted?: boolean;

  /**
   * Only valid for Video on Demand content. Time in the video where playback starts. Specifies hours, minutes, and seconds.
   *
   * @default '0h0m0s'
   */
  time?: string;
}
