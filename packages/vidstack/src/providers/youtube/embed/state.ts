/**
 * @see {@link https://developers.google.com/youtube/iframe_api_reference#onStateChange}
 */
export const YouTubePlayerState = {
  _Unstarted: -1,
  _Ended: 0,
  _Playing: 1,
  _Paused: 2,
  _Buffering: 3,
  _Cued: 5,
} as const;

export type YouTubePlayerStateValue = (typeof YouTubePlayerState)[keyof typeof YouTubePlayerState];
