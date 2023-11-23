/**
 * @see https://developers.google.com/youtube/iframe_api_reference#onStateChange
 */
export const enum YouTubePlayerState {
  Unstarted = -1,
  Ended = 0,
  Playing = 1,
  Paused = 2,
  Buffering = 3,
  Cued = 5,
}
