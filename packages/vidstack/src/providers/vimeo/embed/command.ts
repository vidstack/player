import { VimeoEvent } from './event';
import type { VimeoChapter, VimeoQuality, VimeoTextTrack } from './misc';

/**
 * @see https://github.com/vimeo/player.js#methods
 */
export const enum VimeoCommand {
  AddEventListener = 'addEventListener',
  DisableTextTrack = 'disableTextTrack',
  EnableTextTrack = 'enableTextTrack',
  ExitFullscreen = 'exitFullscreen',
  ExitPictureInPicture = 'exitPictureInPicture',
  GetBuffered = 'getBuffered',
  GetCuePoints = 'getCuePoints',
  GetChapters = 'getChapters',
  GetCurrentTime = 'getCurrentTime',
  GetDuration = 'getDuration',
  GetFullscreen = 'getFullscreen',
  GetPictureInPicture = 'getPictureInPicture',
  GetPlayed = 'getPlayed',
  GetQualities = 'getQualities',
  GetQuality = 'getQuality',
  GetSeekable = 'getSeekable',
  GetSeeking = 'getSeeking',
  GetTextTracks = 'getTextTracks',
  GetVideoTitle = 'getVideoTitle',
  HideOverlay = '_hideOverlay',
  Pause = 'pause',
  Play = 'play',
  RequestFullscreen = 'requestFullscreen',
  RequestPictureInPicture = 'requestPictureInPicture',
  SeekTo = 'seekTo',
  SetMuted = 'setMuted',
  SetPlaybackRate = 'setPlaybackRate',
  SetQuality = 'setQuality',
  SetVolume = 'setVolume',
  ShowOverlay = '_showOverlay',
  Destroy = 'destroy',
  LoadVideo = 'loadVideo',
  Unload = 'unload',
}

export interface VimeoCommandArg {
  [VimeoCommand.Play]: void;
  [VimeoCommand.Pause]: void;
  [VimeoCommand.SetMuted]: boolean;
  [VimeoCommand.SetVolume]: number;
  [VimeoCommand.GetDuration]: void;
  [VimeoCommand.GetChapters]: void;
  [VimeoCommand.GetCurrentTime]: void;
  [VimeoCommand.SeekTo]: number;
  [VimeoCommand.SetPlaybackRate]: number;
  [VimeoCommand.AddEventListener]: VimeoEvent;
  [VimeoCommand.GetCuePoints]: void;
  [VimeoCommand.GetVideoTitle]: string;
  [VimeoCommand.GetTextTracks]: void;
  [VimeoCommand.EnableTextTrack]: {
    language: string;
    kind: string;
  };
  [VimeoCommand.DisableTextTrack]: string;
  [VimeoCommand.SetQuality]: string;
  [VimeoCommand.ShowOverlay]: void;
  [VimeoCommand.HideOverlay]: void;
  [VimeoCommand.GetBuffered]: void;
  [VimeoCommand.RequestFullscreen]: void;
  [VimeoCommand.ExitFullscreen]: void;
  [VimeoCommand.RequestPictureInPicture]: void;
  [VimeoCommand.ExitPictureInPicture]: void;
  [VimeoCommand.GetQuality]: void;
  [VimeoCommand.GetQualities]: void;
  [VimeoCommand.GetPlayed]: void;
  [VimeoCommand.GetSeekable]: void;
  [VimeoCommand.GetSeeking]: void;
  [VimeoCommand.GetFullscreen]: void;
  [VimeoCommand.GetPictureInPicture]: void;
  [VimeoCommand.Destroy]: void;
  [VimeoCommand.LoadVideo]: number;
  [VimeoCommand.Unload]: void;
}

export interface VimeoCommandData {
  [VimeoCommand.Play]: void;
  [VimeoCommand.Pause]: void;
  [VimeoCommand.SetMuted]: void;
  [VimeoCommand.SetVolume]: void;
  [VimeoCommand.GetDuration]: number;
  [VimeoCommand.GetChapters]: VimeoChapter[];
  [VimeoCommand.GetCurrentTime]: number;
  [VimeoCommand.SeekTo]: void;
  [VimeoCommand.SetPlaybackRate]: void;
  [VimeoCommand.AddEventListener]: void;
  [VimeoCommand.GetCuePoints]: void;
  [VimeoCommand.GetVideoTitle]: string;
  [VimeoCommand.GetTextTracks]: VimeoTextTrack[];
  [VimeoCommand.EnableTextTrack]: void;
  [VimeoCommand.DisableTextTrack]: void;
  [VimeoCommand.SetQuality]: void;
  [VimeoCommand.ShowOverlay]: void;
  [VimeoCommand.HideOverlay]: void;
  [VimeoCommand.GetBuffered]: number;
  [VimeoCommand.RequestFullscreen]: void;
  [VimeoCommand.ExitFullscreen]: void;
  [VimeoCommand.RequestPictureInPicture]: void;
  [VimeoCommand.ExitPictureInPicture]: void;
  [VimeoCommand.GetQuality]: string;
  [VimeoCommand.GetQualities]: VimeoQuality[];
  [VimeoCommand.GetPlayed]: number[];
  [VimeoCommand.GetSeekable]: number[];
  [VimeoCommand.GetSeeking]: boolean;
  [VimeoCommand.GetFullscreen]: boolean;
  [VimeoCommand.GetPictureInPicture]: boolean;
  [VimeoCommand.Destroy]: void;
  [VimeoCommand.LoadVideo]: void;
  [VimeoCommand.Unload]: void;
}
