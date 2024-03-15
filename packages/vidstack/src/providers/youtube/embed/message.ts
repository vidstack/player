import type { YouTubeEvent } from './event';
import type { YouTubePlaybackQuality } from './quality';
import type { YouTubePlayerStateValue } from './state';

export interface YouTubeVideoData {
  author: string;
  title: string;
  video_id: string;
}

export interface YouTubeProgressState {
  airingStart: number;
  airingEnd: number;
  allowSeeking: boolean;
  clipStart: number;
  clipEnd: boolean | null;
  current: number;
  displayedStart: number;
  duration: number;
  ingestionTime: number;
  isAtLiveHead: false;
  loaded: number;
  offset: number;
  seekableStart: number;
  seekableEnd: number;
  viewerLivestreamJoinMediaTime: number;
}

export interface YouTubeMessageInfo {
  availablePlaybackRates?: number[];
  availableQualityLevels?: YouTubePlaybackQuality[];
  currentTime?: number;
  currentTimeLastUpdated?: number;
  videoLoadedFraction?: number;
  volume?: number;
  videoUrl?: string;
  videoData?: YouTubeVideoData;
  duration?: number;
  muted?: boolean;
  playbackQuality?: YouTubePlaybackQuality;
  playbackRate?: number;
  playerState?: YouTubePlayerStateValue;
  progressState?: YouTubeProgressState;
}

export interface YouTubeMessage {
  channel: string;
  event: YouTubeEvent;
  info?: YouTubeMessageInfo;
}
