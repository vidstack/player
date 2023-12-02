import type { VimeoEvent } from './event';
import type { VimeoChapter, VimeoQuality, VimeoTextTrack } from './misc';

/**
 * @see https://github.com/vimeo/player.js#methods
 */
export type VimeoCommand =
  | 'addEventListener'
  | 'disableTextTrack'
  | 'enableTextTrack'
  | 'exitFullscreen'
  | 'exitPictureInPicture'
  | 'getBuffered'
  | 'getCuePoints'
  | 'getChapters'
  | 'getCurrentTime'
  | 'getDuration'
  | 'getFullscreen'
  | 'getPictureInPicture'
  | 'getPlayed'
  | 'getQualities'
  | 'getQuality'
  | 'getSeekable'
  | 'getSeeking'
  | 'getTextTracks'
  | 'getVideoTitle'
  | '_hideOverlay'
  | 'pause'
  | 'play'
  | 'requestFullscreen'
  | 'requestPictureInPicture'
  | 'seekTo'
  | 'setMuted'
  | 'setPlaybackRate'
  | 'setQuality'
  | 'setVolume'
  | '_showOverlay'
  | 'destroy'
  | 'loadVideo'
  | 'unload';

export interface VimeoCommandArg {
  play: void;
  pause: void;
  setMuted: boolean;
  setVolume: number;
  getDuration: void;
  getChapters: void;
  getCurrentTime: void;
  seekTo: number;
  setPlaybackRate: number;
  addEventListener: VimeoEvent;
  getCuePoints: void;
  getVideoTitle: string;
  getTextTracks: void;
  enableTextTrack: {
    language: string;
    kind: string;
  };
  disableTextTrack: string;
  setQuality: string;
  _showOverlay: void;
  _hideOverlay: void;
  getBuffered: void;
  requestFullscreen: void;
  exitFullscreen: void;
  requestPictureInPicture: void;
  exitPictureInPicture: void;
  getQuality: void;
  getQualities: void;
  getPlayed: void;
  getSeekable: void;
  getSeeking: void;
  getFullscreen: void;
  getPictureInPicture: void;
  destroy: void;
  loadVideo: number;
  unload: void;
}

export interface VimeoCommandData {
  play: void;
  pause: void;
  setMuted: void;
  setVolume: void;
  getDuration: number;
  getChapters: VimeoChapter[];
  getCurrentTime: number;
  seekTo: void;
  setPlaybackRate: void;
  addEventListener: void;
  getCuePoints: void;
  getVideoTitle: string;
  getTextTracks: VimeoTextTrack[];
  enableTextTrack: void;
  disableTextTrack: void;
  setQuality: void;
  _showOverlay: void;
  _hideOverlay: void;
  getBuffered: number;
  requestFullscreen: void;
  exitFullscreen: void;
  requestPictureInPicture: void;
  exitPictureInPicture: void;
  getQuality: string;
  getQualities: VimeoQuality[];
  getPlayed: number[];
  getSeekable: number[];
  getSeeking: boolean;
  getFullscreen: boolean;
  getPictureInPicture: boolean;
  destroy: void;
  loadVideo: void;
  unload: void;
}
