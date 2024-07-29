/**
 * @see {@link https://developers.google.com/youtube/iframe_api_reference#onStateChange}
 */
export const YouTubePlayerState = {
  Unstarted: -1,
  Ended: 0,
  Playing: 1,
  Paused: 2,
  Buffering: 3,
  Cued: 5,
} as const;

export type YouTubePlayerStateValue = (typeof YouTubePlayerState)[keyof typeof YouTubePlayerState];
