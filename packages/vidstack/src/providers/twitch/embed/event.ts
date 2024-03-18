export type TwitchEvent = keyof TwitchEventPayload;

export interface TwitchEventPayload {
  UPDATE_STATE: TwitchState;
  authenticate: { displayName: string; id: string; profileImageURL: string; __typename: string };
  captions: unknown; // haven't found a stream/video with captions yet
  ended: void;
  error: unknown; // haven't encountered any errors yet, there seem to be some error codes in the embed SDK
  pause: void;
  play: { sessionId: string };
  playbackBlocked: unknown; // again, haven't encountered this yet
  playing: void;
  offline: void;
  online: void;
  ready: void;
  seek: { position: number };
  // these seem to be redundant
  'video.pause': void;
  'video.play': void;
  'video.ready': void;
}

export interface TwitchQuality {
  name: string;
  group: string;
  codecs: string;
  bitrate: number;
  width: number;
  height: number;
  framerate: number;
  isDefault: boolean;
}

export interface TwitchState {
  videoID: string | undefined;
  channelID: string | undefined;
  channelName: string | undefined;
  collectionID: string | undefined;
  currentTime: number; // currentTime in seconds (decimals possible)
  duration: number; // duration in seconds (decimals possible)
  muted: boolean;
  playback: 'Idle' | 'Playing' | 'Ended';
  quality: TwitchQuality['name'];
  volume: number; // float between 0 and 1
  ended: boolean;
  qualitiesAvailable: TwitchQuality[];
  stats: {
    videoStats: {
      backendVersion: string;
      bufferSize: number;
      codecs: string;
      displayResolution: string;
      fps: number;
      hlsLatencyBroadcaster: number;
      playbackRate: number;
      skippedFrames: number;
      videoResolution: number;
    };
  };
}
