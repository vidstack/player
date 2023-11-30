/**
 * @see {@link https://github.com/vimeo/player.js#events}
 */
export const vimeoEvents = [
  'bufferend',
  'bufferstart',
  // 'cuechange',
  'durationchange',
  'ended',
  'enterpictureinpicture',
  'error',
  'fullscreenchange',
  'leavepictureinpicture',
  'loaded',
  // 'loadeddata',
  // 'loadedmetadata',
  // 'loadstart',
  'pause',
  'play',
  'playbackratechange',
  // 'progress',
  'qualitychange',
  'seeked',
  'seeking',
  // 'texttrackchange',
  'timeupdate',
  'volumechange',
  'waiting',
  // 'adstarted',
  // 'adcompleted',
  // 'aderror',
  // 'adskipped',
  // 'adallcompleted',
  // 'adclicked',
  // 'chapterchange',
  // 'chromecastconnected',
  // 'remoteplaybackavailabilitychange',
  // 'remoteplaybackconnecting',
  // 'remoteplaybackconnect',
  // 'remoteplaybackdisconnect',
  // 'liveeventended',
  // 'liveeventstarted',
  // 'livestreamoffline',
  // 'livestreamonline',
];

export const enum VimeoEvent {
  BufferEnd = 'bufferend',
  BufferStart = 'bufferstart',
  CueChange = 'cuechange',
  DurationChange = 'durationchange',
  Ended = 'ended',
  EnterPictureInPicture = 'enterpictureinpicture',
  Error = 'error',
  FullscreenChange = 'fullscreenchange',
  LeavePictureInPicture = 'leavepictureinpicture',
  Loaded = 'loaded',
  LoadedData = 'loadeddata',
  LoadedMetadata = 'loadedmetadata',
  LoadProgress = 'loadProgress',
  LoadStart = 'loadstart',
  Pause = 'pause',
  Play = 'play',
  PlaybackRateChange = 'playbackratechange',
  PlayProgress = 'playProgress',
  Progress = 'progress',
  QualityChange = 'qualitychange',
  Ready = 'ready',
  Seeked = 'seek',
  Seeking = 'seeking',
  TextTrackChange = 'texttrackchange',
  VolumeChange = 'volumechange',
  Waiting = 'waiting',
}

export interface VimeoProgressPayload {
  seconds: number;
  percent: number;
  duration: number;
}

export interface VimeoPlayPayload {
  seconds: number;
  percent: number;
  duration: number;
}

export interface VimeoErrorPayload {
  name: string;
  message: string;
  method?: string;
}

export interface VimeoEventPayload {
  [VimeoEvent.Play]: VimeoPlayPayload;
  [VimeoEvent.Pause]: void;
  [VimeoEvent.Ready]: void;
  [VimeoEvent.PlayProgress]: VimeoProgressPayload;
  [VimeoEvent.LoadProgress]: VimeoProgressPayload;
  [VimeoEvent.BufferStart]: void;
  [VimeoEvent.BufferEnd]: void;
  [VimeoEvent.Loaded]: { id: number };
  [VimeoEvent.Ended]: void;
  [VimeoEvent.Seeking]: void;
  [VimeoEvent.Seeked]: void;
  [VimeoEvent.CueChange]: void;
  [VimeoEvent.FullscreenChange]: { fullscreen: boolean };
  [VimeoEvent.VolumeChange]: { volume: number };
  [VimeoEvent.DurationChange]: { duration: number };
  [VimeoEvent.PlaybackRateChange]: { playbackRate: number };
  [VimeoEvent.TextTrackChange]: void;
  [VimeoEvent.Error]: any;
  [VimeoEvent.LoadedData]: any;
  [VimeoEvent.LoadStart]: any;
  [VimeoEvent.LoadedMetadata]: any;
  [VimeoEvent.EnterPictureInPicture]: void;
  [VimeoEvent.LeavePictureInPicture]: void;
  [VimeoEvent.QualityChange]: any;
  [VimeoEvent.Waiting]: void;
}
