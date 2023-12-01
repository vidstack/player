/**
 * @see {@link https://developers.google.com/youtube/iframe_api_reference#Playback_controls}
 */
export type YouTubeCommand =
  | 'playVideo'
  | 'pauseVideo'
  | 'seekTo'
  | 'mute'
  | 'unMute'
  | 'setVolume'
  | 'setPlaybackRate';

export interface YouTubeCommandArg {
  playVideo: void;
  pauseVideo: void;
  seekTo: number;
  mute: void;
  unMute: void;
  setVolume: number;
  setPlaybackRate: number;
}
