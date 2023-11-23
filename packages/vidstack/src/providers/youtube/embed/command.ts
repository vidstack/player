/**
 * @see https://developers.google.com/youtube/iframe_api_reference#Playback_controls
 */
export const enum YouTubeCommand {
  Play = 'playVideo',
  Pause = 'pauseVideo',
  Seek = 'seekTo',
  Mute = 'mute',
  Unmute = 'unMute',
  SetVolume = 'setVolume',
  SetPlaybackRate = 'setPlaybackRate',
}

export interface YouTubeCommandArg {
  [YouTubeCommand.Play]: void;
  [YouTubeCommand.Pause]: void;
  [YouTubeCommand.Seek]: number;
  [YouTubeCommand.Mute]: void;
  [YouTubeCommand.Unmute]: void;
  [YouTubeCommand.SetVolume]: number;
  [YouTubeCommand.SetPlaybackRate]: number;
}
