# Player API

## Properties

```ts
interface PlayerProps {
  src: Source[];
  currentTime: number;
  volume: number;
  paused: boolean;
  muted: boolean;
  aspectRatio: string;
  duration: number; // readonly
  playbackStarted: boolean;
  playbackEnded: boolean;
  playbackQuality: string | undefined;
  playbackQualities: string[]; // readonly
  playbackRate: number;
  playbackRates: number[]; // readonly
  isReady: boolean; // readonly
  playbackReady: boolean; // readonly
  audioTracks: AudioTrack[]; // readonly
  autoplay: boolean;
  loop: boolean;
  playsinline: boolean;
  buffered: number; // readonly
  buffering: boolean; // readonly
  playing: boolean; // readonly
  seeking: boolean; // readonly
  controls: boolean;
  mediaTitle: string; // readonly
  currentAudioTrack: number; // readonly
  currentPoster: string; // readonly
  currentProvider: MediaProvider<any> | undefined; // readonly
  currentSrc: string; // readonly
  textTracks: TextTrack[]; // readonly
  currentTextTrack: number; // readonly
  isTextTrackVisible: boolean; // readonly
  shouldRenderNativeTextTracks: boolean;
  mediaType: MediaType; // readonly
  isAudio: boolean; // readonly
  isVideo: boolean; // readonly
  viewType: ViewType; // readonly
  isAudioView: boolean; // readonly
  isVideoView: boolean; // readonly
  isControlsActive: boolean;
  isPiPActive: boolean; // readonly
  isFullscreenActive: boolean; // readonly
  isLive: boolean; // readonly
  isMobile: boolean; // readonly
  isTouch: boolean; // readonly
  isSettingsActive: boolean; // readonly
  autoFetchPoster: boolean;
  autoAspectRatio: boolean;
  heartbeatInterval: number;
  mediaTrim: MediaTrim; // readonly
  bootStrategy: 'click' | 'lazy' | 'immediate' | BootStrategy;
  mediaLoadStrategy: 'firstCanPlay' | MediaLoadStrategy;
}
```

## Methods

```ts
interface PlayerMethods {
  canAutoplay(): Promise<boolean>;
  canMutedAutoplay(): Promise<boolean>;
  canPlay(src: Source[]): boolean;

  // Should these just be errors thrown from corresponding setter?
  canSetAudioTrack(): boolean;
  canSetTextTrack(): boolean;
  canSetTextTrackVisiblity(): boolean;
  canSetFullscreen(): boolean;
  canSetPiP(): boolean;
  canSetPlaybackRate(): boolean;
  canSetPlaybackQuality(): boolean;

  play(): Promise<void>;
  pause(): Promise<void>;
  enterFullscreen(options: FullscreenOptions | undefined): Promise<any>;
  exitFullscreen(): Promise<any>;
  enterPiP(): Promise<any>;
  exitPiP(): Promise<any>;

  getCaptureStream(): MediaStream | undefined;
  getCurrentPlayerState(): PlayerState;

  setCurrentAudioTrack(trackIndex: number): void;
  setCurrentTextTrack(trackIndex: number): void;
  setTextTrackVisibility(isVisible: boolean): void;
}
```

## Events

```ts
interface PlayerEvents {
  // Requires discussion.
}
```
